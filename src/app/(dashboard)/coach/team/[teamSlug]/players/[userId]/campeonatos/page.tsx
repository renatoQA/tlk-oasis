import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getManagedTeamPlayer } from "@/lib/permissions";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { TournamentsTab } from "@/components/profile/tournaments-tab";

export default async function CoachPlayerTournamentsPage({
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
        active="tournaments"
        visibleTabs={["profile", "agenda", "elo", "team", "tournaments"]}
      />
      <TournamentsTab userId={userId} basePath={`/coach/team/${teamSlug}/tournaments`} />
    </div>
  );
}
