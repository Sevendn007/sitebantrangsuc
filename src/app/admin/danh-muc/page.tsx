import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/AdminBar";
import DeleteButton from "@/components/admin/DeleteButton";
import NewCategoryForm from "./NewCategoryForm";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const cats = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <PageHeader title="Danh mục" subtitle={`${cats.length} danh mục`} />

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-lg border border-gold-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gold-50/70 text-ink-800/70">
              <tr className="text-left">
                <th className="p-3">Tên</th>
                <th>Slug</th>
                <th>Số SP</th>
                <th className="text-right pr-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.id} className="border-t border-gold-100">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="text-ink-800/60">{c.slug}</td>
                  <td>{c._count.products}</td>
                  <td className="text-right pr-3">
                    <DeleteButton url={`/api/admin/categories/${c.id}`} small />
                  </td>
                </tr>
              ))}
              {cats.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-ink-800/60">Chưa có danh mục.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gold-100">
          <h2 className="font-serif text-xl mb-4">Thêm danh mục</h2>
          <NewCategoryForm />
        </div>
      </div>
    </div>
  );
}
