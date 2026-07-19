import { requireRole } from "@/lib/session";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { TeamTab } from "@/components/profile/team-tab";

export default async function PlayerTeamPage() {
  const session = await requireRole("PLAYER", "ADMIN");

  return (
    <div>
      <ProfileTabNav basePath="/player/profile" active="team" />
      <TeamTab userId={session.user.id} canScheduleMeeting={session.user.role === "PLAYER"} />
    </div>
  );
}
