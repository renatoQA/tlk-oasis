import { requireRole } from "@/lib/session";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { EloTab } from "@/components/profile/elo-tab";

export default async function PlayerEloPage() {
  const session = await requireRole("PLAYER", "ADMIN");

  return (
    <div>
      <ProfileTabNav basePath="/player/profile" active="elo" />
      <EloTab userId={session.user.id} editable />
    </div>
  );
}
