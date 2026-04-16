"use client";

import { useState } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-slate-100">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full text-left flex items-start justify-between gap-4 py-5 group"
            >
              <span
                className={`text-base font-semibold leading-snug transition-colors ${
                  isOpen ? "text-[#0D1B8E]" : "text-slate-800 group-hover:text-[#0D1B8E]"
                }`}
              >
                {item.q}
              </span>
              {/* Plus / minus icon */}
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors mt-0.5 ${
                  isOpen
                    ? "bg-[#0D1B8E] text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-[#0D1B8E]/10 group-hover:text-[#0D1B8E]"
                }`}
                aria-hidden="true"
              >
                {isOpen ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                  </svg>
                )}
              </span>
            </button>

            {/* Answer panel */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-[600px] pb-5" : "max-h-0"
              }`}
            >
              <p className="text-slate-600 leading-relaxed text-sm pr-10">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
