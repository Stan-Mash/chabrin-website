import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import PropertiesHero from "@/components/sections/properties/PropertiesHero";
import SearchInterface from "@/components/sections/properties/SearchInterface";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Search Properties",
    description: "Browse available residential and commercial properties managed by Chabrin Agencies across Nairobi, Kiambu, Murang'a, Kajiado, Machakos and beyond. Filter by region, type, bedrooms and budget - with an interactive map.",
    alternates: { canonical: `https://www.chabrinagencies.com/${locale}/properties` },
  };
}

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
