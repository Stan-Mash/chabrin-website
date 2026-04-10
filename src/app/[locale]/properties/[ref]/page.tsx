import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { getListingByReference } from "@/db/queries/listings";
import { PropertySchema } from "@/components/layout/StructuredData";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ locale: string; ref: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ref } = await params;
  const listing = await getListingByReference(ref);

  if (!listing) {
    return { title: "Property Not Found" };
  }

  const title = `${listing.title} - ${listing.zone} | Chabrin Agencies`;
  const description = `${listing.title} in ${listing.area}, ${listing.zone}. ${listing.bedrooms || 0} bed${listing.bathrooms ? `, ${listing.bathrooms}` : ""} bath. KES ${listing.rent_kes.toLocaleString()}/month`;
  const propertyImage = listing.images?.[0] || siteConfig.ogImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.url}/properties/${ref}`,
      images: [{ url: propertyImage, width: 1200, height: 630, alt: listing.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [propertyImage],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { locale, ref } = await params;
  setRequestLocale(locale);

  const listing = await getListingByReference(ref);

  if (!listing) {
    notFound();
  }

  const isCommercial = listing.property_type === "office" || listing.property_type === "retail";
  const formattedPrice = listing.rent_kes.toLocaleString("en-US");

  return (
    <main className="min-h-screen bg-surface">
      <PropertySchema
        reference={listing.reference}
        title={listing.title}
        description={`${listing.bedrooms || 0} bedroom property in ${listing.area}`}
        price={listing.rent_kes}
        deposit={listing.deposit_kes}
        bedrooms={listing.bedrooms}
        bathrooms={listing.bathrooms}
        sizeM2={listing.size_m2}
        zone={listing.zone}
        area={listing.area}
        image={listing.images?.[0]}
        updatedAt={listing.updated_at}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href={`/${locale}`} className="hover:text-brand-navy">
            Home
          </Link>
          <span>/</span>
          <Link href={`/${locale}/properties`} className="hover:text-brand-navy">
            Properties
          </Link>
          <span>/</span>
          <span className="text-brand-navy font-medium">{listing.title}</span>
        </div>

        {/* Gallery section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main image */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl overflow-hidden shadow-card h-96 lg:h-[500px]">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <span className="text-6xl opacity-20">🏠</span>
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {listing.images.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-20">
              <div className="mb-6">
                <p className="text-slate-500 text-sm mb-1">Reference</p>
                <p className="text-brand-navy font-bold text-lg">{listing.reference}</p>
              </div>

              <div className="mb-6">
                <p className="text-slate-500 text-sm mb-1">Property Type</p>
                <p className="text-brand-navy font-semibold capitalize">{listing.property_type}</p>
              </div>

              <div className="mb-8">
                <p className="text-slate-500 text-sm mb-2">Monthly Rent</p>
                <p className="text-3xl font-extrabold text-brand-navy">KES {formattedPrice}</p>
                <p className="text-xs text-slate-400 mt-1">+ KES {listing.deposit_kes.toLocaleString()} deposit</p>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/${locale}/contact?ref=${listing.reference}`}
                  className="block w-full text-center py-3 rounded-full bg-brand-navy text-white font-bold
                           hover:bg-brand-navy-dark transition-colors"
                >
                  Make an Inquiry
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                    `Hi, I'm interested in ${listing.reference} - ${listing.title} in ${listing.area}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 rounded-full bg-green-500 text-white font-bold
                           hover:bg-green-600 transition-colors"
                >
                  WhatsApp
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Location</p>
                  <p className="text-brand-navy font-medium">
                    {listing.area}, {listing.zone}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Status</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-card mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-6">Property Details</h2>

              <div className="grid grid-cols-3 gap-6 mb-8">
                {!isCommercial && listing.bedrooms !== null && listing.bedrooms > 0 && (
                  <div className="p-4 bg-surface rounded-xl text-center">
                    <p className="text-3xl font-bold text-brand-navy">{listing.bedrooms}</p>
                    <p className="text-sm text-slate-500 mt-1">Bedrooms</p>
                  </div>
                )}
                {listing.bathrooms !== null && (
                  <div className="p-4 bg-surface rounded-xl text-center">
                    <p className="text-3xl font-bold text-brand-navy">{listing.bathrooms}</p>
                    <p className="text-sm text-slate-500 mt-1">{isCommercial ? "WCs" : "Bathrooms"}</p>
                  </div>
                )}
                {listing.size_m2 !== null && (
                  <div className="p-4 bg-surface rounded-xl text-center">
                    <p className="text-3xl font-bold text-brand-navy">{listing.size_m2}</p>
                    <p className="text-sm text-slate-500 mt-1">m²</p>
                  </div>
                )}
              </div>

              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-4">Features</h3>
                  <ul className="grid grid-cols-2 gap-3">
                    {listing.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Description placeholder */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">About This Property</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                This {listing.property_type === "apartment" ? "well-maintained apartment" : "beautiful property"} is located in
                the heart of {listing.area}, {listing.zone}. It offers excellent value for money and is perfect for families or
                professionals looking for quality accommodation.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The property is managed by Chabrin Agencies Limited, a trusted property management company with over a decade of
                experience managing properties across Nairobi and surrounding regions.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-96">
              <h3 className="text-lg font-bold text-brand-navy mb-4">Contact Agent</h3>
              <p className="text-slate-600 text-sm mb-6">
                Have questions about this property? Contact Chabrin Agencies today.
              </p>

              <div className="space-y-4">
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-surface hover:bg-brand-navy/5 transition-colors"
                >
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-xs text-slate-500">Call Us</p>
                    <p className="text-brand-navy font-semibold">{siteConfig.contact.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-surface hover:bg-brand-navy/5 transition-colors"
                >
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-brand-navy font-semibold text-sm">{siteConfig.contact.email}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors border border-green-200"
                >
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-xs text-green-600">WhatsApp</p>
                    <p className="text-green-700 font-semibold">Chat Now</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
