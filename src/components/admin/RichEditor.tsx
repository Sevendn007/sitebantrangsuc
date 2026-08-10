"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import {
  Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon, Undo, Redo, Quote, Minus,
} from "lucide-react";

interface Props {
  name: string;
  defaultValue?: string;
}

export default function RichEditor({ name, defaultValue }: Props) {
  const [value, setValue] = useState(defaultValue || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ HTMLAttributes: { class: "rounded my-3" } }),
    ],
    content: defaultValue || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-luxe min-h-[280px] max-w-none border border-gold-200 border-t-0 rounded-b p-4 focus:outline-none bg-white",
      },
    },
    onUpdate: ({ editor }) => setValue(editor.getHTML()),
  });

  useEffect(() => {
    // ensure hidden input always reflects state
  }, [value]);

  if (!editor) {
    return (
      <div>
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={10}
          className="w-full border border-gold-200 rounded px-3 py-2 font-mono text-sm"
        />
        <p className="text-xs text-ink-800/60 mt-1">Đang tải editor...</p>
      </div>
    );
  }

  async function uploadImageAndInsert(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok && data.url && editor) {
      editor.chain().focus().setImage({ src: data.url }).run();
    } else {
      alert(data.error || "Upload lỗi");
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={value} />

      <div className="flex flex-wrap gap-1 border border-gold-200 rounded-t bg-gold-50/50 p-2">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold size={14} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic size={14} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}><Underline size={14} /></Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 size={14} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 size={14} /></Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List size={14} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered size={14} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote size={14} /></Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={14} /></Btn>
        <Sep />
        <Btn
          onClick={() => {
            const previous = editor.getAttributes("link").href;
            const url = window.prompt("URL", previous || "https://");
            if (url === null) return;
            if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
            else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
        >
          <LinkIcon size={14} />
        </Btn>
        <Btn onClick={() => fileRef.current?.click()}><ImageIcon size={14} /></Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().undo().run()}><Undo size={14} /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()}><Redo size={14} /></Btn>
      </div>

      <EditorContent editor={editor} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadImageAndInsert(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Btn({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={"w-8 h-8 grid place-items-center rounded transition " + (active ? "bg-gold-200 text-gold-900" : "hover:bg-gold-100 text-ink-800")}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="w-px bg-gold-200 mx-1" />;
}
