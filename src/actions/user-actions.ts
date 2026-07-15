"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSession, requireRole } from "@/lib/session";
import type { ActionResult } from "./invite-actions";
import type { Role } from "@/generated/prisma/enums";

const riotIdSchema = z.object({
  gameName: z.string().min(1, "Informe o nome"),
  tagLine: z.string().min(1, "Informe a tag"),
});

export async function updateRiotIdAction(formData: FormData): Promise<void> {
  const session = await requireSession();

  const parsed = riotIdSchema.safeParse({
    gameName: formData.get("gameName"),
    tagLine: formData.get("tagLine"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  const { gameName, tagLine } = parsed.data;

  await db.riotAccount.upsert({
    where: { userId: session.user.id },
    update: { gameName, tagLine },
    create: { userId: session.user.id, gameName, tagLine },
  });

  revalidatePath("/player/profile");
  revalidatePath("/coach/team");
  revalidatePath("/admin/users");
}

export async function updateUserRoleTeamAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const userId = formData.get("userId") as string;
  const role = formData.get("role") as Role;
  const teamId = (formData.get("teamId") as string) || null;

  await db.user.update({
    where: { id: userId },
    data: { role, teamId },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { ok: true, message: "Usuário atualizado" };
}
