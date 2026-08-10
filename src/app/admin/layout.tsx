import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import AdminNav from "./AdminNav";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-ink-50 grid grid-cols-[240px_1fr]">
      <aside className="bg-ink-900 text-white p-5 flex flex-col">
        <Link href="/admin" className="flex items-center gap-2 mb-8">
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 grid place-items-center font-serif text-lg">
            V
          </span>
          <span className="font-serif text-lg">VK Admin</span>
        </Link>

        <AdminNav />

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="text-xs text-white/60 mb-2">{session.email}</div>
          <LogoutButton />
        </div>
      </aside>

      <main className="p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
