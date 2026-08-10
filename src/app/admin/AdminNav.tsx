"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gem,
  FolderTree,
  FileText,
  Image as ImageIcon,
  Mail,
  ShoppingBag,
  Settings as SettingsIcon,
} from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: Gem },
  { href: "/admin/danh-muc", label: "Danh mục", icon: FolderTree },
  { href: "/admin/bai-viet", label: "Bài viết", icon: FileText },
  { href: "/admin/banner", label: "Banner", icon: ImageIcon },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: ShoppingBag },
  { href: "/admin/lien-he", label: "Liên hệ", icon: Mail },
  { href: "/admin/cai-dat", label: "Cài đặt", icon: SettingsIcon },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="admin-nav flex flex-col gap-1">
      {ITEMS.map((it) => {
        const active = it.exact ? path === it.href : path === it.href || path.startsWith(it.href + "/");
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={
              "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition " +
              (active ? "bg-gold-50 text-gold-800 font-medium" : "text-white/85 hover:bg-white/5")
            }
          >
            <it.icon size={16} />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
