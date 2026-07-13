"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole, requireSession } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { createEventSchema } from "@/lib/validators/event";
import type { ActionResult } from "./invite-actions";
import type { EventType } from "@/generated/prisma/enums";

export async function createEventAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole("COACH", "ADMIN");

  const teamId = formData.get("teamId") as string;
  if (!(await canManageTeam(session.user, teamId))) {
    return { ok: false, error: "Sem permissão para este time" };
  }

  const playerIds = formData.getAll("playerIds") as string[];

  const parsed = createEventSchema.safeParse({
    teamId,
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    startsAt: formData.get("startsAt"),
    location: formData.get("location") || undefined,
    playerIds,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { type, title, description, startsAt, location } = parsed.data;

  const roster = await db.user.findMany({ where: { teamId, role: "PLAYER" }, select: { id: true } });
  const invitedIds = playerIds.length > 0 ? playerIds : roster.map((r) => r.id);

  await db.event.create({
    data: {
      teamId,
      type: type as EventType,
      title,
      description,
      startsAt: new Date(startsAt),
      location,
      createdById: session.user.id,
      invites: { create: invitedIds.map((userId) => ({ userId })) },
    },
  });

  revalidatePath("/coach");
  revalidatePath("/player/profile");
  return { ok: true, message: "Evento criado" };
}

export async function rsvpAction(eventInviteId: string, status: "ACCEPTED" | "DECLINED"): Promise<void> {
  const session = await requireSession();

  const invite = await db.eventInvite.findUnique({ where: { id: eventInviteId } });
  if (!invite || invite.userId !== session.user.id) {
    throw new Error("Convite não encontrado");
  }

  await db.eventInvite.update({
    where: { id: eventInviteId },
    data: { status, respondedAt: new Date() },
  });

  revalidatePath("/player/profile");
}

export async function deleteEventAction(eventId: string): Promise<void> {
  const session = await requireRole("COACH", "ADMIN");

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Evento não encontrado");

  if (!(await canManageTeam(session.user, event.teamId))) {
    throw new Error("Sem permissão");
  }

  await db.event.delete({ where: { id: eventId } });
  revalidatePath(`/coach/team`);
}
