import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifyVnpayReturn } from "@/lib/payment/vnpay";
import { sendOrderPaidEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kết quả thanh toán" };

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  let ok = false;
  let orderCode: string | null = null;
  let message = "Đang xác thực thanh toán...";

  if (searchParams.vnp_TxnRef) {
    const check = verifyVnpayReturn(searchParams);
    orderCode = check.txnRef;
    if (!check.ok) {
      message = "Chữ ký VNPay không hợp lệ. Không cập nhật đơn hàng.";
    } else {
      const order = await prisma.order.findUnique({ where: { code: check.txnRef } });
      if (!order) {
        message = "Không tìm thấy đơn hàng.";
      } else if (check.amount !== order.total) {
        message = "Số tiền thanh toán không khớp — vui lòng liên hệ hỗ trợ.";
      } else if (check.responseCode !== "00") {
        message = "Giao dịch VNPay không thành công hoặc đã bị huỷ.";
      } else {
        if (order.paymentStatus !== "paid") {
          const updated = await prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: "paid", status: "confirmed" },
          });
          sendOrderPaidEmail(updated).catch(() => {});
        }
        ok = true;
        message = "Thanh toán qua VNPay thành công.";
      }
    }
  } else if (searchParams.orderId && searchParams.resultCode !== undefined) {
    orderCode = searchParams.orderId;
    const order = await prisma.order.findUnique({ where: { code: searchParams.orderId } });
    const paidAmount = Number(searchParams.amount || 0);
    if (!order) {
      message = "Không tìm thấy đơn hàng.";
    } else if (paidAmount !== order.total) {
      message = "Số tiền thanh toán không khớp — vui lòng liên hệ hỗ trợ.";
    } else if (searchParams.resultCode !== "0") {
      message = "Thanh toán MoMo không thành công hoặc bị huỷ.";
    } else {
      if (order.paymentStatus !== "paid") {
        const updated = await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "paid", status: "confirmed" },
        });
        sendOrderPaidEmail(updated).catch(() => {});
      }
      ok = true;
      message = "Thanh toán qua MoMo thành công.";
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      {ok ? (
        <CheckCircle size={64} className="mx-auto text-green-600" />
      ) : (
        <XCircle size={64} className="mx-auto text-red-500" />
      )}
      <h1 className="font-serif text-4xl mt-6">
        {ok ? "Thanh toán thành công" : "Thanh toán chưa hoàn tất"}
      </h1>
      <p className="mt-3 text-ink-800/70">{message}</p>
      {orderCode && (
        <p className="mt-2 text-ink-800/70">
          Mã đơn: <strong className="text-ink-900">{orderCode}</strong>
        </p>
      )}
      <div className="mt-8 flex justify-center gap-4">
        {orderCode && (
          <Link
            href={`/don-hang?code=${orderCode}`}
            className="bg-gold-600 hover:bg-gold-700 text-white px-6 py-3 uppercase tracking-widest text-sm"
          >
            Xem đơn hàng
          </Link>
        )}
        <Link href="/san-pham" className="bg-ink-900 hover:bg-ink-800 text-white px-6 py-3 uppercase tracking-widest text-sm">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
