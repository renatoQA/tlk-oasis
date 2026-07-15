import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { UserRoleTeamForm } from "@/components/admin/user-role-team-form";
import { ProfileInfoTab } from "@/components/profile/profile-info-tab";
import { AgendaTab } from "@/components/profile/agenda-tab";
import { EloTab } from "@/components/profile/elo-tab";
import { TeamTab } from "@/components/profile/team-tab";
import { TournamentsTab } from "@/components/profile/tournaments-tab";
import { DocumentsTab } from "@/components/profile/documents-tab";
import { StatusToggles } from "@/components/admin/status-toggles";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  await requireRole("ADMIN");

  // Fetched sequentially (not Promise.all) - the local dev Postgres has a
  // narrow concurrency bug with @prisma/adapter-pg where many overlapping
  // queries on one request corrupt the connection's prepared-statement state.
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) notFound();
  const teams = await db.team.findMany({ orderBy: { name: "asc" } });

  const profileInfo = await ProfileInfoTab({ userId: user.id, editable: true });
  const agenda = await AgendaTab({ userId: user.id, canRespond: false });
  const elo = await EloTab({ userId: user.id, editable: true });
  const team = await TeamTab({ userId: user.id });
  const tournaments = await TournamentsTab({ userId: user.id, basePath: "/admin/tournaments" });
  const documents = await DocumentsTab({ userId: user.id, canUpload: true });

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

      {profileInfo}
      <StatusToggles user={user} />
      {agenda}
      {elo}
      {team}
      {tournaments}
      {documents}
    </div>
  );
}
