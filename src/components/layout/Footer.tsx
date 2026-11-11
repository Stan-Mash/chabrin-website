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
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.534 5.859L.054 23.447a.75.75 0 00.918.919l5.761-1.483A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.853 0-3.584-.504-5.073-1.383l-.363-.215-3.76.967.985-3.671-.232-.378A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  WhatsApp Us
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
