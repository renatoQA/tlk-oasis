import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { UserRoleTeamForm } from "@/components/admin/user-role-team-form";
import { AgendaTab } from "@/components/profile/agenda-tab";
import { RiotIdTab } from "@/components/profile/riot-id-tab";
import { EloTab } from "@/components/profile/elo-tab";
import { TeamTab } from "@/components/profile/team-tab";
import { TournamentsTab } from "@/components/profile/tournaments-tab";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  await requireRole("ADMIN");

  const [user, teams] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.team.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{user.name ?? user.email}</h1>
        <p className="text-sm text-muted">{user.email}</p>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">Role e time</h2>
        <UserRoleTeamForm userId={user.id} role={user.role} teamId={user.teamId} teams={teams} />
      </Card>

      <AgendaTab userId={user.id} canRespond={false} />
      <RiotIdTab userId={user.id} editable={false} />
      <EloTab userId={user.id} editable />
      <TeamTab userId={user.id} />
      <TournamentsTab userId={user.id} basePath="/admin/tournaments" />
    </div>
  );
}
