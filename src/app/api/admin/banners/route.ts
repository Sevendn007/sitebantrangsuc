import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional().default(""),
  image: z.string().min(1),
  video: z.string().optional().nullable(),
  link: z.string().optional().default(""),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    await prisma.banner.create({
      data: { ...data, video: data.video || null },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid" }, { status: 400 });
  }
}
