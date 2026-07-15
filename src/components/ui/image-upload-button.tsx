"use client";

import { useActionState, useEffect, useRef } from "react";
import { uploadImageAction } from "@/actions/upload-actions";
import { Button } from "@/components/ui/button";

export function ImageUploadButton({
  label = "Enviar imagem",
  currentUrl,
  onUploaded,
}: {
  label?: string;
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
}) {
  const [state, formAction, pending] = useActionState(uploadImageAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = state?.ok ? state.url : (currentUrl ?? null);

  useEffect(() => {
    if (state?.ok) {
      onUploaded(state.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="flex items-center gap-3">
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Preview"
          className="h-14 w-14 rounded-lg border border-border object-cover"
        />
      )}
      <form ref={formRef} action={formAction}>
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/*"
          className="hidden"
          disabled={pending}
          onChange={() => formRef.current?.requestSubmit()}
        />
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          {pending ? "Enviando..." : label}
        </Button>
      </form>
      {state && !state.ok && <p className="text-xs text-red-300">{state.error}</p>}
    </div>
  );
}
