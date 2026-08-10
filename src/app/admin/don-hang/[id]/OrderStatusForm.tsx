"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderStatusForm({
  id,
  status,
  paymentStatus,
}: {
  id: string;
  status: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [s, setS] = useState(status);
  const [ps, setPs] = useState(paymentStatus);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    setSaving(true);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s, paymentStatus: ps }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-3 text-sm">
      <div>
        <label className="text-xs uppercase tracking-widest text-ink-800/70">Trạng thái đơn</label>
        <select value={s} onChange={(e) => setS(e.target.value)} className="mt-1 w-full border border-gold-200 rounded px-3 py-2">
          <option value="new">Mới</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="done">Hoàn tất</option>
          <option value="canceled">Đã huỷ</option>
        </select>
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-ink-800/70">Thanh toán</label>
        <select value={ps} onChange={(e) => setPs(e.target.value)} className="mt-1 w-full border border-gold-200 rounded px-3 py-2">
          <option value="pending">Chờ thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="failed">Lỗi thanh toán</option>
        </select>
      </div>
      <button disabled={saving} onClick={onSave} className="w-full bg-gold-600 hover:bg-gold-700 disabled:opacity-60 text-white py-2 uppercase tracking-widest text-xs">
        {saving ? "Đang lưu..." : "Cập nhật"}
      </button>
    </div>
  );
}
