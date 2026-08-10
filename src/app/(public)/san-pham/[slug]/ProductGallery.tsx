"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const next = useCallback(() => setActive((a) => (a + 1) % images.length), [images.length]);
  const prev = useCallback(() => setActive((a) => (a - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, next, prev]);

  return (
    <div>
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gold-50 border border-gold-100 group">
        <img
          src={images[active]}
          alt={alt}
          onClick={() => setLightbox(true)}
          onMouseMove={(e) => {
            const r = (e.target as HTMLImageElement).getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            setOrigin(`${x}% ${y}%`);
          }}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          style={{
            transformOrigin: origin,
            transform: zoomed ? "scale(1.75)" : "scale(1)",
            transition: zoomed ? "transform 200ms" : "transform 500ms",
          }}
          className="w-full h-full object-cover cursor-zoom-in"
        />
        <button
          onClick={() => setLightbox(true)}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 grid place-items-center opacity-0 group-hover:opacity-100 transition"
          aria-label="Phóng to"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={"aspect-square rounded overflow-hidden border-2 transition " + (i === active ? "border-gold-500" : "border-gold-100 hover:border-gold-300")}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 grid place-items-center animate-in fade-in"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-6 right-6 text-white/80 hover:text-white" onClick={() => setLightbox(false)} aria-label="Đóng">
            <X size={28} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 text-white/80 hover:text-white" aria-label="Trước">
            <ChevronLeft size={40} />
          </button>
          <img src={images[active]} alt={alt} className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 text-white/80 hover:text-white" aria-label="Sau">
            <ChevronRight size={40} />
          </button>
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm">
            {active + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
