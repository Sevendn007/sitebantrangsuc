import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyLogin, createSession } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/ratelimit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export async function POST(req: Request) {
  try {
    const rl = rateLimit(clientKey(req, "login"), { windowMs: 5 * 60_000, max: 10 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Quá nhiều lần thử đăng nhập. Vui lòng chờ ${rl.retryAfter}s.` },
        { status: 429 }
      );
    }
    const data = schema.parse(await req.json());
    const user = await verifyLogin(data.email, data.password);
    if (!user) {
      return NextResponse.json({ error: "Sai email hoặc mật khẩu" }, { status: 401 });
    }
    await createSession({
      uid: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid" }, { status: 400 });
  }
}
