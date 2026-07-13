"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerTeamAction } from "@/actions/tournament-actions";

type Tournament = { id: string; name: string; startDate: string };

export function RegisterTeamForm({ teamId, tournaments }: { teamId: string; tournaments: Tournament[] }) {
  const [state, formAction, pending] = useActionState(registerTeamAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="teamId" value={teamId} />

      {state && (
        <p className={`rounded-lg px-3 py-2 text-sm ${state.ok ? "border border-green-500/40 bg-green-500/10 text-green-300" : "border border-red-500/40 bg-red-500/10 text-red-300"}`}>
          {state.ok ? state.message : state.error}
        </p>
      )}

      {tournaments.length === 0 ? (
        <p className="text-sm text-muted">
          Nenhum campeonato cadastrado ainda. Peça ao admin para criar um em Admin → Campeonatos.
        </p>
      ) : (
        <>
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
        </>
      )}
    </form>
  );
}
