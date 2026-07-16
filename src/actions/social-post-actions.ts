"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { detectPlatform } from "@/lib/social-platform";
import type { ActionResult } from "./invite-actions";

const socialPostSchema = z.object({
  url: z.string().url("Cole um link válido"),
  description: z.string().optional(),
});

export async function createSocialPostAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = socialPostSchema.safeParse({
    url: formData.get("url"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const post = await db.socialPost.create({
    data: {
      url: parsed.data.url,
      description: parsed.data.description,
      platform: detectPlatform(parsed.data.url),
      createdById: session.user.id,
    },
  });

  revalidatePath("/tlk-play");
  redirect(`/tlk-play/${post.id}`);
}

export async function deleteSocialPostAction(postId: string): Promise<void> {
  const session = await requireSession();

  const post = await db.socialPost.findUnique({ where: { id: postId } });
  if (!post) return;
  if (post.createdById !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Sem permissão para excluir este post");
  }

  await db.socialPost.delete({ where: { id: postId } });
  revalidatePath("/tlk-play");
  redirect("/tlk-play");
}
