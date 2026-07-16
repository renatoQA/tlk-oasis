import { notFound, redirect } from "next/navigation";
import { requireRole, homeForRole } from "@/lib/session";
import { canManageTeam } from "@/lib/permissions";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { EventForm } from "@/components/agenda/event-form";

export default async function NewEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ teamSlug: string }>;
  searchParams: Promise<{ playerId?: string; type?: string }>;
}) {
  const { teamSlug } = await params;
  const { playerId, type } = await searchParams;
  const session = await requireRole("COACH", "ADMIN");

  const team = await db.team.findUnique({ where: { slug: teamSlug } });
  if (!team) notFound();
  if (!(await canManageTeam(session.user, team.id))) redirect(homeForRole(session.user.role));

  const roster = await db.user.findMany({
    where: { teamId: team.id, role: "PLAYER" },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold">Novo evento — {team.name}</h1>
      <Card>
        <EventForm
          teamId={team.id}
          roster={roster}
          defaultType={type ?? "TRAINING"}
          preselectedPlayerIds={playerId ? [playerId] : []}
        />
      </Card>
    </div>
  );
}
