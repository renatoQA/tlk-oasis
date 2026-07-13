import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole, homeForRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

      {registrations.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Nenhuma inscrição ainda.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <Card key={reg.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{reg.tournament.name}</p>
                  <p className="text-xs text-muted">
                    {reg.tournament.startDate.toLocaleDateString("pt-BR")}
                    {reg.tournament.endDate && ` – ${reg.tournament.endDate.toLocaleDateString("pt-BR")}`}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[reg.status]}>{reg.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
