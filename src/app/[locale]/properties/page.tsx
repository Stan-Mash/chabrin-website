import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import PropertiesHero from "@/components/sections/properties/PropertiesHero";
import SearchInterface from "@/components/sections/properties/SearchInterface";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Search Properties | Chabrin Agencies Limited",
  description:
    "Browse available residential and commercial properties managed by Chabrin Agencies across Nairobi, Kiambu, Murang'a and Kajiado. Filter by region, type, bedrooms and budget — with an interactive map.",
};

export default async function PropertiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PropertiesHero />
      <SearchInterface />
    </>
  );
}
