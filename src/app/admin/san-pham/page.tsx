import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND, safeParseImages } from "@/lib/utils";
import { PageHeader } from "@/components/admin/AdminBar";
import DeleteButton from "@/components/admin/DeleteButton";
import Pagination from "@/components/admin/Pagination";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;

export default async function AdminProductsList({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const page = Math.max(1, Number(searchParams.page || 1));

  const where: Prisma.ProductWhereInput = q ? { name: { contains: q } } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Sản phẩm"
        subtitle={`${total} sản phẩm`}
        newHref="/admin/san-pham/moi"
        newLabel="Thêm sản phẩm"
      />

      <form className="mb-4 flex gap-2 max-w-md">
        <input name="q" defaultValue={q} placeholder="Tìm theo tên sản phẩm..." className="flex-1 border border-gold-200 rounded px-3 py-2 text-sm" />
        <button className="bg-ink-900 text-white px-4 text-xs uppercase tracking-widest">Tìm</button>
        {q && <Link href="/admin/san-pham" className="text-sm text-ink-800/60 self-center hover:text-gold-700">Xoá lọc</Link>}
      </form>

      <div className="bg-white rounded-lg border border-gold-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gold-50/70 text-ink-800/70">
            <tr className="text-left">
              <th className="p-3">Ảnh</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const img = safeParseImages(p.images)[0];
              return (
                <tr key={p.id} className="border-t border-gold-100">
                  <td className="p-3">
                    {img && <img src={img} alt="" className="w-12 h-12 object-cover rounded" />}
                  </td>
                  <td>
                    <Link href={`/admin/san-pham/${p.id}`} className="font-medium hover:text-gold-700">
                      {p.name}
                    </Link>
                    <div className="text-xs text-ink-800/60">/{p.slug}</div>
                  </td>
                  <td>{p.category?.name || "—"}</td>
                  <td>
                    {p.salePrice ? (
                      <>
                        <div className="text-gold-700 font-semibold">{formatVND(p.salePrice)}</div>
                        <div className="line-through text-xs text-ink-800/50">{formatVND(p.price)}</div>
                      </>
                    ) : (
                      formatVND(p.price)
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {p.featured && <span className="text-[10px] bg-gold-100 text-gold-800 px-1.5 py-0.5 rounded">NỔI BẬT</span>}
                      {p.isNew && <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">MỚI</span>}
                      {!p.inStock && <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded">HẾT</span>}
                    </div>
                  </td>
                  <td className="text-right pr-3">
                    <div className="inline-flex gap-3">
                      <Link href={`/admin/san-pham/${p.id}`} className="text-sm text-gold-700 hover:underline">Sửa</Link>
                      <DeleteButton url={`/api/admin/products/${p.id}`} small />
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-ink-800/60">Chưa có sản phẩm.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} baseUrl="/admin/san-pham" q={q} />
    </div>
  );
}
