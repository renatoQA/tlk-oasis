"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { upload } from "@vercel/blob/client";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDocumentRecordAction } from "@/actions/document-actions";

const MAX_SIZE = 10 * 1024 * 1024;

export function DocumentUploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const titleInput = form.elements.namedItem("title") as HTMLInputElement;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const title = titleInput.value.trim();
    const file = fileInput.files?.[0];

    if (!title || !file) {
      setFeedback({ ok: false, text: "Preencha o título e selecione o arquivo" });
      return;
    }
    if (file.size > MAX_SIZE) {
      setFeedback({ ok: false, text: "Arquivo muito grande (máx 10MB)" });
      return;
    }

    setPending(true);
    setFeedback(null);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const blob = await upload(`documents/${crypto.randomUUID()}.${ext}`, file, {
        access: "private",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ kind: "document" }),
      });
      const result = await createDocumentRecordAction(userId, title, blob.url);
      if (result.ok) {
        setFeedback({ ok: true, text: result.message ?? "Documento anexado" });
        form.reset();
        router.refresh();
      } else {
        setFeedback({ ok: false, text: result.error });
      }
    } catch (err) {
      setFeedback({ ok: false, text: err instanceof Error ? err.message : "Erro ao enviar documento" });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {feedback && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.ok
              ? "border border-green-500/40 bg-green-500/10 text-green-300"
              : "border border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {feedback.text}
        </p>
      )}

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" placeholder="ex: Contrato assinado" required />
        </div>
        <div>
          <Label htmlFor="file">Arquivo</Label>
          <input
            id="file"
            name="file"
            type="file"
            required
            className="block rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Enviando..." : "Anexar"}
        </Button>
      </div>
    </form>
  );
}
