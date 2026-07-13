import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEloProvider } from "@/lib/elo";
import { refreshEloAction } from "@/actions/elo-actions";
import { ManualEloForm } from "@/components/profile/manual-elo-form";

export async function EloTab({ userId, editable }: { userId: string; editable: boolean }) {
  const account = await db.riotAccount.findUnique({
    where: { userId },
    include: { eloSnapshots: { orderBy: { fetchedAt: "desc" }, take: 10 } },
  });

  if (!account) {
    return (
      <Card>
        <h3 className="text-base font-semibold">Elo</h3>
        <p className="mt-2 text-sm text-muted">
          Vincule um Riot ID na aba &quot;Riot ID&quot; para acompanhar o elo.
        </p>
      </Card>
    );
  }

  const providerConfigured = getEloProvider().isConfigured;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Elo</h3>
          {editable && providerConfigured && (
            <form action={refreshEloAction.bind(null, userId)}>
              <Button type="submit" variant="secondary">
                Atualizar via Tracker.gg
              </Button>
            </form>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted">Elo atual</p>
            <p className="text-2xl font-bold">
              {account.cachedCurrentTier ?? "—"}
              {account.cachedCurrentRr != null && (
                <span className="ml-1 text-sm text-muted">({account.cachedCurrentRr} RR)</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Elo peak</p>
            <p className="text-2xl font-bold brand-gradient-text">
              {account.cachedPeakTier ?? (account.cachedPeakRr ? `${account.cachedPeakRr} RR` : "—")}
            </p>
          </div>
        </div>

        {!providerConfigured && (
          <p className="mt-3 text-xs text-muted">
            Integração automática com Tracker.gg ainda não configurada — atualize manualmente abaixo.
          </p>
        )}
      </Card>

      {editable && !providerConfigured && (
        <Card>
          <h4 className="mb-3 text-sm font-semibold">Entrada manual</h4>
          <ManualEloForm userId={userId} />
        </Card>
      )}

      {account.eloSnapshots.length > 0 && (
        <Card>
          <h4 className="mb-3 text-sm font-semibold">Histórico recente</h4>
          <ul className="space-y-2 text-sm">
            {account.eloSnapshots.map((snap) => (
              <li key={snap.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-muted">{snap.fetchedAt.toLocaleDateString("pt-BR")}</span>
                <span>
                  {snap.currentTier ?? "—"} {snap.currentRr != null && `(${snap.currentRr} RR)`}
                </span>
                {snap.isManualEntry && <Badge tone="muted">manual</Badge>}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
