"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { createEventAction } from "@/actions/event-actions";

type Player = { id: string; name: string | null; email: string };
type Member = { id: string; name: string | null; email: string; role: string; teamLabel: string };

const TYPE_OPTIONS = [
  { value: "TRAINING", label: "Treino" },
  { value: "SCRIM", label: "Scrim" },
  { value: "TOURNAMENT_MATCH", label: "Partida de campeonato" },
  { value: "MEETING", label: "Reunião" },
];

const ROLE_LABEL: Record<string, string> = {
  PLAYER: "Player",
  COACH: "Coach",
};

export function EventForm({
  teamId,
  roster,
  allMembers,
  defaultType = "TRAINING",
  preselectedPlayerIds = [],
}: {
  teamId: string;
  roster: Player[];
  allMembers: Member[];
  defaultType?: string;
  preselectedPlayerIds?: string[];
}) {
  const [state, formAction, pending] = useActionState(createEventAction, null);
  const [type, setType] = useState(defaultType);
  const [teamFilter, setTeamFilter] = useState("");
  const isMeeting = type === "MEETING";

  const teamOptions = useMemo(
    () => Array.from(new Set(allMembers.map((m) => m.teamLabel))).sort(),
    [allMembers]
  );

  const visibleMembers = useMemo(
    () => (teamFilter ? allMembers.filter((m) => m.teamLabel === teamFilter) : allMembers),
    [allMembers, teamFilter]
  );

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
          value={type}
          onChange={(e) => setType(e.target.value)}
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

      {isMeeting ? (
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted">Convidar (qualquer jogador ou coach)</p>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="rounded-lg border border-border bg-card px-2 py-1 text-xs"
            >
              <option value="">Todos os times</option>
              {teamOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-border p-3">
            {visibleMembers.map((member) => (
              <label key={member.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="playerIds"
                    value={member.id}
                    defaultChecked={preselectedPlayerIds.includes(member.id)}
                  />
                  {member.name ?? member.email}
                </span>
                <span className="flex items-center gap-1">
                  <Badge tone="muted">{ROLE_LABEL[member.role] ?? member.role}</Badge>
                  <Badge tone="purple">{member.teamLabel}</Badge>
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-1.5 text-sm font-medium text-muted">
            Convidar (deixe todos desmarcados para convidar o elenco inteiro)
          </p>
          <div className="space-y-1 rounded-lg border border-border p-3">
            {roster.map((player) => (
              <label key={player.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="playerIds"
                  value={player.id}
                  defaultChecked={preselectedPlayerIds.includes(player.id)}
                />
                {player.name ?? player.email}
              </label>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Criando..." : "Criar evento"}
      </Button>
    </form>
  );
}
