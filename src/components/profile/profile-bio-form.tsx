"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfileInfoAction } from "@/actions/profile-actions";

type Bio = {
  nick: string | null;
  instagram: string | null;
  address: string | null;
  birthDate: string | null;
  shirtSize: string | null;
};

export function ProfileBioForm({ userId, bio }: { userId: string; bio: Bio }) {
  const [state, formAction, pending] = useActionState(updateProfileInfoAction, null);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="nick">Nick</Label>
          <Input id="nick" name="nick" defaultValue={bio.nick ?? ""} />
        </div>
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" name="instagram" placeholder="@usuario" defaultValue={bio.instagram ?? ""} />
        </div>
        <div>
          <Label htmlFor="birthDate">Data de nascimento</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={bio.birthDate ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="shirtSize">Tamanho de camiseta</Label>
          <Input id="shirtSize" name="shirtSize" placeholder="P, M, G..." defaultValue={bio.shirtSize ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" name="address" defaultValue={bio.address ?? ""} />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
