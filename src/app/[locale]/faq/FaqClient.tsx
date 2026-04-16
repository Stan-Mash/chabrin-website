"use client";

import { useState } from "react";
import FaqAccordion, { type FaqItem } from "@/components/sections/faq/FaqAccordion";

interface Tab {
  key: string;
  label: string;
  items: FaqItem[];
}

interface FaqClientProps {
  tabs: Tab[];
}

// Icon per tab
const TAB_ICONS: Record<string, React.ReactNode> = {
  tenants: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  owners: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
    </svg>
  ),
  investors: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.375m3.75.375l-.375 3.75" />
    </svg>
  ),
};

export default function FaqClient({ tabs }: FaqClientProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const active = tabs.find((t) => t.key === activeTab) ?? tabs[0];

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── Tab bar ── */}
        <div
          className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-10"
          role="tablist"
          aria-label="FAQ categories"
        >
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                aria-controls={`faq-panel-${tab.key}`}
                id={`faq-tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl
                  text-sm font-semibold transition-all duration-200 focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[#0D1B8E]
                  ${isActive
                    ? "bg-[#0D1B8E] text-white shadow-sm"
                    : "text-slate-500 hover:text-[#0D1B8E] hover:bg-white"
                  }`}
              >
                {TAB_ICONS[tab.key]}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* ── FAQ count chip ── */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
            style={{ color: "#00C9C9" }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: "#00C9C9" }}
              aria-hidden="true"
            />
            {active.label}
          </span>
          <span className="text-slate-300 text-xs">—</span>
          <span className="text-slate-400 text-xs">{active.items.length} questions</span>
        </div>

        {/* ── Accordion panels ── */}
        {tabs.map((tab) => (
          <div
            key={tab.key}
            id={`faq-panel-${tab.key}`}
            role="tabpanel"
            aria-labelledby={`faq-tab-${tab.key}`}
            hidden={tab.key !== activeTab}
          >
            <FaqAccordion items={tab.items} />
          </div>
        ))}
      </div>
    </section>
  );
}
