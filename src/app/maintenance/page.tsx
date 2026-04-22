import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Coming Soon | Chabrin Agencies Limited",
  description:
    "Chabrin Agencies Limited — Premier property management in Nairobi, Kenya. Our new website is coming soon.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0D1B8E 0%, #0a1570 60%, #061040 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          {/* Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "24px",
              padding: "48px 40px",
              maxWidth: "520px",
              width: "100%",
              textAlign: "center",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Logo */}
            <div style={{ marginBottom: "32px" }}>
              <Image
                src="/logo-wordmark.png"
                alt="Chabrin Agencies Limited"
                width={200}
                height={48}
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
                priority
              />
            </div>

            {/* Cyan accent line */}
            <div
              style={{
                width: "48px",
                height: "4px",
                background: "#00C9C9",
                borderRadius: "2px",
                margin: "0 auto 28px",
              }}
            />

            {/* Heading */}
            <h1
              style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: 800,
                margin: "0 0 16px",
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
              }}
            >
              Something great is coming.
            </h1>

            {/* Body copy */}
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "15px",
                lineHeight: 1.7,
                margin: "0 0 36px",
              }}
            >
              We are putting the finishing touches on our new website. In the
              meantime, our team remains fully available to assist you with
              property management, leasing, and valuation enquiries.
            </p>

            {/* Divider */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "28px",
              }}
            />

            {/* Contact heading */}
            <p
              style={{
                color: "#00C9C9",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                margin: "0 0 20px",
              }}
            >
              Get in touch
            </p>

            {/* Contact items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Phone */}
              <ContactRow
                icon="📞"
                label="Phone"
                value="+254 720 854 389"
                href="tel:+254720854389"
              />
              {/* WhatsApp */}
              <ContactRow
                icon="💬"
                label="WhatsApp"
                value="+254 720 854 389"
                href="https://wa.me/254720854389?text=Hello%20Chabrin%20Agencies"
              />
              {/* Email */}
              <ContactRow
                icon="✉️"
                label="Email"
                value="info@chabrinagencies.co.ke"
                href="mailto:info@chabrinagencies.co.ke"
              />
              {/* Location */}
              <ContactRow
                icon="📍"
                label="Office"
                value="Nacico Plaza, 5th Floor, Landhies Road, Nairobi"
              />
            </div>

            {/* Hours */}
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "12px",
                marginTop: "28px",
                marginBottom: "0",
              }}
            >
              Mon – Fri: 8:00 AM – 5:30 PM &nbsp;·&nbsp; Sat: 9:00 AM – 1:00 PM
            </p>
          </div>

          {/* Footer */}
          <p
            style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: "12px",
              marginTop: "24px",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Chabrin Agencies Limited. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "12px 16px",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: "18px", flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", margin: "0 0 2px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
          {label}
        </p>
        <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600, margin: 0 }}>
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: "none", display: "block" }} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        {content}
      </a>
    );
  }

  return content;
}
