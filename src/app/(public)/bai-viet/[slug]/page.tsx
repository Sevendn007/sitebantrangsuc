import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Clock } from "lucide-react";

export const revalidate = 60;

function estimateReading(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export default async function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post || !post.published) notFound();

  const others = await prisma.post.findMany({
    where: { published: true, NOT: { id: post.id } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const reading = estimateReading(post.content);

  return (
    <article>
      <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <img src={post.cover} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative mx-auto max-w-4xl px-6 h-full flex flex-col justify-end pb-16">
          <Link href="/bai-viet" className="text-white/70 hover:text-white text-xs uppercase tracking-widest inline-flex items-center gap-1 mb-6 self-start">
            <ArrowLeft size={12} /> Tất cả bài viết
          </Link>
          <div className="text-white/70 text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-4">
            <span>{new Date(post.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}</span>
            <span className="w-px h-3 bg-white/30" />
            <span className="flex items-center gap-1"><Clock size={12} /> {reading} phút đọc</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-[1.05] max-w-3xl">{post.title}</h1>
          <p className="mt-6 text-white/85 text-lg italic max-w-2xl">{post.excerpt}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose-luxe text-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {others.length > 0 && (
        <section className="bg-gold-50/60 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-3xl text-center mb-10">Đọc tiếp</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {others.map((o) => (
                <Link key={o.id} href={`/bai-viet/${o.slug}`} className="group block bg-white rounded-md overflow-hidden border border-gold-100 hover:shadow-luxe transition">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={o.cover} alt={o.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] uppercase tracking-widest text-gold-600 mb-2">
                      {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                    <h3 className="font-serif text-xl text-ink-900 group-hover:text-gold-700">{o.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
