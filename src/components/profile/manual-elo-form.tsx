"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { manualEloEntryAction } from "@/actions/elo-actions";

export function ManualEloForm({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(manualEloEntryAction, null);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="userId" value={userId} />
      {state && !state.ok && <p className="text-sm text-red-300">{state.error}</p>}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="currentTier">Rank atual</Label>
          <Input id="currentTier" name="currentTier" placeholder="ex: Diamante 2" />
        </div>
        <div className="w-28">
          <Label htmlFor="currentRr">RR</Label>
          <Input id="currentRr" name="currentRr" type="number" min={0} max={100} required />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
