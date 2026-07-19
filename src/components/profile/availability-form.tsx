"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { setAvailabilityAction } from "@/actions/availability-actions";
import { DAYS_OF_WEEK, DAY_LABELS } from "@/lib/availability";

export function AvailabilityForm({
  availability,
}: {
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];
}) {
  const [state, formAction, pending] = useActionState(setAvailabilityAction, null);
  const byDay = new Map(availability.map((a) => [a.dayOfWeek, a]));
  const [enabled, setEnabled] = useState<Record<number, boolean>>(
    Object.fromEntries(DAYS_OF_WEEK.map((day) => [day, byDay.has(day)]))
  );

  return (
    <form action={formAction} className="space-y-3">
      {state && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok
              ? "border border-green-500/40 bg-green-500/10 text-green-300"
              : "border border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {state.ok ? state.message : state.error}
        </p>
      )}

      <div className="space-y-2">
        {DAYS_OF_WEEK.map((day) => {
          const existing = byDay.get(day);
          return (
            <div key={day} className="flex flex-wrap items-center gap-2 text-sm">
              <label className="flex w-28 shrink-0 items-center gap-2">
                <input
                  type="checkbox"
                  name={`day_${day}_enabled`}
                  defaultChecked={!!existing}
                  onChange={(e) => setEnabled((prev) => ({ ...prev, [day]: e.target.checked }))}
                  className="accent-brand-pink"
                />
                {DAY_LABELS[day]}
              </label>
              <input
                type="time"
                name={`day_${day}_start`}
                defaultValue={existing?.startTime ?? "18:00"}
                disabled={!enabled[day]}
                className="rounded-lg border border-border bg-card px-2 py-1 text-sm disabled:opacity-40"
              />
              <span className="text-muted">até</span>
              <input
                type="time"
                name={`day_${day}_end`}
                defaultValue={existing?.endTime ?? "22:00"}
                disabled={!enabled[day]}
                className="rounded-lg border border-border bg-card px-2 py-1 text-sm disabled:opacity-40"
              />
            </div>
          );
        })}
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar disponibilidade"}
      </Button>
    </form>
  );
}
