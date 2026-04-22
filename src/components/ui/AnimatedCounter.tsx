"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  value: string;   // e.g. "10+", "30+", "95%"
  className?: string;
  duration?: number;
}

function parse(raw: string): { number: number; suffix: string } {
  const m = raw.match(/^(\d+)(.*)$/);
  if (!m) return { number: 0, suffix: raw };
  return { number: parseInt(m[1], 10), suffix: m[2] ?? "" };
}

export default function AnimatedCounter({ value, className, duration = 1800 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState("0");
  const { number, suffix } = parse(value);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * number).toString());
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(number.toString());
    };

    requestAnimationFrame(step);
  }, [inView, number, duration]);

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  );
}
