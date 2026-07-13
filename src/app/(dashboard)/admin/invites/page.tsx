import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InviteForm } from "@/components/invites/invite-form";
import { revokeInviteAction } from "@/actions/invite-actions";

const STATUS_TONE: Record<string, "purple" | "pink" | "green" | "yellow" | "red" | "muted"> = {
  PENDING: "yellow",
  ACCEPTED: "green",
  EXPIRED: "muted",
  REVOKED: "red",
};

export default async function AdminInvitesPage() {
  await requireRole("ADMIN");

  const [invites, teams] = await Promise.all([
    db.invite.findMany({ orderBy: { createdAt: "desc" } }),
    db.team.findMany({ orderBy: { name: "asc" } }),
  ]);
  const teamNameById = new Map(teams.map((t) => [t.id, t.name]));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-6 text-xl font-semibold">Convites</h1>
        {invites.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">Nenhum convite criado ainda.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {invites.map((invite) => (
              <Card key={invite.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-xs text-muted">
                      {invite.role}
                      {invite.teamId && ` · ${teamNameById.get(invite.teamId)}`} · expira em{" "}
                      {invite.expiresAt.toLocaleDateString("pt-BR")}
                    </p>
                    {invite.status === "PENDING" && (
                      <p className="mt-1 truncate text-xs text-brand-pink-light">
                        /invite/{invite.token}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={STATUS_TONE[invite.status]}>{invite.status}</Badge>
                    {invite.status === "PENDING" && (
                      <form action={revokeInviteAction.bind(null, invite.id)}>
                        <Button type="submit" variant="ghost" className="text-xs text-red-300">
                          Revogar
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-6 text-xl font-semibold">Novo convite</h2>
        <Card>
          <InviteForm teams={teams} />
        </Card>
      </div>
    </div>
  );
}
