import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getManagedTeamPlayer } from "@/lib/permissions";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { TeamTab } from "@/components/profile/team-tab";

export default async function CoachPlayerTeamPage({
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
      <ProfileTabNav
        basePath={basePath}
        active="team"
        visibleTabs={["profile", "agenda", "elo", "team", "tournaments"]}
      />
      <TeamTab userId={userId} />
    </div>
  );
}
