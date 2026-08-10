import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/AdminBar";
import DeleteButton from "@/components/admin/DeleteButton";
import Pagination from "@/components/admin/Pagination";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;

export default async function AdminPosts({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const page = Math.max(1, Number(searchParams.page || 1));
  const where: Prisma.PostWhereInput = q ? { title: { contains: q } } : {};
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.post.count({ where }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <PageHeader title="Bài viết" subtitle={`${total} bài viết`} newHref="/admin/bai-viet/moi" newLabel="Thêm bài viết" />

      <form className="mb-4 flex gap-2 max-w-md">
        <input name="q" defaultValue={q} placeholder="Tìm theo tiêu đề..." className="flex-1 border border-gold-200 rounded px-3 py-2 text-sm" />
        <button className="bg-ink-900 text-white px-4 text-xs uppercase tracking-widest">Tìm</button>
      </form>

      <div className="bg-white rounded-lg border border-gold-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gold-50/70 text-ink-800/70">
            <tr className="text-left">
              <th className="p-3">Ảnh</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
              <th className="text-right pr-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-gold-100">
                <td className="p-3"><img src={p.cover} className="w-16 h-12 object-cover rounded" /></td>
                <td>
                  <Link href={`/admin/bai-viet/${p.id}`} className="font-medium hover:text-gold-700">{p.title}</Link>
                  <div className="text-xs text-ink-800/60">/{p.slug}</div>
                </td>
                <td>{p.published ? <span className="text-green-700 text-xs">Đã đăng</span> : <span className="text-ink-800/60 text-xs">Bản nháp</span>}</td>
                <td>{new Date(p.createdAt).toLocaleDateString("vi-VN")}</td>
                <td className="text-right pr-3">
                  <div className="inline-flex gap-3">
                    <Link href={`/admin/bai-viet/${p.id}`} className="text-sm text-gold-700 hover:underline">Sửa</Link>
                    <DeleteButton url={`/api/admin/posts/${p.id}`} small />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-ink-800/60">Chưa có bài viết.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} baseUrl="/admin/bai-viet" q={q} />
    </div>
  );
}
