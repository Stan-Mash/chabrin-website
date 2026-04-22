"use client";

import { useEffect, useRef } from "react";

export default function CursorSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;
    const parent = spot.parentElement;
    if (!parent) return;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      spot.style.left = `${e.clientX - rect.left}px`;
      spot.style.top = `${e.clientY - rect.top}px`;
      spot.style.opacity = "1";
    };
    const onLeave = () => { spot.style.opacity = "0"; };

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      aria-hidden="true"
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2
                 w-[500px] h-[500px] rounded-full opacity-0 transition-opacity duration-500
                 hidden lg:block"
      style={{
        background:
          "radial-gradient(circle, rgba(0,201,201,0.07) 0%, rgba(0,201,201,0.02) 40%, transparent 70%)",
        zIndex: 2,
      }}
    />
  );
}
