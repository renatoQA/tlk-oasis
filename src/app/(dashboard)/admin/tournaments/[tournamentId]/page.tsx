import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TournamentDetail } from "@/components/tournaments/tournament-detail";
import { CreateTournamentForm } from "@/components/admin/create-tournament-form";
import { unregisterTeamAction, deleteTournamentAction } from "@/actions/tournament-actions";

const STATUS_TONE: Record<string, "purple" | "pink" | "green" | "yellow" | "red" | "muted"> = {
  PLANNED: "muted",
  REGISTERED: "purple",
  CONFIRMED: "pink",
  COMPLETED: "green",
  WITHDRAWN: "red",
};

export default async function AdminTournamentDetailPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  await requireRole("ADMIN");

  const tournament = await db.tournament.findUnique({
    where: { id: tournamentId },
    include: { registrations: { include: { team: true } } },
  });
  if (!tournament) notFound();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <TournamentDetail
          tournament={tournament}
          registrations={tournament.registrations.map((r) => ({ teamName: r.team.name, status: r.status }))}
        />

        <div>
          <h2 className="mb-4 text-lg font-semibold">Times inscritos</h2>
          {tournament.registrations.length === 0 ? (
            <Card>
              <p className="text-sm text-muted">Nenhum time inscrito ainda.</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {tournament.registrations.map((reg) => (
                <Card key={reg.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{reg.team.name}</p>
                    <Badge tone={STATUS_TONE[reg.status]}>{reg.status}</Badge>
                  </div>
                  <form action={unregisterTeamAction.bind(null, reg.teamId, tournamentId)}>
                    <Button type="submit" variant="ghost" className="text-xs text-red-300">
                      Desregistrar
                    </Button>
                  </form>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Editar campeonato</h2>
          <Card>
            <CreateTournamentForm
              tournament={{
                id: tournament.id,
                name: tournament.name,
                organizer: tournament.organizer,
                startDate: tournament.startDate.toISOString().slice(0, 10),
                endDate: tournament.endDate ? tournament.endDate.toISOString().slice(0, 10) : null,
                description: tournament.description,
                imageUrl: tournament.imageUrl,
              }}
            />
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-red-300">Excluir campeonato</h2>
          <Card>
            <p className="mb-3 text-sm text-muted">
              Remove o campeonato e as inscrições dos times. Não pode ser desfeito.
            </p>
            <form action={deleteTournamentAction.bind(null, tournamentId)}>
              <Button type="submit" variant="ghost" className="w-full text-red-300">
                Excluir campeonato
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
