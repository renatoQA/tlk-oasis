import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { CreateTournamentForm } from "@/components/admin/create-tournament-form";
import { RegisterTeamAdminForm } from "@/components/admin/register-team-admin-form";
import { TournamentCalendar } from "@/components/tournaments/tournament-calendar";

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
        <TournamentCalendar
          tournaments={tournaments.map((t) => ({
            id: t.id,
            name: t.name,
            organizer: t.organizer,
            startDate: t.startDate.toISOString(),
            endDate: t.endDate ? t.endDate.toISOString() : null,
            href: `/admin/tournaments/${t.id}`,
            badges: t.registrations.map((reg) => ({
              key: reg.id,
              label: `${reg.team.name}: ${reg.status}`,
              tone: STATUS_TONE[reg.status],
            })),
          }))}
        />
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
