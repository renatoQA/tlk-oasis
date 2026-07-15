import Link from "next/link";
import { cn } from "@/lib/utils";

export type ProfileTab = "profile" | "agenda" | "elo" | "team" | "tournaments" | "documents";

const TABS: { key: ProfileTab; label: string; slug: string }[] = [
  { key: "profile", label: "Perfil", slug: "" },
  { key: "agenda", label: "Agenda", slug: "agenda" },
  { key: "elo", label: "Elo", slug: "elo" },
  { key: "team", label: "Time", slug: "time" },
  { key: "tournaments", label: "Campeonatos", slug: "campeonatos" },
  { key: "documents", label: "Documentos", slug: "documentos" },
];

export function ProfileTabNav({
  basePath,
  active,
  visibleTabs,
}: {
  basePath: string;
  active: ProfileTab;
  visibleTabs?: ProfileTab[];
}) {
  const tabs = visibleTabs ? TABS.filter((t) => visibleTabs.includes(t.key)) : TABS;

  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.slug ? `${basePath}/${tab.slug}` : basePath}
          className={cn(
            "shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200",
            active === tab.key
              ? "border-brand-pink text-foreground shadow-[0_1px_12px_-2px_var(--brand-pink)]"
              : "border-transparent text-muted hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
