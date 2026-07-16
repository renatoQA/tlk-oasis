import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRoleTeamForm } from "@/components/admin/user-role-team-form";
import { ProfileInfoTab } from "@/components/profile/profile-info-tab";
import { AgendaTab } from "@/components/profile/agenda-tab";
import { EloTab } from "@/components/profile/elo-tab";
import { TeamTab } from "@/components/profile/team-tab";
import { TournamentsTab } from "@/components/profile/tournaments-tab";
import { DocumentsTab } from "@/components/profile/documents-tab";
import { StatusToggles } from "@/components/admin/status-toggles";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { CoachTeamsForm } from "@/components/admin/coach-teams-form";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await requireRole("ADMIN");

  // Fetched sequentially (not Promise.all) - the local dev Postgres has a
  // narrow concurrency bug with @prisma/adapter-pg where many overlapping
  // queries on one request corrupt the connection's prepared-statement state.
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) notFound();
  const teams = await db.team.findMany({ orderBy: { name: "asc" } });
  const userTeam = user.teamId ? teams.find((t) => t.id === user.teamId) : undefined;
  const coachAssignments =
    user.role === "COACH"
      ? await db.coachAssignment.findMany({ where: { userId: user.id }, select: { teamId: true } })
      : [];

  const profileInfo = await ProfileInfoTab({ userId: user.id, editable: true });
  const agenda = await AgendaTab({ userId: user.id, canRespond: false });
  const elo = await EloTab({ userId: user.id, editable: true });
  const team = await TeamTab({ userId: user.id });
  const tournaments = await TournamentsTab({ userId: user.id, basePath: "/admin/tournaments" });
  const documents = await DocumentsTab({ userId: user.id, canUpload: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{user.name ?? user.email}</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {userTeam && (
            <Link href={`/coach/team/${userTeam.slug}/agenda/new?playerId=${user.id}&type=MEETING`}>
              <Button variant="secondary">Marcar reunião</Button>
            </Link>
          )}
          {session.user.id !== user.id && (
            <DeleteUserButton userId={user.id} name={user.name ?? user.email} />
          )}
        </div>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">Role e time</h2>
        <UserRoleTeamForm userId={user.id} role={user.role} teamId={user.teamId} teams={teams} />
      </Card>

      {user.role === "COACH" && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold">Times que treina</h2>
          <CoachTeamsForm
            userId={user.id}
            teams={teams}
            assignedTeamIds={coachAssignments.map((a) => a.teamId)}
          />
        </Card>
      )}

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
