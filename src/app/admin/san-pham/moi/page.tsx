import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import { PageHeader } from "@/components/admin/AdminBar";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <PageHeader title="Thêm sản phẩm" />
      <ProductForm categories={categories} />
    </div>
  );
}
