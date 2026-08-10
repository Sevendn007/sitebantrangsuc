import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { PageHeader } from "@/components/admin/AdminBar";
import OrderStatusForm from "./OrderStatusForm";

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div>
      <PageHeader title={`Đơn hàng ${order.code}`} subtitle={new Date(order.createdAt).toLocaleString("vi-VN")} />

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white p-6 rounded-lg border border-gold-100">
          <h2 className="font-serif text-xl mb-4">Sản phẩm</h2>
          <ul className="divide-y divide-gold-100">
            {order.items.map((it) => (
              <li key={it.id} className="py-3 flex gap-3">
                {it.image && <img src={it.image} alt="" className="w-16 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-ink-800/60">SL: {it.quantity}</div>
                </div>
                <div className="font-semibold">{formatVND(it.price * it.quantity)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-6 text-sm border-t border-gold-100 pt-4 space-y-2">
            <div className="flex justify-between"><dt>Tạm tính</dt><dd>{formatVND(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Vận chuyển</dt><dd>{formatVND(order.shipping)}</dd></div>
            <div className="flex justify-between text-base font-semibold border-t border-gold-100 pt-2"><dt>Tổng</dt><dd className="text-gold-700">{formatVND(order.total)}</dd></div>
          </dl>
        </div>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gold-100">
            <h3 className="font-serif text-lg mb-3">Thông tin khách</h3>
            <div className="text-sm space-y-1">
              <div><strong>Tên:</strong> {order.customerName}</div>
              <div><strong>Điện thoại:</strong> {order.customerPhone}</div>
              {order.customerEmail && <div><strong>Email:</strong> {order.customerEmail}</div>}
              <div><strong>Địa chỉ:</strong> {order.address}</div>
              {order.note && <div><strong>Ghi chú:</strong> {order.note}</div>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gold-100">
            <h3 className="font-serif text-lg mb-3">Thanh toán</h3>
            <div className="text-sm">Phương thức: <strong className="uppercase">{order.paymentMethod}</strong></div>
            <div className="text-sm">Trạng thái: <strong>{order.paymentStatus}</strong></div>
            {order.txnRef && <div className="text-xs text-ink-800/60 mt-1">TxnRef: {order.txnRef}</div>}
          </div>

          <div className="bg-white p-6 rounded-lg border border-gold-100">
            <h3 className="font-serif text-lg mb-3">Cập nhật trạng thái</h3>
            <OrderStatusForm id={order.id} status={order.status} paymentStatus={order.paymentStatus} />
          </div>
        </aside>
      </div>
    </div>
  );
}
