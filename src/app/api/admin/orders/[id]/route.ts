import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  status: z.enum(["new", "confirmed", "shipping", "done", "canceled"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    await prisma.order.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid" }, { status: 400 });
  }
}
