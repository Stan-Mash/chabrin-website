import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { OrganizationSchema } from "@/components/layout/StructuredData";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "property management Kenya",
    "property management Nairobi",
    "property management Kiambu",
    "rental properties Kenya",
    "Chabrin Agencies",
    "real estate Kenya",
    "property leasing Nairobi",
    "property management Kajiado",
    "property management Muranga",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_KE",
    alternateLocale: "sw_KE",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg",    type: "image/svg+xml" },
      { url: "/icon.png",    type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1B8E",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Call headers() to opt into dynamic rendering so Next.js reads x-nonce
  // from the response headers and stamps its inline hydration scripts.
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html
      suppressHydrationWarning
      className={cn("h-full antialiased", plusJakartaSans.variable)}
    >
      <head>
        <OrganizationSchema nonce={nonce} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface text-brand-navy">
        {children}
      </body>
    </html>
  );
}
