export type SocialPlatform = "INSTAGRAM" | "TIKTOK" | "X" | "OTHER";

export function detectPlatform(url: string): SocialPlatform {
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "OTHER";
  }

  if (host.includes("instagram.com")) return "INSTAGRAM";
  if (host.includes("tiktok.com")) return "TIKTOK";
  if (host.includes("twitter.com") || host.includes("x.com")) return "X";
  return "OTHER";
}
