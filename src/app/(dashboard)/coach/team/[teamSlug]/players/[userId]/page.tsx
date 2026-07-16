import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getManagedTeamPlayer } from "@/lib/permissions";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { ProfileInfoTab } from "@/components/profile/profile-info-tab";
import { Button } from "@/components/ui/button";

export default async function CoachPlayerProfilePage({
  params,
}: {
  params: Promise<{ teamSlug: string; userId: string }>;
}) {
  const { teamSlug, userId } = await params;
  const session = await requireRole("COACH", "ADMIN");
  const found = await getManagedTeamPlayer(session.user, teamSlug, userId);
  if (!found) notFound();

  const basePath = `/coach/team/${teamSlug}/players/${userId}`;
  return (
    <div>
      <ProfileTabNav basePath={basePath} active="profile" />
      <div className="space-y-4">
        <div className="flex justify-end">
          <Link href={`/coach/team/${teamSlug}/agenda/new?playerId=${userId}&type=MEETING`}>
            <Button variant="secondary">Marcar reunião com {found.player.name ?? "este jogador"}</Button>
          </Link>
        </div>
        <ProfileInfoTab userId={userId} editable={false} />
      </div>
    </div>
  );
}
