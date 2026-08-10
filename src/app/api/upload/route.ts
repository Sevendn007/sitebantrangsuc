import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";
import { rateLimit, clientKey } from "@/lib/ratelimit";

const MAX = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rl = rateLimit(clientKey(req, "upload"), { windowMs: 60_000, max: 30 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Quá nhiều yêu cầu, vui lòng thử lại sau." }, { status: 429 });
  }

  const fd = await req.formData();
  const file = fd.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "File > 5MB" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Bad type" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImage(buffer, file.type);
  return NextResponse.json({ url });
}
