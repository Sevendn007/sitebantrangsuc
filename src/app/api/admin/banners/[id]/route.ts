import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.banner.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Delete error" }, { status: 400 });
  }
}
