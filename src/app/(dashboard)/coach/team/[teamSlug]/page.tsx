import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole, homeForRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";

export default async function CoachTeamPage({ params }: { params: Promise<{ teamSlug: string }> }) {
  const { teamSlug } = await params;
  const session = await requireRole("COACH", "ADMIN");

  const team = await db.team.findUnique({
    where: { slug: teamSlug },
    include: { members: { include: { riotAccount: true } } },
  });
  if (!team) notFound();
  if (!(await canManageTeam(session.user, team.id))) redirect(homeForRole(session.user.role));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{team.name}</h1>
        <div className="flex gap-2 text-sm">
          <Link href={`/coach/team/${team.slug}/agenda`} className="text-brand-pink-light hover:underline">
            Agenda
          </Link>
          <Link href={`/coach/team/${team.slug}/tournaments`} className="text-brand-pink-light hover:underline">
            Campeonatos
          </Link>
        </div>
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold">Elenco</h2>
        {team.members.length === 0 ? (
          <p className="text-sm text-muted">Nenhum jogador neste time ainda.</p>
        ) : (
          <ul className="space-y-2">
            {team.members.map((player) => (
              <li key={player.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <Link
                  href={`/coach/team/${team.slug}/players/${player.id}`}
                  className="hover:text-brand-pink-light"
                >
                  {player.name ?? player.email}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted">
                  {player.riotAccount ? (
                    <>
                      <Badge tone="muted">
                        {player.riotAccount.cachedCurrentTier ?? "sem elo"}
                      </Badge>
                      {player.riotAccount.cachedPeakTier && (
                        <Badge tone="pink">peak {player.riotAccount.cachedPeakTier}</Badge>
                      )}
                    </>
                  ) : (
                    <Badge tone="muted">sem riot id</Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
