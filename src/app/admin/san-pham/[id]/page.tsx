import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import { PageHeader } from "@/components/admin/AdminBar";
import { safeParseImages } from "@/lib/utils";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <PageHeader title={`Chỉnh sửa: ${product.name}`} />
      <ProductForm
        categories={categories}
        initial={{
          ...product,
          images: safeParseImages(product.images),
        }}
      />
    </div>
  );
}
