import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { makeOrderCode, safeParseImages } from "@/lib/utils";
import { createMomoPayment } from "@/lib/payment/momo";
import { createVnpayUrl } from "@/lib/payment/vnpay";
import { calcShipping, PROVINCES } from "@/lib/vn-address";
import { rateLimit, clientKey } from "@/lib/ratelimit";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { headers } from "next/headers";

const schema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  customerEmail: z.string().email().optional().or(z.literal("")).nullable(),
  address: z.string().min(4),
  province: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  ward: z.string().optional().nullable(),
  note: z.string().max(1000).optional().nullable(),
  paymentMethod: z.enum(["cod", "momo", "vnpay", "bank"]),
  items: z
    .array(z.object({ id: z.string(), quantity: z.number().int().min(1).max(100), size: z.string().optional().nullable() }))
    .min(1),
});

export async function POST(req: Request) {
  try {
    const rl = rateLimit(clientKey(req, "orders"), { windowMs: 60_000, max: 8 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Quá nhiều đơn — vui lòng thử lại sau." }, { status: 429 });
    }

    const data = schema.parse(await req.json());

    const productIds = data.items.map((i) => i.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length === 0) {
      return NextResponse.json({ error: "Sản phẩm không hợp lệ" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = data.items
      .map((it) => {
        const p = products.find((x) => x.id === it.id);
        if (!p) return null;
        if (!p.inStock) return null;
        const price = p.salePrice ?? p.price;
        subtotal += price * it.quantity;
        return {
          productId: p.id,
          name: p.name,
          price,
          quantity: it.quantity,
          size: it.size || null,
          image: safeParseImages(p.images)[0] || null,
        };
      })
      .filter(Boolean) as any[];

    if (orderItems.length === 0) {
      return NextResponse.json({ error: "Không có sản phẩm hợp lệ (có thể đã hết hàng)" }, { status: 400 });
    }

    // Recompute shipping from province code lookup by name
    const prov = PROVINCES.find((p) => p.name === data.province);
    const shipping = calcShipping(subtotal, prov?.code || null);
    const total = subtotal + shipping;
    const code = makeOrderCode();

    const order = await prisma.order.create({
      data: {
        code,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        address: data.address,
        province: data.province || null,
        district: data.district || null,
        ward: data.ward || null,
        note: data.note || null,
        subtotal,
        shipping,
        total,
        paymentMethod: data.paymentMethod,
        paymentStatus: "pending",
        status: "new",
        items: { create: orderItems },
      },
    });

    // Fire-and-forget confirmation email
    sendOrderConfirmationEmail(order).catch(() => {});

    if (data.paymentMethod === "momo") {
      const momo = await createMomoPayment({
        orderId: code,
        orderInfo: `Thanh toan don hang ${code}`,
        amount: total,
      });
      if (momo.payUrl) {
        return NextResponse.json({ ok: true, code, redirectUrl: momo.payUrl });
      }
      return NextResponse.json({
        ok: true,
        code,
        redirectUrl: `/thanh-toan/thanh-cong?code=${code}`,
        warning: momo.message || "Không tạo được liên kết MoMo — đã ghi nhận đơn hàng.",
      });
    }

    if (data.paymentMethod === "vnpay") {
      const ip =
        headers().get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headers().get("x-real-ip") ||
        "127.0.0.1";
      try {
        const url = createVnpayUrl({
          orderId: code,
          amount: total,
          orderInfo: `Thanh toan don hang ${code}`,
          ipAddr: ip,
        });
        return NextResponse.json({ ok: true, code, redirectUrl: url });
      } catch (e: any) {
        return NextResponse.json({
          ok: true,
          code,
          redirectUrl: `/thanh-toan/thanh-cong?code=${code}`,
          warning: e?.message,
        });
      }
    }

    return NextResponse.json({ ok: true, code, orderId: order.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid" }, { status: 400 });
  }
}
