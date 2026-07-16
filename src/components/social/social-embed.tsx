"use client";

import { useEffect } from "react";
import type { SocialPlatform } from "@/lib/social-platform";

function loadScriptOnce(src: string, onLoad?: () => void) {
  if (document.querySelector(`script[src="${src}"]`)) {
    onLoad?.();
    return;
  }
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  if (onLoad) script.onload = onLoad;
  document.body.appendChild(script);
}

function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    const process = () => window.instgrm?.Embeds.process();
    loadScriptOnce("https://www.instagram.com/embed.js", process);
    const timer = setTimeout(process, 400);
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ margin: 0 }}
    />
  );
}

function TikTokEmbed({ url }: { url: string }) {
  useEffect(() => {
    loadScriptOnce("https://www.tiktok.com/embed.js");
  }, [url]);

  return (
    <blockquote className="tiktok-embed" cite={url} style={{ margin: 0 }}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    </blockquote>
  );
}

function XEmbed({ url }: { url: string }) {
  useEffect(() => {
    const process = () => window.twttr?.widgets.load();
    loadScriptOnce("https://platform.twitter.com/widgets.js", process);
    const timer = setTimeout(process, 400);
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <blockquote className="twitter-tweet">
      <a href={url}>{url}</a>
    </blockquote>
  );
}

function FallbackLinkCard({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border p-4 text-sm text-brand-pink-light hover:underline"
    >
      Abrir post
    </a>
  );
}

export function SocialEmbed({ platform, url }: { platform: SocialPlatform; url: string }) {
  switch (platform) {
    case "INSTAGRAM":
      return <InstagramEmbed url={url} />;
    case "TIKTOK":
      return <TikTokEmbed url={url} />;
    case "X":
      return <XEmbed url={url} />;
    default:
      return <FallbackLinkCard url={url} />;
  }
}
