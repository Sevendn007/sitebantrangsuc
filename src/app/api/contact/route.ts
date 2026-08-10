import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKey } from "@/lib/ratelimit";

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(5).max(3000),
});

export async function POST(req: Request) {
  try {
    const rl = rateLimit(clientKey(req, "contact"), { windowMs: 60_000, max: 5 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Quá nhiều yêu cầu — vui lòng chờ ít phút." }, { status: 429 });
    }
    const data = schema.parse(await req.json());
    await prisma.contact.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        subject: data.subject || null,
        message: data.message,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid" }, { status: 400 });
  }
}
