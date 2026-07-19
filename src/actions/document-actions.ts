"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import type { ActionResult } from "./invite-actions";

export async function createDocumentRecordAction(
  userId: string,
  title: string,
  url: string
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");

  if (!userId || !title || !url) {
    return { ok: false, error: "Preencha o título e selecione o arquivo" };
  }

  await db.document.create({
    data: { userId, title, url, uploadedById: session.user.id },
  });

  revalidatePath("/admin/users");
  revalidatePath("/player/profile");
  revalidatePath("/coach/team");
  return { ok: true, message: "Documento anexado" };
}

export async function deleteDocumentAction(documentId: string): Promise<void> {
  await requireRole("ADMIN");
  await db.document.delete({ where: { id: documentId } });
  revalidatePath("/admin/users");
}
