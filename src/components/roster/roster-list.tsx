"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { toggleMemberTagAction } from "@/actions/team-actions";

export type RosterPlayer = {
  id: string;
  name: string | null;
  email: string;
  photoUrl: string | null;
  isIgl: boolean;
  isCaptain: boolean;
  riotAccount: {
    gameName: string;
    tagLine: string;
    cachedCurrentTier: string | null;
    cachedPeakTier: string | null;
  } | null;
};

export function RosterList({
  players,
  detailBasePath,
  meetingBasePath,
}: {
  players: RosterPlayer[];
  detailBasePath: string;
  meetingBasePath?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exportCsv() {
    const rows = players
      .filter((p) => selected.size === 0 || selected.has(p.id))
      .map((p) => ({
        nome: p.name ?? "",
        email: p.email,
        riotId: p.riotAccount ? `${p.riotAccount.gameName}#${p.riotAccount.tagLine}` : "",
      }));

    const header = "Nome,Email,Riot ID";
    const csv = [header, ...rows.map((r) => `"${r.nome}","${r.email}","${r.riotId}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "riot-ids.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (players.length === 0) {
    return <p className="text-sm text-muted">Nenhum jogador neste time ainda.</p>;
  }

  return (
    <div>
      <ul className="space-y-2">
        {players.map((player) => (
          <li key={player.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.has(player.id)}
                onChange={() => toggleSelected(player.id)}
                className="accent-brand-pink"
              />
              <Link
                href={`${detailBasePath}/${player.id}`}
                className="flex items-center gap-2 hover:text-brand-pink-light"
              >
                <Avatar src={player.photoUrl} name={player.name ?? player.email} size="sm" />
                {player.name ?? player.email}
              </Link>
              {player.isCaptain && <Badge tone="pink">Capitão</Badge>}
              {player.isIgl && <Badge tone="purple">IGL</Badge>}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              {player.riotAccount ? (
                <>
                  <Badge tone="muted">{player.riotAccount.cachedCurrentTier ?? "sem elo"}</Badge>
                  {player.riotAccount.cachedPeakTier && (
                    <Badge tone="pink">peak {player.riotAccount.cachedPeakTier}</Badge>
                  )}
                </>
              ) : (
                <Badge tone="muted">sem riot id</Badge>
              )}
              <form action={toggleMemberTagAction.bind(null, player.id, "isCaptain")}>
                <button type="submit" className="rounded px-1.5 py-0.5 hover:bg-card-hover hover:text-foreground">
                  {player.isCaptain ? "− capitão" : "+ capitão"}
                </button>
              </form>
              <form action={toggleMemberTagAction.bind(null, player.id, "isIgl")}>
                <button type="submit" className="rounded px-1.5 py-0.5 hover:bg-card-hover hover:text-foreground">
                  {player.isIgl ? "− IGL" : "+ IGL"}
                </button>
              </form>
              {meetingBasePath && (
                <Link
                  href={`${meetingBasePath}?playerId=${player.id}&type=MEETING`}
                  className="rounded px-1.5 py-0.5 text-brand-pink-light hover:bg-card-hover"
                >
                  Marcar reunião
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2">
        <Button type="button" variant="secondary" onClick={exportCsv}>
          Exportar Riot IDs (CSV)
        </Button>
        <span className="text-xs text-muted">
          {selected.size === 0 ? "Nenhum selecionado — exporta todos" : `${selected.size} selecionado(s)`}
        </span>
      </div>
    </div>
  );
}
