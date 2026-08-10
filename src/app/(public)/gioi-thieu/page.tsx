import { Award, Gem, Sparkles, Heart } from "lucide-react";

export const metadata = { title: "Về chúng tôi" };

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[50vh] min-h-[380px] bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=2000&q=80)" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-7xl px-6 h-full flex items-center">
          <div className="text-white max-w-xl fade-up">
            <div className="text-xs uppercase tracking-[0.4em] text-gold-200 mb-3">
              Về chúng tôi
            </div>
            <h1 className="font-serif text-5xl">Di sản trang sức Á Đông</h1>
            <p className="mt-4 text-white/80">
              Nơi mỗi tác phẩm là sự hòa quyện giữa tinh xảo thủ công và cảm
              hứng thiết kế đương đại.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-3">
          <span className="gold-line" /> Câu chuyện <span className="gold-line" />
        </div>
        <h2 className="font-serif text-4xl">Từ xưởng kim hoàn truyền thống đến thương hiệu đương đại</h2>
        <p className="mt-6 text-ink-800/80 leading-relaxed">
          Được thành lập từ tình yêu với nghề kim hoàn truyền thống Việt Nam,
          Lam Thu Jewelry là nơi hội tụ những nghệ nhân bậc thầy với hơn 20
          năm kinh nghiệm. Chúng tôi tin rằng, mỗi món trang sức đều mang một
          câu chuyện, một khoảnh khắc, một dấu ấn được lưu giữ trọn vẹn qua
          thời gian.
        </p>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-8">
          {[
            { icon: Award, t: "Chất lượng", d: "Vàng, kim cương, đá quý được kiểm định GIA/GRA." },
            { icon: Gem, t: "Tinh xảo", d: "Chế tác thủ công bởi nghệ nhân giàu kinh nghiệm." },
            { icon: Sparkles, t: "Sáng tạo", d: "Thiết kế đương đại giao thoa văn hoá Á Đông." },
            { icon: Heart, t: "Tận tâm", d: "Đồng hành trọn đời với mỗi khách hàng." },
          ].map((v, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 mx-auto grid place-items-center rounded-full bg-gold-50 text-gold-700">
                <v.icon size={24} />
              </div>
              <h3 className="mt-4 font-serif text-xl">{v.t}</h3>
              <p className="mt-2 text-sm text-ink-800/70">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1602752275197-9d7a4bd7bd2d?w=1200&q=80"
          alt="Cửa hàng"
          className="rounded-md w-full aspect-[4/3] object-cover shadow-luxe"
        />
        <div>
          <h2 className="font-serif text-3xl">Ghé thăm showroom</h2>
          <p className="mt-4 text-ink-800/80 leading-relaxed">
            Trải nghiệm không gian trang sức đẳng cấp — nơi bạn có thể chiêm
            ngưỡng, cảm nhận và được tư vấn tận tâm bởi các chuyên gia của
            Lam Thu Jewelry.
          </p>
          <ul className="mt-5 space-y-2 text-ink-800/80">
            <li><strong>Showroom Sài Gòn:</strong> 123 Nguyễn Huệ, Q.1</li>
            <li><strong>Showroom Hà Nội:</strong> 45 Tràng Tiền, Hoàn Kiếm</li>
            <li><strong>Giờ mở cửa:</strong> 9:00 – 21:00 (T2 – CN)</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
