import Link from "next/link";
import { siteConfig } from "@/config/site";

const HOURS = [
  { day: "Monday – Friday", hours: "8:00 AM – 5:00 PM" },
  { day: "Saturday",        hours: "8:30 AM – 12:00 PM" },
  { day: "Sunday",          hours: "Closed"             },
  { day: "Public Holidays", hours: "Closed"             },
];

export default function ContactInfo() {
  const whatsappMsg = encodeURIComponent(
    "Hello, I would like to enquire about your property management services."
  );

  return (
    <div className="space-y-6">

      {/* ── Contact details ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-7 shadow-card">
        <h3 className="font-bold text-brand-navy text-lg mb-6">Contact Details</h3>
        <div className="space-y-5">

          {/* Address */}
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">📍</span>
            <div>
              <p className="font-semibold text-brand-navy text-sm mb-0.5">Office</p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Nacico Plaza, 5th Floor, Room 517<br />
                Landhies Road, Nairobi<br />
                <span className="text-slate-400">{siteConfig.contact.pobox}</span>
              </p>
            </div>
          </div>

          {/* Phone 1 */}
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">📞</span>
            <div>
              <p className="font-semibold text-brand-navy text-sm mb-0.5">Phone</p>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="text-brand-cyan text-sm hover:underline font-medium block"
              >
                {siteConfig.contact.phone}
              </a>
              <a
                href={`tel:${siteConfig.contact.phone2.replace(/\s/g, "")}`}
                className="text-brand-cyan text-sm hover:underline font-medium block"
              >
                {siteConfig.contact.phone2}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">✉️</span>
            <div>
              <p className="font-semibold text-brand-navy text-sm mb-0.5">Email</p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-brand-cyan text-sm hover:underline font-medium"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-full
                     bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors"
        >
          {/* WhatsApp SVG icon */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat on WhatsApp
        </a>
      </div>

      {/* ── Office hours ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-7 shadow-card">
        <h3 className="font-bold text-brand-navy text-lg mb-4">Office Hours</h3>
        <div className="space-y-3">
          {HOURS.map(({ day, hours }) => (
            <div
              key={day}
              className="flex justify-between items-center text-sm border-b border-slate-100
                         pb-2 last:border-0 last:pb-0"
            >
              <span className="text-slate-600 font-medium">{day}</span>
              <span className={hours === "Closed" ? "text-red-400 font-semibold" : "text-brand-navy font-semibold"}>
                {hours}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Map placeholder ────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden shadow-card h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-2">🗺️</span>
          <p className="text-slate-400 text-sm font-medium">Nacico Plaza, Landhies Rd</p>
          <p className="text-slate-400 text-xs">Interactive map coming soon</p>
        </div>
      </div>

      {/* ── Social ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Follow Us
        </p>
        <div className="flex gap-3">
          {[
            { href: siteConfig.social.facebook,  label: "Facebook",  icon: "f"  },
            { href: siteConfig.social.instagram, label: "Instagram", icon: "in" },
            { href: siteConfig.social.linkedin,  label: "LinkedIn",  icon: "li" },
          ].map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-full bg-surface border border-slate-200 flex items-center
                         justify-center text-brand-navy font-bold text-xs hover:bg-brand-navy
                         hover:text-white hover:border-brand-navy transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── Find us ────────────────────────────────────────────────────── */}
      <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-2xl p-5">
        <p className="text-xs font-semibold text-brand-navy uppercase tracking-wide mb-2">
          📌 How to Find Us
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          Take any matatu heading to <strong>Landhies Road</strong> (near Gikomba/River Road area).
          Nacico Plaza is a prominent building on Landhies Road. Take the lift or stairs to
          the <strong>5th Floor, Room 517</strong>.
        </p>
        <Link
          href={`https://maps.google.com/?q=Nacico+Plaza+Landhies+Road+Nairobi`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-brand-cyan text-sm font-semibold hover:underline"
        >
          Open in Google Maps →
        </Link>
      </div>
    </div>
  );
}
