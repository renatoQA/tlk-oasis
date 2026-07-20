"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { createTournamentSchema, registerTeamSchema } from "@/lib/validators/tournament";
import { sanitizeRichText } from "@/lib/sanitize";
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
    imageUrl: formData.get("imageUrl") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, organizer, startDate, endDate, description, imageUrl } = parsed.data;

  await db.tournament.create({
    data: {
      name,
      organizer,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description: description ? sanitizeRichText(description) : null,
      imageUrl,
    },
  });

  revalidatePath("/admin/tournaments");
  return { ok: true, message: "Campeonato criado" };
}

export async function updateTournamentAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const tournamentId = formData.get("tournamentId") as string;

  const parsed = createTournamentSchema.safeParse({
    name: formData.get("name"),
    organizer: formData.get("organizer") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
  });
  if (!tournamentId || !parsed.success) {
    return { ok: false, error: parsed.error?.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, organizer, startDate, endDate, description, imageUrl } = parsed.data;

  await db.tournament.update({
    where: { id: tournamentId },
    data: {
      name,
      organizer,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description: description ? sanitizeRichText(description) : null,
      imageUrl,
    },
  });

  revalidatePath("/admin/tournaments");
  revalidatePath(`/admin/tournaments/${tournamentId}`);
  return { ok: true, message: "Campeonato atualizado" };
}

export async function deleteTournamentAction(tournamentId: string): Promise<void> {
  await requireRole("ADMIN");
  await db.tournament.delete({ where: { id: tournamentId } });
  revalidatePath("/admin/tournaments");
  redirect("/admin/tournaments");
}

export async function unregisterTeamAction(teamId: string, tournamentId: string): Promise<void> {
  await requireRole("ADMIN");

  await db.$transaction([
    db.teamTournamentRegistration.deleteMany({ where: { teamId, tournamentId } }),
    db.event.deleteMany({ where: { teamId, tournamentId, type: "TOURNAMENT_MATCH" } }),
  ]);

  revalidatePath("/admin/tournaments");
  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath("/coach/team");
  revalidatePath("/player/profile");
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

  await db.$transaction(async (tx) => {
    await tx.teamTournamentRegistration.upsert({
      where: { teamId_tournamentId: { teamId, tournamentId } },
      update: { notes, status: "REGISTERED" },
      create: { teamId, tournamentId, notes, status: "REGISTERED" },
    });

    const existingEvent = await tx.event.findFirst({
      where: { teamId, tournamentId, type: "TOURNAMENT_MATCH" },
      select: { id: true },
    });

    if (!existingEvent) {
      const tournament = await tx.tournament.findUniqueOrThrow({
        where: { id: tournamentId },
        select: { name: true, startDate: true },
      });

      const event = await tx.event.create({
        data: {
          type: "TOURNAMENT_MATCH",
          title: tournament.name,
          startsAt: tournament.startDate,
          teamId,
          tournamentId,
          createdById: session.user.id,
        },
      });

      const players = await tx.user.findMany({
        where: { teamId, role: "PLAYER" },
        select: { id: true },
      });

      if (players.length > 0) {
        await tx.eventInvite.createMany({
          data: players.map((p) => ({ eventId: event.id, userId: p.id })),
          skipDuplicates: true,
        });
      }
    }
  });

  revalidatePath(`/coach/team`);
  revalidatePath("/admin/tournaments");
  revalidatePath("/player/profile");
  return { ok: true, message: "Time inscrito no campeonato — a data já entrou na agenda dos jogadores" };
}
