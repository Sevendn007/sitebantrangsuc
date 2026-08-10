import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { Gem, FileText, Mail, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, posts, contacts, orders, latestOrders, latestContacts] =
    await Promise.all([
      prisma.product.count(),
      prisma.post.count(),
      prisma.contact.count({ where: { handled: false } }),
      prisma.order.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.contact.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "paid" },
  });

  const stats = [
    { label: "Sản phẩm", value: products, icon: Gem, href: "/admin/san-pham" },
    { label: "Bài viết", value: posts, icon: FileText, href: "/admin/bai-viet" },
    { label: "Đơn hàng", value: orders, icon: ShoppingBag, href: "/admin/don-hang" },
    { label: "Liên hệ mới", value: contacts, icon: Mail, href: "/admin/lien-he" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Tổng quan</h1>
      <p className="text-ink-800/60 mb-8">Chào mừng trở lại, đây là tóm tắt hoạt động của cửa hàng.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white p-5 rounded-lg border border-gold-100 hover:shadow-luxe transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full grid place-items-center bg-gold-50 text-gold-700">
                <s.icon size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-ink-800/60">{s.label}</div>
                <div className="text-2xl font-semibold">{s.value}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg border border-gold-100">
        <div className="text-xs uppercase tracking-widest text-ink-800/60">Doanh thu đã thanh toán</div>
        <div className="mt-1 text-3xl font-serif text-gold-700">{formatVND(revenue._sum.total || 0)}</div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gold-100">
          <div className="flex justify-between mb-4">
            <h2 className="font-serif text-xl">Đơn hàng gần đây</h2>
            <Link href="/admin/don-hang" className="text-sm text-gold-700 hover:underline">Xem tất cả</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="text-ink-800/60">
              <tr className="text-left border-b border-gold-100">
                <th className="py-2">Mã</th>
                <th>Khách</th>
                <th>Tổng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((o) => (
                <tr key={o.id} className="border-b border-gold-50">
                  <td className="py-2 font-mono text-xs">{o.code}</td>
                  <td>{o.customerName}</td>
                  <td>{formatVND(o.total)}</td>
                  <td>
                    <StatusBadge value={o.status} />
                  </td>
                </tr>
              ))}
              {latestOrders.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-ink-800/60">Chưa có đơn hàng.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gold-100">
          <div className="flex justify-between mb-4">
            <h2 className="font-serif text-xl">Liên hệ mới</h2>
            <Link href="/admin/lien-he" className="text-sm text-gold-700 hover:underline">Xem tất cả</Link>
          </div>
          <ul className="space-y-3">
            {latestContacts.map((c) => (
              <li key={c.id} className="border-b border-gold-50 pb-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-ink-800/60">{new Date(c.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="text-xs text-ink-800/60">{c.phone} • {c.email}</div>
                <div className="text-sm mt-1 line-clamp-2">{c.message}</div>
              </li>
            ))}
            {latestContacts.length === 0 && <li className="text-center text-ink-800/60 py-4">Chưa có liên hệ.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    new: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipping: "bg-purple-100 text-purple-800",
    done: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  };
  const label: Record<string, string> = {
    new: "Mới",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    done: "Hoàn tất",
    canceled: "Đã huỷ",
  };
  return <span className={`px-2 py-0.5 rounded text-xs ${map[value] || "bg-gray-100 text-gray-800"}`}>{label[value] || value}</span>;
}
