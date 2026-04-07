import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Locale } from "@/types";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("hero");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-navy text-white px-6">
      <div className="text-center max-w-2xl">
        {/* Logo placeholder */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-brand-cyan flex items-center justify-center">
            <span className="font-bold text-brand-navy text-lg">CAL</span>
          </div>
          <div className="text-left">
            <p className="font-bold text-xl tracking-wide">CHABRIN AGENCIES</p>
            <p className="text-brand-cyan text-sm font-semibold tracking-widest">LIMITED</p>
          </div>
        </div>

        {/* Coming soon message */}
        <p className="text-brand-cyan text-sm font-semibold tracking-widest uppercase mb-4">
          {t("tagline")}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          {t("headline")}
        </h1>
        <p className="text-white/70 text-lg leading-relaxed mb-10">
          {t("subheadline")}
        </p>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          Website launching soon
        </div>
      </div>
    </main>
  );
}
