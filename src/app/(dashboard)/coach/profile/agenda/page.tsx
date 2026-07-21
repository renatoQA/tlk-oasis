import { requireRole } from "@/lib/session";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { AgendaTab } from "@/components/profile/agenda-tab";

export default async function CoachAgendaPage() {
  const session = await requireRole("COACH", "ADMIN");

  return (
    <div>
      <ProfileTabNav basePath="/coach/profile" active="agenda" visibleTabs={["profile", "agenda", "documents"]} />
      <AgendaTab userId={session.user.id} canRespond />
    </div>
  );
}
