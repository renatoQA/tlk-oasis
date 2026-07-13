"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createInviteAction } from "@/actions/invite-actions";

type Team = { id: string; name: string };

export function InviteForm({ teams }: { teams: Team[] }) {
  const [state, formAction, pending] = useActionState(createInviteAction, null);

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
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          defaultValue="PLAYER"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="PLAYER">Player</option>
          <option value="COACH">Coach</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div>
        <Label htmlFor="teamId">Time (opcional)</Label>
        <select
          id="teamId"
          name="teamId"
          defaultValue=""
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="">Sem time</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Criando..." : "Criar convite"}
      </Button>
    </form>
  );
}
