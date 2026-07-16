import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { CopyLinkButton } from "@/components/shared/copy-link-button";
import { SocialEmbed } from "@/components/social/social-embed";
import { deleteSocialPostAction } from "@/actions/social-post-actions";

export default async function SocialPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();

  const post = await db.socialPost.findUnique({ where: { id }, include: { createdBy: true } });
  if (!post) notFound();

  const canDelete = post.createdById === session.user.id || session.user.role === "ADMIN";

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm text-muted">
          <Avatar src={post.createdBy.photoUrl} name={post.createdBy.name ?? post.createdBy.email} size="sm" />
          <span>{post.createdBy.name ?? post.createdBy.email}</span>
          <span>· {post.createdAt.toLocaleDateString("pt-BR")}</span>
        </div>

        {post.description && <p className="mb-4 whitespace-pre-wrap text-sm">{post.description}</p>}

        <SocialEmbed platform={post.platform} url={post.url} />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CopyLinkButton path={`/tlk-play/${post.id}`} />
          {canDelete && (
            <form action={deleteSocialPostAction.bind(null, post.id)}>
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
