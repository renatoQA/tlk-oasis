"use client";

import { useActionState } from "react";
import { Label, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerTeamAction } from "@/actions/tournament-actions";

type Team = { id: string; name: string };
type Tournament = { id: string; name: string; startDate: string };

export function RegisterTeamAdminForm({
  teams,
  tournaments,
}: {
  teams: Team[];
  tournaments: Tournament[];
}) {
  const [state, formAction, pending] = useActionState(registerTeamAction, null);

  if (teams.length === 0 || tournaments.length === 0) {
    return (
      <p className="text-sm text-muted">
        Crie ao menos um time e um campeonato antes de inscrever.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
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

      <div>
        <Label htmlFor="teamId">Time</Label>
        <select
          id="teamId"
          name="teamId"
          required
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="tournamentId">Campeonato</Label>
        <select
          id="tournamentId"
          name="tournamentId"
          required
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({new Date(t.startDate).toLocaleDateString("pt-BR")})
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Input id="notes" name="notes" />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Inscrevendo..." : "Inscrever time"}
      </Button>
    </form>
  );
}
