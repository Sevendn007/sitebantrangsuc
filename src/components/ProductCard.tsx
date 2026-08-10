import Link from "next/link";
import { formatVND, safeParseImages } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  images: string;
  isNew: boolean;
  material?: string | null;
}

export default function ProductCard({ p }: { p: ProductCardData }) {
  const imgs = safeParseImages(p.images);
  const cover = imgs[0] || "/placeholder.jpg";
  const alt = imgs[1] || cover;
  const hasSale = p.salePrice && p.salePrice < p.price;

  return (
    <Link
      href={`/san-pham/${p.slug}`}
      className="product-card group block bg-white rounded-lg overflow-hidden border border-gold-100/60 hover:border-gold-300 hover:shadow-luxe transition"
    >
      <div className="relative aspect-square overflow-hidden bg-gold-50">
        <img src={cover} alt={p.name} className="w-full h-full object-cover" />
        <img
          src={alt}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        {p.isNew && (
          <span className="absolute top-3 left-3 bg-ink-900 text-gold-100 text-[10px] tracking-widest px-2 py-1">
            NEW
          </span>
        )}
        {hasSale && (
          <span className="absolute top-3 right-3 bg-gold-600 text-white text-[10px] tracking-widest px-2 py-1">
            SALE
          </span>
        )}
      </div>
      <div className="p-4 text-center">
        {p.material && (
          <div className="text-[10px] uppercase tracking-widest text-gold-600 mb-1">
            {p.material}
          </div>
        )}
        <h3 className="font-serif text-lg text-ink-900 line-clamp-2 min-h-[3.25rem]">
          {p.name}
        </h3>
        <div className="mt-2 flex items-center justify-center gap-2">
          {hasSale ? (
            <>
              <span className="text-gold-700 font-semibold">{formatVND(p.salePrice!)}</span>
              <span className="text-ink-100 line-through text-sm">{formatVND(p.price)}</span>
            </>
          ) : (
            <span className="text-ink-900 font-semibold">{formatVND(p.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
