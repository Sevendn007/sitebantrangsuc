"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart, type CartItem } from "@/lib/cart";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";

interface Props {
  item: Omit<CartItem, "quantity" | "size">;
  sizes?: string[];
  inStock: boolean;
}

export default function AddToCartPanel({ item, sizes, inStock }: Props) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string>(sizes?.[0] || "");
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const needsSize = (sizes?.length || 0) > 0;

  function build(): Omit<CartItem, "quantity"> {
    return { ...item, size: needsSize ? size : undefined };
  }

  function onAdd() {
    if (!inStock) return;
    if (needsSize && !size) return alert("Vui lòng chọn size");
    addToCart(build(), qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }
  function onBuy() {
    if (!inStock) return;
    if (needsSize && !size) return alert("Vui lòng chọn size");
    addToCart(build(), qty);
    router.push("/thanh-toan");
  }

  return (
    <div className="mt-8">
      {needsSize && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs uppercase tracking-widest text-ink-800/70">Chọn size *</div>
            <a href="#size-guide" className="text-xs text-gold-700 underline">Hướng dẫn chọn size</a>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes!.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSize(s)}
                className={
                  "min-w-11 h-11 px-3 border rounded text-sm transition " +
                  (size === s
                    ? "border-gold-600 bg-gold-50 text-gold-800 font-semibold"
                    : "border-gold-200 hover:border-gold-400")
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="inline-flex items-center border border-gold-200 rounded">
          <button className="w-10 h-11 grid place-items-center hover:bg-gold-50" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Giảm">
            <Minus size={14} />
          </button>
          <span className="w-10 text-center">{qty}</span>
          <button className="w-10 h-11 grid place-items-center hover:bg-gold-50" onClick={() => setQty(qty + 1)} aria-label="Tăng">
            <Plus size={14} />
          </button>
        </div>
        <button
          onClick={onAdd}
          disabled={!inStock}
          className="flex-1 h-11 bg-ink-900 hover:bg-ink-800 disabled:bg-gray-400 text-white uppercase tracking-widest text-sm flex items-center justify-center gap-2"
        >
          {!inStock ? "Hết hàng" : added ? <><Check size={16} /> Đã thêm</> : <><ShoppingBag size={16} /> Thêm vào giỏ</>}
        </button>
      </div>
      <button
        onClick={onBuy}
        disabled={!inStock}
        className="mt-3 w-full h-11 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-400 text-white uppercase tracking-widest text-sm"
      >
        {inStock ? "Mua ngay" : "Sản phẩm tạm hết"}
      </button>
    </div>
  );
}
