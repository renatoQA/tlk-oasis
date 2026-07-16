import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentUploadForm } from "@/components/profile/document-upload-form";
import { deleteDocumentAction } from "@/actions/document-actions";
import { blobProxyUrl } from "@/lib/blob-proxy";

export async function DocumentsTab({ userId, canUpload }: { userId: string; canUpload: boolean }) {
  const documents = await db.document.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold">Documentos</h3>

      {documents.length === 0 ? (
        <p className="text-sm text-muted">Nenhum documento anexado ainda.</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
              <a
                href={blobProxyUrl(doc.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-pink-light hover:underline"
              >
                {doc.title}
              </a>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted">{doc.createdAt.toLocaleDateString("pt-BR")}</span>
                {canUpload && (
                  <form action={deleteDocumentAction.bind(null, doc.id)}>
                    <Button type="submit" variant="ghost" className="text-xs text-red-300">
                      Remover
                    </Button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {canUpload && (
        <div className="border-t border-border pt-4">
          <DocumentUploadForm userId={userId} />
        </div>
      )}
    </Card>
  );
}
