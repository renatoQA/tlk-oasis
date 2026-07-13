import { requireRole } from "@/lib/session";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { AgendaTab } from "@/components/profile/agenda-tab";

export default async function PlayerProfilePage() {
  const session = await requireRole("PLAYER", "ADMIN");

  return (
    <div>
      <ProfileTabNav basePath="/player/profile" active="agenda" />
      <AgendaTab userId={session.user.id} canRespond />
    </div>
  );
}
