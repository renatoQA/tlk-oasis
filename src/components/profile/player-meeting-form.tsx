"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPlayerMeetingAction } from "@/actions/player-meeting-actions";

export function PlayerMeetingForm({
  targetUserId,
  targetName,
}: {
  targetUserId: string;
  targetName: string;
}) {
  const [state, formAction, pending] = useActionState(createPlayerMeetingAction, null);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="targetUserId" value={targetUserId} />

      {state && !state.ok && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" defaultValue={`Reunião com ${targetName}`} required />
      </div>

      <div>
        <Label htmlFor="startsAt">Data e hora</Label>
        <Input id="startsAt" name="startsAt" type="datetime-local" required />
      </div>

      <div>
        <Label htmlFor="description">Descrição (opcional)</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-pink/60"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Marcando..." : "Marcar reunião"}
      </Button>
    </form>
  );
}
