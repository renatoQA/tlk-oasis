import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole, homeForRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { TournamentCalendar } from "@/components/tournaments/tournament-calendar";

const STATUS_TONE: Record<string, "purple" | "pink" | "green" | "yellow" | "red" | "muted"> = {
  PLANNED: "muted",
  REGISTERED: "purple",
  CONFIRMED: "pink",
  COMPLETED: "green",
  WITHDRAWN: "red",
};

export default async function CoachTeamTournamentsPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const session = await requireRole("COACH", "ADMIN");

  const team = await db.team.findUnique({ where: { slug: teamSlug } });
  if (!team) notFound();
  if (!(await canManageTeam(session.user, team.id))) redirect(homeForRole(session.user.role));

  const registrations = await db.teamTournamentRegistration.findMany({
    where: { teamId: team.id },
    include: { tournament: true },
    orderBy: { tournament: { startDate: "asc" } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Campeonatos — {team.name}</h1>
        <Link href={`/coach/team/${team.slug}/tournaments/register`}>
          <Button>Inscrever em campeonato</Button>
        </Link>
      </div>

      <TournamentCalendar
        tournaments={registrations.map((reg) => ({
          id: reg.id,
          name: reg.tournament.name,
          organizer: reg.tournament.organizer,
          startDate: reg.tournament.startDate.toISOString(),
          endDate: reg.tournament.endDate ? reg.tournament.endDate.toISOString() : null,
          href: `/coach/team/${team.slug}/tournaments/${reg.tournament.id}`,
          badges: [{ key: reg.id, label: reg.status, tone: STATUS_TONE[reg.status] }],
        }))}
      />
    </div>
  );
}
