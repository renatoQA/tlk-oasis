import { requireRole } from "@/lib/session";
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

export default async function AdminEventsPage() {
  await requireRole("ADMIN");

  const events = await db.event.findMany({
    include: { team: true, invites: true },
    orderBy: { startsAt: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Calendário geral</h1>
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
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{event.title}</p>
                      <Badge tone="muted">{TYPE_LABEL[event.type]}</Badge>
                      <Badge tone="purple">{event.team.name}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {event.startsAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                      {event.location && ` · ${event.location}`}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {accepted} aceitos · {declined} recusados · {event.invites.length} convidados
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
