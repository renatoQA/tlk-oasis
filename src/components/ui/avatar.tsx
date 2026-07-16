import { blobProxyUrl } from "@/lib/blob-proxy";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-16 w-16 text-lg",
} as const;

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function Avatar({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name: string;
  size?: keyof typeof SIZE_CLASSES;
}) {
  const sizeClass = SIZE_CLASSES[size];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={blobProxyUrl(src)}
        alt={name}
        className={cn(sizeClass, "shrink-0 rounded-full border border-border object-cover")}
      />
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "flex shrink-0 items-center justify-center rounded-full border border-border bg-card-hover font-semibold text-muted"
      )}
    >
      {initials(name) || "?"}
    </div>
  );
}

export function TeamLogo({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name: string;
  size?: keyof typeof SIZE_CLASSES;
}) {
  const sizeClass = SIZE_CLASSES[size];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={blobProxyUrl(src)}
        alt={name}
        className={cn(sizeClass, "shrink-0 rounded-lg border border-border object-cover")}
      />
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "flex shrink-0 items-center justify-center rounded-lg border border-border bg-card-hover font-semibold text-muted"
      )}
    >
      {initials(name) || "?"}
    </div>
  );
}
