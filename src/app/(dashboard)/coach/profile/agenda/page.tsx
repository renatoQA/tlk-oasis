import Link from "next/link";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { ProfileTabNav } from "@/components/profile/profile-tab-nav";
import { AgendaTab } from "@/components/profile/agenda-tab";
import { Button } from "@/components/ui/button";

export default async function CoachAgendaPage() {
  const session = await requireRole("COACH", "ADMIN");

  const anchorTeam =
    session.user.role === "COACH"
      ? await db.team.findFirst({
          where: { coachLinks: { some: { userId: session.user.id } } },
          orderBy: { name: "asc" },
          select: { slug: true },
        })
      : await db.team.findFirst({ orderBy: { name: "asc" }, select: { slug: true } });

  return (
    <div>
      <ProfileTabNav basePath="/coach/profile" active="agenda" visibleTabs={["profile", "agenda", "documents"]} />

      <div className="mb-4 flex justify-end">
        {anchorTeam && (
          <Link href={`/coach/team/${anchorTeam.slug}/agenda/new?type=MEETING`}>
            <Button>Marcar reunião</Button>
          </Link>
        )}
      </div>

      <AgendaTab userId={session.user.id} canRespond />
    </div>
  );
}
