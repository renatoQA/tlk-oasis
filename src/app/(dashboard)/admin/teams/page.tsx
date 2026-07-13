import Link from "next/link";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";

export default async function AdminTeamsPage() {
  await requireRole("ADMIN");

  const teams = await db.team.findMany({
    include: { members: true, coachLinks: { include: { user: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Times</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Link key={team.id} href={`/admin/teams/${team.slug}`}>
            <Card className="transition hover:border-brand-pink/50">
              <h2 className="font-semibold">{team.name}</h2>
              <div className="mt-2 flex gap-2">
                <Badge tone="purple">{team.members.length} jogadores</Badge>
                <Badge tone="pink">{team.coachLinks.length} coaches</Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
