"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export default function HeroParallaxBlobs() {
  const { scrollYProgress } = useScroll();
  const blob1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ y: blob1Y }}
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full
                   bg-brand-cyan/10 blur-3xl pointer-events-none"
      />
      <motion.div
        aria-hidden="true"
        style={{ y: blob2Y }}
        className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full
                   bg-brand-navy-light/30 blur-2xl pointer-events-none"
      />
    </>
  );
}
