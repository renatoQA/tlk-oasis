import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/enums";

type UploadKind = "photo" | "team-logo" | "tournament-image" | "document";

const UPLOAD_KINDS: Record<
  UploadKind,
  { roles: Role[]; pathPrefix: string; maxSize: number; allowedContentTypes?: string[] }
> = {
  photo: {
    roles: ["ADMIN", "COACH", "PLAYER"],
    pathPrefix: "uploads/",
    maxSize: 5 * 1024 * 1024,
    allowedContentTypes: ["image/*"],
  },
  "team-logo": {
    roles: ["ADMIN"],
    pathPrefix: "uploads/",
    maxSize: 5 * 1024 * 1024,
    allowedContentTypes: ["image/*"],
  },
  "tournament-image": {
    roles: ["ADMIN"],
    pathPrefix: "uploads/",
    maxSize: 5 * 1024 * 1024,
    allowedContentTypes: ["image/*"],
  },
  document: {
    roles: ["ADMIN"],
    pathPrefix: "documents/",
    maxSize: 10 * 1024 * 1024,
  },
};

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Upload não configurado (conecte um Blob Store na Vercel)" },
      { status: 500 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const session = await auth();
        if (!session?.user) throw new Error("Não autenticado");

        const kind = (clientPayload ? (JSON.parse(clientPayload) as { kind?: string }).kind : null) as
          | UploadKind
          | null;
        const config = kind ? UPLOAD_KINDS[kind] : undefined;
        if (!config) throw new Error("Tipo de upload inválido");
        if (!config.roles.includes(session.user.role)) throw new Error("Sem permissão para este upload");
        if (!pathname.startsWith(config.pathPrefix)) throw new Error("Caminho inválido");

        return {
          maximumSizeInBytes: config.maxSize,
          ...(config.allowedContentTypes ? { allowedContentTypes: config.allowedContentTypes } : {}),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao gerar token de upload" },
      { status: 400 }
    );
  }
}
