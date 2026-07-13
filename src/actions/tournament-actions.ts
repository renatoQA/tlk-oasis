"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { createTournamentSchema, registerTeamSchema } from "@/lib/validators/tournament";
import type { ActionResult } from "./invite-actions";

export async function createTournamentAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = createTournamentSchema.safeParse({
    name: formData.get("name"),
    organizer: formData.get("organizer") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, organizer, startDate, endDate, description } = parsed.data;

  await db.tournament.create({
    data: {
      name,
      organizer,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description,
    },
  });

  revalidatePath("/admin/tournaments");
  return { ok: true, message: "Campeonato criado" };
}

export async function registerTeamAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole("COACH", "ADMIN");

  const parsed = registerTeamSchema.safeParse({
    teamId: formData.get("teamId"),
    tournamentId: formData.get("tournamentId"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { teamId, tournamentId, notes } = parsed.data;

  if (!(await canManageTeam(session.user, teamId))) {
    return { ok: false, error: "Sem permissão para este time" };
  }

  await db.teamTournamentRegistration.upsert({
    where: { teamId_tournamentId: { teamId, tournamentId } },
    update: { notes, status: "REGISTERED" },
    create: { teamId, tournamentId, notes, status: "REGISTERED" },
  });

  revalidatePath(`/coach/team`);
  revalidatePath("/admin/tournaments");
  return { ok: true, message: "Time inscrito no campeonato" };
}
