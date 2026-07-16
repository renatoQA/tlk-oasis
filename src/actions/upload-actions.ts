"use server";

import { put } from "@vercel/blob";
import { requireSession } from "@/lib/session";

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

const MAX_SIZE = 5 * 1024 * 1024;

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireSession();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { ok: false, error: "Nenhum arquivo selecionado" };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Só é permitido enviar imagens" };
  }
  if (file.size > MAX_SIZE) {
    return { ok: false, error: "Imagem muito grande (máx 5MB)" };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      error: "Upload de imagem não configurado (conecte um Blob Store na Vercel)",
    };
  }

  try {
    const ext = file.name.split(".").pop() ?? "bin";
    const blob = await put(`uploads/${crypto.randomUUID()}.${ext}`, file, {
      access: "private",
    });
    return { ok: true, url: blob.url };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao enviar imagem";
    return { ok: false, error: message };
  }
}

export async function uploadImageAction(
  _prevState: UploadResult | null,
  formData: FormData
): Promise<UploadResult> {
  return uploadImage(formData);
}
