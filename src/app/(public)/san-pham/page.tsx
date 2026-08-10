import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { Prisma } from "@prisma/client";

export const revalidate = 60;

const PAGE_SIZE = 12;

interface SearchParams {
  ["danh-muc"]?: string;
  q?: string;
  sort?: string;
  min?: string;
  max?: string;
  mat?: string;
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const categorySlug = searchParams["danh-muc"];
  const q = searchParams.q?.trim();
  const mat = searchParams.mat?.trim();
  const sort = searchParams.sort || "new";
  const minPrice = searchParams.min ? Number(searchParams.min) : undefined;
  const maxPrice = searchParams.max ? Number(searchParams.max) : undefined;
  const page = Math.max(1, Number(searchParams.page || 1));

  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const where: Prisma.ProductWhereInput = {
    ...(category ? { categoryId: category.id } : {}),
    ...(q ? { name: { contains: q } } : {}),
    ...(mat ? { material: { contains: mat } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const priceBands = [
    { label: "Dưới 5 triệu", min: 0, max: 5_000_000 },
    { label: "5 – 15 triệu", min: 5_000_000, max: 15_000_000 },
    { label: "15 – 30 triệu", min: 15_000_000, max: 30_000_000 },
    { label: "Trên 30 triệu", min: 30_000_000, max: 999_999_999 },
  ];

  const materials = ["Bạc S925", "Vàng 18K", "Vàng trắng", "Kim cương"];

  function buildLink(overrides: Record<string, string | undefined>) {
    const merged: Record<string, string | undefined> = {
      "danh-muc": categorySlug,
      q,
      sort,
      min: minPrice?.toString(),
      max: maxPrice?.toString(),
      mat,
      ...overrides,
    };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const s = params.toString();
    return `/san-pham${s ? `?${s}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <nav className="text-xs uppercase tracking-widest text-ink-800/60 mb-4">
        <Link href="/" className="hover:text-gold-700">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span>Sản phẩm{category ? ` / ${category.name}` : ""}</span>
      </nav>

      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-3">
          <span className="gold-line" /> Bộ sưu tập <span className="gold-line" />
        </div>
        <h1 className="font-serif text-4xl text-ink-900">
          {category ? category.name : q ? `Kết quả cho "${q}"` : "Tất cả sản phẩm"}
        </h1>
      </div>

      {/* Search bar */}
      <form action="/san-pham" className="mt-8 mx-auto max-w-xl flex gap-2">
        {categorySlug && <input type="hidden" name="danh-muc" value={categorySlug} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm nhẫn, dây chuyền, kim cương..."
          className="flex-1 border border-gold-200 rounded px-4 py-2.5 focus:outline-none focus:border-gold-500 bg-white"
        />
        <button className="bg-ink-900 hover:bg-ink-800 text-white px-6 uppercase text-xs tracking-widest">Tìm</button>
      </form>

      <div className="mt-10 grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-6">
          <div>
            <h3 className="font-serif text-lg mb-3 text-ink-900">Danh mục</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href={buildLink({ "danh-muc": undefined, page: undefined })}
                      className={"block px-3 py-1.5 rounded " + (!categorySlug ? "bg-gold-50 text-gold-800 font-medium" : "hover:bg-gold-50")}>
                  Tất cả
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={buildLink({ "danh-muc": c.slug, page: undefined })}
                        className={"block px-3 py-1.5 rounded " + (categorySlug === c.slug ? "bg-gold-50 text-gold-800 font-medium" : "hover:bg-gold-50")}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-3 text-ink-900">Khoảng giá</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href={buildLink({ min: undefined, max: undefined, page: undefined })}
                      className={"block px-3 py-1.5 rounded " + (!minPrice && !maxPrice ? "bg-gold-50 text-gold-800 font-medium" : "hover:bg-gold-50")}>
                  Tất cả
                </Link>
              </li>
              {priceBands.map((b) => {
                const active = minPrice === b.min && maxPrice === b.max;
                return (
                  <li key={b.label}>
                    <Link href={buildLink({ min: b.min.toString(), max: b.max.toString(), page: undefined })}
                          className={"block px-3 py-1.5 rounded " + (active ? "bg-gold-50 text-gold-800 font-medium" : "hover:bg-gold-50")}>
                      {b.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-3 text-ink-900">Chất liệu</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href={buildLink({ mat: undefined, page: undefined })}
                      className={"block px-3 py-1.5 rounded " + (!mat ? "bg-gold-50 text-gold-800 font-medium" : "hover:bg-gold-50")}>
                  Tất cả
                </Link>
              </li>
              {materials.map((m) => (
                <li key={m}>
                  <Link href={buildLink({ mat: m, page: undefined })}
                        className={"block px-3 py-1.5 rounded " + (mat === m ? "bg-gold-50 text-gold-800 font-medium" : "hover:bg-gold-50")}>
                    {m}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between border-b border-gold-100 pb-4 mb-6">
            <div className="text-sm text-ink-800/70">
              Hiển thị <strong>{products.length}</strong> / <strong>{total}</strong> sản phẩm
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-800/60">Sắp xếp:</span>
              <div className="flex gap-1">
                {[
                  { v: "new", l: "Mới" },
                  { v: "price-asc", l: "Giá ↑" },
                  { v: "price-desc", l: "Giá ↓" },
                ].map((o) => (
                  <Link key={o.v} href={buildLink({ sort: o.v })}
                        className={"px-3 py-1 rounded border text-xs " + (sort === o.v ? "border-gold-500 bg-gold-50 text-gold-800" : "border-gold-200 hover:border-gold-400")}>
                    {o.l}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 text-ink-800/60">
              Không có sản phẩm nào phù hợp.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} p={p as any} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    return (
                      <Link key={n} href={buildLink({ page: n === 1 ? undefined : n.toString() })}
                            className={"w-10 h-10 grid place-items-center rounded border text-sm " + (n === page ? "border-gold-500 bg-gold-50 text-gold-800 font-semibold" : "border-gold-200 hover:border-gold-400")}>
                        {n}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
