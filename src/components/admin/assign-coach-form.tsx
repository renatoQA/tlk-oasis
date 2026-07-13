"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { assignCoachAction } from "@/actions/team-actions";

type Coach = { id: string; name: string | null; email: string };

export function AssignCoachForm({ teamId, coaches }: { teamId: string; coaches: Coach[] }) {
  const [state, formAction, pending] = useActionState(assignCoachAction, null);

  if (coaches.length === 0) {
    return <p className="text-sm text-muted">Nenhum usuário com role Coach disponível ainda.</p>;
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="teamId" value={teamId} />
      <select
        name="userId"
        required
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
      >
        {coaches.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name ?? c.email}
          </option>
        ))}
      </select>
      <Button type="submit" disabled={pending}>
        {pending ? "Vinculando..." : "Vincular coach"}
      </Button>
      {state && (
        <span className={`text-sm ${state.ok ? "text-green-300" : "text-red-300"}`}>
          {state.ok ? state.message : state.error}
        </span>
      )}
    </form>
  );
}
