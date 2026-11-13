import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

const LOCALES = ["en", "sw"] as const;

const CORRIDORS = {
  "cbd-kilimani": {
    name:          "CBD & Kilimani",
    zone:          "Premium CBD & Inner Ring",
    tagline:       "Nairobi's Premier Business and Residential Address",
    description:
      "The CBD and Kilimani corridor forms the commercial heart of Nairobi, anchored by Upper Hill, Kilimani, and the Central Business District. Office blocks, luxury apartments, and retail plazas are concentrated here, commanding some of the city's highest rents and strongest investor demand.",
    neighborhoods: ["Upper Hill", "Kilimani", "CBD", "Westlands", "Lavington"],
    propertyTypes: ["Grade A Offices", "Luxury Apartments", "Retail Spaces", "Mixed-Use Developments"],
    avgYield:      "5–7%",
    vacancy:       "~8%",
    seoKeywords:   "property management Kilimani, property management CBD Nairobi, office space Upper Hill",
  },
  "thika-road-ruiru": {
    name:          "Thika Road & Ruiru",
    zone:          "Northern Commuter Corridor",
    tagline:       "Kenya's Fastest-Growing Commuter Belt",
    description:
      "The Thika Road corridor stretches from Nairobi's Githurai junction through Ruiru and towards Thika town, serving a fast-growing population of young professionals and families priced out of the inner city. High-density apartments and gated communities dominate, with strong rental demand driven by proximity to the TICH and industrial zones.",
    neighborhoods: ["Githurai", "Kahawa", "Ruiru", "Juja", "Thika"],
    propertyTypes: ["High-Density Apartments", "Maisonettes", "Bedsitters", "Gated Communities"],
    avgYield:      "7–10%",
    vacancy:       "~5%",
    seoKeywords:   "property management Thika Road, property management Ruiru, rental apartments Githurai",
  },
  "kasarani-roysambu": {
    name:          "Kasarani & Roysambu",
    zone:          "Kasarani-Ruaraka Belt",
    tagline:       "Nairobi's Middle-Market Residential Hub",
    description:
      "Kasarani and Roysambu form a dense middle-class residential belt north of the CBD. Close to Moi International Sports Centre, Thika Road access, and emerging retail, this corridor attracts mid-income tenants and young families. Strong occupancy rates and stable returns make it a core corridor in Chabrin's managed portfolio.",
    neighborhoods: ["Kasarani", "Roysambu", "Ruaraka", "Zimmerman", "Clay City"],
    propertyTypes: ["Apartments", "Bedsitters", "Studio Units", "Town Houses"],
    avgYield:      "8–11%",
    vacancy:       "~6%",
    seoKeywords:   "property management Kasarani, rental apartments Roysambu, property management Ruaraka Nairobi",
  },
  "eastlands-embakasi": {
    name:          "Eastlands & Embakasi",
    zone:          "Inner East & Greater Eastlands",
    tagline:       "High-Volume Residential Management Across Nairobi East",
    description:
      "Eastlands and Embakasi encompass one of Nairobi's most populous residential areas, stretching from Makadara through Kayole, Umoja, and Embakasi village. Affordable rental units command high demand and rapid tenant turnaround. Proximity to Jomo Kenyatta International Airport and the Industrial Area makes this corridor strategically important for both residential and light-industrial tenants.",
    neighborhoods: ["Makadara", "Umoja", "Kayole", "Embakasi", "Fedha"],
    propertyTypes: ["Apartments", "Bedsitters", "Commercial Units", "Light Industrial"],
    avgYield:      "9–12%",
    vacancy:       "~5%",
    seoKeywords:   "property management Eastlands, property management Embakasi, rental apartments Umoja Nairobi",
  },
  "westlands-parklands": {
    name:          "Westlands & Parklands",
    zone:          "Westlands Professional District",
    tagline:       "Nairobi's International Business and Residential District",
    description:
      "Westlands and Parklands house Nairobi's highest concentration of international businesses, hotels, and premium residential developments. The area attracts expatriates, senior professionals, and corporate tenants who demand quality management, rapid response, and institutional-grade reporting. Chabrin's local expertise ensures full occupancy and high tenant satisfaction in this competitive corridor.",
    neighborhoods: ["Westlands", "Parklands", "Spring Valley", "Highridge", "Karura"],
    propertyTypes: ["Luxury Apartments", "Serviced Offices", "Commercial Plazas", "Executive Homes"],
    avgYield:      "5–7%",
    vacancy:       "~9%",
    seoKeywords:   "property management Westlands, property management Parklands Nairobi, luxury apartments Westlands",
  },
  "south-b-south-c": {
    name:          "South B & South C",
    zone:          "Inner Urban Residential",
    tagline:       "Established Mid-Market Residential Neighbourhoods",
    description:
      "South B and South C are established middle-class residential areas well connected to the CBD and industrial belt via Mombasa Road. Stable tenant profiles, low vacancy rates, and consistent demand from civil servants and private sector workers make these neighbourhoods a reliable pillar of Chabrin's residential portfolio.",
    neighborhoods: ["South B", "South C", "Bellevue", "Hazina", "Doonholm"],
    propertyTypes: ["Flats", "Maisonettes", "Commercial Shops", "Townhouses"],
    avgYield:      "8–10%",
    vacancy:       "~6%",
    seoKeywords:   "property management South B Nairobi, property management South C, rental flats South Nairobi",
  },
  "south-metro-airport": {
    name:          "South Metro & Airport",
    zone:          "Southern Metro and Airport Corridor",
    tagline:       "Logistics, Industrial, and Residential Gateway",
    description:
      "The Southern Metro corridor spans the Mombasa Road axis and areas surrounding Jomo Kenyatta International Airport, encompassing industrial parks, logistics hubs, and emerging residential estates in Athi River and surrounding Kajiado County. It is Chabrin's fastest-growing corridor, driven by manufacturing expansion, special economic zones, and demand for affordable employee housing.",
    neighborhoods: ["Athi River", "Mlolongo", "Syokimau", "Kitengela", "Mavoko"],
    propertyTypes: ["Warehouses", "Light Industrial", "Employee Housing", "Commercial Units"],
    avgYield:      "8–12%",
    vacancy:       "~7%",
    seoKeywords:   "property management Athi River, property management Syokimau, warehouse management Mombasa Road Nairobi",
  },
} as const;

