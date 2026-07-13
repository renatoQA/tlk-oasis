"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import type { ActionResult } from "./invite-actions";

export async function assignCoachAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const teamId = formData.get("teamId") as string;
  const userId = formData.get("userId") as string;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "COACH") {
    return { ok: false, error: "Usuário selecionado não é um coach" };
  }

  await db.coachAssignment.upsert({
    where: { userId_teamId: { userId, teamId } },
    update: {},
    create: { userId, teamId },
  });

  revalidatePath("/admin/teams");
  return { ok: true, message: "Coach vinculado ao time" };
}

export async function removeCoachAction(coachAssignmentId: string): Promise<void> {
  await requireRole("ADMIN");
  await db.coachAssignment.delete({ where: { id: coachAssignmentId } });
  revalidatePath("/admin/teams");
}
