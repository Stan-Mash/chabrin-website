import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ComplaintsHero   from "@/components/sections/complaints/ComplaintsHero";
import ComplaintForm    from "@/components/sections/complaints/ComplaintForm";
import ComplaintStatus  from "@/components/sections/complaints/ComplaintStatus";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Complaints & Issue Tracker | Chabrin Agencies Limited",
  description:
    "Submit a complaint, maintenance request, or feedback to Chabrin Agencies. " +
    "Every submission is acknowledged with a reference number and tracked to resolution. " +
    "Serving tenants and landlords across Nairobi, Kiambu, Murang'a, Kajiado, Machakos, and beyond.",
};

export default async function ComplaintsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ComplaintsHero />

      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">

            {/* ── Left: Submission form ── */}
            <div>
              <ComplaintForm />
            </div>

            {/* ── Right: Status checker + info ── */}
            <div className="space-y-6">
              <ComplaintStatus />

              {/* Contact fallback card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-[#0D1B8E] mb-1 text-base">Need Immediate Help?</h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                  For emergencies — no water, security breach, or serious safety risk —
                  please call or WhatsApp us directly for the fastest response.
                </p>
                <div className="space-y-2.5">
                  <a
                    href="https://wa.me/254720854389?text=URGENT: I have an emergency complaint"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500 text-white
                               font-semibold text-sm hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp — +254 720 854 389
                  </a>
                  <a
                    href="tel:+254720854389"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-[#0D1B8E]
                               text-[#0D1B8E] font-semibold text-sm hover:bg-[#0D1B8E] hover:text-white
                               transition-colors"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call — +254 720 854 389
                  </a>
                  <a
                    href="mailto:info@chabrinagencies.co.ke"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200
                               text-slate-600 font-semibold text-sm hover:border-[#0D1B8E]
                               hover:text-[#0D1B8E] transition-colors"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@chabrinagencies.co.ke
                  </a>
                </div>
              </div>

              {/* Office hours card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-[#0D1B8E] mb-3 text-base">Office Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monday – Friday</span>
                    <span className="font-semibold text-[#0D1B8E]">8:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-500">Saturday</span>
                    <span className="font-semibold text-[#0D1B8E]">8:30 AM – 12:00 PM</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-500">Sunday &amp; Public Holidays</span>
                    <span className="font-semibold text-red-500">Closed</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Complaints submitted outside office hours are acknowledged on the next working day.
                  Emergencies are escalated immediately regardless of time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
