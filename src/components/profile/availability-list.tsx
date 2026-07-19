import { DAY_LABELS } from "@/lib/availability";

export function AvailabilityList({
  availability,
}: {
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];
}) {
  if (availability.length === 0) {
    return <p className="text-sm text-muted">Nenhuma disponibilidade cadastrada.</p>;
  }

  const sorted = [...availability].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <ul className="space-y-1 text-sm">
      {sorted.map((a) => (
        <li key={a.dayOfWeek}>
          <span className="font-medium">{DAY_LABELS[a.dayOfWeek]}:</span> {a.startTime} – {a.endTime}
        </li>
      ))}
    </ul>
  );
}
