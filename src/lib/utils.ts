export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Date/time strings without a timezone offset (e.g. "2026-08-17T15:00") are parsed
// as local time by `new Date(...)`. These helpers invert that using the same local
// getters, so a value round-trips through an edit form unchanged regardless of the
// server process's timezone.
export function toLocalDateInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toLocalTimeInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
