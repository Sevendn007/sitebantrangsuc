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
            <a className="p-2 rounded-full border border-gold-700 hover:bg-gold-700/20" href="#" aria-label="Facebook"><Facebook size={16} /></a>
            <a className="p-2 rounded-full border border-gold-700 hover:bg-gold-700/20" href="#" aria-label="Instagram"><Instagram size={16} /></a>
            <a className="p-2 rounded-full border border-gold-700 hover:bg-gold-700/20" href="#" aria-label="Youtube"><Youtube size={16} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-white">Bộ sưu tập</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/san-pham?danh-muc=nhan" className="hover:text-white">Nhẫn</Link></li>
            <li><Link href="/san-pham?danh-muc=day-chuyen" className="hover:text-white">Dây chuyền</Link></li>
            <li><Link href="/san-pham?danh-muc=lac-tay" className="hover:text-white">Lắc tay</Link></li>
            <li><Link href="/san-pham?danh-muc=bong-tai" className="hover:text-white">Bông tai</Link></li>
            <li><Link href="/san-pham?danh-muc=nhan-cuoi" className="hover:text-white">Nhẫn cưới</Link></li>
          </ul>
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
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5"/> 123 Nguyễn Huệ, Q.1, TP.HCM</li>
            <li className="flex items-center gap-2"><Phone size={16} /> 0987 654 321</li>
            <li className="flex items-center gap-2"><Mail size={16} /> hello@vankhanhjewelry.com</li>
          </ul>
          <p className="text-xs text-gold-100/60 mt-4">
            Giờ mở cửa: 9:00 — 21:00 (T2 — CN)
          </p>
        </div>
      </div>

      <div className="border-t border-gold-800/50">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gold-100/60">
          <span>© {new Date().getFullYear()} Lam Thu Jewelry. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <img src="https://cdn.pixabay.com/photo/2021/12/06/13/45/visa-6850402_1280.png" alt="Visa" className="h-4 opacity-80" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Logo_MoMo_Circle.png/240px-Logo_MoMo_Circle.png" alt="MoMo" className="h-5 opacity-90" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Logo-VNPAY-QR-1.png/220px-Logo-VNPAY-QR-1.png" alt="VNPay" className="h-5 opacity-90" />
          </span>
        </div>
      </div>
    </footer>
  );
}
