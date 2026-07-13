"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { refreshEloForAccount, isRefreshOnCooldown } from "@/lib/elo/snapshot";
import { getEloProvider } from "@/lib/elo";
import type { ActionResult } from "./invite-actions";

async function assertCanManageRiotAccount(targetUserId: string) {
  const session = await requireSession();
  if (session.user.id === targetUserId) return session;
  if (session.user.role === "ADMIN") return session;
  if (session.user.role === "COACH") {
    const target = await db.user.findUnique({ where: { id: targetUserId } });
    if (target?.teamId && (await canManageTeam(session.user, target.teamId))) {
      return session;
    }
  }
  throw new Error("Sem permissão para esta conta");
}

export async function refreshEloAction(userId: string): Promise<void> {
  await assertCanManageRiotAccount(userId);

  const account = await db.riotAccount.findUnique({ where: { userId } });
  if (!account) return;

  if (isRefreshOnCooldown(account.lastFetchedAt)) {
    return;
  }

  try {
    await refreshEloForAccount(account.id);
  } catch {
    // Provider errors (rate limit, not found, etc.) are non-fatal here - the
    // last known snapshot stays displayed. Manual entry remains available.
    return;
  }

  revalidatePath("/player/profile/elo");
}

export async function manualEloEntryAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const userId = formData.get("userId") as string;
  await assertCanManageRiotAccount(userId);

  const currentRr = Number(formData.get("currentRr"));
  const currentTier = (formData.get("currentTier") as string) || undefined;

  if (!Number.isFinite(currentRr)) {
    return { ok: false, error: "RR inválido" };
  }

  const account = await db.riotAccount.findUnique({ where: { userId } });
  if (!account) return { ok: false, error: "Nenhum Riot ID vinculado" };

  await refreshEloForAccount(account.id, { manual: { currentRr, currentTier } });
  revalidatePath("/player/profile/elo");
  return { ok: true };
}

export async function eloProviderStatus() {
  return getEloProvider().isConfigured;
}
