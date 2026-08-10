"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không gửi được");
      setState("sent");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-md border border-gold-100 space-y-4">
      <h2 className="font-serif text-2xl">Gửi tin nhắn cho chúng tôi</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-ink-800/70">Họ tên *</label>
          <input required name="name" className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 focus:outline-none focus:border-gold-500" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-ink-800/70">Số điện thoại *</label>
          <input required name="phone" className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 focus:outline-none focus:border-gold-500" />
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-ink-800/70">Email</label>
        <input type="email" name="email" className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 focus:outline-none focus:border-gold-500" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-ink-800/70">Chủ đề</label>
        <input name="subject" className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 focus:outline-none focus:border-gold-500" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-ink-800/70">Nội dung *</label>
        <textarea required name="message" rows={5} className="mt-1 w-full border border-gold-200 rounded px-3 py-2.5 focus:outline-none focus:border-gold-500" />
      </div>

      {state === "error" && <div className="text-sm text-red-600">{error}</div>}
      {state === "sent" && (
        <div className="text-sm text-green-700 flex items-center gap-2">
          <Check size={16} /> Cảm ơn bạn — chúng tôi sẽ liên hệ trong 24h.
        </div>
      )}

      <button
        disabled={state === "sending"}
        className="inline-flex items-center gap-2 bg-ink-900 hover:bg-ink-800 disabled:opacity-50 text-white px-8 py-3 uppercase tracking-widest text-sm"
      >
        {state === "sending" ? "Đang gửi..." : (<><Send size={16} /> Gửi liên hệ</>)}
      </button>
    </form>
  );
}
