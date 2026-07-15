"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { importRosterAction } from "@/actions/import-actions";

export function RosterImportForm() {
  const [state, formAction, pending] = useActionState(importRosterAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="csv">Cole o CSV da planilha</Label>
        <textarea
          id="csv"
          name="csv"
          rows={10}
          placeholder="Nome,Time,Nick,Instagram,Endereço,Data de Nascimento,Tamanho Camiseta"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Importando..." : "Importar"}
      </Button>

      {state && !state.ok && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      {state && state.ok && (
        <div className="space-y-2 text-sm">
          <p className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-green-300">
            {state.updated.length} atualizado(s)
          </p>
          {state.updated.length > 0 && (
            <p className="text-muted">Atualizados: {state.updated.join(", ")}</p>
          )}
          {state.notFound.length > 0 && (
            <p className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-yellow-300">
              Não encontrados (sem conta com esse nome): {state.notFound.join(", ")}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
