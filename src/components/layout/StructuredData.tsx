"use client";

import { siteConfig } from "@/config/site";

/**
 * Structured data (JSON-LD) components for SEO.
 * Helps search engines understand page content and display rich results.
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

/**
 * Organization schema for homepage and global metadata.
 * Identifies Chabrin Agencies to search engines.
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo-wordmark.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    foundingDate: "2020",
    areaServed: [
      {
        "@type": "City",
        name: "Nairobi",
        addressCountry: "KE",
      },
      {
        "@type": "City",
        name: "Kiambu",
        addressCountry: "KE",
      },
      {
        "@type": "City",
        name: "Murang'a",
        addressCountry: "KE",
      },
      {
        "@type": "City",
        name: "Kajiado",
        addressCountry: "KE",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressLocality: "Nairobi",
      addressRegion: "Nairobi",
      postalCode: "00620",
      addressCountry: "KE",
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      language: ["en", "sw"],
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Property listing schema for property detail pages.
 * Displays rich results in search with price, location, features.
 */
export function PropertySchema({
  reference,
  title,
  description,
  price,
  deposit,
  bedrooms,
  bathrooms,
  sizeM2,
  zone,
  area,
  image,
  updatedAt,
}: {
  reference: string;
  title: string;
  description: string;
  price: number;
  deposit: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sizeM2?: number | null;
  zone: string;
  area: string;
  image?: string;
  updatedAt: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    url: `${siteConfig.url}/en/properties/${reference}`,
    name: title,
    description,
    image: image || `${siteConfig.url}${siteConfig.ogImage}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: area,
      addressRegion: zone,
      addressCountry: "KE",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: price.toString(),
      availability: "https://schema.org/InStoreOnly",
    },
    numberOfRooms: bedrooms || 0,
    numberOfBedrooms: bedrooms || 0,
    numberOfBathroomsUnitText: bathrooms?.toString() || "1",
    floorSize: sizeM2
      ? {
          "@type": "QuantitativeValue",
          value: sizeM2.toString(),
          unitCode: "MTK",
        }
      : undefined,
    dateModified: updatedAt,
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/en/contact?ref=${reference}`,
        actionPlatform: ["DesktopWebPlatform", "MobileWebPlatform"],
      },
      result: {
        "@type": "Reservation",
        name: "Property Inquiry",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb schema for navigation hierarchy.
 * Shows breadcrumbs in search results and helps SEO.
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQ schema for common questions.
 * Displays FAQ rich results in search.
 */
export function FAQSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
