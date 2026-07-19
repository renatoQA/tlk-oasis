import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { AvailabilityList } from "@/components/profile/availability-list";
import { PlayerMeetingForm } from "@/components/profile/player-meeting-form";

export default async function NewPlayerMeetingPage({
  searchParams,
}: {
  searchParams: Promise<{ targetUserId?: string }>;
}) {
  const { targetUserId } = await searchParams;
  const session = await requireRole("PLAYER");
  if (!targetUserId) notFound();

  const target = await db.user.findUnique({
    where: { id: targetUserId },
    include: { availability: { orderBy: { dayOfWeek: "asc" } } },
  });

  if (
    !target ||
    target.role !== "PLAYER" ||
    target.id === session.user.id ||
    target.teamId !== session.user.teamId
  ) {
    notFound();
  }

  const targetName = target.name ?? target.email;

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl font-semibold">Marcar reunião com {targetName}</h1>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-muted">Disponibilidade de {targetName}</h3>
        <AvailabilityList availability={target.availability} />
      </Card>

      <Card>
        <PlayerMeetingForm targetUserId={target.id} targetName={targetName} />
      </Card>
    </div>
  );
}
