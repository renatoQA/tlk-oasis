"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateShirtTrackingCodeAction } from "@/actions/status-actions";

export function ShirtTrackingForm({
  userId,
  shirtTrackingCode,
}: {
  userId: string;
  shirtTrackingCode: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateShirtTrackingCodeAction, null);

  return (
    <form action={formAction} className="border-b border-border py-2 last:border-0">
      <input type="hidden" name="userId" value={userId} />
      <Label htmlFor="shirtTrackingCode">Observação / rastreio da camiseta</Label>
      <div className="flex items-center gap-2">
        <Input
          id="shirtTrackingCode"
          name="shirtTrackingCode"
          defaultValue={shirtTrackingCode ?? ""}
          placeholder="Código de rastreio ou link"
          className="flex-1"
        />
        <Button type="submit" variant="secondary" disabled={pending} className="px-3 py-2 text-xs">
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
      {state && (
        <p className={`mt-1 text-xs ${state.ok ? "text-green-300" : "text-red-300"}`}>
          {state.ok ? state.message : state.error}
        </p>
      )}
    </form>
  );
}
