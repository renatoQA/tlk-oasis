"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/actions/upload-actions";
import { blobProxyUrl } from "@/lib/blob-proxy";

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
      Image,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[140px] rounded-b-lg px-3 py-2 text-sm focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  async function handleFile(file: File | null) {
    if (!file || !editor) return;
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadImage(formData);
    if (result.ok) {
      editor.chain().focus().setImage({ src: blobProxyUrl(result.url) }).run();
    }
  }

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          Negrito
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          Itálico
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Lista
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("URL do link:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()}>Imagem</ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-2 py-1 text-xs font-medium transition",
        active ? "bg-brand-purple/30 text-brand-purple-light" : "text-muted hover:bg-card-hover hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
