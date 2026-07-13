import { db } from "@/lib/db";
import { getValidInvite } from "@/lib/invites";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { acceptInviteFormAction } from "@/actions/invite-actions";

const ERROR_MESSAGES: Record<string, string> = {
  not_found: "Convite não encontrado.",
  not_pending: "Este convite já foi utilizado ou revogado.",
  expired: "Este convite expirou. Peça um novo ao seu coach/admin.",
};

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error } = await searchParams;
  const { invite, error: inviteError } = await getValidInvite(token);

  if (!invite) {
    return (
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Convite inválido</h2>
        <p className="text-sm text-muted">
          {ERROR_MESSAGES[inviteError ?? "not_found"]}
        </p>
      </Card>
    );
  }

  const team = invite.teamId ? await db.team.findUnique({ where: { id: invite.teamId } }) : null;

  return (
    <Card>
      <h2 className="mb-1 text-lg font-semibold">Complete seu cadastro</h2>
      <p className="mb-5 text-sm text-muted">
        Convite para <span className="text-foreground">{invite.email}</span>
        {team ? (
          <>
            {" "}
            no time <span className="text-foreground">{team.name}</span>
          </>
        ) : null}
      </p>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <form action={acceptInviteFormAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" required minLength={8} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
        </div>

        <div className="border-t border-border pt-4">
          <p className="mb-3 text-xs text-muted">
            Riot ID do Valorant (opcional agora, pode vincular depois no seu perfil)
          </p>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="gameName">Nome</Label>
              <Input id="gameName" name="gameName" placeholder="ex: Fulano" />
            </div>
            <div className="w-24">
              <Label htmlFor="tagLine">Tag</Label>
              <Input id="tagLine" name="tagLine" placeholder="BR1" />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Criar conta
        </Button>
      </form>
    </Card>
  );
}
