import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/AboutHero";
import Mission from "@/components/sections/about/Mission";
import Timeline from "@/components/sections/about/Timeline";
import Leadership from "@/components/sections/about/Leadership";
import Accreditations from "@/components/sections/about/Accreditations";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "About Us | Chabrin Agencies Limited",
  description: "Over 15 years of trusted property management in Nairobi. Meet the team behind Chabrin Agencies.",
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <AboutHero />
      <Mission />
      <Timeline />
      <Leadership />
      <Accreditations />
    </>
  );
}
