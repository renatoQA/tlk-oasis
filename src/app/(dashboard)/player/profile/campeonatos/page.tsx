import { requireRole } from "@/lib/session";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { TournamentsTab } from "@/components/profile/tournaments-tab";

export default async function PlayerTournamentsPage() {
  const session = await requireRole("PLAYER", "ADMIN");

  return (
    <div>
      <ProfileTabNav basePath="/player/profile" active="tournaments" />
      <TournamentsTab userId={session.user.id} />
    </div>
  );
}
