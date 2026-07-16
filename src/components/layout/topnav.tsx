import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { logoutAction } from "@/actions/auth-actions";
import { HamburgerButton } from "@/components/layout/hamburger-button";
import type { Role } from "@/generated/prisma/enums";

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  COACH: "Coach",
  PLAYER: "Player",
};

export function Topnav({
  name,
  role,
  photoUrl,
}: {
  name: string | null | undefined;
  role: Role;
  photoUrl?: string | null;
}) {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <HamburgerButton />
        <Avatar src={photoUrl} name={name ?? "?"} size="sm" />
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
