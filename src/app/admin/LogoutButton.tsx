"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  async function onClick() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-white/85 hover:text-white"
    >
      <LogOut size={14} /> Đăng xuất
    </button>
  );
}
