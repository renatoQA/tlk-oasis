import Link from "next/link";
import type { Role } from "@/generated/prisma/enums";

type NavItem = { href: string; label: string };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  PLAYER: [{ href: "/player/profile", label: "Meu Perfil" }],
  COACH: [
    { href: "/coach", label: "Meus Times" },
    { href: "/coach/profile", label: "Meu Perfil" },
  ],
  ADMIN: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Usuários" },
    { href: "/admin/invites", label: "Convites" },
    { href: "/admin/teams", label: "Times" },
    { href: "/admin/events", label: "Calendário" },
    { href: "/admin/tournaments", label: "Campeonatos" },
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const items = NAV_BY_ROLE[role];
  return (
    <nav className="flex h-full w-56 shrink-0 flex-col gap-1 border-r border-border bg-card/40 p-4">
      <div className="mb-6 px-2 text-lg font-extrabold tracking-tight">
        <span className="brand-gradient-text">TLK Oasis</span>
      </div>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-card hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
