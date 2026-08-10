import slugify from "slugify";

export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN").format(v) + "₫";
}

export function makeSlug(text: string) {
  return slugify(text, { lower: true, strict: true, locale: "vi" });
}

export function safeParseImages(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function makeOrderCode() {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `VK${y}${m}${day}${rand}`;
}

export function truncate(s: string, n = 120) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n).trim() + "…" : s;
}
