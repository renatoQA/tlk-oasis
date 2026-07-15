"use server";

import Papa from "papaparse";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { normalizeHeader, parseBrDate } from "@/lib/csv";

export type ImportReport = {
  ok: true;
  updated: string[];
  notFound: string[];
} | { ok: false; error: string };

export async function importRosterAction(
  _prevState: ImportReport | null,
  formData: FormData
): Promise<ImportReport> {
  await requireRole("ADMIN");

  const csvText = formData.get("csv") as string;
  if (!csvText?.trim()) {
    return { ok: false, error: "Cole o conteúdo do CSV" };
  }

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    return { ok: false, error: `Erro ao ler CSV: ${parsed.errors[0].message}` };
  }

  const teams = await db.team.findMany();
  const teamByName = new Map(teams.map((t) => [t.name.trim().toLowerCase(), t.id]));

  const updated: string[] = [];
  const notFound: string[] = [];

  for (const row of parsed.data) {
    const norm: Record<string, string> = {};
    for (const [key, value] of Object.entries(row)) {
      norm[normalizeHeader(key)] = (value ?? "").trim();
    }

    const name = norm["nome"];
    if (!name) continue;

    const user = await db.user.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (!user) {
      notFound.push(name);
      continue;
    }

    const teamName = norm["time"];
    const teamId = teamName ? teamByName.get(teamName.trim().toLowerCase()) : undefined;

    const birthDateRaw = norm["datadenascimento"];
    const birthDate = birthDateRaw ? parseBrDate(birthDateRaw) : null;

    await db.user.update({
      where: { id: user.id },
      data: {
        ...(teamId ? { teamId } : {}),
        ...(norm["nick"] ? { nick: norm["nick"] } : {}),
        ...(norm["instagram"] ? { instagram: norm["instagram"] } : {}),
        ...(norm["endereco"] || norm["enderecocompleto"]
          ? { address: norm["endereco"] || norm["enderecocompleto"] }
          : {}),
        ...(norm["tamanhocamiseta"] ? { shirtSize: norm["tamanhocamiseta"] } : {}),
        ...(birthDate ? { birthDate } : {}),
      },
    });

    updated.push(name);
  }

  revalidatePath("/admin/users");
  return { ok: true, updated, notFound };
}
