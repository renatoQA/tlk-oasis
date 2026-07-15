import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { TournamentDetail } from "@/components/tournaments/tournament-detail";

export default async function AdminTournamentDetailPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  await requireRole("ADMIN");

  const tournament = await db.tournament.findUnique({
    where: { id: tournamentId },
    include: { registrations: { include: { team: true } } },
  });
  if (!tournament) notFound();

  return (
    <TournamentDetail
      tournament={tournament}
      registrations={tournament.registrations.map((r) => ({ teamName: r.team.name, status: r.status }))}
    />
  );
}
