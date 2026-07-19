"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { DAYS_OF_WEEK, DAY_LABELS } from "@/lib/availability";
import type { ActionResult } from "./invite-actions";

export async function setAvailabilityAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const toUpsert: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
  const toDelete: number[] = [];

  for (const day of DAYS_OF_WEEK) {
    const enabled = formData.get(`day_${day}_enabled`) === "on";
    if (!enabled) {
      toDelete.push(day);
      continue;
    }
    const start = (formData.get(`day_${day}_start`) as string) || "";
    const end = (formData.get(`day_${day}_end`) as string) || "";
    if (!start || !end || start >= end) {
      return { ok: false, error: `Horário inválido em ${DAY_LABELS[day]}` };
    }
    toUpsert.push({ dayOfWeek: day, startTime: start, endTime: end });
  }

  await db.$transaction([
    db.availability.deleteMany({ where: { userId: session.user.id, dayOfWeek: { in: toDelete } } }),
    ...toUpsert.map((d) =>
      db.availability.upsert({
        where: { userId_dayOfWeek: { userId: session.user.id, dayOfWeek: d.dayOfWeek } },
        update: { startTime: d.startTime, endTime: d.endTime },
        create: { userId: session.user.id, dayOfWeek: d.dayOfWeek, startTime: d.startTime, endTime: d.endTime },
      })
    ),
  ]);

  revalidatePath("/player/profile");
  return { ok: true, message: "Disponibilidade atualizada" };
}
