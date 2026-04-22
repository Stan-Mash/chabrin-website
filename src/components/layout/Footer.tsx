import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import TrustTicker from "@/components/ui/TrustTicker";

const SERVICES_LINKS = [
  { label: "Property Management", href: "/services#management" },
  { label: "Leasing & Letting",   href: "/services#leasing"    },
  { label: "Valuation",           href: "/services#valuation"  },
  { label: "Digital Lease Mgmt",  href: "/services#digital"    },
];

const COMPANY_LINKS = [
  { key: "about",    href: "/about"   },
  { key: "blog",     href: "/blog"    },
  { key: "careers",  href: "/careers" },
  { key: "contact",  href: "/contact" },
];

export default function Footer() {
  const t      = useTranslations("nav");
  const tFoot  = useTranslations("footer");
  const locale = useLocale();
  const year   = new Date().getFullYear();

  const lp = (href: string) => `/${locale}${href}`;

  return (
    <footer className="bg-brand-navy text-white">
      {/* ── Trust ticker ──────────────────────────────────────────────── */}
      <TrustTicker />
      {/* ── Main footer grid ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ── Brand column ──────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Link href={lp("/")} className="inline-flex mb-5 w-fit">
              <div className="bg-white rounded-xl p-3">
                <Image
                  src="/logo-icon.png"
                  alt="Chabrin Agencies Limited"
                  width={120}
                  height={120}
                  className="h-20 w-auto"
                />
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {tFoot("tagline")}
            </p>
          </div>

          {/* ── Services ──────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold tracking-widest text-brand-cyan uppercase mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {SERVICES_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={lp(href)}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ───────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold tracking-widest text-brand-cyan uppercase mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={lp(href)}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ───────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold tracking-widest text-brand-cyan uppercase mb-5">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone2.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contact.phone2}
                </a>
              </li>
              <li className="leading-relaxed">{siteConfig.contact.address}</li>
              <li className="text-white/40 text-xs">{siteConfig.contact.pobox}</li>
              <li className="pt-1 border-t border-white/10 mt-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-brand-cyan/70 mb-2">
                  Office Hours
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  Mon – Fri: <span className="text-white/70">8:00 AM – 5:00 PM</span><br />
                  Saturday: <span className="text-white/70">8:30 AM – 12:00 PM</span><br />
                  <span className="text-white/30">Sunday & Public Holidays: Closed</span>
                </p>
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30
                             text-brand-cyan text-xs font-semibold hover:bg-brand-cyan/10 transition-colors"
                >
                  <span>💬</span> WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40 text-center sm:text-left">
            &copy; {year} {siteConfig.name}. {tFoot("rights")}
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link
              href={lp("/privacy-policy")}
              className="hover:text-white/70 transition-colors"
            >
              {tFoot("privacy")}
            </Link>
            <span>·</span>
            <span>EARB Registered</span>
            <span>·</span>
            <span>ODPC Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
