import { requireRole } from "@/lib/session";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { DocumentsTab } from "@/components/profile/documents-tab";

export default async function CoachProfileDocumentsPage() {
  const session = await requireRole("COACH", "ADMIN");

  return (
    <div>
      <ProfileTabNav
        basePath="/coach/profile"
        active="documents"
        visibleTabs={["profile", "documents"]}
      />
      <DocumentsTab userId={session.user.id} canUpload />
    </div>
  );
}
