import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refreshEloForAccount } from "@/lib/elo/snapshot";
import { getEloProvider } from "@/lib/elo";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!getEloProvider().isConfigured) {
    return NextResponse.json({ skipped: true, reason: "TRACKER_API_KEY not configured" });
  }

  const accounts = await db.riotAccount.findMany({ select: { id: true } });
  const results: { id: string; ok: boolean; error?: string }[] = [];

  for (const account of accounts) {
    try {
      await refreshEloForAccount(account.id);
      results.push({ id: account.id, ok: true });
    } catch (e) {
      results.push({ id: account.id, ok: false, error: e instanceof Error ? e.message : "unknown" });
    }
    await sleep(2000);
  }

  return NextResponse.json({ refreshed: results.length, results });
}
