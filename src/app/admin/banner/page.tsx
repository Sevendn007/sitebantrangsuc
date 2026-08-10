import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/AdminBar";
import DeleteButton from "@/components/admin/DeleteButton";
import BannerForm from "./BannerForm";

export const dynamic = "force-dynamic";

export default async function AdminBanners() {
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <PageHeader title="Banner" subtitle={`${banners.length} banner`} />
      <div className="grid md:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-lg border border-gold-100 p-4 flex gap-4">
              <img src={b.image} alt="" className="w-40 h-24 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-ink-800/60">{b.subtitle}</div>
                <div className="text-xs mt-1">Link: {b.link || "—"} • Thứ tự: {b.order} • {b.active ? "Đang hiển thị" : "Ẩn"}</div>
              </div>
              <DeleteButton url={`/api/admin/banners/${b.id}`} small />
            </div>
          ))}
          {banners.length === 0 && (
            <div className="bg-white rounded-lg border border-gold-100 p-8 text-center text-ink-800/60">Chưa có banner nào.</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gold-100">
          <h2 className="font-serif text-xl mb-4">Thêm banner</h2>
          <BannerForm />
        </div>
      </div>
    </div>
  );
}
