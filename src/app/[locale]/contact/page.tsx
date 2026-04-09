import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import ContactHero from "@/components/sections/contact/ContactHero";
import ContactForm from "@/components/sections/contact/ContactForm";
import ContactInfo from "@/components/sections/contact/ContactInfo";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Contact Us | Chabrin Agencies Limited",
  description:
    "Get in touch with Chabrin Agencies. Send an enquiry, request a property management consultation, or ask about available properties in Nairobi.",
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ContactHero />
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
