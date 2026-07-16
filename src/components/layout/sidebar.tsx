"use client";

import Link from "next/link";
import type { Role } from "@/generated/prisma/enums";
import { useSidebar } from "@/components/layout/sidebar-provider";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

const SHARED_NAV: NavItem[] = [
  { href: "/vods", label: "VODs TLK" },
  { href: "/tlk-play", label: "TLK Play" },
];

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  PLAYER: [{ href: "/player/profile", label: "Meu Perfil" }, ...SHARED_NAV],
  COACH: [
    { href: "/coach", label: "Meus Times" },
    { href: "/coach/profile", label: "Meu Perfil" },
    ...SHARED_NAV,
  ],
  ADMIN: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Usuários" },
    { href: "/admin/invites", label: "Convites" },
    { href: "/admin/teams", label: "Times" },
    { href: "/admin/events", label: "Calendário" },
    { href: "/admin/tournaments", label: "Campeonatos" },
    { href: "/admin/import", label: "Importar planilha" },
    ...SHARED_NAV,
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const items = NAV_BY_ROLE[role];
  const { open, close } = useSidebar();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={close}
          aria-hidden
        />
      )}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-56 shrink-0 flex-col gap-1 border-r border-border bg-card/95 p-4 transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:bg-card/40",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 px-2 text-lg font-extrabold tracking-tight">
          <span className="brand-gradient-text">TLK Oasis</span>
        </div>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-card-hover hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
