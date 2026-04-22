"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";

const STORAGE_KEY = "chabrin_cookie_consent";

export default function CookieBanner() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const respond = (choice: "accepted" | "declined") => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 32 }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-brand-navy border-t border-white/10
                     px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center
                     justify-between gap-4 shadow-[0_-8px_32px_rgba(13,27,142,0.35)]"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold mb-1">
              We use cookies to improve your experience
            </p>
            <p className="text-white/55 text-xs leading-relaxed">
              Chabrin Agencies uses cookies and similar technologies to operate our website
              and improve your experience. By continuing, you agree to our{" "}
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-brand-cyan hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and KDPA data processing terms.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => respond("declined")}
              className="px-4 py-2 rounded-full border border-white/20 text-white/70
                         text-xs font-semibold hover:border-white/40 hover:text-white
                         transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => respond("accepted")}
              className="px-5 py-2 rounded-full bg-brand-cyan text-brand-navy
                         text-xs font-bold hover:bg-brand-cyan-dark transition-colors"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
