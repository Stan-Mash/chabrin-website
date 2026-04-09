export default function ContactHero() {
  return (
    <section className="relative bg-brand-navy overflow-hidden py-16 md:py-20">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 mb-5">
          <span className="w-8 h-0.5 bg-brand-cyan" />
          <span className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">
            Get in Touch
          </span>
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
          We&apos;d Love to
          <br className="hidden md:block" />
          <span className="text-brand-cyan"> Hear from You</span>
        </h1>
        <p className="text-slate-300 max-w-2xl leading-relaxed">
          Our team responds within one business day. Reach out for property enquiries,
          management consultations, or general questions.
        </p>
      </div>
    </section>
  );
}
