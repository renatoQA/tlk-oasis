import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth-actions";
import type { Role } from "@/generated/prisma/enums";

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  COACH: "Coach",
  PLAYER: "Player",
};

export function Topnav({ name, role }: { name: string | null | undefined; role: Role }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="font-medium">{name ?? "Sem nome"}</span>
        <Badge tone={role === "ADMIN" ? "pink" : role === "COACH" ? "purple" : "muted"}>
          {ROLE_LABEL[role]}
        </Badge>
      </div>
      <form action={logoutAction}>
        <Button type="submit" variant="ghost">
          Sair
        </Button>
      </form>
    </header>
  );
}
