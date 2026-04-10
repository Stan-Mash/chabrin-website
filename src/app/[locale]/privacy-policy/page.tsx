import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Chabrin Agencies Limited collects, uses, and protects your personal data under the Kenya Data Protection Act 2019.",
};

const LAST_UPDATED = "10 April 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-slate-300 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto prose prose-slate prose-headings:text-brand-navy prose-a:text-brand-cyan prose-a:no-underline hover:prose-a:underline max-w-none">

          <p>
            Chabrin Agencies Limited (<strong>"Chabrin"</strong>, <strong>"we"</strong>,{" "}
            <strong>"us"</strong>, or <strong>"our"</strong>) is committed to protecting
            your personal data. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit{" "}
            <a href={siteConfig.url}>{siteConfig.url}</a> or use our services, in
            compliance with the <strong>Kenya Data Protection Act, 2019 (KDPA)</strong> and
            the Data Protection (General) Regulations, 2021.
          </p>

          <hr />

          <h2>1. Data Controller</h2>
          <p>
            The data controller responsible for your personal data is:
          </p>
          <address className="not-italic bg-slate-50 rounded-xl p-5 text-sm leading-7 border border-slate-100">
            <strong>Chabrin Agencies Limited</strong><br />
            Nacico Plaza, 5th Floor, Room 517<br />
            Landhies Road, Nairobi, Kenya<br />
            P.O Box 16659-00620, Nairobi<br />
            Email: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a><br />
            Phone: <a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a>
          </address>

          <h2>2. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li><strong>Contact enquiries:</strong> name, email address, phone number, subject, and message content submitted through our contact form.</li>
            <li><strong>Tenancy and lease data:</strong> national ID/passport number, KRA PIN, employment details, next-of-kin, and guarantor information collected during the lease application process.</li>
            <li><strong>Identity documents:</strong> copies of national ID or passport for identity verification purposes.</li>
            <li><strong>Usage data:</strong> IP address, browser type, pages visited, and time spent on pages, collected automatically via server logs.</li>
          </ul>
          <p>We do <strong>not</strong> use cookies for advertising or tracking purposes.</p>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your enquiries and provide the services you request.</li>
            <li>Process and manage lease agreements and tenancy documentation.</li>
            <li>Verify your identity as required by law and our due-diligence obligations.</li>
            <li>Send service-related communications (e.g. lease reminders, payment notices).</li>
            <li>Comply with legal and regulatory obligations under Kenyan law.</li>
            <li>Improve and maintain our website and services.</li>
          </ul>
          <p>
            We will <strong>never</strong> sell, rent, or share your personal data with third parties
            for marketing purposes.
          </p>

          <h2>4. Legal Basis for Processing</h2>
          <p>We process your personal data on the following lawful bases under the KDPA:</p>
          <ul>
            <li><strong>Consent</strong> — where you have given explicit consent (e.g. contact form submission).</li>
            <li><strong>Contract performance</strong> — where processing is necessary to fulfil a lease agreement or service contract.</li>
            <li><strong>Legal obligation</strong> — where processing is required by Kenyan law (e.g. identity verification, stamp duty records).</li>
            <li><strong>Legitimate interests</strong> — where processing is necessary for our legitimate business interests, provided these are not overridden by your rights.</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain personal data only for as long as necessary to fulfil the purposes for which
            it was collected, or as required by law:
          </p>
          <ul>
            <li><strong>Contact enquiries:</strong> up to 12 months, then securely deleted.</li>
            <li><strong>Lease and tenancy records:</strong> 7 years after lease expiry, in line with statutory requirements.</li>
            <li><strong>Identity documents:</strong> retained for the duration of the tenancy plus 3 years.</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organisational measures to protect your personal
            data, including:
          </p>
          <ul>
            <li>AES-256 encryption of sensitive identity data (national ID, passport number, KRA PIN) at rest.</li>
            <li>TLS encryption for all data in transit (HTTPS).</li>
            <li>Role-based access controls ensuring staff can only access data necessary for their duties.</li>
            <li>Regular security audits and access logging.</li>
          </ul>

          <h2>7. Sharing of Personal Data</h2>
          <p>We may share your personal data with:</p>
          <ul>
            <li><strong>Landlords and property owners</strong> — where necessary to process a lease application or manage a tenancy on their behalf.</li>
            <li><strong>Legal professionals</strong> — lawyers engaged in the preparation of lease agreements.</li>
            <li><strong>Regulatory authorities</strong> — where required by law (e.g. Kenya Revenue Authority, court orders).</li>
            <li><strong>Service providers</strong> — trusted third-party vendors who assist us in operating our services (e.g. cloud hosting), bound by confidentiality obligations.</li>
          </ul>
          <p>All third parties are required to handle your data in accordance with the KDPA.</p>

          <h2>8. Your Rights Under the KDPA</h2>
          <p>Under the Kenya Data Protection Act 2019, you have the right to:</p>
          <ul>
            <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
            <li><strong>Rectification</strong> — request correction of inaccurate or incomplete data.</li>
            <li><strong>Erasure</strong> — request deletion of your data where there is no longer a lawful basis for retention.</li>
            <li><strong>Restriction</strong> — request that we restrict processing of your data in certain circumstances.</li>
            <li><strong>Objection</strong> — object to processing based on legitimate interests.</li>
            <li><strong>Withdraw consent</strong> — where processing is based on consent, withdraw it at any time without affecting prior processing.</li>
            <li><strong>Lodge a complaint</strong> — with the Office of the Data Protection Commissioner (ODPC) at <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer">odpc.go.ke</a>.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>. We will
            respond within 21 days as required by the KDPA.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not directed to children under 18 years of age. We do not knowingly
            collect personal data from children. If you believe a child has provided us with personal
            data, please contact us immediately.
          </p>

          <h2>10. Links to Third-Party Websites</h2>
          <p>
            Our website may contain links to third-party websites (e.g. Google Maps). We are not
            responsible for the privacy practices of those sites and encourage you to read their
            privacy policies.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material
            changes by updating the "Last updated" date at the top of this page. Continued use of
            our website after changes constitutes acceptance of the updated policy.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            For any privacy-related questions, requests, or complaints, please contact our Data
            Protection Officer:
          </p>
          <address className="not-italic bg-slate-50 rounded-xl p-5 text-sm leading-7 border border-slate-100">
            <strong>Data Protection Officer</strong><br />
            Chabrin Agencies Limited<br />
            Nacico Plaza, 5th Floor, Room 517, Landhies Road<br />
            Nairobi, Kenya<br />
            Email: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a><br />
            Phone: <a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a>
          </address>

        </div>
      </section>
    </main>
  );
}
