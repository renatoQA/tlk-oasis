import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { CopyLinkButton } from "@/components/shared/copy-link-button";
import { deleteVodAction } from "@/actions/vod-actions";

export default async function VodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();

  const vod = await db.vod.findUnique({ where: { id }, include: { createdBy: true } });
  if (!vod) notFound();

  const canDelete = vod.createdById === session.user.id || session.user.role === "ADMIN";

  return (
    <div className="max-w-2xl">
      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm text-muted">
          <Avatar src={vod.createdBy.photoUrl} name={vod.createdBy.name ?? vod.createdBy.email} size="sm" />
          <span>{vod.createdBy.name ?? vod.createdBy.email}</span>
          <span>· {vod.createdAt.toLocaleDateString("pt-BR")}</span>
        </div>

        {vod.description && <p className="mb-4 whitespace-pre-wrap text-sm">{vod.description}</p>}

        <div className="flex flex-wrap items-center gap-2">
          <a href={vod.url} target="_blank" rel="noopener noreferrer">
            <Button>Assistir</Button>
          </a>
          <CopyLinkButton path={`/vods/${vod.id}`} />
          {canDelete && (
            <form action={deleteVodAction.bind(null, vod.id)}>
              <Button type="submit" variant="ghost" className="text-red-300">
                Excluir
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
