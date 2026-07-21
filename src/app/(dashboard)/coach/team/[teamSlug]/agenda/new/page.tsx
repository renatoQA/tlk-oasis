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

  const [roster, everyone] = await Promise.all([
    db.user.findMany({
      where: { teamId: team.id, role: "PLAYER" },
      select: { id: true, name: true, email: true },
    }),
    db.user.findMany({
      where: { role: { in: ["PLAYER", "COACH"] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        team: { select: { name: true } },
        coachAssignments: { select: { team: { select: { name: true } } } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const allMembers = everyone.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    teamLabel:
      member.role === "COACH"
        ? member.coachAssignments.map((a) => a.team.name).join(", ") || "Sem time"
        : (member.team?.name ?? "Sem time"),
  }));

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold">Novo evento — {team.name}</h1>
      <Card>
        <EventForm
          teamId={team.id}
          roster={roster}
          allMembers={allMembers}
          defaultType={type ?? "TRAINING"}
          preselectedPlayerIds={playerId ? [playerId] : []}
        />
      </Card>
    </div>
  );
}
