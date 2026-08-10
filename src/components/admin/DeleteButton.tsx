"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({
  url,
  small,
  label = "Xoá",
}: {
  url: string;
  small?: boolean;
  label?: string;
}) {
  const router = useRouter();
  async function onClick() {
    if (!confirm("Bạn có chắc muốn xoá?")) return;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Không xoá được");
      return;
    }
    router.refresh();
  }
  return (
    <button
      onClick={onClick}
      className={
        (small ? "text-xs " : "text-sm ") +
        "inline-flex items-center gap-1 text-red-600 hover:text-red-800"
      }
    >
      <Trash2 size={small ? 12 : 14} /> {label}
    </button>
  );
}
