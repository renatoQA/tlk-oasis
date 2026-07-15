"use client";

import { useRouter } from "next/navigation";
import { ImageUploadButton } from "@/components/ui/image-upload-button";
import { setTeamLogoAction } from "@/actions/team-actions";

export function TeamLogoUploader({ teamId, currentUrl }: { teamId: string; currentUrl: string | null }) {
  const router = useRouter();

  return (
    <ImageUploadButton
      label="Alterar logo do time"
      currentUrl={currentUrl}
      onUploaded={async (url) => {
        await setTeamLogoAction(teamId, url);
        router.refresh();
      }}
    />
  );
}
