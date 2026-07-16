import Link from "next/link";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { TeamLogo } from "@/components/ui/avatar";

export default async function CoachHomePage() {
  const session = await requireRole("COACH", "ADMIN");

  const teams =
    session.user.role === "ADMIN"
      ? await db.team.findMany({ include: { members: true } })
      : (
          await db.coachAssignment.findMany({
            where: { userId: session.user.id },
            include: { team: { include: { members: true } } },
          })
        ).map((a) => a.team);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Meus times</h1>
      {teams.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">
            Você ainda não está atribuído a nenhum time. Peça ao admin para vincular seu usuário.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/coach/team/${team.slug}`}>
              <Card className="card-hover-effect">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TeamLogo src={team.logoUrl} name={team.name} />
                    <h2 className="font-semibold">{team.name}</h2>
                  </div>
                  <Badge tone="purple">{team.members.length} jogadores</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
