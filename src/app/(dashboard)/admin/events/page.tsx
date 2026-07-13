import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";

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
          {events.map((event) => (
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
                </div>
                <span className="text-xs text-muted">{event.invites.length} convidados</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
