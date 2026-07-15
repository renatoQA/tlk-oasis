"use client";

import { useRouter } from "next/navigation";
import { ImageUploadButton } from "@/components/ui/image-upload-button";
import { updateProfilePhotoAction } from "@/actions/profile-actions";

export function ProfilePhotoUploader({ userId, currentUrl }: { userId: string; currentUrl: string | null }) {
  const router = useRouter();

  return (
    <ImageUploadButton
      label="Alterar foto"
      currentUrl={currentUrl}
      onUploaded={async (url) => {
        await updateProfilePhotoAction(userId, url);
        router.refresh();
      }}
    />
  );
}
