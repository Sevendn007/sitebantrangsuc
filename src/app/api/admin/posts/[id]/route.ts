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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const slug = data.slug?.trim() ? makeSlug(data.slug) : makeSlug(data.title);
    await prisma.post.update({ where: { id: params.id }, data: { ...data, slug } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Delete error" }, { status: 400 });
  }
}
