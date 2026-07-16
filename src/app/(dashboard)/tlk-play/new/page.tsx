import { requireSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { SocialPostForm } from "@/components/social/social-post-form";

export default async function NewSocialPostPage() {
  await requireSession();

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold">Postar no TLK Play</h1>
      <Card>
        <SocialPostForm />
      </Card>
    </div>
  );
}
