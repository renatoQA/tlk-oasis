"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadDocumentAction } from "@/actions/document-actions";

export function DocumentUploadForm({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(uploadDocumentAction, null);

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

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" placeholder="ex: Contrato assinado" required />
        </div>
        <div>
          <Label htmlFor="file">Arquivo</Label>
          <input
            id="file"
            name="file"
            type="file"
            required
            className="block rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Enviando..." : "Anexar"}
        </Button>
      </div>
    </form>
  );
}
