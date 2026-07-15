"use client";

import { useActionState, useState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadButton } from "@/components/ui/image-upload-button";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { createTournamentAction } from "@/actions/tournament-actions";

export function CreateTournamentForm() {
  const [state, formAction, pending] = useActionState(createTournamentAction, null);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  return (
    <form action={formAction} className="space-y-4">
      {state && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok
              ? "border border-green-500/40 bg-green-500/10 text-green-300"
              : "border border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {state.ok ? state.message : state.error}
        </p>
      )}

      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="organizer">Organizador</Label>
        <Input id="organizer" name="organizer" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="startDate">Início</Label>
          <Input id="startDate" name="startDate" type="date" required />
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate">Fim</Label>
          <Input id="endDate" name="endDate" type="date" />
        </div>
      </div>

      <div>
        <Label>Imagem/logo do campeonato</Label>
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <ImageUploadButton label="Enviar imagem" currentUrl={imageUrl || null} onUploaded={setImageUrl} />
      </div>

      <div>
        <Label>Descrição</Label>
        <input type="hidden" name="description" value={description} />
        <RichTextEditor value={description} onChange={setDescription} placeholder="Regras, premiação, links..." />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Criando..." : "Criar campeonato"}
      </Button>
    </form>
  );
}
