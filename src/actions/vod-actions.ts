"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import type { ActionResult } from "./invite-actions";

const vodSchema = z.object({
  url: z.string().url("Cole um link válido"),
  description: z.string().optional(),
});

export async function createVodAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = vodSchema.safeParse({
    url: formData.get("url"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const vod = await db.vod.create({
    data: {
      url: parsed.data.url,
      description: parsed.data.description,
      createdById: session.user.id,
    },
  });

  revalidatePath("/vods");
  redirect(`/vods/${vod.id}`);
}

export async function deleteVodAction(vodId: string): Promise<void> {
  const session = await requireSession();

  const vod = await db.vod.findUnique({ where: { id: vodId } });
  if (!vod) return;
  if (vod.createdById !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Sem permissão para excluir este VOD");
  }

  await db.vod.delete({ where: { id: vodId } });
  revalidatePath("/vods");
  redirect("/vods");
}
