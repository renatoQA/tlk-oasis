"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import type { ActionResult } from "./invite-actions";

const meetingSchema = z.object({
  targetUserId: z.string().min(1),
  title: z.string().min(1, "Informe um título"),
  startsAt: z.string().min(1, "Informe data e hora"),
  description: z.string().optional(),
});

export async function createPlayerMeetingAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole("PLAYER");

  if (!session.user.teamId) {
    return { ok: false, error: "Você precisa estar em um time para marcar reuniões" };
  }

  const parsed = meetingSchema.safeParse({
    targetUserId: formData.get("targetUserId"),
    title: formData.get("title"),
    startsAt: formData.get("startsAt"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const { targetUserId, title, startsAt, description } = parsed.data;

  if (targetUserId === session.user.id) {
    return { ok: false, error: "Selecione outro jogador" };
  }

  const target = await db.user.findUnique({ where: { id: targetUserId } });
  if (!target || target.role !== "PLAYER" || target.teamId !== session.user.teamId) {
    return { ok: false, error: "Jogador não encontrado no seu time" };
  }

  await db.event.create({
    data: {
      teamId: session.user.teamId,
      type: "MEETING",
      title,
      description,
      startsAt: new Date(startsAt),
      createdById: session.user.id,
      invites: {
        create: [
          { userId: session.user.id, status: "ACCEPTED", respondedAt: new Date() },
          { userId: targetUserId },
        ],
      },
    },
  });

  revalidatePath("/player/profile");
  revalidatePath("/player/profile/agenda");
  redirect("/player/profile/agenda");
}
