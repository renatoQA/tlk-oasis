import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { rsvpAction } from "@/actions/event-actions";

const TYPE_LABEL: Record<string, string> = {
  TRAINING: "Treino",
  SCRIM: "Scrim",
  TOURNAMENT_MATCH: "Partida de campeonato",
  MEETING: "Reunião",
};

const STATUS_TONE: Record<string, "purple" | "pink" | "green" | "yellow" | "red" | "muted"> = {
  PENDING: "yellow",
  ACCEPTED: "green",
  DECLINED: "red",
};

export async function AgendaTab({ userId, canRespond }: { userId: string; canRespond: boolean }) {
  // eslint-disable-next-line react-hooks/purity -- server component data fetch, not a memoized render
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const invites = await db.eventInvite.findMany({
    where: { userId, event: { startsAt: { gte: since } } },
    include: { event: true },
    orderBy: { event: { startsAt: "asc" } },
  });

  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold">Agenda</h3>
      {invites.length === 0 ? (
        <p className="text-sm text-muted">Nenhum compromisso próximo.</p>
      ) : (
        <ul className="space-y-3">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{invite.event.title}</p>
                  <Badge tone="muted">{TYPE_LABEL[invite.event.type]}</Badge>
                </div>
                <p className="text-xs text-muted">
                  {invite.event.startsAt.toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                  {invite.event.location && ` · ${invite.event.location}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge tone={STATUS_TONE[invite.status]}>{invite.status}</Badge>
                {canRespond && invite.status === "PENDING" && (
                  <>
                    <form action={rsvpAction.bind(null, invite.id, "ACCEPTED")}>
                      <Button type="submit" variant="secondary" className="px-2 py-1 text-xs">
                        Aceitar
                      </Button>
                    </form>
                    <form action={rsvpAction.bind(null, invite.id, "DECLINED")}>
                      <Button type="submit" variant="ghost" className="px-2 py-1 text-xs">
                        Recusar
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
