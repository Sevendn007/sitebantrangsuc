import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { PageHeader } from "@/components/admin/AdminBar";
import Pagination from "@/components/admin/Pagination";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; status?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const status = searchParams.status || "";
  const page = Math.max(1, Number(searchParams.page || 1));

  const where: Prisma.OrderWhereInput = {
    ...(q ? { OR: [{ code: { contains: q } }, { customerName: { contains: q } }, { customerPhone: { contains: q } }] } : {}),
    ...(status ? { status } : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <PageHeader title="Đơn hàng" subtitle={`${total} đơn hàng`} />

      <form className="mb-4 flex gap-2 flex-wrap">
        <input name="q" defaultValue={q} placeholder="Mã đơn / khách / SĐT..." className="border border-gold-200 rounded px-3 py-2 text-sm min-w-64" />
        <select name="status" defaultValue={status} className="border border-gold-200 rounded px-3 py-2 text-sm">
          <option value="">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="done">Hoàn tất</option>
          <option value="canceled">Đã huỷ</option>
        </select>
        <button className="bg-ink-900 text-white px-4 text-xs uppercase tracking-widest">Lọc</button>
        {(q || status) && <Link href="/admin/don-hang" className="text-sm text-ink-800/60 self-center hover:text-gold-700">Xoá lọc</Link>}
      </form>

      <div className="bg-white rounded-lg border border-gold-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gold-50/70 text-ink-800/70">
            <tr className="text-left">
              <th className="p-3">Mã</th>
              <th>Khách</th>
              <th>Tổng</th>
              <th>Phương thức</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-gold-100">
                <td className="p-3 font-mono text-xs">{o.code}</td>
                <td>
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-xs text-ink-800/60">{o.customerPhone}</div>
                </td>
                <td className="font-semibold">{formatVND(o.total)}</td>
                <td className="uppercase text-xs">{o.paymentMethod}</td>
                <td><PayBadge value={o.paymentStatus} /></td>
                <td><StatusBadge value={o.status} /></td>
                <td className="text-xs">{new Date(o.createdAt).toLocaleString("vi-VN")}</td>
                <td className="text-right pr-3">
                  <Link href={`/admin/don-hang/${o.id}`} className="text-sm text-gold-700 hover:underline">Chi tiết</Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-ink-800/60">Chưa có đơn hàng.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} baseUrl="/admin/don-hang" q={q} />
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    new: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
    shipping: "bg-purple-100 text-purple-800", done: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  };
  const label: Record<string, string> = { new: "Mới", confirmed: "Xác nhận", shipping: "Đang giao", done: "Hoàn tất", canceled: "Huỷ" };
  return <span className={`px-2 py-0.5 rounded text-xs ${map[value] || "bg-gray-100"}`}>{label[value] || value}</span>;
}

function PayBadge({ value }: { value: string }) {
  const map: Record<string, string> = { pending: "bg-yellow-100 text-yellow-800", paid: "bg-green-100 text-green-800", failed: "bg-red-100 text-red-800" };
  const label: Record<string, string> = { pending: "Chờ", paid: "Đã trả", failed: "Lỗi" };
  return <span className={`px-2 py-0.5 rounded text-xs ${map[value] || "bg-gray-100"}`}>{label[value] || value}</span>;
}
