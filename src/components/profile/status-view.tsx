import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markShirtReceivedAction } from "@/actions/status-actions";

type StatusUser = {
  id: string;
  contractSent: boolean;
  contractSigned: boolean;
  shirtRequested: boolean;
  shirtSent: boolean;
  shirtReceived: boolean;
};

export function StatusView({ user, canMarkReceived }: { user: StatusUser; canMarkReceived: boolean }) {
  return (
    <Card>
      <h3 className="mb-3 text-base font-semibold">Contrato e camiseta</h3>
      <div className="flex flex-wrap gap-2">
        <Badge tone={user.contractSent ? "green" : "muted"}>
          Contrato enviado: {user.contractSent ? "Sim" : "Não"}
        </Badge>
        <Badge tone={user.contractSigned ? "green" : "muted"}>
          Contrato assinado: {user.contractSigned ? "Sim" : "Não"}
        </Badge>
        <Badge tone={user.shirtRequested ? "green" : "muted"}>
          Camiseta solicitada: {user.shirtRequested ? "Sim" : "Não"}
        </Badge>
        <Badge tone={user.shirtSent ? "green" : "muted"}>
          Camiseta enviada: {user.shirtSent ? "Sim" : "Não"}
        </Badge>
        <Badge tone={user.shirtReceived ? "green" : "muted"}>
          Camiseta recebida: {user.shirtReceived ? "Sim" : "Não"}
        </Badge>
      </div>
      {canMarkReceived && (
        <form action={markShirtReceivedAction.bind(null, user.id)} className="mt-3">
          <Button type="submit" variant="secondary">
            {user.shirtReceived ? "Desmarcar camiseta recebida" : "Marcar camiseta como recebida"}
          </Button>
        </form>
      )}
    </Card>
  );
}
