"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { createInvite, acceptInvite } from "@/lib/invites";
import { createInviteSchema, acceptInviteSchema } from "@/lib/validators/invite";
import { signIn } from "@/lib/auth";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

// Only admins create invites - coaches manage agenda/elo/tournaments for
// their team but do not onboard new accounts (confirmed with the org owner).
export async function createInviteAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");

  const parsed = createInviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
    teamId: formData.get("teamId") || null,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const { email, role, teamId } = parsed.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { ok: false, error: "Já existe uma conta com esse email" };
  }

  await createInvite({ email, role, teamId, createdById: session.user.id });
  revalidatePath("/admin/invites");
  return { ok: true, message: "Convite criado com sucesso" };
}

export async function revokeInviteAction(inviteId: string): Promise<void> {
  await requireRole("ADMIN");
  await db.invite.update({ where: { id: inviteId }, data: { status: "REVOKED" } });
  revalidatePath("/admin/invites");
}

export async function acceptInviteFormAction(formData: FormData) {
  const parsed = acceptInviteSchema.safeParse({
    token: formData.get("token"),
    name: formData.get("name"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    gameName: formData.get("gameName") || undefined,
    tagLine: formData.get("tagLine") || undefined,
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/invite/${formData.get("token")}?error=${encodeURIComponent(message)}`);
  }

  const { token, name, password, gameName, tagLine } = parsed.data;

  let user;
  try {
    user = await acceptInvite({ token, name, password, gameName, tagLine });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao aceitar convite";
    redirect(`/invite/${token}?error=${encodeURIComponent(message)}`);
  }

  await signIn("credentials", {
    email: user.email,
    password,
    redirectTo: "/",
  });
}
