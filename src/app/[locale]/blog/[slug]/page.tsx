import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/sanity/queries/blog";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

// ── Static fallback articles ──────────────────────────────────────────────────

const ARTICLES: Record<string, { title: string; category: string; publishedAt: string; readTime: string; body: string }> = {
  "understanding-lease-agreements-kenya": {
    title: "Understanding Lease Agreements in Kenya: What Every Landlord Needs to Know",
    category: "Landlord Guide",
    publishedAt: "2026-03-01",
    readTime: "6 min read",
    body: `
A lease agreement is the foundation of every landlord-tenant relationship in Kenya. Yet many landlords treat it as a formality - a document signed once and filed away. This is a costly mistake. A well-drafted lease protects your rental income, defines your rights, and reduces the risk of costly disputes.

## What Makes a Lease Agreement Legally Binding in Kenya?

Under the Law of Contract Act (Cap 23), a valid contract requires offer, acceptance, consideration, and capacity. For a residential lease, the consideration is the rent paid in exchange for the right to occupy. Leases for a term exceeding three years must be executed as a deed and registered under the Registration of Titles Act, though most residential tenancies run month-to-month or on a one-year basis and do not require registration.

The Landlord and Tenant (Shops, Hotels and Catering Establishments) Act (Cap 301) applies primarily to commercial premises. Residential tenancies are governed by common law principles and the Distress for Rent Act.

## Key Clauses Every Kenyan Lease Must Include

**1. Identification of parties.** Full legal names of the landlord (or property manager on their behalf) and all adult tenants. Using initials or nicknames creates enforcement problems.

**2. Property description.** The unit number, floor, and building name. Under Kenya's KRA eRITS privacy rules, do not include land reference numbers or GPS coordinates in documents shared with tenants.

**3. Term and commencement.** State the start date and whether the tenancy is fixed-term (e.g., one year) or periodic (month-to-month). A fixed-term lease gives the landlord certainty of income; a periodic tenancy is easier to end if the tenant proves troublesome.

**4. Rent amount and payment terms.** State the monthly rent in Kenya Shillings. Avoid foreign-currency denominations unless both parties are domiciled abroad - the Central Bank of Kenya discourages KES-to-USD conversions in domestic leases. Specify the due date (typically the 1st of the month), grace period (usually five days), and late-payment fee.

**5. Security deposit.** The standard market practice in Nairobi is one to three months' rent as a deposit. The lease must state the deposit amount, the conditions under which it may be retained, and the timeline for its return after the tenancy ends (typically 30 days).

**6. Permitted use.** Residential properties should state "residential use only." Allowing commercial activity without updating the lease - and potentially the building's occupancy permit - creates liability.

**7. Maintenance obligations.** Who is responsible for routine maintenance (tenant) versus structural repairs (landlord)? In Kenya, landlords are generally responsible for maintaining the structure and ensuring habitable conditions. Tenants are responsible for minor repairs and cleanliness.

**8. Subletting restrictions.** Most Kenyan leases prohibit subletting without the landlord's written consent. Airbnb-style short-term lets have proliferated in Nairobi; without an express prohibition, enforcement is difficult.

**9. Notice periods.** The minimum notice required to end a periodic tenancy in Kenya is typically one rental period (one month for a monthly tenancy). Fixed-term leases require no notice - they expire automatically.

**10. Dispute resolution.** Specify whether disputes go to the Business Premises Rent Tribunal, the Magistrate's Court, or private arbitration. For commercial premises, the Tribunal is mandatory under Cap 301.

## Common Mistakes Kenyan Landlords Make

**Using a template from the internet.** South African or British lease templates circulate widely online. They reference legislation that does not exist in Kenya and omit clauses specific to Kenyan practice (e.g., KDPA consent for personal data processing).

**Not registering long-term leases.** Leases exceeding three years must be registered to be enforceable against third parties. An unregistered long-term lease is valid between the parties but cannot be enforced against a subsequent purchaser.

**Vague rent-escalation clauses.** "Rent shall be reviewed annually" without specifying the method (CPI-linked, fixed percentage, or mutual agreement) leads to disputes. Tie increases to the Kenya National Bureau of Statistics' CPI where possible.

**No KDPA consent clause.** The Kenya Data Protection Act 2019 requires landlords to obtain explicit consent before collecting and processing tenants' personal data (national ID numbers, KRA PIN, payslips). Your lease should include a data consent clause referencing your Privacy Policy.

## Working with a Professional Property Manager

Chabrin Agencies Limited drafts and reviews lease agreements for all managed properties, ensuring compliance with current Kenyan law and including KDPA-compliant data consent clauses. We also maintain a register of all tenancies and renewal dates, so no lease lapses unnoticed.

If you manage your property independently, we recommend having your lease reviewed by a registered advocate or a reputable property management firm before the first tenancy commences.
    `.trim(),
  },
  "nairobi-rental-market-2026": {
    title: "Nairobi Rental Market Update 2026: Zones to Watch",
    category: "Market Insights",
    publishedAt: "2026-02-01",
    readTime: "8 min read",
    body: `
Nairobi's rental market entered 2026 in a state of selective buoyancy. While the broader economy grappled with elevated interest rates and a weakened shilling, specific micro-markets within the city posted occupancy rates above 92 percent. Understanding where demand is concentrated - and why - is the difference between a fully-let portfolio and one with chronic vacancies.

## The Big Picture: Supply Outpacing Demand in Some Zones

According to data from the Kenya National Bureau of Statistics and Knight Frank's Africa Report, Nairobi's formal residential stock grew by approximately 14,000 units in 2025, primarily in the mid-market segment (KES 25,000 to KES 65,000 per month). This supply addition has softened rents in historically tight markets such as Kilimani and Lavington, where average two-bedroom rents declined by 4 to 6 percent year-on-year.

By contrast, the affordable segment (below KES 20,000 per month) in peripheral zones such as Kahawa Wendani, Ruiru, and Juja remains severely undersupplied. Vacancy rates in these areas are under 3 percent, and landlords who have invested in security infrastructure and reliable water supply are commanding rent premiums of 10 to 15 percent over comparable units.

## Five Zones Showing Strong Demand in 2026

**1. Ruaka and Banana Hill.** The northward expansion of Nairobi's tech corridor - anchored by companies relocating from the CBD and Westlands to avoid traffic congestion - has driven demand for two- and three-bedroom apartments. Proximity to Limuru Road and the Northern Bypass makes Ruaka attractive to professionals employed in Westlands and Gigiri. Average two-bedroom rents: KES 35,000 to KES 55,000.

**2. Syokimau and Mlolongo.** The SGR commuter rail has fundamentally changed the calculus for tenants willing to live further from the CBD. The 25-minute journey from Syokimau to Nairobi Central Station has made this corridor viable for professionals who previously had to live closer to the city. Supply remains constrained by limited serviced land, keeping vacancy below 5 percent. Average two-bedroom rents: KES 28,000 to KES 45,000.

**3. Embakasi and Utawala.** The Zone 3 expansion has seen significant infrastructure investment. The Eastern Bypass connectivity and proximity to the JKIA industrial zone have attracted logistics and manufacturing employees. Demand for one-bedroom units is particularly strong. Average one-bedroom rents: KES 15,000 to KES 25,000.

**4. Githurai 44 and 45.** Despite a reputation for high-density informal housing, the formal market in Githurai has matured significantly. Landlords who invested in gated compounds with backup power and borehole water are reporting full occupancy. This zone serves as the entry point for Nairobi's lower-middle-income rental market.

**5. South C and South B.** These established middle-income zones continue to demonstrate resilience. The recently completed interchange at Mombasa Road has reduced commute times to Westlands and Upper Hill, re-igniting tenant interest. Established social infrastructure (schools, hospitals, shopping) makes these zones attractive to families.

## What Tenants Are Prioritising in 2026

Our data from enquiries handled through Chabrin Agencies shows three non-negotiables for Nairobi tenants in 2026:

**Reliable water supply.** Power outages are managed through solar backup, but water scarcity - particularly in estates on the outer ring - remains the single biggest deterrent. Landlords with functioning boreholes or large storage capacity command a clear premium.

**Security.** Perimeter walls, controlled access, and CCTV are table stakes. Tenants in the KES 30,000 and above segment increasingly expect manned security.

**Fibre internet connectivity.** Remote and hybrid work has made fast internet as essential as running water. Buildings with existing Safaricom Home Fibre or Zuku infrastructure let significantly faster than those without.

## Rental Yield Outlook

Gross rental yields across Nairobi averaged 5.8 percent in 2025, down from 6.4 percent in 2023, reflecting the appreciation in land and construction costs. Net yields (after management fees, maintenance, and voids) averaged 4.2 percent.

The zones showing the strongest yield compression - Kilimani, Westlands, Lavington - are oversupplied at the top of the market. Investors seeking yield over capital appreciation should focus on the affordable mid-market in emerging zones.

For landlords seeking a detailed yield analysis of their existing portfolio or guidance on acquisition targets, our valuation team is available for consultations.
    `.trim(),
  },
  "tenant-rights-kenya": {
    title: "Know Your Rights as a Tenant in Kenya",
    category: "Tenant Guide",
    publishedAt: "2026-01-01",
    readTime: "5 min read",
    body: `
Many tenants in Kenya endure illegal practices by landlords simply because they do not know what the law entitles them to. Understanding your rights is the first step to asserting them - and to resolving disputes without escalation.

## The Legal Framework for Residential Tenancies

Residential tenancies in Kenya are governed primarily by common law principles and two statutes:

**The Distress for Rent Act (Cap 293)** regulates a landlord's right to distrain (seize) a tenant's goods for unpaid rent. Crucially, it limits what can be distrained (exempt goods include clothing, bedding, and tools of trade) and requires a court order for certain categories of property.

**The Landlord and Tenant (Shops, Hotels and Catering Establishments) Act (Cap 301)** applies to commercial premises but is frequently cited in residential disputes regarding controlled tenancies.

For most residential tenants, the practical protection comes from common law implied terms and the Constitution of Kenya 2010, which recognises the right to housing as a social and economic right.

## Your Core Rights as a Residential Tenant

**1. Right to a habitable property.** The landlord has an implied duty to ensure the property is fit for human habitation at the commencement of the tenancy and to maintain it in that condition. This includes a structurally sound roof, working plumbing, and safe electrical installations.

**2. Right to quiet enjoyment.** Once you have paid your rent, the landlord cannot enter the property without reasonable notice (generally 24 to 48 hours in writing) except in a genuine emergency. Entering your home unannounced, cutting utilities to force you out, or removing fixtures to make the property uninhabitable are all unlawful.

**3. Right to a receipt.** You are entitled to a written receipt for every rent payment. Keep these - they are your primary evidence in any dispute about payment history.

**4. Right to notice before eviction.** A landlord cannot evict you without following the legal process. For a periodic tenancy (month-to-month), the landlord must give notice equal to one rental period. For non-payment of rent, the landlord must serve a formal demand before commencing eviction proceedings.

**5. Right to your security deposit.** Your deposit must be returned within a reasonable time (typically 30 days) after the tenancy ends, minus any legitimate deductions for damage beyond normal wear and tear. The landlord cannot retain the deposit for pre-existing damage or general cleaning.

**6. Right to data protection.** Under the Kenya Data Protection Act 2019, any personal data you provide to a landlord or property manager (national ID, KRA PIN, employment details) must be collected with your consent, used only for the stated purpose, and kept securely. You have the right to access your data and to request its deletion after the tenancy ends.

## Unlawful Practices to Watch Out For

**Self-help eviction.** Changing the locks, removing your belongings, or cutting utilities to force you to leave are all illegal. If this happens to you, report it to the nearest police station and seek legal advice from the Legal Aid Centre of Eldoret (LACE), the Kituo cha Sheria, or a private advocate.

**Excessive rent increases without notice.** Rent increases must be notified in advance (minimum one rental period) and cannot take effect mid-lease. Any increase that does not follow the lease terms or reasonable notice requirements can be challenged.

**Withholding of deposit without justification.** If your landlord refuses to return your deposit without itemising the deductions and providing evidence of the damage caused, you can file a claim in the Magistrate's Court (for amounts below KES 1 million) or the High Court.

## Raising a Complaint

If you are a tenant in a property managed by Chabrin Agencies Limited, our complaints portal at [/complaints](/complaints) allows you to submit a formal complaint and track its resolution. You will receive a reference number within minutes and a response within our published SLA.

For landlord-tenant disputes beyond our managed portfolio, the resources available include the Business Premises Rent Tribunal (for commercial tenants under Cap 301), the Magistrate's Court, and the Office of the Ombudsman.

Understanding your rights does not mean being adversarial - most disputes are resolved through clear communication. But knowing what you are entitled to ensures the conversation starts from an informed position.
    `.trim(),
  },
  "property-valuation-guide": {
    title: "How Property Valuations Work in Kenya - and Why They Matter",
    category: "Valuation",
    publishedAt: "2025-12-01",
    readTime: "7 min read",
    body: `
A property valuation is an independent, professional assessment of a property's market value at a specific point in time. In Kenya, valuations are required for mortgage applications, estate administration, company accounts, insurance, compulsory acquisition, and rental assessments. Yet many property owners treat them as a bureaucratic hurdle rather than a strategic tool.

Understanding what goes into a valuation - and how to maximise your property's assessed value - can make a material difference to your financial outcomes.

## Who Can Conduct a Valuation in Kenya?

Under the Valuers Act (Cap 532), only registered valuers may issue valuation reports in Kenya. The registration authority is the Valuers Registration Board (VRB), which operates under the Ministry of Lands. Any valuation report issued by an unregistered person carries no legal standing.

Registered valuers use the designations MISK (Member of the Institution of Surveyors of Kenya) or FISK (Fellow). When commissioning a valuation, always verify the valuer's VRB registration number.

Chabrin Agencies works with VRB-registered valuers for all rental and investment assessments. Where a full statutory valuation is required (e.g., for a mortgage), we can refer you to qualified professionals.

## The Three Primary Valuation Methods

**1. The Comparable Sales Method (Market Approach)**

The most widely used method for residential properties. The valuer identifies recent sales of comparable properties in the same area and adjusts for differences in size, condition, location, and amenities.

The reliability of this method depends on market transparency. In Nairobi, transaction data is not fully public, which means valuers must draw on their own transaction databases, the Kenya Property Developers Association data, and professional networks. This is why local market knowledge is so important - a valuer from outside Nairobi may apply inappropriate comparables.

**2. The Income Approach (Investment Method)**

Used for income-producing properties: rental apartments, commercial buildings, and mixed-use developments. The valuer capitalises the net annual income at a yield rate appropriate for the property type and location.

The formula is: **Value = Net Annual Income / Capitalisation Rate**

If a property generates KES 600,000 per year in net rental income and the market capitalisation rate for that property type and location is 6%, the assessed value is KES 10 million.

The capitalisation rate is derived from market evidence of yields on similar properties. It reflects the risk profile of the investment: a beachfront holiday let in Diani carries a different risk (and hence a different cap rate) than a government-tenanted office building in Nairobi CBD.

**3. The Depreciated Replacement Cost Method**

Used where there is insufficient market or income data - typically for specialist properties such as hospitals, schools, churches, and industrial facilities. The valuer estimates the cost of constructing an equivalent building at current prices, then deducts depreciation for age, condition, and functional obsolescence.

This method tends to produce higher values than the market approach and is not accepted by most banks for mortgage purposes on standard residential properties.

## What Affects Your Property's Valuation in Nairobi?

**Location and micro-location.** The same 3-bedroom apartment can command a 40 percent difference in value between Kilimani and Kayole. Within a single estate, units on higher floors with better views or away from the main road carry premiums.

**Title integrity.** A property with a clean, registered freehold title (absolute proprietorship) is worth more than one with a leasehold that expires in under 40 years, or one with caveats or cautions registered against it. Always verify title status at the Ministry of Lands before commissioning a valuation.

**Services and infrastructure.** Proximity to functioning water mains, stable power (or solar backup), paved access roads, and fibre internet connectivity all add measurable value. Properties reliant on water bowsers are discounted.

**Property condition.** Deferred maintenance - peeling paint, cracked tiles, failing plumbing - reduces the assessed value directly (through the depreciation adjustment) and indirectly (by deterring comparable buyers and tenants).

**Building age and standard of construction.** Post-2010 constructions built to the current building code typically achieve higher values than older stock, all else being equal.

## Maximising Value Before a Valuation

If you are commissioning a valuation for a mortgage or sale, consider:

- Repainting common areas and units (high ROI)
- Repairing or replacing broken fixtures (taps, light fittings, door handles)
- Clearing any title issues (caveats, cautions, unpaid land rent) before the valuation date
- Providing the valuer with a full rent roll, service charge accounts, and maintenance records for income-producing properties

For a formal valuation of your property or portfolio, contact our team to discuss your requirements.
    `.trim(),
  },
  "kdpa-landlords-tenants": {
    title: "What Kenya's Data Protection Act Means for Landlords and Property Managers",
    category: "Legal",
    publishedAt: "2025-10-01",
    readTime: "6 min read",
    body: `
The Kenya Data Protection Act 2019 (KDPA) is not just for technology companies and banks. If you are a landlord or property manager who collects, stores, or processes personal information about tenants, applicants, or employees, you are a data controller under the Act - and you have legal obligations.

Non-compliance carries financial penalties of up to KES 5 million or imprisonment of up to 10 years for the most serious offences. More practically, a data breach or misuse of tenant data can result in complaints to the Office of the Data Protection Commissioner (ODPC), civil claims, and reputational damage.

## What Counts as "Personal Data"?

Under the KDPA, personal data is any information that relates to an identified or identifiable natural person. In a property management context, this includes:

- Full name and national identification number
- KRA Personal Identification Number (PIN)
- Passport number
- Payslips and bank statements (collected to verify income)
- Employment details (employer name, job title, salary)
- Next-of-kin details
- Photographs (including ID photos)
- WhatsApp conversations and email correspondence
- CCTV footage in which tenants appear

Sensitive personal data - including health information, biometric data, and financial information - attracts heightened protection.

## What Are Your Obligations as a Data Controller?

**1. Lawful basis for processing.** You must have a legal basis for collecting and processing personal data. The most common bases for landlords are:
- **Consent:** the tenant has given clear, informed, freely-given consent (the KDPA requires consent to be specific and documented)
- **Contract:** processing is necessary for the performance of the tenancy agreement (e.g., collecting bank details to process rent)
- **Legal obligation:** processing is required to comply with the law (e.g., KRA requirements)

Blanket, pre-ticked consent forms do not meet the KDPA standard.

**2. Data minimisation.** You may only collect what you actually need. If you need to verify income, a payslip is sufficient - you do not need a full bank statement going back 12 months. If you need to identify a tenant, a national ID copy is sufficient - you do not need a passport and a driving licence.

**3. Purpose limitation.** Data collected for one purpose (e.g., tenant screening) cannot be used for another purpose (e.g., marketing) without fresh consent.

**4. Data security.** You must implement appropriate technical and organisational measures to protect personal data against unauthorised access, loss, or destruction. For a small landlord, this means:
- Storing tenant files in a locked cabinet or encrypted folder
- Not sharing tenant ID documents with contractors without necessity
- Deleting tenant data securely after the tenancy ends and the retention period expires

**5. Data subject rights.** Tenants have the right to access their personal data, correct inaccuracies, and request deletion after the tenancy ends (subject to your legitimate record-keeping obligations). You must have a process to respond to these requests within 21 days.

**6. ODPC registration.** Data controllers processing personal data in Kenya are required to register with the ODPC. As of 2025, the ODPC has begun enforcement and has issued compliance notices to organisations across sectors.

## Practical Steps for Landlords and Property Managers

**Update your lease agreements.** Include a data processing consent clause that describes what data you collect, why, how long you retain it, and your contact details as the data controller. Link to a Privacy Policy if you have one.

**Review your tenant application forms.** Remove fields that collect more data than necessary. Question every field: do you actually need this information to process the tenancy?

**Secure your tenant files.** Physical files should be locked. Digital files should be password-protected and stored on encrypted drives or secure cloud services. Do not store tenant data in unprotected WhatsApp conversations.

**Establish a retention policy.** Kenya's tax and accounting regulations generally require records to be retained for seven years. After that period, tenant personal data should be securely deleted or anonymised.

**Train your staff.** Anyone who handles tenant data - caretakers, office staff, accounts personnel - should understand the basics of data protection.

## How Chabrin Agencies Approaches KDPA Compliance

Chabrin Agencies Limited has registered with the ODPC and maintains a comprehensive data protection framework covering tenant data, job applicant data, and landlord data. Our lease agreements include KDPA-compliant consent clauses. Our digital systems use encrypted storage and access controls. We retain a data protection policy reviewed annually by qualified legal counsel.

We recognise that KDPA compliance is not a one-time project but an ongoing obligation. If you manage your property directly and need guidance on building a compliant tenant data management process, our team is available to discuss best practices.
    `.trim(),
  },
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;

  try {
    const post = await getPostBySlug(slug);
    if (post) {
      return {
        title: post.title,
        description: post.excerpt,
        alternates: {
          canonical: `${siteConfig.url}/${locale}/blog/${slug}`,
          languages: {
            "en-KE": `${siteConfig.url}/en/blog/${slug}`,
            "sw-KE": `${siteConfig.url}/sw/blog/${slug}`,
          },
        },
      };
    }
  } catch { /* fall through to static */ }

  const article = ARTICLES[slug];
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog/${slug}`,
      languages: {
        "en-KE": `${siteConfig.url}/en/blog/${slug}`,
        "sw-KE": `${siteConfig.url}/sw/blog/${slug}`,
      },
    },
  };
}

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const locales = ["en", "sw"];
  const slugs = Object.keys(ARTICLES);

  try {
    const posts = await getAllPosts();
    const sanitySlugs = posts.map((p) => p.slug);
    return locales.flatMap((locale) =>
      [...slugs, ...sanitySlugs].map((slug) => ({ locale, slug }))
    );
  } catch {
    return locales.flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug }))
    );
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleBody({ content }: { content: string }) {
  const paragraphs = content.split("\n\n");
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-brand-navy prose-headings:font-bold prose-a:text-brand-cyan">
      {paragraphs.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-bold text-brand-navy mt-8 mb-3">
              {block.replace("## ", "")}
            </h2>
          );
        }
        if (block.startsWith("**") && block.endsWith("**")) {
          const inner = block.slice(2, -2);
          return <p key={i} className="font-semibold text-brand-navy mt-4 mb-1">{inner}</p>;
        }
        // Handle inline bold
        const parts = block.split(/\*\*(.+?)\*\*/g);
        return (
          <p key={i} className="text-slate-600 leading-relaxed mb-4">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} className="text-brand-navy font-semibold">{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  // Try Sanity first
  let sanityPost = null;
  try {
    sanityPost = await getPostBySlug(slug);
  } catch { /* fall through */ }

  const article = ARTICLES[slug];

  if (!sanityPost && !article) {
    notFound();
  }

  const title       = sanityPost?.title    ?? article!.title;
  const category    = sanityPost?.category ?? article!.category;
  const publishedAt = sanityPost?.publishedAt ?? article!.publishedAt;
  const readTime    = sanityPost?.readTime ?? article!.readTime;
  const body        = article?.body ?? "";

  return (
    <main className="min-h-screen bg-white">
      {/* Header strip */}
      <div className="bg-brand-navy text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1.5 text-brand-cyan/70 text-sm hover:text-brand-cyan mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Blog
          </Link>
          <span className="inline-block px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan text-xs font-bold uppercase tracking-widest mb-4">
            {category}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-3 text-white/50 text-sm">
            <span>Chabrin Agencies</span>
            <span aria-hidden="true">·</span>
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
            {readTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{readTime}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {body ? (
          <ArticleBody content={body} />
        ) : (
          <p className="text-slate-500 italic">Full article content coming soon.</p>
        )}

        {/* CTA */}
        <div className="mt-14 p-8 bg-surface rounded-2xl border border-slate-100 text-center">
          <p className="text-sm font-bold text-brand-cyan uppercase tracking-widest mb-2">
            Need professional guidance?
          </p>
          <h3 className="text-xl font-bold text-brand-navy mb-3">
            Talk to Chabrin Agencies
          </h3>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Our team of registered property managers and valuers is available to advise on
            leases, compliance, valuations, and tenant relations across Nairobi and surrounding counties.
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block px-8 py-3 rounded-full bg-brand-navy text-white font-bold text-sm
                       hover:bg-brand-navy-dark transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </article>
    </main>
  );
}
