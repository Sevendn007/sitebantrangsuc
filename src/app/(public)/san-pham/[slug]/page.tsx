import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND, safeParseImages } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "./ProductGallery";
import AddToCartPanel from "./AddToCartPanel";
import { ShieldCheck, Truck, Gem, RefreshCcw } from "lucide-react";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!product) notFound();

  const images = safeParseImages(product.images);
  const related = await prisma.product.findMany({
    where: {
      NOT: { id: product.id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const priceNow = product.salePrice ?? product.price;

  const sizes: string[] = (() => {
    try {
      if (!product.sizes) return [];
      const arr = JSON.parse(product.sizes);
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  })();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <nav className="text-xs uppercase tracking-widest text-ink-800/60 mb-6">
        <Link href="/" className="hover:text-gold-700">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/san-pham" className="hover:text-gold-700">Sản phẩm</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/san-pham?danh-muc=${product.category.slug}`} className="hover:text-gold-700">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        <ProductGallery images={images.length > 0 ? images : ["/placeholder.jpg"]} alt={product.name} />

        <div>
          {product.category && (
            <div className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-2">
              {product.category.name}
            </div>
          )}
          <h1 className="font-serif text-3xl md:text-4xl text-ink-900">{product.name}</h1>
          {product.sku && (
            <div className="mt-2 text-xs text-ink-800/60">SKU: {product.sku}</div>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-gold-700">{formatVND(priceNow)}</span>
            {product.salePrice && (
              <span className="text-ink-800/50 line-through">{formatVND(product.price)}</span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {product.material && (
              <div className="border border-gold-100 rounded p-3">
                <div className="text-[10px] uppercase tracking-widest text-gold-600">Chất liệu</div>
                <div className="text-ink-900">{product.material}</div>
              </div>
            )}
            {product.weight && (
              <div className="border border-gold-100 rounded p-3">
                <div className="text-[10px] uppercase tracking-widest text-gold-600">Trọng lượng</div>
                <div className="text-ink-900">{product.weight}</div>
              </div>
            )}
          </div>

          <p className="mt-6 text-ink-800/80 leading-relaxed">{product.description}</p>

          <AddToCartPanel
            item={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: priceNow,
              image: images[0] || "",
            }}
            sizes={sizes}
            inStock={product.inStock}
          />

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: ShieldCheck, t: "Bảo hành trọn đời" },
              { icon: Truck, t: "Giao hàng bảo hiểm" },
              { icon: Gem, t: "Kiểm định GIA/GRA" },
              { icon: RefreshCcw, t: "Đổi trả 7 ngày" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-ink-800/70">
                <b.icon size={16} className="text-gold-600" /> {b.t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl border-b border-gold-100 pb-3 mb-6">Mô tả chi tiết</h2>
        <div
          className="prose-luxe"
          dangerouslySetInnerHTML={{ __html: product.content || product.description }}
        />
      </section>

      {sizes.length > 0 && (
        <section id="size-guide" className="mt-16 max-w-3xl bg-gold-50/60 border border-gold-100 rounded p-6">
          <h2 className="font-serif text-2xl mb-3">Hướng dẫn chọn size nhẫn</h2>
          <p className="text-sm text-ink-800/80 leading-relaxed">
            Đo chu vi ngón tay (mm) và đối chiếu bảng size dưới đây. Nếu ở giữa 2 size, hãy chọn size lớn hơn.
          </p>
          <table className="w-full mt-4 text-sm">
            <thead className="bg-white">
              <tr className="text-left"><th className="p-2">Size</th><th>Chu vi (mm)</th><th>Đường kính (mm)</th></tr>
            </thead>
            <tbody>
              {[
                ["6", "46.8", "14.9"], ["7", "47.8", "15.2"], ["8", "48.7", "15.5"],
                ["9", "49.7", "15.8"], ["10", "50.6", "16.1"], ["11", "51.5", "16.4"],
                ["12", "52.5", "16.7"], ["13", "53.4", "17.0"],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-gold-100"><td className="p-2">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-ink-800/60 mt-3">Miễn phí đổi size trong 30 ngày.</p>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-center mb-8">Có thể bạn thích</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} p={p as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
