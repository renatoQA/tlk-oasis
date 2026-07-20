"use client";

import { useActionState, useState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadButton } from "@/components/ui/image-upload-button";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { createTournamentAction, updateTournamentAction } from "@/actions/tournament-actions";

export function CreateTournamentForm({
  tournament,
}: {
  tournament?: {
    id: string;
    name: string;
    organizer: string | null;
    startDate: string;
    endDate: string | null;
    description: string | null;
    imageUrl: string | null;
  };
}) {
  const action = tournament ? updateTournamentAction : createTournamentAction;
  const [state, formAction, pending] = useActionState(action, null);
  const [imageUrl, setImageUrl] = useState(tournament?.imageUrl ?? "");
  const [description, setDescription] = useState(tournament?.description ?? "");

  return (
    <form action={formAction} className="space-y-4">
      {tournament && <input type="hidden" name="tournamentId" value={tournament.id} />}
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
        <Input id="name" name="name" defaultValue={tournament?.name} required />
      </div>
      <div>
        <Label htmlFor="organizer">Organizador</Label>
        <Input id="organizer" name="organizer" defaultValue={tournament?.organizer ?? undefined} />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="startDate">Início</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={tournament?.startDate} required />
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate">Fim</Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={tournament?.endDate ?? undefined} />
        </div>
      </div>

      <div>
        <Label>Imagem/logo do campeonato</Label>
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <ImageUploadButton
          label="Enviar imagem"
          currentUrl={imageUrl || null}
          kind="tournament-image"
          onUploaded={setImageUrl}
        />
      </div>

      <div>
        <Label>Descrição</Label>
        <input type="hidden" name="description" value={description} />
        <RichTextEditor value={description} onChange={setDescription} placeholder="Regras, premiação, links..." />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? tournament
            ? "Salvando..."
            : "Criando..."
          : tournament
            ? "Salvar alterações"
            : "Criar campeonato"}
      </Button>
    </form>
  );
}
