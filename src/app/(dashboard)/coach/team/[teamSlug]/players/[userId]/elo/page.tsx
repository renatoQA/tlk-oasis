import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getManagedTeamPlayer } from "@/lib/permissions";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { EloTab } from "@/components/profile/elo-tab";

export default async function CoachPlayerEloPage({
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
      <ProfileTabNav basePath={basePath} active="elo" />
      <EloTab userId={userId} editable />
    </div>
  );
}
