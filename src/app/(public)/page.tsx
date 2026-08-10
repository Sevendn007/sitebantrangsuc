import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import HeroBanner from "@/components/HeroBanner";
import Reveal from "@/components/Reveal";
import { ArrowRight, Award, ShieldCheck, Sparkles, Gem } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [banners, featured, newArrivals, categories, posts] = await Promise.all([
    prisma.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.product.findMany({ where: { featured: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.product.findMany({ where: { isNew: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.category.findMany({ orderBy: { order: "asc" }, take: 6 }),
    prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const heroBanner = banners[0];

  return (
    <>
      <HeroBanner
        title={heroBanner?.title || "Đẳng cấp Á Đông — Vẻ đẹp đương đại"}
        subtitle={heroBanner?.subtitle || "Bộ sưu tập mới 2026"}
        image={heroBanner?.image || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=2000&q=80"}
        video={heroBanner?.video}
        link={heroBanner?.link || "/san-pham"}
      />

      <section className="border-y border-gold-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Award, title: "Bảo hành trọn đời", desc: "Cam kết chất lượng vàng, đá" },
            { icon: ShieldCheck, title: "Kiểm định GIA / GRA", desc: "Đá quý có giấy chứng nhận" },
            { icon: Sparkles, title: "Chế tác thủ công", desc: "Bởi nghệ nhân trên 20 năm" },
            { icon: Gem, title: "Giao hàng bảo hiểm", desc: "Toàn quốc, đóng gói sang trọng" },
          ].map((u, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="flex items-start gap-3">
                <u.icon size={28} className="text-gold-600 mt-0.5" />
                <div>
                  <div className="font-medium text-ink-900">{u.title}</div>
                  <div className="text-sm text-ink-800/60">{u.desc}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <SectionTitle
            eyebrow="Danh mục"
            title="Chọn phong cách của riêng bạn"
            desc="Khám phá các danh mục trang sức tinh xảo, mỗi thiết kế mang một ngôn ngữ riêng."
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <Link href={`/san-pham?danh-muc=${c.slug}`} className="group relative aspect-square rounded-full overflow-hidden border border-gold-200 bg-gold-50 hover:shadow-luxe transition block">
                <img
                  src={`https://images.unsplash.com/photo-${
                    ["1599643477877-530eb83abc8e","1605100804763-247f67b3557e","1543294001-f7cd5d7fb516","1602751584552-8ba73aad10e1","1611085583191-a3b181a88401","1596944924616-7b38e7cfac36"][i % 6]
                  }?w=600&q=80`}
                  alt={c.name}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition" />
                <div className="absolute inset-0 grid place-items-center text-white text-center">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gold-200">Bộ sưu tập</div>
                    <div className="font-serif text-xl mt-1">{c.name}</div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionTitle eyebrow="Đặc sắc" title="Sản phẩm nổi bật" desc="Những thiết kế được yêu thích nhất mùa này." />
          </Reveal>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.08}>
                <ProductCard p={p as any} />
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/san-pham" className="inline-flex items-center gap-2 border border-ink-900 hover:bg-ink-900 hover:text-white px-8 py-3 uppercase tracking-widest text-sm transition-all hover:tracking-[0.3em]">
              Xem tất cả sản phẩm <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&q=80" alt="Nghệ nhân chế tác" className="rounded-md w-full aspect-[4/5] object-cover shadow-luxe" />
              <div className="absolute -bottom-6 -right-6 hidden md:block bg-gold-600 text-white px-8 py-6 rounded-md">
                <div className="font-serif text-4xl">20+</div>
                <div className="text-xs uppercase tracking-widest">năm di sản</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-3">
                <span className="gold-line" /> Câu chuyện thương hiệu
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-ink-900 leading-[1.05]">
                Di sản của sự tinh xảo — <br />
                Cảm hứng của thời đại mới.
              </h2>
              <p className="mt-6 text-ink-800/75 leading-relaxed">
                Từ những xưởng kim hoàn truyền thống, Lam Thu Jewelry gìn giữ và
                phát triển nghệ thuật chế tác trang sức Việt. Mỗi sản phẩm là sự
                hòa quyện giữa kỹ thuật thủ công tinh xảo, chất liệu quý và cảm
                hứng thiết kế đương đại.
              </p>
              <p className="mt-4 text-ink-800/75 leading-relaxed">
                Chúng tôi tin rằng, trang sức không chỉ là món quà — mà là ngôn ngữ
                của tình yêu, của khoảnh khắc, của di sản để lại cho mai sau.
              </p>
              <Link href="/gioi-thieu" className="mt-8 inline-flex items-center gap-2 text-gold-700 hover:text-gold-900 uppercase tracking-widest text-sm">
                Tìm hiểu thêm <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="bg-gold-50/40 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal><SectionTitle eyebrow="Mới ra mắt" title="New Arrivals" /></Reveal>
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 0.08}>
                  <ProductCard p={p as any} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <SectionTitle eyebrow="Cẩm nang" title="Journal" desc="Kiến thức về vàng, kim cương, chăm sóc và phối trang sức." />
          </Reveal>
          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <Link href={`/bai-viet/${p.slug}`} className="group block bg-white rounded-md overflow-hidden border border-gold-100 hover:shadow-luxe transition h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] uppercase tracking-widest text-gold-600 mb-2">
                      {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                    <h3 className="font-serif text-xl text-ink-900 group-hover:text-gold-700 transition">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-800/70 line-clamp-3">{p.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <Reveal>
          <SectionTitle eyebrow="Đăng ký" title="Nhận ưu đãi và bộ sưu tập mới" desc="Đăng ký để nhận thông báo về ra mắt bộ sưu tập và ưu đãi thành viên." />
          <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input className="flex-1 px-4 py-3 border border-gold-200 rounded-md focus:outline-none focus:border-gold-500 bg-white" placeholder="Email của bạn" />
            <button className="bg-ink-900 hover:bg-ink-800 text-white px-8 py-3 uppercase tracking-widest text-sm">Đăng ký</button>
          </form>
        </Reveal>
      </section>
    </>
  );
}
