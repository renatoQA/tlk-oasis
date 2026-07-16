import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole, homeForRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { TeamLogoUploader } from "@/components/admin/team-logo-uploader";
import { RosterList } from "@/components/roster/roster-list";

export default async function CoachTeamPage({ params }: { params: Promise<{ teamSlug: string }> }) {
  const { teamSlug } = await params;
  const session = await requireRole("COACH", "ADMIN");

  const team = await db.team.findUnique({
    where: { slug: teamSlug },
    include: { members: { include: { riotAccount: true } } },
  });
  if (!team) notFound();
  if (!(await canManageTeam(session.user, team.id))) redirect(homeForRole(session.user.role));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {team.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={team.logoUrl} alt={team.name} className="h-12 w-12 rounded-lg border border-border object-cover" />
          )}
          <h1 className="text-xl font-semibold">{team.name}</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href={`/coach/team/${team.slug}/agenda`} className="text-brand-pink-light hover:underline">
            Agenda
          </Link>
          <Link href={`/coach/team/${team.slug}/tournaments`} className="text-brand-pink-light hover:underline">
            Campeonatos
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <TeamLogoUploader teamId={team.id} currentUrl={team.logoUrl} />
      </Card>

      <Card>
        <h2 className="mb-4 text-base font-semibold">Elenco</h2>
        <RosterList
          players={team.members}
          detailBasePath={`/coach/team/${team.slug}/players`}
          meetingBasePath={`/coach/team/${team.slug}/agenda/new`}
        />
      </Card>
    </div>
  );
}
