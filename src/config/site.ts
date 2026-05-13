/**
 * Global site configuration.
 * Update these values when deploying to production.
 */
export const siteConfig = {
  name: "Chabrin Agencies Limited",
  shortName: "Chabrin",
  description:
    "Premier property management, leasing, and valuation services across Nairobi, Kiambu, Murang'a, Kajiado, and beyond.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://chabrinagencies.com",
  ogImage: "/og-image.png",
  locale: {
    default: "en",
    supported: ["en", "sw"],
  },
  contact: {
    email: "kimathiw@chabrinagencies.co.ke",
    careersEmail: "careers@chabrinagencies.co.ke",
    phone: "+254 720 854 389",
    phone2: "+254 745 912 688",
    whatsapp: "254720854389",
    address: "Nacico Plaza, 5th Floor, Room 517, Landhies Road, Nairobi",
    pobox: "P.O Box 16659-00620, Nairobi",
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
