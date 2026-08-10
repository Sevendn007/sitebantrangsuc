import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  baseUrl,
  q,
}: {
  page: number;
  totalPages: number;
  baseUrl: string;
  q?: string;
}) {
  if (totalPages <= 1) return null;
  const range = pageRange(page, totalPages);
  return (
    <div className="mt-4 flex justify-center gap-2">
      {range.map((n, i) =>
        n === "..." ? (
          <span key={i} className="px-2 text-ink-800/50">…</span>
        ) : (
          <Link
            key={i}
            href={`${baseUrl}?${new URLSearchParams({ ...(q ? { q } : {}), page: String(n) }).toString()}`}
            className={
              "min-w-9 h-9 px-3 grid place-items-center rounded border text-sm " +
              (n === page
                ? "border-gold-500 bg-gold-50 text-gold-800 font-semibold"
                : "border-gold-200 hover:border-gold-400")
            }
          >
            {n}
          </Link>
        )
      )}
    </div>
  );
}

function pageRange(current: number, total: number): (number | "...")[] {
  const delta = 2;
  const range: (number | "...")[] = [];
  let last: number | undefined;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      if (last !== undefined && i - last > 1) range.push("...");
      range.push(i);
      last = i;
    }
  }
  return range;
}
