import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-900 text-gold-100">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 grid place-items-center text-white font-serif text-lg">
              V
            </span>
            <span className="font-serif text-2xl">Lam Thu Jewelry</span>
          </div>
          <p className="text-sm text-gold-100/70 leading-relaxed">
            Thương hiệu trang sức cao cấp — nơi tinh xảo Á Đông gặp gỡ vẻ đẹp
            đương đại. Mỗi tác phẩm là một câu chuyện của di sản, thẩm mỹ và
            đẳng cấp.
          </p>
          <div className="mt-5 flex gap-3">
            <a className="p-2 rounded-full border border-gold-700 hover:bg-gold-700/20" href="https://www.facebook.com/lamthujewelry" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
            <a className="p-2 rounded-full border border-gold-700 hover:bg-gold-700/20" href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 006.33 6.33 6.33 6.33 0 006.33-6.33V8.89a8.4 8.4 0 004.53 1.32v-3.45a5.28 5.28 0 01-2.6-.07z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-white">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/gioi-thieu" className="hover:text-white">Về chúng tôi</Link></li>
            <li><Link href="/bai-viet" className="hover:text-white">Cẩm nang trang sức</Link></li>
            <li><Link href="/chinh-sach/bao-hanh" className="hover:text-white">Chính sách bảo hành</Link></li>
            <li><Link href="/chinh-sach/doi-tra" className="hover:text-white">Chính sách đổi trả</Link></li>
            <li><Link href="/chinh-sach/giao-hang" className="hover:text-white">Chính sách giao hàng</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-white">Liên hệ</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0"/> <span>21-23 Nguyễn Trãi, Thành phố Hồng Ngự, Tỉnh Đồng Tháp</span></li>
            <li className="flex items-center gap-2"><Phone size={16} /> +84 84 796 9666</li>
            <li className="flex items-center gap-2"><Mail size={16} /> minhthuliticare@gmail.com</li>
          </ul>
          <p className="text-xs text-gold-100/60 mt-4">
            Giờ mở cửa: 9:00 — 21:00 (T2 — CN)
          </p>
        </div>
      </div>

      <div className="border-t border-gold-800/50">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gold-100/60">
          <span>© {new Date().getFullYear()} Lam Thu Jewelry. All rights reserved.</span>
          <span className="flex items-center gap-4 bg-white/10 px-3 py-1.5 rounded">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-3 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="h-4 object-contain" />
            <img src="https://vnpay.vn/s1/vnpay/logo-vnpay-white.png" alt="VNPay" className="h-4 object-contain bg-ink-900 p-0.5 rounded" />
          </span>
        </div>
      </div>
    </footer>
  );
}
