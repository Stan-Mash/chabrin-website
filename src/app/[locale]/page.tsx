import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/types";
import Hero       from "@/components/sections/Hero";
import StatsBar   from "@/components/sections/StatsBar";
import Services   from "@/components/sections/Services";
import WhyChabrin from "@/components/sections/WhyChabrin";
import CTABanner  from "@/components/sections/CTABanner";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isSwahili  = locale === "sw";

  return {
    title: isSwahili
      ? "Usimamizi wa Mali Nairobi | Chabrin Agencies Limited"
      : "Premier Property Management Nairobi | Chabrin Agencies Limited",
    description: isSwahili
      ? "Huduma za usimamizi wa mali, upangaji na tathmini Nairobi. Chabrin Agencies."
      : "Professional property management, leasing and valuation services across Nairobi. Trusted by 500+ landlords.",
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <StatsBar />
      <Services />
      <WhyChabrin />
      <CTABanner />
    </>
  );
}
