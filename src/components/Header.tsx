"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, Search, X, Phone, Package } from "lucide-react";
import { readCart } from "@/lib/cart";

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/bai-viet", label: "Cẩm nang" },
  { href: "/gioi-thieu", label: "Về chúng tôi" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const refresh = () => setCount(readCart().reduce((s, i) => s + i.quantity, 0));
    refresh();
    window.addEventListener("cart:change", refresh);
    window.addEventListener("storage", refresh);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("cart:change", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden md:block bg-ink-900 text-gold-100 text-xs">
        <div className="mx-auto max-w-7xl px-6 py-2 flex justify-between">
          <span>Miễn phí vận chuyển toàn quốc cho đơn từ 3.000.000₫</span>
          <span className="flex items-center gap-4">
            <Link href="/don-hang" className="hover:text-white flex items-center gap-1"><Package size={12} /> Tra cứu đơn</Link>
            <a href="tel:+84847969666" className="flex items-center gap-1 hover:text-white">
              <Phone size={12} /> +84 84 796 9666
            </a>
            <Link href="/lien-he" className="hover:text-white">Đặt lịch tư vấn</Link>
          </span>
        </div>
      </div>

      <div className={"backdrop-blur transition-all border-b " + (scrolled ? "bg-white/95 border-gold-100 shadow-sm" : "bg-white/80 border-transparent")}>
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <button className="md:hidden text-ink-900" aria-label="menu" onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>

          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 grid place-items-center text-white font-serif text-lg">V</span>
            <span className="font-serif text-2xl tracking-wide text-ink-900">
              Lam Thu <span className="text-gold-600">Jewelry</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm uppercase tracking-widest text-ink-800 hover:text-gold-600 transition-colors">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={() => setSearchOpen(true)} aria-label="Tìm kiếm" className="text-ink-800 hover:text-gold-600">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-6 shadow-luxe" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif text-xl">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="close"><X size={22} /></button>
            </div>
            <nav className="flex flex-col gap-4">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="text-base uppercase tracking-widest text-ink-800" onClick={() => setOpen(false)}>
                  {n.label}
                </Link>
              ))}
              <div className="border-t border-gold-100 pt-4 mt-2 space-y-3">
                <Link href="/don-hang" className="block text-base uppercase tracking-widest text-ink-800" onClick={() => setOpen(false)}>Tra cứu đơn hàng</Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <form
            action="/san-pham"
            method="get"
            onClick={(e) => e.stopPropagation()}
            className="mx-auto max-w-2xl mt-32 bg-white rounded-lg shadow-luxe p-6"
            onSubmit={() => setSearchOpen(false)}
          >
            <div className="flex items-center gap-3">
              <Search size={20} className="text-gold-600" />
              <input
                ref={searchRef}
                name="q"
                placeholder="Tìm sản phẩm..."
                className="flex-1 border-b border-gold-200 pb-2 focus:outline-none focus:border-gold-500 text-lg"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="close" type="button"><X size={20} /></button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="text-ink-800/60 uppercase tracking-widest">Gợi ý:</span>
              {["nhẫn", "dây chuyền", "lắc tay", "bông tai"].map((s) => (
                <Link key={s} href={`/san-pham?q=${encodeURIComponent(s)}`} onClick={() => setSearchOpen(false)} className="text-gold-700 hover:underline">
                  {s}
                </Link>
              ))}
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
