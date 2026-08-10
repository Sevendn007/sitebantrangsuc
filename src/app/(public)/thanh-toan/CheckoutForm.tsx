"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { readCart, cartSubtotal, clearCart, type CartItem } from "@/lib/cart";
import { formatVND } from "@/lib/utils";
import { PROVINCES, calcShipping } from "@/lib/vn-address";

type Method = "cod" | "momo" | "vnpay" | "bank";

export default function CheckoutForm() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<Method>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [provinceCode, setProvinceCode] = useState<string>("");
  const [districtName, setDistrictName] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    setItems(readCart());
    // Warn on leaving with unsaved data — will only fire after user starts typing
  }, []);

  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (submitting) return;
      const hasInput = Boolean(provinceCode || districtName);
      if (hasInput && items.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [items, provinceCode, districtName, submitting]);

  const subtotal = cartSubtotal(items);
  const shipping = subtotal === 0 ? 0 : calcShipping(subtotal, provinceCode || null);
  const total = subtotal + shipping;

  const province = useMemo(
    () => PROVINCES.find((p) => p.code === provinceCode),
    [provinceCode]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Giỏ hàng đang trống.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerName: fd.get("customerName"),
      customerPhone: fd.get("customerPhone"),
      customerEmail: fd.get("customerEmail"),
      address: fd.get("address"),
      province: province?.name || "",
      district: districtName,
      ward: fd.get("ward"),
      note: fd.get("note"),
      paymentMethod: method,
      items: items.map((i) => ({ id: i.id, quantity: i.quantity, size: i.size })),
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đặt hàng thất bại");
      clearCart();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        window.location.href = `/thanh-toan/thanh-cong?code=${data.code}`;
      }
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center bg-white p-10 rounded-md border border-gold-100">
        <p className="text-ink-800/70">Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.</p>
        <Link href="/san-pham" className="mt-6 inline-block bg-gold-600 text-white px-6 py-3 uppercase text-sm tracking-widest">
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-[1fr_360px] gap-10">
      <div className="space-y-8">
        <section className="bg-white border border-gold-100 rounded-md p-6">
          <h2 className="font-serif text-xl mb-4">Thông tin giao hàng</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field name="customerName" label="Họ tên *" required />
            <Field name="customerPhone" label="Số điện thoại *" required inputMode="tel" pattern="[0-9\+\-\s]{9,15}" />
            <Field name="customerEmail" label="Email" type="email" full />

            <div>
              <Label>Tỉnh / Thành *</Label>
              <select
                value={provinceCode}
                onChange={(e) => { setProvinceCode(e.target.value); setDistrictName(""); }}
                required
                className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 bg-white"
              >
                <option value="">— Chọn tỉnh / thành —</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Quận / Huyện *</Label>
              <select
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
                required
                disabled={!province}
                className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 bg-white disabled:bg-gold-50"
              >
                <option value="">— {province ? "Chọn quận / huyện" : "Chọn tỉnh trước"} —</option>
                {province?.districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <Field name="ward" label="Phường / Xã" />
            <Field name="address" label="Số nhà, đường *" required full />
            <Field name="note" label="Ghi chú" full textarea />
          </div>
        </section>

        <section className="bg-white border border-gold-100 rounded-md p-6">
          <h2 className="font-serif text-xl mb-4">Phương thức thanh toán</h2>
          <div className="space-y-3">
            <PayOption value="cod" current={method} onSelect={setMethod}
              title="Thanh toán khi nhận hàng (COD)"
              desc="Kiểm tra hàng — thanh toán bằng tiền mặt hoặc chuyển khoản khi giao." icon="💵" />
            <PayOption value="momo" current={method} onSelect={setMethod}
              title="Ví MoMo"
              desc="Quét QR hoặc mở app MoMo để thanh toán an toàn." icon="🅜" />
            <PayOption value="vnpay" current={method} onSelect={setMethod}
              title="VNPay QR / Thẻ ATM / Visa"
              desc="Chuyển tới cổng VNPay để thanh toán qua ngân hàng nội địa hoặc thẻ quốc tế." icon="🅥" />
            <PayOption value="bank" current={method} onSelect={setMethod}
              title="Chuyển khoản ngân hàng"
              desc="VCB • 0123 456 789 • CTY TNHH VAN KHANH JEWELRY. Ghi rõ mã đơn khi chuyển." icon="🏦" />
          </div>
        </section>
      </div>

      <aside className="bg-white border border-gold-100 rounded-md p-6 h-fit md:sticky md:top-24">
        <h3 className="font-serif text-xl mb-4">Đơn hàng của bạn</h3>
        <ul className="divide-y divide-gold-100 max-h-64 overflow-auto">
          {items.map((it) => (
            <li key={it.id + (it.size || "")} className="py-3 flex gap-3">
              <img src={it.image} alt="" className="w-14 h-14 object-cover rounded" />
              <div className="flex-1 text-sm">
                <div className="font-medium line-clamp-2">{it.name}</div>
                <div className="text-ink-800/60">SL: {it.quantity}{it.size ? ` • Size ${it.size}` : ""}</div>
              </div>
              <div className="text-sm font-semibold">{formatVND(it.price * it.quantity)}</div>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-sm border-t border-gold-100 pt-4">
          <div className="flex justify-between"><dt>Tạm tính</dt><dd>{formatVND(subtotal)}</dd></div>
          <div className="flex justify-between">
            <dt>Vận chuyển</dt>
            <dd>{shipping ? formatVND(shipping) : <span className="text-green-700">Miễn phí</span>}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-gold-100 pt-3">
            <dt>Tổng</dt><dd className="text-gold-700">{formatVND(total)}</dd>
          </div>
        </dl>

        {method === "bank" && total > 0 && (
          <div className="mt-4 border border-gold-200 rounded p-3 text-center">
            <div className="text-xs uppercase tracking-widest text-gold-700 mb-2">QR chuyển khoản VietQR</div>
            <img
              alt="VietQR"
              className="mx-auto max-w-[220px]"
              src={`https://img.vietqr.io/image/VCB-0123456789-compact2.png?amount=${total}&addInfo=Thanh%20toan%20VKJ&accountName=CTY%20TNHH%20VAN%20KHANH%20JEWELRY`}
            />
            <div className="text-[11px] text-ink-800/60 mt-2">Nội dung ghi: <strong>Thanh toan VKJ</strong></div>
          </div>
        )}

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <button disabled={submitting} className="mt-6 w-full bg-ink-900 hover:bg-ink-800 disabled:opacity-60 text-white px-6 py-3 uppercase tracking-widest text-sm">
          {submitting ? "Đang xử lý..." : "Đặt hàng"}
        </button>
        <p className="text-[11px] text-ink-800/60 mt-3 leading-relaxed">
          Bằng việc đặt hàng, bạn đồng ý với <Link href="/chinh-sach/bao-hanh" className="underline">điều khoản</Link> và chính sách bảo mật của Lam Thu Jewelry.
        </p>
      </aside>
    </form>
  );
}

function Field({ name, label, required, type = "text", full, textarea, inputMode, pattern }: any) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label>{label}</Label>
      {textarea ? (
        <textarea name={name} rows={3} className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 focus:outline-none focus:border-gold-500" />
      ) : (
        <input type={type} name={name} required={required} inputMode={inputMode} pattern={pattern} className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 focus:outline-none focus:border-gold-500" />
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs uppercase tracking-widest text-ink-800/70">{children}</div>;
}

function PayOption({ value, current, onSelect, title, desc, icon }: any) {
  const active = value === current;
  return (
    <label className={"flex gap-4 p-4 rounded border cursor-pointer transition " + (active ? "border-gold-500 bg-gold-50/70" : "border-gold-100 hover:border-gold-300")}>
      <input type="radio" name="paymentMethod" value={value} checked={active} onChange={() => onSelect(value)} className="mt-1" />
      <span className="text-2xl">{icon}</span>
      <span className="flex-1">
        <span className="block font-medium text-ink-900">{title}</span>
        <span className="block text-xs text-ink-800/60 mt-0.5">{desc}</span>
      </span>
    </label>
  );
}
