import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { CreateTournamentForm } from "@/components/admin/create-tournament-form";

const STATUS_TONE: Record<string, "purple" | "pink" | "green" | "yellow" | "red" | "muted"> = {
  PLANNED: "muted",
  REGISTERED: "purple",
  CONFIRMED: "pink",
  COMPLETED: "green",
  WITHDRAWN: "red",
};

export default async function AdminTournamentsPage() {
  await requireRole("ADMIN");

  const tournaments = await db.tournament.findMany({
    include: { registrations: { include: { team: true } } },
    orderBy: { startDate: "asc" },
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-6 text-xl font-semibold">Campeonatos</h1>
        {tournaments.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">Nenhum campeonato cadastrado ainda.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tournaments.map((t) => (
              <Card key={t.id}>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted">
                  {t.startDate.toLocaleDateString("pt-BR")}
                  {t.endDate && ` – ${t.endDate.toLocaleDateString("pt-BR")}`}
                  {t.organizer && ` · ${t.organizer}`}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {t.registrations.map((reg) => (
                    <Badge key={reg.id} tone={STATUS_TONE[reg.status]}>
                      {reg.team.name}: {reg.status}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="mb-6 text-xl font-semibold">Novo campeonato</h2>
        <Card>
          <CreateTournamentForm />
        </Card>
      </div>
    </div>
  );
}
