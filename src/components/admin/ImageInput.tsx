"use client";

import { useRef, useState } from "react";
import { Upload, X, Plus } from "lucide-react";

interface Props {
  name: string;
  defaultValue?: string[] | string;
  multiple?: boolean;
}

export default function ImageInput({ name, defaultValue, multiple }: Props) {
  const initial =
    typeof defaultValue === "string"
      ? defaultValue
        ? [defaultValue]
        : []
      : defaultValue || [];
  const [urls, setUrls] = useState<string[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(f: File) {
    setUploading(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload lỗi");
      setUrls((u) => (multiple ? [...u, data.url] : [data.url]));
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="hidden"
        name={name}
        value={multiple ? JSON.stringify(urls) : urls[0] || ""}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {urls.map((u, i) => (
          <div key={u + i} className="relative aspect-square border border-gold-200 rounded overflow-hidden bg-gold-50">
            <img src={u} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setUrls((arr) => arr.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 grid place-items-center hover:bg-red-100"
              aria-label="Xoá"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {(multiple || urls.length === 0) && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="aspect-square border-2 border-dashed border-gold-200 rounded grid place-items-center text-ink-800/50 hover:border-gold-500 hover:text-gold-700"
          >
            {uploading ? "..." : (
              <div className="text-center text-xs">
                {multiple ? <Plus /> : <Upload className="mx-auto" size={20} />}
                <div className="mt-1">{multiple ? "Thêm ảnh" : "Chọn ảnh"}</div>
              </div>
            )}
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      {err && <div className="mt-2 text-sm text-red-600">{err}</div>}
      <p className="mt-2 text-xs text-ink-800/60">
        Hoặc dán URL: <input
          placeholder="https://..."
          className="border border-gold-200 rounded px-2 py-1 text-xs w-64 ml-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const v = (e.target as HTMLInputElement).value.trim();
              if (v) {
                setUrls((arr) => (multiple ? [...arr, v] : [v]));
                (e.target as HTMLInputElement).value = "";
              }
            }
          }}
        />
      </p>
    </div>
  );
}
