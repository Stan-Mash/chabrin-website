"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const controls = useAnimation();

  useEffect(() => {
    controls.set({ opacity: 0, y: 8 });
    requestAnimationFrame(() => {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      });
    });
  }, [pathname, controls]);

  return (
    <motion.div animate={controls} initial={{ opacity: 0, y: 8 }}>
      {children}
    </motion.div>
  );
}
