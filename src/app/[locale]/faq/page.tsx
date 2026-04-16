import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import FaqClient from "./FaqClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: `${t("hero_title")} | Chabrin Agencies Limited`,
    description: t("hero_subtitle"),
  };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "faq" });

  // Fetch all FAQ data server-side — the JSON arrays are typed as arrays of objects
  // next-intl's raw() helper lets us pull the full array
  const tenants = t.raw("tenants") as { q: string; a: string }[];
  const owners = t.raw("owners") as { q: string; a: string }[];
  const investors = t.raw("investors") as { q: string; a: string }[];

  const tabs = [
    { key: "tenants", label: t("tab_tenants"), items: tenants },
    { key: "owners",  label: t("tab_owners"),  items: owners  },
    { key: "investors", label: t("tab_investors"), items: investors },
  ];

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    locale === "sw"
      ? "Habari, nina swali kuhusu huduma za Chabrin."
      : "Hello, I have a question about Chabrin's services."
  )}`;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0D1B8E] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#00C9C9] text-xs font-bold uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            {t("hero_title")}
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("hero_subtitle")}
          </p>
        </div>
      </section>

      {/* ── Tabbed accordion ─────────────────────────────────────────────── */}
      <FaqClient tabs={tabs} />

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            {t("cta_title")}
          </h2>
          <p className="text-slate-500 text-base mb-8 max-w-xl mx-auto">
            {t("cta_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl
                         bg-[#0D1B8E] text-white font-bold text-sm hover:brightness-110 transition-all"
            >
              {t("cta_contact")}
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl
                         bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("cta_whatsapp")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
