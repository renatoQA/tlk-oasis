"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { blobProxyUrl } from "@/lib/blob-proxy";

const MAX_SIZE = 5 * 1024 * 1024;

export function ImageUploadButton({
  label = "Enviar imagem",
  currentUrl,
  onUploaded,
  kind = "photo",
}: {
  label?: string;
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
  kind?: "photo" | "team-logo" | "tournament-image";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const preview = uploadedUrl ?? currentUrl ?? null;

  async function handleFile(file: File | null) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Só é permitido enviar imagens");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Imagem muito grande (máx 5MB)");
      return;
    }

    setPending(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const blob = await upload(`uploads/${crypto.randomUUID()}.${ext}`, file, {
        access: "private",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ kind }),
      });
      setUploadedUrl(blob.url);
      onUploaded(blob.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar imagem");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blobProxyUrl(preview)}
          alt="Preview"
          className="h-14 w-14 rounded-lg border border-border object-cover"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={pending}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
      >
        {pending ? "Enviando..." : label}
      </Button>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
