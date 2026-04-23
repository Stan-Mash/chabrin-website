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

  // margin: "-80px 0px" means the observer fires 80px before the element
  // leaves/enters the viewport edge — reliable replay on scroll up without
  // needing a high `amount` threshold that large headings rarely cross.
  const inView = useInView(ref as React.RefObject<Element>, {
    once: false,
    margin: "-80px 0px",
  });

  const words = text.split(" ");

  return (
    // @ts-expect-error — dynamic tag with forwarded ref
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + i * 0.07,
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
