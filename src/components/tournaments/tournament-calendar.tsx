"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarTournament = {
  id: string;
  name: string;
  organizer: string | null;
  startDate: string;
  endDate: string | null;
  href: string;
  badges: { key: string; label: string; tone: "purple" | "pink" | "green" | "yellow" | "red" | "muted" }[];
};

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function occursOn(t: CalendarTournament, day: Date) {
  const start = startOfDay(new Date(t.startDate));
  const end = t.endDate ? startOfDay(new Date(t.endDate)) : start;
  const d = startOfDay(day);
  return d >= start && d <= end;
}

function buildWeek(anchor: Date) {
  const sunday = addDays(startOfDay(anchor), -anchor.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(sunday, i));
}

function buildMonth(anchor: Date) {
  const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function TournamentCalendar({ tournaments }: { tournaments: CalendarTournament[] }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState<"week" | "month">("week");
  const [cursor, setCursor] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const days = useMemo(() => (view === "week" ? buildWeek(cursor) : buildMonth(cursor)), [view, cursor]);

  const countByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const day of days) {
      const key = day.toDateString();
      map.set(key, tournaments.filter((t) => occursOn(t, day)).length);
    }
    return map;
  }, [days, tournaments]);

  const visible = useMemo(() => {
    if (!selectedDate) return tournaments;
    return tournaments.filter((t) => occursOn(t, selectedDate));
  }, [tournaments, selectedDate]);

  function goToday() {
    setCursor(today);
    setSelectedDate(today);
  }

  function navigate(delta: number) {
    setCursor((c) => (view === "week" ? addDays(c, delta * 7) : addMonths(c, delta)));
  }

  function selectDay(day: Date) {
    setSelectedDate((prev) => (prev && isSameDay(prev, day) ? null : day));
  }

  const headerLabel =
    view === "week"
      ? `${days[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} – ${days[6].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`
      : cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" onClick={() => navigate(-1)} className="px-2 py-1">
              ‹
            </Button>
            <p className="min-w-[150px] text-center text-sm font-medium capitalize">{headerLabel}</p>
            <Button variant="ghost" onClick={() => navigate(1)} className="px-2 py-1">
              ›
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={goToday} className="px-3 py-1 text-xs">
              Hoje
            </Button>
            <div className="flex rounded-lg border border-border p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setView("week")}
                className={cn("rounded-md px-2.5 py-1 transition", view === "week" ? "brand-gradient-bg text-white" : "text-muted hover:text-foreground")}
              >
                Semanal
              </button>
              <button
                type="button"
                onClick={() => setView("month")}
                className={cn("rounded-md px-2.5 py-1 transition", view === "month" ? "brand-gradient-bg text-white" : "text-muted hover:text-foreground")}
              >
                Mensal
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted">
          {WEEKDAY_LABELS.map((w) => (
            <div key={w} className="pb-1">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const inMonth = view === "month" ? day.getMonth() === cursor.getMonth() : true;
            const count = countByDay.get(day.toDateString()) ?? 0;
            const isToday = isSameDay(day, today);
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => selectDay(day)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-lg border p-2 text-xs transition hover:bg-card-hover",
                  view === "week" ? "min-h-16" : "min-h-11",
                  isSelected ? "border-brand-pink/60 bg-brand-pink/10" : "border-transparent",
                  !isSelected && isToday && "border-brand-purple/50",
                  !inMonth && "opacity-40"
                )}
              >
                <span className={cn(isToday && "font-semibold text-brand-pink-light")}>{day.getDate()}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "rounded-full",
                      view === "week"
                        ? "bg-brand-pink/20 px-1.5 py-0.5 text-[10px] text-brand-pink-light"
                        : "h-1.5 w-1.5 bg-brand-pink-light"
                    )}
                  >
                    {view === "week" ? `${count} campeonato${count > 1 ? "s" : ""}` : ""}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted">
          {selectedDate
            ? isSameDay(selectedDate, today)
              ? "Hoje"
              : selectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
            : "Todos os campeonatos"}
        </h2>
        {selectedDate && (
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            className="text-xs text-muted hover:text-foreground"
          >
            Ver todos
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">
            {selectedDate ? "Nenhum campeonato nesta data." : "Nenhum campeonato cadastrado ainda."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((t) => (
            <Link key={t.id} href={t.href}>
              <Card className="card-hover-effect">
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted">
                  {new Date(t.startDate).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                  {t.endDate &&
                    ` – ${new Date(t.endDate).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}`}
                  {t.organizer && ` · ${t.organizer}`}
                </p>
                {t.badges.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.badges.map((b) => (
                      <Badge key={b.key} tone={b.tone}>
                        {b.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
