"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole, requireSession } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
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

export async function updateCoachTeamsAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const userId = formData.get("userId") as string;
  const teamIds = formData.getAll("teamIds") as string[];

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "COACH") {
    return { ok: false, error: "Usuário não é um coach" };
  }

  await db.$transaction([
    db.coachAssignment.deleteMany({
      where: { userId, ...(teamIds.length > 0 ? { teamId: { notIn: teamIds } } : {}) },
    }),
    ...teamIds.map((teamId) =>
      db.coachAssignment.upsert({
        where: { userId_teamId: { userId, teamId } },
        update: {},
        create: { userId, teamId },
      })
    ),
  ]);

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/teams");
  return { ok: true, message: "Times do coach atualizados" };
}

export async function toggleMemberTagAction(
  userId: string,
  tag: "isIgl" | "isCaptain"
): Promise<void> {
  const session = await requireSession();

  const player = await db.user.findUnique({ where: { id: userId } });
  if (!player?.teamId || !(await canManageTeam(session.user, player.teamId))) {
    throw new Error("Sem permissão para este time");
  }

  await db.user.update({
    where: { id: userId },
    data: { [tag]: !player[tag] },
  });

  revalidatePath("/coach/team");
  revalidatePath("/admin/teams");
  revalidatePath("/player/profile/time");
}

export async function setTeamLogoAction(teamId: string, logoUrl: string): Promise<void> {
  const session = await requireSession();

  if (!(await canManageTeam(session.user, teamId))) {
    throw new Error("Sem permissão para este time");
  }

  await db.team.update({ where: { id: teamId }, data: { logoUrl } });

  revalidatePath("/coach/team");
  revalidatePath("/admin/teams");
  revalidatePath("/player/profile/time");
}
