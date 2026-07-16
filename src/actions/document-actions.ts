"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import type { ActionResult } from "./invite-actions";

const MAX_SIZE = 10 * 1024 * 1024;

export async function uploadDocumentAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");

  const userId = formData.get("userId") as string;
  const title = formData.get("title") as string;
  const file = formData.get("file") as File | null;

  if (!userId || !title) {
    return { ok: false, error: "Preencha o título e selecione o usuário" };
  }
  if (!file || file.size === 0) {
    return { ok: false, error: "Nenhum arquivo selecionado" };
  }
  if (file.size > MAX_SIZE) {
    return { ok: false, error: "Arquivo muito grande (máx 10MB)" };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "Upload de arquivo não configurado (conecte um Blob Store na Vercel)" };
  }

  try {
    const ext = file.name.split(".").pop() ?? "bin";
    const blob = await put(`documents/${crypto.randomUUID()}.${ext}`, file, { access: "private" });

    await db.document.create({
      data: { userId, title, url: blob.url, uploadedById: session.user.id },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao enviar documento";
    return { ok: false, error: message };
  }

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
