import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyVnpayReturn } from "@/lib/payment/vnpay";
import { sendOrderPaidEmail } from "@/lib/email";

// VNPay IPN: server-to-server callback. Response format is strict (RspCode/Message).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());
  return handle(query);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  let query: Record<string, string> = Object.fromEntries(url.searchParams.entries());
  if (Object.keys(query).length === 0) {
    try {
      const body = await req.json();
      query = Object.fromEntries(
        Object.entries(body as Record<string, unknown>).map(([k, v]) => [k, String(v ?? "")])
      );
    } catch {
      // ignore
    }
  }
  return handle(query);
}

async function handle(query: Record<string, string>) {
  const check = verifyVnpayReturn(query);
  if (!check.ok) {
    return NextResponse.json({ RspCode: "97", Message: "Invalid signature" });
  }

  const order = await prisma.order.findUnique({ where: { code: check.txnRef } });
  if (!order) {
    return NextResponse.json({ RspCode: "01", Message: "Order not found" });
  }

  if (check.amount !== order.total) {
    return NextResponse.json({ RspCode: "04", Message: "Amount mismatch" });
  }

  if (order.paymentStatus === "paid") {
    return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });
  }

  const paid = check.responseCode === "00";
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: paid ? "paid" : "failed",
      status: paid ? "confirmed" : "new",
      txnRef: query.vnp_TransactionNo || null,
    },
  });

  if (paid) sendOrderPaidEmail(updated).catch(() => {});

  return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
}
