import { requireRole } from "@/lib/session";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { RiotIdTab } from "@/components/profile/riot-id-tab";

export default async function PlayerRiotIdPage() {
  const session = await requireRole("PLAYER", "ADMIN");

  return (
    <div>
      <ProfileTabNav basePath="/player/profile" active="riot-id" />
      <RiotIdTab userId={session.user.id} editable />
    </div>
  );
}
