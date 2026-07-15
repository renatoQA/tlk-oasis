import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { TournamentDetail } from "@/components/tournaments/tournament-detail";

export default async function PlayerTournamentDetailPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const session = await requireRole("PLAYER", "ADMIN");

  const tournament = await db.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) notFound();

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  const registrations = user?.teamId
    ? await db.teamTournamentRegistration.findMany({
        where: { tournamentId, teamId: user.teamId },
        include: { team: true },
      })
    : [];

  return (
    <TournamentDetail
      tournament={tournament}
      registrations={registrations.map((r) => ({ teamName: r.team.name, status: r.status }))}
    />
  );
}
