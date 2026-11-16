import { getTranslations } from "next-intl/server";
import Link from "next/link";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";
import { setRequestLocale } from "next-intl/server";

type Props = { locale: string };

export default async function ComplaintsHero({ locale }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("complaints");

  return (
    <section className="relative bg-brand-navy overflow-hidden" aria-labelledby="complaints-hero-heading">

      {/* Dot-grid background */}
      <div aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: Editorial header */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-8 h-0.5 bg-brand-cyan" aria-hidden="true" />
              <span className="text-brand-cyan text-xs font-bold tracking-widest uppercase">
                {t("eyebrow")}
              </span>
            </div>

            <h1
              id="complaints-hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-xl"
            >
              <AnimatedHeadline text={t("hero_heading")} as="span" />
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              {t("hero_subtitle")}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#submit"
                className="px-6 py-3 rounded-full bg-brand-cyan text-brand-navy font-bold text-sm
                           hover:brightness-105 transition-all focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
              >
                {t("cta_submit")}
              </a>
              <a
                href="#status"
                className="px-6 py-3 rounded-full border-2 border-white/30 text-white font-semibold
                           text-sm hover:border-white/60 hover:bg-white/5 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                {t("cta_track")}
              </a>
            </div>
          </div>

          {/* Right: Commitment card */}
          <div className="border border-white/15 bg-white/[0.03] rounded-2xl p-6">
            <p className="text-brand-cyan text-xs font-bold tracking-widest uppercase mb-4">
              Our Commitment
            </p>
            <div className="space-y-4">
              {[
                { icon: "shield", label: "Every complaint is logged", desc: "You receive a unique reference number immediately on submission." },
                { icon: "clock", label: "Acknowledged & assigned", desc: "Our team reviews every submission and assigns it to the right team member." },
                { icon: "check", label: "Resolved & reported", desc: "We follow up with a resolution summary and ask for your feedback." },
              ].map(({ label, desc }) => (
                <div key={label} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-cyan/20 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold leading-snug">{label}</p>
                    <p className="text-white/45 text-xs mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-1.5 text-white/40 text-xs">
                <svg className="w-3.5 h-3.5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t("trust_ref")}
              </span>
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-brand-cyan/60 text-xs hover:text-brand-cyan transition-colors underline underline-offset-2"
              >
                {t("trust_privacy")}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
