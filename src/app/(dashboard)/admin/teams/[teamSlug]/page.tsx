import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssignCoachForm } from "@/components/admin/assign-coach-form";
import { removeCoachAction } from "@/actions/team-actions";

export default async function AdminTeamDetailPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  await requireRole("ADMIN");

  const team = await db.team.findUnique({
    where: { slug: teamSlug },
    include: { members: true, coachLinks: { include: { user: true } } },
  });
  if (!team) notFound();

  const availableCoaches = await db.user.findMany({
    where: { role: "COACH", coachAssignments: { none: { teamId: team.id } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{team.name}</h1>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">Coaches</h2>
        <ul className="mb-4 space-y-2">
          {team.coachLinks.map((link) => (
            <li key={link.id} className="flex items-center justify-between text-sm">
              <span>{link.user.name ?? link.user.email}</span>
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
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-semibold">Elenco</h2>
          <Badge tone="purple">{team.members.length}</Badge>
        </div>
        <ul className="space-y-1.5 text-sm">
          {team.members.map((member) => (
            <li key={member.id}>{member.name ?? member.email}</li>
          ))}
          {team.members.length === 0 && <p className="text-muted">Nenhum jogador ainda.</p>}
        </ul>
      </Card>
    </div>
  );
}
