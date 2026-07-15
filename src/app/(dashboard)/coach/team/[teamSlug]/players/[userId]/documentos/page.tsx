import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getManagedTeamPlayer } from "@/lib/permissions";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { DocumentsTab } from "@/components/profile/documents-tab";

export default async function CoachPlayerDocumentsPage({
  params,
}: {
  params: Promise<{ teamSlug: string; userId: string }>;
}) {
  const { teamSlug, userId } = await params;
  const session = await requireRole("COACH", "ADMIN");
  const found = await getManagedTeamPlayer(session.user, teamSlug, userId);
  if (!found) notFound();

  const basePath = `/coach/team/${teamSlug}/players/${userId}`;
  return (
    <div>
      <ProfileTabNav basePath={basePath} active="documents" />
      <DocumentsTab userId={userId} canUpload={false} />
    </div>
  );
}
