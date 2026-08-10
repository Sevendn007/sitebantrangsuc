import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  order: z.number().int().default(0),
});

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const slug = data.slug?.trim() ? makeSlug(data.slug) : makeSlug(data.name);
    const c = await prisma.category.create({
      data: { name: data.name, slug, order: data.order },
    });
    return NextResponse.json({ ok: true, id: c.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid" }, { status: 400 });
  }
}
