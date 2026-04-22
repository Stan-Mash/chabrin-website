import Link from "next/link";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";

const SLA_ITEMS = [
  { priority: "Emergency", colour: "#dc2626", bg: "rgba(220,38,38,0.12)", response: "1 hour",          resolution: "24 hours",         example: "Safety breach, no water/power" },
  { priority: "Urgent",    colour: "#ea580c", bg: "rgba(234,88,12,0.12)", response: "8 hours",          resolution: "7 days",           example: "Plumbing, electrical, locks" },
  { priority: "Routine",   colour: "#2563eb", bg: "rgba(37,99,235,0.12)", response: "72 hours",         resolution: "14 days",          example: "Repairs, noise, management" },
  { priority: "Enquiry",   colour: "#7c3aed", bg: "rgba(124,58,237,0.12)", response: "1 business day", resolution: "5 business days",  example: "Billing, general feedback" },
];

export default function ComplaintsHero() {
  return (
    <section className="relative bg-[#0D1B8E] overflow-hidden" aria-labelledby="complaints-hero-heading">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C9C9]/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00C9C9]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/4" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-8 h-0.5 bg-[#00C9C9]" aria-hidden="true" />
          <span className="text-[#00C9C9] text-xs font-bold tracking-widest uppercase">
            Complaints &amp; Issue Tracker
          </span>
        </div>

        {/* Headline */}
        <h1
          id="complaints-hero-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-2xl"
        >
          <AnimatedHeadline text="We Take Every Concern" as="span" />
          {" "}
          <AnimatedHeadline text="Seriously." as="span" className="text-[#00C9C9]" delay={0.5} />
        </h1>
        <p className="text-white/65 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
          Submit your complaint, maintenance request, or feedback — and track its
          resolution in real time. Every submission receives a reference number and
          a response within our published SLA.
        </p>

        {/* Two CTAs */}
        <div className="flex flex-wrap gap-3 mb-12">
          <a
            href="#submit"
            className="px-6 py-3 rounded-full bg-[#00C9C9] text-[#0D1B8E] font-bold text-sm
                       hover:bg-[#00b3b3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C9C9]/50"
          >
            Submit a Complaint
          </a>
          <a
            href="#status"
            className="px-6 py-3 rounded-full border-2 border-white/30 text-white font-semibold
                       text-sm hover:border-white/60 hover:bg-white/10 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Track Existing Complaint
          </a>
        </div>

        {/* SLA grid */}
        <div>
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-4">
            Our Response Commitments
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SLA_ITEMS.map((item) => (
              <div
                key={item.priority}
                className="rounded-xl p-4"
                style={{ background: item.bg, border: `1px solid ${item.colour}30` }}
              >
                <p
                  className="text-xs font-extrabold tracking-widest uppercase mb-2"
                  style={{ color: item.colour }}
                >
                  {item.priority}
                </p>
                <p className="text-white text-sm font-bold leading-snug mb-0.5">
                  Response: {item.response}
                </p>
                <p className="text-white/55 text-xs mb-2">
                  Resolved by: {item.resolution}
                </p>
                <p className="text-white/35 text-[10px] leading-snug italic">
                  {item.example}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust note */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <svg className="w-3.5 h-3.5 text-[#00C9C9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Reference number issued instantly
          </span>
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <svg className="w-3.5 h-3.5 text-[#00C9C9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email confirmation sent automatically
          </span>
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <svg className="w-3.5 h-3.5 text-[#00C9C9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            KDPA compliant — your data is protected
          </span>
          <Link
            href="/en/privacy-policy"
            className="text-[#00C9C9]/60 text-xs hover:text-[#00C9C9] transition-colors underline underline-offset-2"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </section>
  );
}
