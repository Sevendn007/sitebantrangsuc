"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import RichEditor from "@/components/admin/RichEditor";

interface Initial {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover?: string;
  published?: boolean;
}

export default function PostForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (!dirty || saving) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty, saving]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const body: any = Object.fromEntries(fd.entries());
    body.published = body.published === "on";
    const url = initial?.id ? `/api/admin/posts/${initial.id}` : "/api/admin/posts";
    const method = initial?.id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Lỗi");
      setSaving(false);
      return;
    }
    setDirty(false);
    router.push("/admin/bai-viet");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} onChange={() => setDirty(true)} className="grid md:grid-cols-[1fr_320px] gap-6">
      <div className="bg-white p-6 rounded-lg border border-gold-100 space-y-4">
        <div>
          <Label>Tiêu đề *</Label>
          <input name="title" required defaultValue={initial?.title} className="w-full border border-gold-200 rounded px-3 py-2 text-lg" />
        </div>
        <div>
          <Label>Slug (URL)</Label>
          <input name="slug" defaultValue={initial?.slug} className="w-full border border-gold-200 rounded px-3 py-2" />
        </div>
        <div>
          <Label>Mô tả ngắn (excerpt)</Label>
          <textarea name="excerpt" rows={2} defaultValue={initial?.excerpt} className="w-full border border-gold-200 rounded px-3 py-2" />
        </div>
        <div>
          <Label>Nội dung</Label>
          <RichEditor name="content" defaultValue={initial?.content} />
        </div>
      </div>

      <aside className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gold-100">
          <Label>Ảnh bìa</Label>
          <ImageInput name="cover" defaultValue={initial?.cover || ""} />
        </div>
        <div className="bg-white p-6 rounded-lg border border-gold-100">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} /> Đăng bài
          </label>
        </div>
        {err && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{err}</div>}
        <button disabled={saving} className="w-full bg-gold-600 hover:bg-gold-700 disabled:opacity-60 text-white px-6 py-3 uppercase tracking-widest text-sm">
          {saving ? "Đang lưu..." : "Lưu bài viết"}
        </button>
      </aside>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs uppercase tracking-widest text-ink-800/70 mb-1">{children}</div>;
}
