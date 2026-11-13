import { getTranslations } from "next-intl/server";
import Link from "next/link";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";
import { setRequestLocale } from "next-intl/server";

const SLA_CONFIGS = [
  { key: "emergency" as const, colour: "#dc2626", bg: "rgba(220,38,38,0.12)" },
  { key: "urgent"    as const, colour: "#ea580c", bg: "rgba(234,88,12,0.12)" },
  { key: "routine"   as const, colour: "#2563eb", bg: "rgba(37,99,235,0.12)" },
  { key: "enquiry"   as const, colour: "#7c3aed", bg: "rgba(124,58,237,0.12)" },
];

type Props = { locale: string };

export default async function ComplaintsHero({ locale }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("complaints");

  return (
    <section className="relative bg-[#0D1B8E] overflow-hidden" aria-labelledby="complaints-hero-heading">

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-8 h-0.5 bg-[#00C9C9]" aria-hidden="true" />
          <span className="text-[#00C9C9] text-xs font-bold tracking-widest uppercase">
            {t("eyebrow")}
          </span>
        </div>

        {/* Headline */}
        <h1
          id="complaints-hero-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-2xl"
        >
          <AnimatedHeadline text={t("hero_heading")} as="span" />
        </h1>
        <p className="text-white/65 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
          {t("hero_subtitle")}
        </p>

        {/* Two CTAs */}
        <div className="flex flex-wrap gap-3 mb-12">
          <a
            href="#submit"
            className="px-6 py-3 rounded-full bg-[#00C9C9] text-[#0D1B8E] font-bold text-sm
                       hover:bg-[#00b3b3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C9C9]/50"
          >
            {t("cta_submit")}
          </a>
          <a
            href="#status"
            className="px-6 py-3 rounded-full border-2 border-white/30 text-white font-semibold
                       text-sm hover:border-white/60 hover:bg-white/10 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {t("cta_track")}
          </a>
        </div>

        {/* SLA grid */}
        <div>
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-4">
            {t("sla_title")}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SLA_CONFIGS.map(({ key, colour, bg }) => (
              <div
                key={key}
                className="rounded-xl p-4"
                style={{ background: bg, border: `1px solid ${colour}30` }}
              >
                <p
                  className="text-xs font-extrabold tracking-widest uppercase mb-2"
                  style={{ color: colour }}
                >
                  {t(`sla_${key}_priority`)}
                </p>
                <p className="text-white text-sm font-bold leading-snug mb-0.5">
                  {t("sla_response_label")} {t(`sla_${key}_response`)}
                </p>
                <p className="text-white/55 text-xs mb-2">
                  {t("sla_resolved_label")} {t(`sla_${key}_resolution`)}
                </p>
                <p className="text-white/35 text-[10px] leading-snug italic">
                  {t(`sla_${key}_example`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust note */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <svg className="w-3.5 h-3.5 text-[#00C9C9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t("trust_ref")}
          </span>
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <svg className="w-3.5 h-3.5 text-[#00C9C9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t("trust_email")}
          </span>
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <svg className="w-3.5 h-3.5 text-[#00C9C9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t("trust_kdpa")}
          </span>
          <Link
            href={`/${locale}/privacy-policy`}
            className="text-[#00C9C9]/60 text-xs hover:text-[#00C9C9] transition-colors underline underline-offset-2"
          >
            {t("trust_privacy")}
          </Link>
        </div>
      </div>
    </section>
  );
}
