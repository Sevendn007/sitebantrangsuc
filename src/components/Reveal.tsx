"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}

export default function Reveal({ children, delay = 0, className, y = 24 }: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
