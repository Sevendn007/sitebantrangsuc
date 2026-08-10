"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import RichEditor from "@/components/admin/RichEditor";

interface Category { id: string; name: string; }
interface Initial {
  id?: string;
  name?: string;
  slug?: string;
  sku?: string | null;
  price?: number;
  salePrice?: number | null;
  material?: string | null;
  weight?: string | null;
  sizes?: string | null;
  description?: string;
  content?: string;
  images?: string[];
  featured?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  categoryId?: string | null;
}

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Initial;
}) {
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
    body.price = Number(body.price);
    body.salePrice = body.salePrice ? Number(body.salePrice) : null;
    body.featured = body.featured === "on";
    body.isNew = body.isNew === "on";
    body.inStock = body.inStock === "on";
    try {
      body.images = JSON.parse(body.images || "[]");
    } catch { body.images = []; }
    body.sizes = body.sizes
      ? String(body.sizes).split(",").map((s: string) => s.trim()).filter(Boolean)
      : null;
    if (body.categoryId === "") body.categoryId = null;

    const url = initial?.id ? `/api/admin/products/${initial.id}` : "/api/admin/products";
    const method = initial?.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Lỗi lưu");
      setSaving(false);
      return;
    }
    setDirty(false);
    router.push("/admin/san-pham");
    router.refresh();
  }

  const initialSizes = (() => {
    try {
      if (!initial?.sizes) return "";
      const arr = JSON.parse(initial.sizes);
      return Array.isArray(arr) ? arr.join(", ") : "";
    } catch { return ""; }
  })();

  return (
    <form onSubmit={onSubmit} onChange={() => setDirty(true)} className="grid md:grid-cols-[1fr_320px] gap-6">
      <div className="bg-white p-6 rounded-lg border border-gold-100 space-y-4">
        <Field label="Tên sản phẩm *" name="name" defaultValue={initial?.name} required />
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Slug (URL)" name="slug" defaultValue={initial?.slug} placeholder="tu-dong-sinh-neu-de-trong" />
          <Field label="SKU" name="sku" defaultValue={initial?.sku || ""} />
        </div>
        <div>
          <Label>Ảnh sản phẩm</Label>
          <ImageInput name="images" multiple defaultValue={initial?.images || []} />
        </div>
        <Field label="Mô tả ngắn" name="description" defaultValue={initial?.description} textarea rows={3} />
        <div>
          <Label>Nội dung chi tiết</Label>
          <RichEditor name="content" defaultValue={initial?.content} />
        </div>
      </div>

      <aside className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gold-100 space-y-4">
          <Field label="Giá gốc *" name="price" type="number" defaultValue={initial?.price} required />
          <Field label="Giá khuyến mãi" name="salePrice" type="number" defaultValue={initial?.salePrice || ""} />
          <Field label="Chất liệu" name="material" defaultValue={initial?.material || ""} placeholder="Vàng 18K, Kim cương..." />
          <Field label="Trọng lượng" name="weight" defaultValue={initial?.weight || ""} placeholder="3.5 chỉ" />
          <div>
            <Label>Sizes (VD nhẫn: 6, 7, 8)</Label>
            <input name="sizes" defaultValue={initialSizes} placeholder="Bỏ trống nếu không có size" className="w-full border border-gold-200 rounded px-3 py-2" />
            <p className="text-[11px] text-ink-800/60 mt-1">Ngăn cách bằng dấu phẩy. Có size = bắt buộc chọn khi mua.</p>
          </div>
          <div>
            <Label>Danh mục</Label>
            <select name="categoryId" defaultValue={initial?.categoryId || ""} className="w-full border border-gold-200 rounded px-3 py-2">
              <option value="">— Chưa phân loại —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gold-100 space-y-3">
          <Label>Trạng thái</Label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Nổi bật
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isNew" defaultChecked={initial?.isNew} /> Mới ra mắt
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="inStock" defaultChecked={initial?.inStock ?? true} /> Còn hàng
          </label>
        </div>

        {err && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{err}</div>}

        <button disabled={saving} className="w-full bg-gold-600 hover:bg-gold-700 disabled:opacity-60 text-white px-6 py-3 uppercase tracking-widest text-sm">
          {saving ? "Đang lưu..." : "Lưu sản phẩm"}
        </button>
      </aside>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs uppercase tracking-widest text-ink-800/70 mb-1">{children}</div>;
}

function Field({ label, name, textarea, rows, defaultValue, required, type = "text", placeholder }: any) {
  return (
    <div>
      <Label>{label}</Label>
      {textarea ? (
        <textarea name={name} rows={rows} defaultValue={defaultValue} className="w-full border border-gold-200 rounded px-3 py-2" placeholder={placeholder} />
      ) : (
        <input name={name} type={type} required={required} defaultValue={defaultValue as any} placeholder={placeholder} className="w-full border border-gold-200 rounded px-3 py-2" />
      )}
    </div>
  );
}
