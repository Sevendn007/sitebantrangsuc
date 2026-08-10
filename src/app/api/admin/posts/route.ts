import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  cover: z.string().default(""),
  published: z.boolean().default(true),
});

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const slug = data.slug?.trim() ? makeSlug(data.slug) : makeSlug(data.title);
    const p = await prisma.post.create({
      data: { ...data, slug },
    });
    return NextResponse.json({ ok: true, id: p.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid" }, { status: 400 });
  }
}
