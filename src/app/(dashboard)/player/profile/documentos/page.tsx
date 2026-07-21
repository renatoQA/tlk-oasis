import { requireRole } from "@/lib/session";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { DocumentsTab } from "@/components/profile/documents-tab";

export default async function PlayerDocumentsPage() {
  const session = await requireRole("PLAYER", "ADMIN");

  return (
    <div>
      <ProfileTabNav basePath="/player/profile" active="documents" />
      <DocumentsTab userId={session.user.id} canUpload />
    </div>
  );
}
