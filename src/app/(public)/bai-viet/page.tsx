import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-3">
          <span className="gold-line" /> Cẩm nang <span className="gold-line" />
        </div>
        <h1 className="font-serif text-4xl text-ink-900">Cẩm nang trang sức</h1>
        <p className="mt-3 text-ink-800/70">
          Kiến thức, xu hướng và câu chuyện xung quanh thế giới trang sức.
        </p>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-8">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/bai-viet/${p.slug}`}
            className="group block bg-white rounded-md overflow-hidden border border-gold-100 hover:shadow-luxe transition"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={p.cover}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
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
        ))}
      </div>
    </div>
  );
}
