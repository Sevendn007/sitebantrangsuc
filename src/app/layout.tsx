import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lam Thu Jewelry — Trang sức đẳng cấp",
    template: "%s | Lam Thu Jewelry",
  },
  description:
    "Lam Thu Jewelry — thương hiệu trang sức cao cấp: nhẫn cưới, kim cương, vàng 18K, đá quý. Thiết kế thủ công tinh xảo, đẳng cấp Á Đông.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Lam Thu Jewelry",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-luxe">{children}</body>
    </html>
  );
}
