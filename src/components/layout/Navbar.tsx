"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { key: "properties", href: "/properties" },
  { key: "services",   href: "/services"   },
  { key: "about",      href: "/about"      },
  { key: "faq",        href: "/faq"        },
  { key: "blog",       href: "/blog"       },
  { key: "careers",    href: "/careers"    },
  { key: "complaints", href: "/complaints" },
] as const;

export default function Navbar() {
  const t       = useTranslations("nav");
  const locale  = useLocale();
  const pathname = usePathname();
  const [isOpen,      setIsOpen]      = useState(false);
  const [isScrolled,  setIsScrolled]  = useState(false);

  // Detect scroll for shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const localePath = (href: string) => `/${locale}${href}`;
  const otherLocale = locale === "en" ? "sw" : "en";
  const switchLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const isActive = (href: string) =>
    pathname === localePath(href) || pathname.startsWith(localePath(href) + "/");

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-card border-b border-slate-100"
          : "bg-white"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link
            href={localePath("/")}
            className="flex items-center flex-shrink-0"
            aria-label="Chabrin Agencies — Home"
          >
            <Image
              src="/logo-full.png"
              alt="Chabrin Agencies Limited"
              width={498}
              height={175}
              className="h-32 md:h-44 w-auto"
              priority
            />
          </Link>

          {/* ── Desktop Navigation ────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={localePath(href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "text-brand-navy bg-surface font-semibold"
                    : "text-slate-600 hover:text-brand-navy hover:bg-surface"
                }`}
              >
                {t(key)}
              </Link>
            ))}
          </div>

          {/* ── Desktop Right — Language + CTA ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <Link
              href={switchLocalePath}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200
                         text-xs font-semibold text-slate-500 hover:border-brand-navy hover:text-brand-navy
                         transition-colors"
              aria-label={`Switch to ${otherLocale === "en" ? "English" : "Swahili"}`}
            >
              <span className="text-base leading-none">
                {otherLocale === "sw" ? "🇰🇪" : "🇬🇧"}
              </span>
              <span>{otherLocale === "sw" ? "SW" : "EN"}</span>
            </Link>

            {/* CTA */}
            <Link
              href={localePath("/contact")}
              className="px-4 py-2 rounded-full bg-brand-navy text-white text-sm font-semibold
                         hover:bg-brand-navy-dark transition-colors shadow-sm"
            >
              {t("contact")}
            </Link>
          </div>

          {/* ── Mobile Menu Button ────────────────────────────────────────── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-surface transition-colors"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span className={`block w-5 h-0.5 bg-brand-navy transition-all duration-300 origin-center
              ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-brand-navy transition-all duration-300
              ${isOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-brand-navy transition-all duration-300 origin-center
              ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* ── Mobile Menu ───────────────────────────────────────────────── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={localePath(href)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "text-brand-navy bg-surface font-semibold"
                    : "text-slate-600 hover:text-brand-navy hover:bg-surface"
                }`}
              >
                {t(key)}
              </Link>
            ))}

            <div className="flex items-center gap-3 px-4 pt-3 mt-1 border-t border-slate-100">
              {/* Language switch */}
              <Link
                href={switchLocalePath}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200
                           text-xs font-semibold text-slate-500 hover:border-brand-navy hover:text-brand-navy
                           transition-colors"
              >
                <span>{otherLocale === "sw" ? "🇰🇪" : "🇬🇧"}</span>
                <span>{otherLocale === "sw" ? "Swahili" : "English"}</span>
              </Link>

              {/* CTA */}
              <Link
                href={localePath("/contact")}
                className="flex-1 text-center px-4 py-2 rounded-full bg-brand-navy text-white
                           text-sm font-semibold hover:bg-brand-navy-dark transition-colors"
              >
                {t("contact")}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
