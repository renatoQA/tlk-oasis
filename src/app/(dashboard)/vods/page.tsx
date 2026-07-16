import Link from "next/link";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default async function VodsPage() {
  await requireSession();

  const vods = await db.vod.findMany({
    include: { createdBy: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">VODs TLK</h1>
        <Link href="/vods/new">
          <Button>Postar VOD</Button>
        </Link>
      </div>

      {vods.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Nenhum VOD postado ainda.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {vods.map((vod) => (
            <Link key={vod.id} href={`/vods/${vod.id}`}>
              <Card className="card-hover-effect">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Avatar src={vod.createdBy.photoUrl} name={vod.createdBy.name ?? vod.createdBy.email} size="sm" />
                  <span>{vod.createdBy.name ?? vod.createdBy.email}</span>
                  <span>· {vod.createdAt.toLocaleDateString("pt-BR")}</span>
                </div>
                {vod.description && <p className="mt-2 text-sm">{vod.description}</p>}
                <p className="mt-1 truncate text-xs text-brand-pink-light">{vod.url}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
