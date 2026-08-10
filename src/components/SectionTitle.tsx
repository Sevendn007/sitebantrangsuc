export default function SectionTitle({
  eyebrow,
  title,
  desc,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : ""}>
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-3">
          <span className="gold-line" />
          {eyebrow}
          <span className="gold-line" />
        </div>
      )}
      <h2 className="font-serif text-3xl md:text-4xl text-ink-900">{title}</h2>
      {desc && <p className="mt-3 text-ink-800/70 leading-relaxed">{desc}</p>}
    </div>
  );
}
