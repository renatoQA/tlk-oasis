import { requireRole } from "@/lib/session";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { ProfileInfoTab } from "@/components/profile/profile-info-tab";

export default async function CoachProfilePage() {
  const session = await requireRole("COACH", "ADMIN");

  return (
    <div>
      <ProfileTabNav
        basePath="/coach/profile"
        active="profile"
        visibleTabs={["profile", "agenda", "documents"]}
      />
      <ProfileInfoTab userId={session.user.id} editable />
    </div>
  );
}
