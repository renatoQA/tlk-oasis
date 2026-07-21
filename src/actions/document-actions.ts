"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import type { ActionResult } from "./invite-actions";

export async function createDocumentRecordAction(
  userId: string,
  title: string,
  url: string
): Promise<ActionResult> {
  const session = await requireSession();

  if (userId !== session.user.id && session.user.role !== "ADMIN") {
    return { ok: false, error: "Sem permissão para anexar documento a este usuário" };
  }

  if (!userId || !title || !url) {
    return { ok: false, error: "Preencha o título e selecione o arquivo" };
  }

  await db.document.create({
    data: { userId, title, url, uploadedById: session.user.id },
  });

  revalidatePath("/admin/users");
  revalidatePath("/player/profile");
  revalidatePath("/coach/profile");
  revalidatePath("/coach/team");
  return { ok: true, message: "Documento anexado" };
}

export async function deleteDocumentAction(documentId: string): Promise<void> {
  const session = await requireSession();

  const document = await db.document.findUnique({ where: { id: documentId } });
  if (!document) return;

  if (session.user.role !== "ADMIN" && document.uploadedById !== session.user.id) {
    throw new Error("Sem permissão para remover este documento");
  }

  await db.document.delete({ where: { id: documentId } });
  revalidatePath("/admin/users");
  revalidatePath("/player/profile");
  revalidatePath("/coach/profile");
}