type SlugKey = keyof typeof CORRIDORS;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const slug of Object.keys(CORRIDORS)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const corridor = CORRIDORS[slug as SlugKey];
  if (!corridor) return { title: "Not Found" };

  const base = siteConfig.url;
  return {
    title:       `${corridor.name} Property Management | Chabrin Agencies`,
    description: `${corridor.tagline}. ${corridor.description.slice(0, 155)}…`,
    keywords:    corridor.seoKeywords,
    alternates:  {
      canonical: `${base}/${locale}/corridors/${slug}`,
      languages: {
        en: `${base}/en/corridors/${slug}`,
        sw: `${base}/sw/corridors/${slug}`,
      },
    },
  };
}

export default async function CorridorPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const corridor = CORRIDORS[slug as SlugKey];
  if (!corridor) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest mb-8" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/60 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${locale}/properties`} className="hover:text-white/60 transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-white/50">{corridor.name}</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-4">
              {corridor.zone}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {corridor.name}
            </h1>
            <p className="text-white/60 text-xl leading-relaxed mb-8">
              {corridor.tagline}
            </p>

            {/* Key metrics */}
            <div className="flex flex-wrap gap-6">
              <div className="border border-white/15 bg-white/5 px-5 py-3">
                <p className="text-[9px] text-white/30 uppercase tracking-widest">Avg. Gross Yield</p>
                <p className="text-brand-cyan font-bold text-lg mt-0.5">{corridor.avgYield}</p>
              </div>
              <div className="border border-white/15 bg-white/5 px-5 py-3">
                <p className="text-[9px] text-white/30 uppercase tracking-widest">Vacancy Rate</p>
                <p className="text-white font-bold text-lg mt-0.5">{corridor.vacancy}</p>
              </div>
              <div className="border border-white/15 bg-white/5 px-5 py-3">
                <p className="text-[9px] text-white/30 uppercase tracking-widest">Neighbourhoods</p>
                <p className="text-white font-bold text-lg mt-0.5">{corridor.neighborhoods.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description + property types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-5">
                About This Corridor
              </h2>
              <p className="text-slate-500 leading-relaxed text-base mb-8">
                {corridor.description}
              </p>

              {/* Neighbourhoods */}
              <h3 className="text-sm font-bold text-brand-navy uppercase tracking-widest mb-4">
                Key Neighbourhoods
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {corridor.neighborhoods.map((n) => (
                  <span key={n} className="text-xs font-medium text-brand-navy border border-slate-200 px-3 py-1">
                    {n}
                  </span>
                ))}
              </div>

              {/* Property types */}
              <h3 className="text-sm font-bold text-brand-navy uppercase tracking-widest mb-4">
                Property Types We Manage
              </h3>
              <div className="space-y-2">
                {corridor.propertyTypes.map((pt, i) => (
                  <div key={pt} className="flex items-center gap-3">
                    <span className="text-[9px] font-mono font-bold text-slate-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm text-slate-600">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="bg-brand-navy p-8">
              <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-4">
                Property Owners
              </p>
              <h3 className="text-white font-bold text-xl mb-4 leading-tight">
                Let Chabrin Manage Your {corridor.name} Property
              </h3>
              <p className="text-white/55 text-sm leading-relaxed mb-6">
                We provide full-service property management in this corridor: tenant screening, rent collection, monthly reporting, and 24h response SLA.
              </p>
              <div className="space-y-3">
                <Link
                  href={`/${locale}/contact`}
                  className="flex items-center justify-center gap-2 w-full py-3
                             bg-brand-cyan text-brand-navy font-bold text-sm
                             hover:brightness-105 transition-all"
                >
                  Get Free Consultation
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/properties`}
                  className="flex items-center justify-center gap-2 w-full py-3
                             border border-white/20 text-white font-semibold text-sm
                             hover:border-white/40 transition-colors"
                >
                  Browse Available Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other corridors */}
      <section className="py-14 bg-surface border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
            Other Coverage Corridors
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(Object.entries(CORRIDORS) as [SlugKey, typeof CORRIDORS[SlugKey]][])
              .filter(([s]) => s !== slug)
              .map(([s, c]) => (
                <Link
                  key={s}
                  href={`/${locale}/corridors/${s}`}
                  className="p-4 border border-slate-200 bg-white hover:border-brand-cyan/40
                             hover:bg-surface transition-colors group"
                >
                  <p className="text-xs font-bold text-brand-navy group-hover:text-brand-cyan transition-colors leading-snug">
                    {c.name}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wide">
                    {c.avgYield} yield
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
