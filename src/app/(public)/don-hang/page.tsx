import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tra cứu đơn hàng" };

function last4(s: string) {
  return s.replace(/\D/g, "").slice(-4);
}

export default async function OrderTrackingPage({
  searchParams,
}: {
  searchParams: { code?: string; phone?: string };
}) {
  const code = (searchParams.code || "").trim();
  const phone = (searchParams.phone || "").trim();

  let order = code ? await prisma.order.findUnique({
    where: { code },
    include: { items: true },
  }) : null;

  // If phone provided, require last 4 to match (privacy protection).
  // If phone not provided, allow lookup by code only — code itself is the confirmation link.
  if (order && phone && last4(order.customerPhone) !== last4(phone)) {
    order = null;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-3">
          <span className="gold-line" /> Tra cứu <span className="gold-line" />
        </div>
        <h1 className="font-serif text-4xl">Tra cứu đơn hàng</h1>
        <p className="mt-3 text-ink-800/70">Nhập mã đơn để xem trạng thái xử lý.</p>
      </div>

      <form className="mt-8 grid md:grid-cols-[1fr_1fr_auto] gap-3 bg-white p-4 rounded-md border border-gold-100">
        <input name="code" defaultValue={code} placeholder="Mã đơn (VD: VK...)" required className="border border-gold-200 rounded px-3 py-2.5" />
        <input name="phone" defaultValue={phone} placeholder="4 số cuối SĐT (tuỳ chọn)" className="border border-gold-200 rounded px-3 py-2.5" />
        <button className="inline-flex items-center gap-2 bg-ink-900 hover:bg-ink-800 text-white px-6 uppercase text-sm tracking-widest">
          <Search size={14} /> Tra cứu
        </button>
      </form>

      {code && !order && (
        <div className="mt-6 bg-white border border-red-100 rounded-md p-6 text-center text-red-700">
          Không tìm thấy đơn hàng khớp với mã và số điện thoại đã nhập.
        </div>
      )}

      {order && (
        <div className="mt-8 bg-white border border-gold-100 rounded-md">
          <div className="p-6 border-b border-gold-100 flex flex-wrap gap-4 justify-between items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-ink-800/60">Mã đơn</div>
              <div className="font-mono text-lg">{order.code}</div>
              <div className="text-xs text-ink-800/60 mt-1">Đặt ngày {new Date(order.createdAt).toLocaleString("vi-VN")}</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge value={order.status} kind="status" />
              <Badge value={order.paymentStatus} kind="pay" />
            </div>
          </div>

          <div className="p-6">
            <Timeline status={order.status} />
          </div>

          <div className="p-6 border-t border-gold-100 grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-serif text-lg mb-2">Giao hàng</h3>
              <div><strong>{order.customerName}</strong></div>
              <div>{order.customerPhone}</div>
              <div className="text-ink-800/80">
                {[order.address, order.ward, order.district, order.province].filter(Boolean).join(", ")}
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg mb-2">Thanh toán</h3>
              <div>Phương thức: <strong className="uppercase">{order.paymentMethod}</strong></div>
              <div>Trạng thái: {order.paymentStatus}</div>
            </div>
          </div>

          <div className="p-6 border-t border-gold-100">
            <h3 className="font-serif text-lg mb-3">Sản phẩm</h3>
            <ul className="divide-y divide-gold-100">
              {order.items.map((it) => (
                <li key={it.id} className="py-3 flex gap-3 items-center">
                  {it.image && <img src={it.image} alt="" className="w-16 h-16 object-cover rounded" />}
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-ink-800/60">SL: {it.quantity}{it.size ? ` • Size ${it.size}` : ""}</div>
                  </div>
                  <div className="font-semibold">{formatVND(it.price * it.quantity)}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 text-sm space-y-1 border-t border-gold-100 pt-3">
              <div className="flex justify-between"><dt>Tạm tính</dt><dd>{formatVND(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Vận chuyển</dt><dd>{formatVND(order.shipping)}</dd></div>
              <div className="flex justify-between font-semibold text-base"><dt>Tổng</dt><dd className="text-gold-700">{formatVND(order.total)}</dd></div>
            </dl>
          </div>

          <div className="p-6 border-t border-gold-100 text-sm">
            <Link href="/lien-he" className="text-gold-700 hover:underline">Cần hỗ trợ? Liên hệ chúng tôi</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Timeline({ status }: { status: string }) {
  const steps = [
    { key: "new", label: "Đã nhận đơn" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "shipping", label: "Đang giao" },
    { key: "done", label: "Hoàn tất" },
  ];
  const canceled = status === "canceled";
  const currentIdx = steps.findIndex((s) => s.key === status);
  return (
    <ol className="flex justify-between items-center relative">
      <div className="absolute left-0 right-0 top-3 h-px bg-gold-100" />
      {steps.map((s, i) => {
        const active = !canceled && i <= currentIdx;
        return (
          <li key={s.key} className="relative flex flex-col items-center flex-1">
            <div className={"w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold " + (active ? "bg-gold-600 text-white" : "bg-white border border-gold-200 text-ink-800/40")}>
              {i + 1}
            </div>
            <div className={"mt-2 text-xs text-center " + (active ? "text-ink-900 font-medium" : "text-ink-800/50")}>{s.label}</div>
          </li>
        );
      })}
      {canceled && (
        <div className="absolute inset-0 bg-white/70 grid place-items-center text-red-700 font-medium">
          Đơn hàng đã huỷ
        </div>
      )}
    </ol>
  );
}

function Badge({ value, kind }: { value: string; kind: "status" | "pay" }) {
  const map: Record<string, string> = {
    new: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipping: "bg-purple-100 text-purple-800",
    done: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  const labels: Record<string, string> = {
    new: "Mới", confirmed: "Đã xác nhận", shipping: "Đang giao", done: "Hoàn tất", canceled: "Đã huỷ",
    pending: "Chờ thanh toán", paid: "Đã thanh toán", failed: "Lỗi thanh toán",
  };
  return (
    <span className={`px-3 py-1 rounded text-xs ${map[value] || "bg-gray-100"}`}>
      {kind === "pay" ? "Thanh toán: " : ""}{labels[value] || value}
    </span>
  );
}
