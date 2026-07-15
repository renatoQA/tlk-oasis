export function RichTextViewer({ html }: { html: string }) {
  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
