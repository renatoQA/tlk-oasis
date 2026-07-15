import { notFound, redirect } from "next/navigation";
import { requireRole, homeForRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { db } from "@/lib/db";
import { TournamentDetail } from "@/components/tournaments/tournament-detail";

export default async function CoachTournamentDetailPage({
  params,
}: {
  params: Promise<{ teamSlug: string; tournamentId: string }>;
}) {
  const { teamSlug, tournamentId } = await params;
  const session = await requireRole("COACH", "ADMIN");

  const team = await db.team.findUnique({ where: { slug: teamSlug } });
  if (!team) notFound();
  if (!(await canManageTeam(session.user, team.id))) redirect(homeForRole(session.user.role));

  const tournament = await db.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) notFound();

  const registrations = await db.teamTournamentRegistration.findMany({
    where: { tournamentId, teamId: team.id },
    include: { team: true },
  });

  return (
    <TournamentDetail
      tournament={tournament}
      registrations={registrations.map((r) => ({ teamName: r.team.name, status: r.status }))}
    />
  );
}
