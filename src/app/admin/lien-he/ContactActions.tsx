"use client";
import { useRouter } from "next/navigation";
import { Check, RotateCcw } from "lucide-react";

export default function ContactActions({ id, handled }: { id: string; handled: boolean }) {
  const router = useRouter();
  async function toggle() {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled: !handled }),
    });
    router.refresh();
  }
  return (
    <button onClick={toggle} className={"text-xs inline-flex items-center gap-1 " + (handled ? "text-ink-800/60" : "text-green-700")}>
      {handled ? <><RotateCcw size={12} /> Đánh dấu chưa xử lý</> : <><Check size={12} /> Đánh dấu đã xử lý</>}
    </button>
  );
}
