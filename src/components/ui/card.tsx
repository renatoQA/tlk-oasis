import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "purple",
}: {
  children: React.ReactNode;
  tone?: "purple" | "pink" | "green" | "yellow" | "red" | "muted";
}) {
  const toneClasses: Record<string, string> = {
    purple: "bg-brand-purple/20 text-brand-purple-light border-brand-purple/40",
    pink: "bg-brand-pink/20 text-brand-pink-light border-brand-pink/40",
    green: "bg-green-500/20 text-green-300 border-green-500/40",
    yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    red: "bg-red-500/20 text-red-300 border-red-500/40",
    muted: "bg-white/5 text-muted border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}
