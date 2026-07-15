"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole, requireSession } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";

export async function toggleContractStatusAction(
  userId: string,
  field: "contractSent" | "contractSigned"
): Promise<void> {
  await requireRole("ADMIN");

  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  await db.user.update({ where: { id: userId }, data: { [field]: !user[field] } });

  revalidatePath("/admin/users");
}

export async function toggleShirtStatusAction(
  userId: string,
  field: "shirtRequested" | "shirtSent"
): Promise<void> {
  await requireRole("ADMIN");

  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  await db.user.update({ where: { id: userId }, data: { [field]: !user[field] } });

  revalidatePath("/admin/users");
}

export async function markShirtReceivedAction(userId: string): Promise<void> {
  const session = await requireSession();

  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  const isSelf = session.user.id === userId;
  const isManager = user.teamId ? await canManageTeam(session.user, user.teamId) : false;

  if (!isSelf && !isManager) {
    throw new Error("Sem permissão para marcar esse status");
  }

  await db.user.update({ where: { id: userId }, data: { shirtReceived: !user.shirtReceived } });

  revalidatePath("/admin/users");
  revalidatePath("/player/profile");
  revalidatePath("/coach/team");
}
