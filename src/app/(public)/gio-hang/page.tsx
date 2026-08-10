"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readCart, updateQuantity, removeFromCart, cartSubtotal, type CartItem } from "@/lib/cart";
import { formatVND } from "@/lib/utils";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(readCart());
    const refresh = () => setItems(readCart());
    window.addEventListener("cart:change", refresh);
    return () => window.removeEventListener("cart:change", refresh);
  }, []);

  const subtotal = cartSubtotal(items);
  const shipping = subtotal >= 3_000_000 || subtotal === 0 ? 0 : 40_000;
  const total = subtotal + shipping;

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-serif text-4xl text-center mb-10">Giỏ hàng</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-md border border-gold-100">
          <ShoppingBag size={48} className="mx-auto text-gold-400" />
          <div className="mt-4 text-ink-800/70">Giỏ hàng của bạn đang trống.</div>
          <Link href="/san-pham" className="mt-6 inline-flex items-center gap-2 bg-gold-600 hover:bg-gold-700 text-white px-8 py-3 uppercase tracking-widest text-sm">
            Tiếp tục mua sắm <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_360px] gap-10">
          <div className="bg-white border border-gold-100 rounded-md divide-y divide-gold-100">
            {items.map((it) => (
              <div key={it.id + (it.size || "")} className="p-4 flex gap-4">
                <img src={it.image} alt={it.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <Link href={`/san-pham/${it.slug}`} className="font-serif text-lg text-ink-900 hover:text-gold-700">
                    {it.name}
                  </Link>
                  {it.size && <div className="text-xs text-ink-800/60">Size: {it.size}</div>}
                  <div className="mt-1 text-gold-700 font-semibold">{formatVND(it.price)}</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center border border-gold-200 rounded">
                      <button className="w-8 h-8 grid place-items-center hover:bg-gold-50" onClick={() => updateQuantity(it.id, it.size, it.quantity - 1)}><Minus size={12} /></button>
                      <span className="w-8 text-center text-sm">{it.quantity}</span>
                      <button className="w-8 h-8 grid place-items-center hover:bg-gold-50" onClick={() => updateQuantity(it.id, it.size, it.quantity + 1)}><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(it.id, it.size)} className="text-sm text-ink-800/60 hover:text-red-600 flex items-center gap-1">
                      <X size={14} /> Xoá
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold text-ink-900">
                  {formatVND(it.price * it.quantity)}
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-white border border-gold-100 rounded-md p-6 h-fit md:sticky md:top-24">
            <h3 className="font-serif text-xl mb-4">Tóm tắt đơn hàng</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-800/70">Tạm tính</dt><dd>{formatVND(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-800/70">Vận chuyển (dự kiến)</dt><dd>{shipping ? formatVND(shipping) : "Miễn phí"}</dd></div>
              <div className="flex justify-between border-t border-gold-100 pt-3 mt-3 text-base font-semibold"><dt>Tổng</dt><dd className="text-gold-700">{formatVND(total)}</dd></div>
            </dl>
            <Link href="/thanh-toan" className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-800 text-white px-6 py-3 uppercase tracking-widest text-sm">
              Thanh toán <ArrowRight size={16} />
            </Link>
            <Link href="/san-pham" className="block text-center mt-3 text-sm text-ink-800/70 hover:text-gold-700">
              Tiếp tục mua sắm
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
