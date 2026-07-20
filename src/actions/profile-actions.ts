"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import type { ActionResult } from "./invite-actions";

const profileInfoSchema = z
  .object({
    nick: z.string().optional(),
    instagram: z.string().optional(),
    address: z.string().optional(),
    birthDate: z.string().optional(),
    shirtSize: z.string().optional(),
    pixKeyType: z.enum(["CPF", "PHONE", "RANDOM", "EMAIL"]).optional(),
    pixKey: z.string().optional(),
  })
  .refine((data) => !data.pixKeyType || !!data.pixKey, {
    message: "Informe a chave Pix",
    path: ["pixKey"],
  });

export async function updateProfileInfoAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const targetUserId = (formData.get("userId") as string) || session.user.id;
  if (targetUserId !== session.user.id && session.user.role !== "ADMIN") {
    return { ok: false, error: "Sem permissão para editar este perfil" };
  }

  const parsed = profileInfoSchema.safeParse({
    nick: formData.get("nick") || undefined,
    instagram: formData.get("instagram") || undefined,
    address: formData.get("address") || undefined,
    birthDate: formData.get("birthDate") || undefined,
    shirtSize: formData.get("shirtSize") || undefined,
    pixKeyType: formData.get("pixKeyType") || undefined,
    pixKey: formData.get("pixKey") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { nick, instagram, address, birthDate, shirtSize, pixKeyType, pixKey } = parsed.data;

  await db.user.update({
    where: { id: targetUserId },
    data: {
      nick,
      instagram,
      address,
      shirtSize,
      birthDate: birthDate ? new Date(birthDate) : null,
      pixKeyType: pixKeyType ?? null,
      pixKey: pixKeyType ? pixKey : null,
    },
  });

  revalidatePath("/player/profile");
  revalidatePath("/coach/profile");
  revalidatePath("/admin/users");
  return { ok: true, message: "Perfil atualizado" };
}

export async function updateProfilePhotoAction(userId: string, photoUrl: string): Promise<void> {
  const session = await requireSession();
  if (userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Sem permissão para editar este perfil");
  }

  await db.user.update({ where: { id: userId }, data: { photoUrl } });

  revalidatePath("/player/profile");
  revalidatePath("/coach/profile");
  revalidatePath("/admin/users");
}
