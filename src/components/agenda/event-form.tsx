"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEventAction } from "@/actions/event-actions";

type Player = { id: string; name: string | null; email: string };

const TYPE_OPTIONS = [
  { value: "TRAINING", label: "Treino" },
  { value: "SCRIM", label: "Scrim" },
  { value: "TOURNAMENT_MATCH", label: "Partida de campeonato" },
  { value: "MEETING", label: "Reunião" },
];

export function EventForm({ teamId, roster }: { teamId: string; roster: Player[] }) {
  const [state, formAction, pending] = useActionState(createEventAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="teamId" value={teamId} />

      {state && !state.ok && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required />
      </div>

      <div>
        <Label htmlFor="type">Tipo</Label>
        <select
          id="type"
          name="type"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          defaultValue="TRAINING"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="startsAt">Data/hora</Label>
        <Input id="startsAt" name="startsAt" type="datetime-local" required />
      </div>

      <div>
        <Label htmlFor="location">Local</Label>
        <Input id="location" name="location" placeholder="ex: Discord - Sala Scrim" />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-muted">
          Convidar (deixe todos desmarcados para convidar o elenco inteiro)
        </p>
        <div className="space-y-1 rounded-lg border border-border p-3">
          {roster.map((player) => (
            <label key={player.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="playerIds" value={player.id} />
              {player.name ?? player.email}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Criando..." : "Criar evento"}
      </Button>
    </form>
  );
}
