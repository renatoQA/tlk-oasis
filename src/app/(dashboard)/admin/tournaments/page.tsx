import Link from "next/link";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { CreateTournamentForm } from "@/components/admin/create-tournament-form";
import { RegisterTeamAdminForm } from "@/components/admin/register-team-admin-form";

const STATUS_TONE: Record<string, "purple" | "pink" | "green" | "yellow" | "red" | "muted"> = {
  PLANNED: "muted",
  REGISTERED: "purple",
  CONFIRMED: "pink",
  COMPLETED: "green",
  WITHDRAWN: "red",
};

export default async function AdminTournamentsPage() {
  await requireRole("ADMIN");

  const [tournaments, teams] = await Promise.all([
    db.tournament.findMany({
      include: { registrations: { include: { team: true } } },
      orderBy: { startDate: "asc" },
    }),
    db.team.findMany({ orderBy: { name: "asc" } }),
  ]);

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
              <Link key={t.id} href={`/admin/tournaments/${t.id}`}>
                <Card className="card-hover-effect">
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
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="mb-6 text-xl font-semibold">Novo campeonato</h2>
          <Card>
            <CreateTournamentForm />
          </Card>
        </div>
        <div>
          <h2 className="mb-6 text-xl font-semibold">Inscrever time</h2>
          <Card>
            <RegisterTeamAdminForm
              teams={teams}
              tournaments={tournaments.map((t) => ({
                id: t.id,
                name: t.name,
                startDate: t.startDate.toISOString(),
              }))}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
