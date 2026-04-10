import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import PropertiesHero from "@/components/sections/properties/PropertiesHero";
import PropertiesGrid from "@/components/sections/properties/PropertiesGrid";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Available Properties | Chabrin Agencies Limited",
  description:
    "Browse available residential and commercial properties managed by Chabrin Agencies across Nairobi, Kiambu, Murang'a, Kajiado and surrounding areas.",
};

export default async function PropertiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PropertiesHero />
      <PropertiesGrid />
    </>
  );
}
