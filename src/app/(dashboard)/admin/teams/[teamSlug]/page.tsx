import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssignCoachForm } from "@/components/admin/assign-coach-form";
import { TeamLogoUploader } from "@/components/admin/team-logo-uploader";
import { RosterList } from "@/components/roster/roster-list";
import { removeCoachAction } from "@/actions/team-actions";
import { Avatar, TeamLogo } from "@/components/ui/avatar";

export default async function AdminTeamDetailPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  await requireRole("ADMIN");

  const team = await db.team.findUnique({
    where: { slug: teamSlug },
    include: { members: { include: { riotAccount: true } }, coachLinks: { include: { user: true } } },
  });
  if (!team) notFound();

  const availableCoaches = await db.user.findMany({
    where: { role: "COACH", coachAssignments: { none: { teamId: team.id } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TeamLogo src={team.logoUrl} name={team.name} size="lg" />
        <h1 className="text-xl font-semibold">{team.name}</h1>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">Logo do time</h2>
        <TeamLogoUploader teamId={team.id} currentUrl={team.logoUrl} />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">Coaches</h2>
        <ul className="mb-4 space-y-2">
          {team.coachLinks.map((link) => (
            <li key={link.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Avatar src={link.user.photoUrl} name={link.user.name ?? link.user.email} size="sm" />
                {link.user.name ?? link.user.email}
              </span>
              <form action={removeCoachAction.bind(null, link.id)}>
                <Button type="submit" variant="ghost" className="text-xs text-red-300">
                  Remover
                </Button>
              </form>
            </li>
          ))}
          {team.coachLinks.length === 0 && <p className="text-sm text-muted">Nenhum coach vinculado.</p>}
        </ul>
        <AssignCoachForm
          teamId={team.id}
          coaches={availableCoaches.map((c) => ({ id: c.id, name: c.name, email: c.email }))}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold">Elenco</h2>
        <RosterList players={team.members} detailBasePath="/admin/users" />
      </Card>
    </div>
  );
}
