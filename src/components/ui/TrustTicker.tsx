"use client";

import { motion } from "framer-motion";

const ITEMS = [
  "✦ EARB Registered Agency",
  "✦ ODPC Compliant",
  "✦ 30+ Years in Nairobi Property",
  "✦ Licensed Estate Agents",
  "✦ 4-County Coverage",
  "✦ 95% Tenant Retention",
  "✦ Professional Property Management",
  "✦ Kenya's Premier Property Managers",
];

const repeated = [...ITEMS, ...ITEMS];

export default function TrustTicker() {
  return (
    <div
      className="bg-brand-navy-dark border-t border-white/10 overflow-hidden py-3 select-none"
      aria-hidden="true"
    >
      <motion.div
        className="flex gap-14 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, ease: "linear", repeat: Infinity, repeatType: "loop" }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="text-[11px] font-bold tracking-widest text-brand-cyan/60 uppercase flex-shrink-0"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
