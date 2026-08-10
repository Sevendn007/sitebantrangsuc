"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, order }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Lỗi");
      setSaving(false);
      return;
    }
    setName("");
    setOrder(0);
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên danh mục"
        required
        className="w-full border border-gold-200 rounded px-3 py-2"
      />
      <input
        type="number"
        value={order}
        onChange={(e) => setOrder(Number(e.target.value))}
        placeholder="Thứ tự"
        className="w-full border border-gold-200 rounded px-3 py-2"
      />
      {err && <div className="text-sm text-red-600">{err}</div>}
      <button disabled={saving} className="w-full bg-ink-900 hover:bg-ink-800 disabled:opacity-60 text-white px-4 py-2 uppercase tracking-widest text-xs">
        {saving ? "Đang lưu..." : "Thêm"}
      </button>
    </form>
  );
}
