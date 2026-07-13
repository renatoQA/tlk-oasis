import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole, homeForRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteEventAction } from "@/actions/event-actions";

const TYPE_LABEL: Record<string, string> = {
  TRAINING: "Treino",
  SCRIM: "Scrim",
  TOURNAMENT_MATCH: "Partida de campeonato",
  MEETING: "Reunião",
};

export default async function CoachTeamAgendaPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const session = await requireRole("COACH", "ADMIN");

  const team = await db.team.findUnique({ where: { slug: teamSlug } });
  if (!team) notFound();
  if (!(await canManageTeam(session.user, team.id))) redirect(homeForRole(session.user.role));

  const events = await db.event.findMany({
    where: { teamId: team.id },
    include: { invites: { include: { user: true } } },
    orderBy: { startsAt: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Agenda — {team.name}</h1>
        <Link href={`/coach/team/${team.slug}/agenda/new`}>
          <Button>Novo evento</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Nenhum evento cadastrado ainda.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const accepted = event.invites.filter((i) => i.status === "ACCEPTED").length;
            const declined = event.invites.filter((i) => i.status === "DECLINED").length;
            return (
              <Card key={event.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{event.title}</p>
                      <Badge tone="muted">{TYPE_LABEL[event.type]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {event.startsAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                      {event.location && ` · ${event.location}`}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {accepted} confirmados · {declined} recusados · {event.invites.length} convidados
                    </p>
                  </div>
                  <form action={deleteEventAction.bind(null, event.id)}>
                    <Button type="submit" variant="ghost" className="text-xs text-red-300">
                      Excluir
                    </Button>
                  </form>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
