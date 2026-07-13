import { db } from "@/lib/db";
import { getEloProvider } from "./index";

const MANUAL_REFRESH_COOLDOWN_MS = 5 * 60 * 1000;

export async function refreshEloForAccount(
  riotAccountId: string,
  opts?: { manual?: { currentRr: number; currentTier?: string } }
) {
  const account = await db.riotAccount.findUniqueOrThrow({ where: { id: riotAccountId } });

  let currentRr: number | null;
  let currentTier: string | null;
  let peakRr: number | null = null;
  let peakTier: string | null = null;
  let raw: unknown = null;
  const isManualEntry = Boolean(opts?.manual);

  if (opts?.manual) {
    currentRr = opts.manual.currentRr;
    currentTier = opts.manual.currentTier ?? null;
  } else {
    const result = await getEloProvider().fetchElo({
      gameName: account.gameName,
      tagLine: account.tagLine,
      region: account.region,
    });
    currentRr = result.currentRr;
    currentTier = result.currentTier;
    peakRr = result.peakRr;
    peakTier = result.peakTier;
    raw = result.raw;
  }

  return db.$transaction(async (tx) => {
    const snapshot = await tx.eloSnapshot.create({
      data: {
        riotAccountId,
        currentRr,
        currentTier,
        peakRr,
        peakTier,
        raw: raw as never,
        isManualEntry,
      },
    });

    const newPeak = Math.max(account.cachedPeakRr ?? 0, currentRr ?? 0, peakRr ?? 0);

    await tx.riotAccount.update({
      where: { id: riotAccountId },
      data: {
        cachedCurrentRr: currentRr,
        cachedCurrentTier: currentTier,
        cachedPeakRr: newPeak,
        cachedPeakTier: newPeak === peakRr ? peakTier : account.cachedPeakTier,
        lastFetchedAt: new Date(),
      },
    });

    return snapshot;
  });
}

export function isRefreshOnCooldown(lastFetchedAt: Date | null): boolean {
  if (!lastFetchedAt) return false;
  return Date.now() - lastFetchedAt.getTime() < MANUAL_REFRESH_COOLDOWN_MS;
}
