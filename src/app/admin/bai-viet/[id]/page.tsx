import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "../PostForm";
import { PageHeader } from "@/components/admin/AdminBar";

export default async function EditPost({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return (
    <div>
      <PageHeader title={`Chỉnh sửa: ${post.title}`} />
      <PostForm initial={post} />
    </div>
  );
}
