import ContactForm from "./ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = { title: "Liên hệ" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-3">
          <span className="gold-line" /> Liên hệ <span className="gold-line" />
        </div>
        <h1 className="font-serif text-4xl">Kết nối với Lam Thu Jewelry</h1>
        <p className="mt-3 text-ink-800/70">
          Chúng tôi luôn sẵn sàng tư vấn — từ chọn nhẫn cưới đến thiết kế riêng.
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-12">
        <div>
          <ContactForm />
        </div>
        <div className="space-y-6">
          {[
            { icon: MapPin, t: "Địa chỉ", d: "21-23 Nguyễn Trãi, TP. Hồng Ngự, Đồng Tháp" },
            { icon: Phone, t: "Hotline", d: "+84 84 796 9666" },
            { icon: Mail, t: "Email", d: "minhthuliticare@gmail.com" },
            { icon: Clock, t: "Giờ mở cửa", d: "9:00 – 21:00 (T2 – CN)" },
          ].map((c, i) => (
            <div key={i} className="flex gap-4 bg-white p-5 rounded-md border border-gold-100">
              <div className="w-12 h-12 rounded-full grid place-items-center bg-gold-50 text-gold-700">
                <c.icon size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-gold-600">{c.t}</div>
                <div className="text-ink-900 font-medium mt-1">{c.d}</div>
              </div>
            </div>
          ))}
          <iframe
            title="map"
            className="w-full h-64 rounded-md border border-gold-100"
            src="https://www.google.com/maps?q=Nguyen+Trai,+Hong+Ngu,+Dong+Thap&output=embed"
          />
        </div>
      </div>
    </div>
  );
}
