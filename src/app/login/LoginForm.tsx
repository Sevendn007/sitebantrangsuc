"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Đăng nhập thất bại");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-widest text-ink-800/70">Email</label>
        <input
          name="email"
          type="email"
          defaultValue="admin@vankhanh.local"
          required
          className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 focus:outline-none focus:border-gold-500"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-ink-800/70">Mật khẩu</label>
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 focus:outline-none focus:border-gold-500"
        />
      </div>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <button
        disabled={loading}
        className="w-full bg-ink-900 hover:bg-ink-800 disabled:opacity-60 text-white px-4 py-3 uppercase tracking-widest text-sm"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
