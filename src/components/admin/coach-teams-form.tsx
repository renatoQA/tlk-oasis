"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { updateCoachTeamsAction } from "@/actions/team-actions";

type Team = { id: string; name: string };

export function CoachTeamsForm({
  userId,
  teams,
  assignedTeamIds,
}: {
  userId: string;
  teams: Team[];
  assignedTeamIds: string[];
}) {
  const [state, formAction, pending] = useActionState(updateCoachTeamsAction, null);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />

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

      <div className="space-y-1.5">
        {teams.map((team) => (
          <label key={team.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="teamIds"
              value={team.id}
              defaultChecked={assignedTeamIds.includes(team.id)}
              className="accent-brand-pink"
            />
            {team.name}
          </label>
        ))}
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar times"}
      </Button>
    </form>
  );
}
