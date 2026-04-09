import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesList from "@/components/sections/services/ServicesList";
import Process from "@/components/sections/services/Process";
import ServicesCTA from "@/components/sections/services/ServicesCTA";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Our Services | Chabrin Agencies Limited",
  description: "Property management, leasing, valuation and facilities management services across Nairobi by Chabrin Agencies.",
};

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <Process />
      <ServicesCTA />
    </>
  );
}
