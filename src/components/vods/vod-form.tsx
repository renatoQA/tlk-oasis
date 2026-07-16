"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createVodAction } from "@/actions/vod-actions";

export function VodForm() {
  const [state, formAction, pending] = useActionState(createVodAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state && !state.ok && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div>
        <Label htmlFor="url">Link do vídeo (YouTube, Drive...)</Label>
        <Input id="url" name="url" type="url" placeholder="https://..." required />
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

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Postando..." : "Postar VOD"}
      </Button>
    </form>
  );
}
