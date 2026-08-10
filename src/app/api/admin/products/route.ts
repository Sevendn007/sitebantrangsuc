import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  price: z.number().int().min(0),
  salePrice: z.number().int().min(0).nullable().optional(),
  material: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  sizes: z.array(z.string()).nullable().optional(),
  description: z.string().default(""),
  content: z.string().default(""),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  inStock: z.boolean().default(true),
  categoryId: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const slug = data.slug?.trim() ? makeSlug(data.slug) : makeSlug(data.name);
    const p = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku: data.sku || null,
        price: data.price,
        salePrice: data.salePrice ?? null,
        material: data.material || null,
        weight: data.weight || null,
        sizes: data.sizes && data.sizes.length > 0 ? JSON.stringify(data.sizes) : null,
        description: data.description,
        content: data.content,
        images: JSON.stringify(data.images),
        featured: data.featured,
        isNew: data.isNew,
        inStock: data.inStock,
        categoryId: data.categoryId || null,
      },
    });
    return NextResponse.json({ ok: true, id: p.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid" }, { status: 400 });
  }
}
