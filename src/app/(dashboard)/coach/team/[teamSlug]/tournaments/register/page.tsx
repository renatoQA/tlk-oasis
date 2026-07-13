import { notFound, redirect } from "next/navigation";
import { requireRole, homeForRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { RegisterTeamForm } from "@/components/tournaments/register-team-form";

export default async function RegisterTournamentPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const session = await requireRole("COACH", "ADMIN");

  const team = await db.team.findUnique({ where: { slug: teamSlug } });
  if (!team) notFound();
  if (!(await canManageTeam(session.user, team.id))) redirect(homeForRole(session.user.role));

  const tournaments = await db.tournament.findMany({ orderBy: { startDate: "asc" } });

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold">Inscrever {team.name}</h1>
      <Card>
        <RegisterTeamForm
          teamId={team.id}
          tournaments={tournaments.map((t) => ({ id: t.id, name: t.name, startDate: t.startDate.toISOString() }))}
        />
      </Card>
    </div>
  );
}
