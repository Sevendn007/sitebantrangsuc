import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMomoIpn } from "@/lib/payment/momo";
import { sendOrderPaidEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(body)) {
      if (v !== null && v !== undefined) params[k] = String(v);
    }
    if (!verifyMomoIpn(params)) {
      return NextResponse.json({ message: "invalid signature" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { code: params.orderId } });
    if (!order) return NextResponse.json({ message: "order not found" }, { status: 404 });

    // Idempotent: if already paid, ack success without re-processing
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ message: "already processed" });
    }

    const paidAmount = Number(params.amount || 0);
    if (paidAmount !== order.total) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "failed", txnRef: params.transId || null },
      });
      return NextResponse.json({ message: "amount mismatch" }, { status: 400 });
    }

    const paid = params.resultCode === "0";
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: paid ? "paid" : "failed",
        status: paid ? "confirmed" : "new",
        txnRef: params.transId || null,
      },
    });

    if (paid) {
      // fire-and-forget email
      sendOrderPaidEmail(updated).catch(() => {});
    }

    return NextResponse.json({ message: "ok" });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "error" }, { status: 400 });
  }
}
