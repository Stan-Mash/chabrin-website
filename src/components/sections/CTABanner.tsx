import Link from "next/link";
import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";

export default function CTABanner() {
  const locale = useLocale();

  return (
    <section className="py-20 md:py-28 bg-brand-navy relative overflow-hidden">

      {/* ── Background accents ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 rounded-full
                   bg-brand-cyan/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full
                   bg-brand-navy-light/50 blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* ── Left — text ────────────────────────────────────────── */}
          <div className="max-w-xl text-center lg:text-left">
            <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-4">
              Property Owners
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Let Us Manage Your Property
            </h2>
            <p className="text-white/65 text-lg leading-relaxed">
              Join hundreds of landlords who trust Chabrin to maximise their rental
              income, minimise vacancy, and handle everything in between.
            </p>
          </div>

          {/* ── Right — action cards ───────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            {/* Primary — get in touch */}
            <Link
              href={`/${locale}/contact`}
              className="flex flex-col items-center justify-center gap-2 px-8 py-5
                         rounded-2xl bg-brand-cyan text-brand-navy font-bold
                         hover:bg-brand-cyan-dark transition-all duration-200
                         shadow-cyan hover:shadow-none hover:-translate-y-0.5
                         min-w-[180px] text-center"
            >
              <span className="text-2xl">📩</span>
              <span className="text-base font-bold">Get in Touch</span>
              <span className="text-xs font-normal opacity-70">We respond within 24h</span>
            </Link>

            {/* Secondary — WhatsApp */}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hello%20Chabrin%2C%20I%20would%20like%20to%20discuss%20property%20management%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 px-8 py-5
                         rounded-2xl border-2 border-white/20 text-white font-bold
                         hover:border-white/50 hover:bg-white/5 transition-all duration-200
                         min-w-[180px] text-center"
            >
              <span className="text-2xl">💬</span>
              <span className="text-base font-bold">WhatsApp Us</span>
              <span className="text-xs font-normal opacity-50">Instant response</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
