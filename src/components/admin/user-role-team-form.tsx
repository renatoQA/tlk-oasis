"use client";

import { useActionState, useState } from "react";
import { Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserRoleTeamAction } from "@/actions/user-actions";
import type { Role } from "@/generated/prisma/enums";

type Team = { id: string; name: string };

export function UserRoleTeamForm({
  userId,
  role,
  teamId,
  teams,
}: {
  userId: string;
  role: Role;
  teamId: string | null;
  teams: Team[];
}) {
  const [state, formAction, pending] = useActionState(updateUserRoleTeamAction, null);
  const [selectedRole, setSelectedRole] = useState<Role>(role);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="userId" value={userId} />

      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          defaultValue={role}
          onChange={(e) => setSelectedRole(e.target.value as Role)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="PLAYER">Player</option>
          <option value="COACH">Coach</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {selectedRole === "PLAYER" && (
        <div>
          <Label htmlFor="teamId">Time</Label>
          <select
            id="teamId"
            name="teamId"
            defaultValue={teamId ?? ""}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="">Sem time</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar"}
      </Button>

      {state && (
        <span className={`text-sm ${state.ok ? "text-green-300" : "text-red-300"}`}>
          {state.ok ? state.message : state.error}
        </span>
      )}
    </form>
  );
}
