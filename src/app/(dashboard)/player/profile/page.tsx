import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { ProfileInfoTab } from "@/components/profile/profile-info-tab";
import { StatusView } from "@/components/profile/status-view";

export default async function PlayerProfilePage() {
  const session = await requireRole("PLAYER", "ADMIN");
  const user = await db.user.findUniqueOrThrow({ where: { id: session.user.id } });

  return (
    <div>
      <ProfileTabNav basePath="/player/profile" active="profile" />
      <div className="space-y-4">
        <ProfileInfoTab userId={session.user.id} editable />
        <StatusView user={user} canMarkReceived />
      </div>
    </div>
  );
}
