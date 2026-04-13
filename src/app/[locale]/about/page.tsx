import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/AboutHero";
import Mission from "@/components/sections/about/Mission";
import Timeline from "@/components/sections/about/Timeline";
import Accreditations from "@/components/sections/about/Accreditations";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "About Us | Chabrin Agencies Limited",
  description: "Over 30 years of trusted property management across Nairobi, Kiambu, Murang'a, Kajiado, Machakos, and beyond. Learn about Chabrin Agencies.",
};

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
