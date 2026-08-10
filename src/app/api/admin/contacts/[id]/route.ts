import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await prisma.contact.update({
    where: { id: params.id },
    data: { handled: !!body.handled },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.contact.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
