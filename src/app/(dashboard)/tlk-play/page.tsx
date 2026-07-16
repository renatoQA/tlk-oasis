import Link from "next/link";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { SocialEmbed } from "@/components/social/social-embed";

export default async function TlkPlayPage() {
  await requireSession();

  const posts = await db.socialPost.findMany({
    include: { createdBy: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">TLK Play</h1>
        <Link href="/tlk-play/new">
          <Button>Postar</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Nenhum post ainda.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <div className="mb-3 flex items-center gap-2 text-xs text-muted">
                <Avatar src={post.createdBy.photoUrl} name={post.createdBy.name ?? post.createdBy.email} size="sm" />
                <span>{post.createdBy.name ?? post.createdBy.email}</span>
                <span>· {post.createdAt.toLocaleDateString("pt-BR")}</span>
              </div>
              {post.description && <p className="mb-3 text-sm">{post.description}</p>}
              <SocialEmbed platform={post.platform} url={post.url} />
              <Link
                href={`/tlk-play/${post.id}`}
                className="mt-3 inline-block text-xs text-brand-pink-light hover:underline"
              >
                Ver post
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
