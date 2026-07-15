import { Card, Badge } from "@/components/ui/card";
import { RichTextViewer } from "@/components/editor/rich-text-viewer";

const STATUS_TONE: Record<string, "purple" | "pink" | "green" | "yellow" | "red" | "muted"> = {
  PLANNED: "muted",
  REGISTERED: "purple",
  CONFIRMED: "pink",
  COMPLETED: "green",
  WITHDRAWN: "red",
};

export function TournamentDetail({
  tournament,
  registrations,
}: {
  tournament: {
    name: string;
    organizer: string | null;
    startDate: Date;
    endDate: Date | null;
    description: string | null;
    imageUrl: string | null;
  };
  registrations?: { teamName: string; status: string }[];
}) {
  return (
    <Card>
      {tournament.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tournament.imageUrl}
          alt={tournament.name}
          className="mb-4 h-48 w-full rounded-lg border border-border object-cover"
        />
      )}
      <h1 className="text-xl font-semibold">{tournament.name}</h1>
      <p className="mt-1 text-sm text-muted">
        {tournament.startDate.toLocaleDateString("pt-BR")}
        {tournament.endDate && ` – ${tournament.endDate.toLocaleDateString("pt-BR")}`}
        {tournament.organizer && ` · ${tournament.organizer}`}
      </p>

      {registrations && registrations.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {registrations.map((reg) => (
            <Badge key={reg.teamName} tone={STATUS_TONE[reg.status]}>
              {reg.teamName}: {reg.status}
            </Badge>
          ))}
        </div>
      )}

      {tournament.description ? (
        <div className="mt-6 border-t border-border pt-4">
          <RichTextViewer html={tournament.description} />
        </div>
      ) : (
        <p className="mt-6 border-t border-border pt-4 text-sm text-muted">
          Nenhuma descrição adicionada ainda.
        </p>
      )}
    </Card>
  );
}
