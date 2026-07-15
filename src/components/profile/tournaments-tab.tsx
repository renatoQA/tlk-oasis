import Link from "next/link";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";

const STATUS_TONE: Record<string, "purple" | "pink" | "green" | "yellow" | "red" | "muted"> = {
  PLANNED: "muted",
  REGISTERED: "purple",
  CONFIRMED: "pink",
  COMPLETED: "green",
  WITHDRAWN: "red",
};

export async function TournamentsTab({ userId, basePath }: { userId: string; basePath: string }) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user?.teamId) {
    return (
      <Card>
        <h3 className="text-base font-semibold">Campeonatos</h3>
        <p className="mt-2 text-sm text-muted">Vincule-se a um time para ver campeonatos inscritos.</p>
      </Card>
    );
  }

  const registrations = await db.teamTournamentRegistration.findMany({
    where: { teamId: user.teamId },
    include: { tournament: true },
    orderBy: { tournament: { startDate: "asc" } },
  });

  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold">Campeonatos inscritos</h3>
      {registrations.length === 0 ? (
        <p className="text-sm text-muted">Nenhum campeonato inscrito no momento.</p>
      ) : (
        <ul className="space-y-3">
          {registrations.map((reg) => (
            <li key={reg.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
              <Link href={`${basePath}/${reg.tournament.id}`} className="hover:text-brand-pink-light">
                <p className="font-medium">{reg.tournament.name}</p>
                <p className="text-xs text-muted">
                  {reg.tournament.startDate.toLocaleDateString("pt-BR")}
                  {reg.tournament.endDate && ` – ${reg.tournament.endDate.toLocaleDateString("pt-BR")}`}
                </p>
              </Link>
              <Badge tone={STATUS_TONE[reg.status]}>{reg.status}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
