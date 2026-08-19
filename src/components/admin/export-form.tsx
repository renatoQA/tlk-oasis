"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";

type FieldGroup = { label: string; fields: { key: string; label: string }[] };

const FIELD_GROUPS: FieldGroup[] = [
  {
    label: "Identificação",
    fields: [
      { key: "name", label: "Nome" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "team", label: "Time" },
      { key: "nick", label: "Nick" },
    ],
  },
  {
    label: "Contato / pessoal",
    fields: [
      { key: "instagram", label: "Instagram" },
      { key: "address", label: "Endereço" },
      { key: "birthDate", label: "Data de nascimento" },
      { key: "shirtSize", label: "Tamanho de camiseta" },
    ],
  },
  {
    label: "Contrato / camiseta",
    fields: [
      { key: "contractSent", label: "Contrato enviado" },
      { key: "contractSigned", label: "Contrato assinado" },
      { key: "shirtRequested", label: "Camiseta solicitada" },
      { key: "shirtSent", label: "Camiseta enviada" },
      { key: "shirtTrackingCode", label: "Rastreio da camiseta" },
      { key: "shirtReceived", label: "Camiseta recebida" },
    ],
  },
  {
    label: "Pix",
    fields: [{ key: "pixKey", label: "Chave Pix" }],
  },
  {
    label: "Valorant",
    fields: [
      { key: "riotId", label: "Riot ID" },
      { key: "currentElo", label: "Elo atual" },
      { key: "peakElo", label: "Elo peak" },
    ],
  },
];

const PRESETS: { label: string; fields: string[] }[] = [
  { label: "Nome + Endereço + Camiseta", fields: ["name", "address", "shirtSize"] },
  { label: "Nome + Riot ID", fields: ["name", "riotId"] },
  { label: "Nome + Instagram", fields: ["name", "instagram"] },
];

export function ExportForm({ teams }: { teams: { id: string; name: string }[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["name"]));

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <form method="GET" action="/api/admin/export" target="_blank" className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-muted">Atalhos</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setSelected(new Set(preset.fields))}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:border-brand-pink hover:text-foreground"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELD_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{group.label}</p>
            <div className="space-y-1">
              {group.fields.map((field) => (
                <label key={field.key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="fields"
                    value={field.key}
                    checked={selected.has(field.key)}
                    onChange={() => toggle(field.key)}
                    className="accent-brand-pink"
                  />
                  {field.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="teamId">Time</Label>
          <select
            id="teamId"
            name="teamId"
            defaultValue=""
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="">Todos os times</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="role">Papel</Label>
          <select
            id="role"
            name="role"
            defaultValue=""
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="PLAYER">Player</option>
            <option value="COACH">Coach</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={selected.size === 0} className="w-full">
        Baixar planilha (CSV)
      </Button>
    </form>
  );
}
