import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function AdminHomePage() {
  await requireRole("ADMIN");

  const [userCount, teamCount, pendingInvites, upcomingEvents, tournamentCount] = await Promise.all([
    db.user.count(),
    db.team.count(),
    db.invite.count({ where: { status: "PENDING" } }),
    db.event.count({ where: { startsAt: { gte: new Date() } } }),
    db.tournament.count(),
  ]);

  const stats = [
    { label: "Usuários", value: userCount },
    { label: "Times", value: teamCount },
    { label: "Convites pendentes", value: pendingInvites },
    { label: "Próximos eventos", value: upcomingEvents },
    { label: "Campeonatos", value: tournamentCount },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold brand-gradient-text">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
