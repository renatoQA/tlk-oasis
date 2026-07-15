import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleContractStatusAction, toggleShirtStatusAction, markShirtReceivedAction } from "@/actions/status-actions";

type StatusUser = {
  id: string;
  contractSent: boolean;
  contractSigned: boolean;
  shirtRequested: boolean;
  shirtSent: boolean;
  shirtReceived: boolean;
};

function ToggleRow({
  label,
  active,
  action,
}: {
  label: string;
  active: boolean;
  action: () => Promise<void>;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <Badge tone={active ? "green" : "muted"}>{active ? "Sim" : "Não"}</Badge>
        <form action={action}>
          <Button type="submit" variant="secondary" className="px-2 py-1 text-xs">
            {active ? "Desmarcar" : "Marcar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function StatusToggles({ user }: { user: StatusUser }) {
  return (
    <Card>
      <h3 className="mb-3 text-base font-semibold">Contrato e camiseta</h3>
      <ToggleRow
        label="Contrato enviado"
        active={user.contractSent}
        action={toggleContractStatusAction.bind(null, user.id, "contractSent")}
      />
      <ToggleRow
        label="Contrato assinado"
        active={user.contractSigned}
        action={toggleContractStatusAction.bind(null, user.id, "contractSigned")}
      />
      <ToggleRow
        label="Camiseta solicitada"
        active={user.shirtRequested}
        action={toggleShirtStatusAction.bind(null, user.id, "shirtRequested")}
      />
      <ToggleRow
        label="Camiseta enviada"
        active={user.shirtSent}
        action={toggleShirtStatusAction.bind(null, user.id, "shirtSent")}
      />
      <ToggleRow
        label="Camiseta recebida (marcado pelo player/coach)"
        active={user.shirtReceived}
        action={markShirtReceivedAction.bind(null, user.id)}
      />
    </Card>
  );
}
