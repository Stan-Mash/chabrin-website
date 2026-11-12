import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/AboutHero";
import Mission from "@/components/sections/about/Mission";
import Timeline from "@/components/sections/about/Timeline";
import Accreditations from "@/components/sections/about/Accreditations";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "About Us",
    description: "Over 30 years of trusted property management across Nairobi, Kiambu, Murang'a, Kajiado, Machakos, and beyond. Learn about Chabrin Agencies.",
    alternates: { canonical: `https://www.chabrinagencies.com/${locale}/about` },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <AboutHero />
      <Mission />
      <Timeline />
      <Accreditations />
    </>
  );
}
