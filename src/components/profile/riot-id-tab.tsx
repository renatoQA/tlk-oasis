import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateRiotIdAction } from "@/actions/user-actions";

export async function RiotIdTab({ userId, editable }: { userId: string; editable: boolean }) {
  const account = await db.riotAccount.findUnique({ where: { userId } });

  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold">Riot ID (Valorant)</h3>

      {account && (
        <p className="mb-4 text-sm text-muted">
          Vinculado:{" "}
          <span className="text-foreground">
            {account.gameName}#{account.tagLine}
          </span>
        </p>
      )}

      {editable ? (
        <form action={updateRiotIdAction} className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="gameName">Nome</Label>
            <Input
              id="gameName"
              name="gameName"
              defaultValue={account?.gameName}
              placeholder="ex: Fulano"
              required
            />
          </div>
          <div className="w-24">
            <Label htmlFor="tagLine">Tag</Label>
            <Input id="tagLine" name="tagLine" defaultValue={account?.tagLine} placeholder="BR1" required />
          </div>
          <Button type="submit">{account ? "Atualizar" : "Vincular"}</Button>
        </form>
      ) : (
        !account && <p className="text-sm text-muted">Nenhum Riot ID vinculado ainda.</p>
      )}
    </Card>
  );
}
