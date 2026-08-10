import PostForm from "../PostForm";
import { PageHeader } from "@/components/admin/AdminBar";

export default function NewPostPage() {
  return (
    <div>
      <PageHeader title="Thêm bài viết" />
      <PostForm />
    </div>
  );
}
