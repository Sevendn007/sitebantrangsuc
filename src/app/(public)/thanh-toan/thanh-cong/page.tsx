import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata = { title: "Đặt hàng thành công" };

export default function SuccessPage({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams.code || "";
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <CheckCircle size={64} className="mx-auto text-green-600" />
      <h1 className="font-serif text-4xl mt-6">Cảm ơn bạn!</h1>
      <p className="mt-3 text-ink-800/70">
        Đơn hàng <strong className="text-ink-900">{code}</strong> đã được ghi nhận.
        Chúng tôi sẽ liên hệ xác nhận trong ít phút.
      </p>
      <div className="mt-8 flex justify-center gap-3 flex-wrap">
        {code && (
          <Link href={`/don-hang?code=${code}`} className="bg-gold-600 hover:bg-gold-700 text-white px-6 py-3 uppercase tracking-widest text-sm">
            Tra cứu đơn hàng
          </Link>
        )}
        <Link href="/san-pham" className="bg-ink-900 hover:bg-ink-800 text-white px-6 py-3 uppercase tracking-widest text-sm">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
