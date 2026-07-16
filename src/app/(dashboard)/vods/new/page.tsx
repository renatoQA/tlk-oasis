import { requireSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { VodForm } from "@/components/vods/vod-form";

export default async function NewVodPage() {
  await requireSession();

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold">Postar VOD</h1>
      <Card>
        <VodForm />
      </Card>
    </div>
  );
}
