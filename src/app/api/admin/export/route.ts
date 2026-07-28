import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { Prisma } from "@/generated/prisma/client";

const FIELD_LABELS: Record<string, string> = {
  name: "Nome",
  email: "Email",
  role: "Role",
  team: "Time",
  nick: "Nick",
  instagram: "Instagram",
  address: "Endereço",
  birthDate: "Data de nascimento",
  shirtSize: "Tamanho de camiseta",
  contractSent: "Contrato enviado",
  contractSigned: "Contrato assinado",
  shirtRequested: "Camiseta solicitada",
  shirtSent: "Camiseta enviada",
  shirtReceived: "Camiseta recebida",
  pixKey: "Chave Pix",
  riotId: "Riot ID",
  currentElo: "Elo atual",
  peakElo: "Elo peak",
};

type UserWithRelations = Prisma.UserGetPayload<{ include: { team: true; riotAccount: true } }>;

function fieldValue(user: UserWithRelations, field: string): string {
  switch (field) {
    case "name":
      return user.name ?? "";
    case "email":
      return user.email;
    case "role":
      return user.role;
    case "team":
      return user.team?.name ?? "";
    case "nick":
      return user.nick ?? "";
    case "instagram":
      return user.instagram ?? "";
    case "address":
      return user.address ?? "";
    case "birthDate":
      return user.birthDate ? user.birthDate.toLocaleDateString("pt-BR") : "";
    case "shirtSize":
      return user.shirtSize ?? "";
    case "contractSent":
      return user.contractSent ? "Sim" : "Não";
    case "contractSigned":
      return user.contractSigned ? "Sim" : "Não";
    case "shirtRequested":
      return user.shirtRequested ? "Sim" : "Não";
    case "shirtSent":
      return user.shirtSent ? "Sim" : "Não";
    case "shirtReceived":
      return user.shirtReceived ? "Sim" : "Não";
    case "pixKey":
      return user.pixKeyType && user.pixKey ? `${user.pixKeyType}: ${user.pixKey}` : "";
    case "riotId":
      return user.riotAccount ? `${user.riotAccount.gameName}#${user.riotAccount.tagLine}` : "";
    case "currentElo":
      return user.riotAccount?.cachedCurrentTier ?? "";
    case "peakElo":
      return user.riotAccount?.cachedPeakTier ?? "";
    default:
      return "";
  }
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fields = searchParams.getAll("fields").filter((f) => f in FIELD_LABELS);
  if (fields.length === 0) {
    return new NextResponse("Selecione ao menos um campo", { status: 400 });
  }

  const teamId = searchParams.get("teamId") || undefined;
  const role = searchParams.get("role") || undefined;

  const users = await db.user.findMany({
    where: {
      ...(teamId ? { teamId } : {}),
      ...(role ? { role: role as "ADMIN" | "COACH" | "PLAYER" } : {}),
    },
    include: { team: true, riotAccount: true },
    orderBy: { name: "asc" },
  });

  const header = fields.map((f) => csvCell(FIELD_LABELS[f])).join(",");
  const rows = users.map((user) => fields.map((f) => csvCell(fieldValue(user, f))).join(","));
  const BOM = "﻿";
  const csv = BOM + [header, ...rows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tlk-export-${Date.now()}.csv"`,
    },
  });
}
