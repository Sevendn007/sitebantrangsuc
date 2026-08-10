"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  image: string;
  video?: string | null;
  link?: string;
}

export default function HeroBanner({ title, subtitle, image, video, link }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[85vh] min-h-[600px] w-full">
        {video ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={image}
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative mx-auto max-w-7xl px-6 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-xs uppercase tracking-[0.5em] text-gold-200 mb-6"
            >
              <span className="gold-line" /> {subtitle} <span className="gold-line" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="mt-8 text-white/85 text-lg leading-relaxed max-w-lg"
            >
              Mỗi tác phẩm được chế tác thủ công từ vàng 18K, kim cương tự nhiên
              và đá quý được tuyển chọn — tôn vinh vẻ đẹp và câu chuyện riêng của bạn.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9 }}
              className="mt-10 flex gap-4 flex-wrap"
            >
              <Link href={link || "/san-pham"} className="inline-flex items-center gap-2 bg-gold-600 hover:bg-gold-700 text-white px-8 py-4 uppercase tracking-widest text-sm transition-all hover:tracking-[0.3em]">
                Khám phá bộ sưu tập <ArrowRight size={16} />
              </Link>
              <Link href="/lien-he" className="inline-flex items-center gap-2 border border-white/70 hover:bg-white hover:text-ink-900 text-white px-8 py-4 uppercase tracking-widest text-sm transition">
                Đặt lịch tư vấn
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-[10px] uppercase tracking-[0.4em]"
        >
          Scroll ↓
        </motion.div>
      </div>
    </section>
  );
}
