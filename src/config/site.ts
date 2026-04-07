/**
 * Global site configuration.
 * Update these values when deploying to production.
 */
export const siteConfig = {
  name: "Chabrin Agencies Limited",
  shortName: "Chabrin",
  description:
    "Premier property management, leasing, and valuation services in Nairobi, Kenya.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://chabrinagencies.com",
  ogImage: "/og-image.png",
  locale: {
    default: "en",
    supported: ["en", "sw"],
  },
  contact: {
    email: "info@chabrinagencies.com",
    phone: "+254 700 000 000", // Update with real number
    whatsapp: "+254700000000",  // Update with real number (no spaces/dashes)
    address: "Nairobi, Kenya",
  },
  social: {
    facebook: "https://facebook.com/chabrinagencies",
    instagram: "https://instagram.com/chabrinagencies",
    linkedin: "https://linkedin.com/company/chabrin-agencies",
    twitter: "https://twitter.com/chabrinagencies",
  },
  brand: {
    navy: "#0D1B8E",
    cyan: "#00C9C9",
  },
} as const;

export type SiteConfig = typeof siteConfig;
