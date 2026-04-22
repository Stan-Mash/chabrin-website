"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Tag = "h1" | "h2" | "h3" | "span";

interface Props {
  text: string;
  className?: string;
  as?: Tag;
  delay?: number;
}

export default function AnimatedHeadline({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.3 });
  const words = text.split(" ");

  return (
    // @ts-expect-error — dynamic tag with forwarded ref
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + i * 0.08,
          }}
          className="inline-block"
          style={{ marginRight: i < words.length - 1 ? "0.25em" : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
