import Link from "next/link";
import { Plus } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  newHref,
  newLabel = "Thêm mới",
}: {
  title: string;
  subtitle?: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-serif text-3xl">{title}</h1>
        {subtitle && <p className="text-ink-800/60 mt-1">{subtitle}</p>}
      </div>
      {newHref && (
        <Link
          href={newHref}
          className="inline-flex items-center gap-2 bg-ink-900 hover:bg-ink-800 text-white px-5 py-2.5 rounded text-sm"
        >
          <Plus size={16} /> {newLabel}
        </Link>
      )}
    </div>
  );
}
