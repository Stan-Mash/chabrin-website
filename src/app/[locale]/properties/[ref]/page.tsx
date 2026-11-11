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
                  <svg className="w-20 h-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
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
                  <svg className="w-6 h-6 text-brand-navy flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                  <div>
                    <p className="text-xs text-slate-500">Call Us</p>
                    <p className="text-brand-navy font-semibold">{siteConfig.contact.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-surface hover:bg-brand-navy/5 transition-colors"
                >
                  <svg className="w-6 h-6 text-brand-navy flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
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
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
