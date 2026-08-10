"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageInput from "@/components/admin/ImageInput";

export default function BannerForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const body: any = Object.fromEntries(fd.entries());
    body.order = Number(body.order || 0);
    body.active = body.active === "on";
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    if (!res.ok) {
      setErr(d.error || "Lỗi");
      setSaving(false);
      return;
    }
    (e.target as HTMLFormElement).reset();
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input name="title" required placeholder="Tiêu đề" className="w-full border border-gold-200 rounded px-3 py-2" />
      <input name="subtitle" placeholder="Phụ đề" className="w-full border border-gold-200 rounded px-3 py-2" />
      <input name="link" placeholder="Đường dẫn (VD: /san-pham?danh-muc=nhan-cuoi)" className="w-full border border-gold-200 rounded px-3 py-2" />
      <div>
        <div className="text-xs uppercase tracking-widest text-ink-800/70 mb-1">Ảnh nền</div>
        <ImageInput name="image" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-ink-800/70 mb-1">Video MP4 (tuỳ chọn) — sẽ ưu tiên hơn ảnh</div>
        <input name="video" placeholder="https://.../hero.mp4" className="w-full border border-gold-200 rounded px-3 py-2" />
      </div>
      <input type="number" name="order" defaultValue={0} placeholder="Thứ tự" className="w-full border border-gold-200 rounded px-3 py-2" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked /> Hiển thị
      </label>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <button disabled={saving} className="w-full bg-ink-900 hover:bg-ink-800 disabled:opacity-60 text-white px-4 py-2 uppercase tracking-widest text-xs">
        {saving ? "Đang lưu..." : "Thêm banner"}
      </button>
    </form>
  );
}
