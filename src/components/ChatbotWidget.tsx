"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import { saveChatbotLead } from "@/actions/save-enquiry";

// ── Types ─────────────────────────────────────────────────────────────────────

type MessageRole = "bot" | "user";

interface Message {
  id: string;
  role: MessageRole;
  text: string;
}

type LeadStep = "idle" | "ask_name" | "ask_phone" | "submitting" | "done";

// ── FAQ Knowledge Base ────────────────────────────────────────────────────────

interface FaqEntry {
  patterns: string[];
  response: { en: string; sw: string };
}

const FAQS: FaqEntry[] = [
  {
    // Contact/location entry is FIRST so "where", "located" etc. resolve here before the zones entry
    patterns: ["contact", "phone", "call", "email", "office", "address", "speak", "talk to", "human", "agent", "person", "team", "where are you", "where is", "located", "location", "where"],
    response: {
      en: "Reach our team directly:\n\n📞 **+254 720 854 389** / +254 745 912 688\n📧 **info@chabrinagencies.co.ke**\n📍 Nacico Plaza, 5th Floor, Room 517\n    Landhies Road, Nairobi\n\n🕐 Mon–Fri: 8:00 AM – 5:30 PM\n🕐 Saturday: 9:00 AM – 1:00 PM\n\nOr WhatsApp us for an instant response — we usually reply within minutes!",
      sw: "Wasiliana na timu yetu moja kwa moja:\n\n📞 **+254 720 854 389** / +254 745 912 688\n📧 **info@chabrinagencies.co.ke**\n📍 Nacico Plaza, Ghorofa ya 5, Chumba 517\n    Landhies Road, Nairobi\n\n🕐 Jumatatu–Ijumaa: 8:00 AM – 5:30 PM\n🕐 Jumamosi: 9:00 AM – 1:00 PM",
    },
  },
  {
    patterns: ["management fee", "fees", "how much", "charge", "cost", "pricing", "percentage", "rate"],
    response: {
      en: "Our property management fee is typically **5–10% of the monthly rent**, depending on the property type and services. This covers tenant management, rent collection, maintenance coordination, and monthly reporting.\n\nWould you like a tailored quote? Our team can prepare one for you — just share your property details.",
      sw: "Ada yetu ya usimamizi wa mali kwa kawaida ni **5–10% ya kodi ya kila mwezi**, kulingana na aina ya mali na huduma. Hii inajumuisha usimamizi wa wapangaji, ukusanyaji wa kodi, uratibu wa matengenezo, na ripoti za kila mwezi.\n\nUnataka bei maalum? Timu yetu inaweza ikuandalie.",
    },
  },
  {
    patterns: ["list property", "register property", "how do i list", "add property", "onboard", "landlord", "owner", "sign up", "join", "get started"],
    response: {
      en: "Getting started with Chabrin is simple:\n\n1️⃣ **Free consultation** — we learn about your property and goals\n2️⃣ **Property assessment** — our team conducts a market analysis\n3️⃣ **Management agreement** — clear, transparent terms\n4️⃣ **We take over** — tenant sourcing, leasing, and full management\n\nCall us on +254 720 854 389 or tap the WhatsApp button below to get started!",
      sw: "Kuanza na Chabrin ni rahisi:\n\n1️⃣ **Mashauriano bila malipo** — tunajifunza kuhusu mali yako\n2️⃣ **Tathmini ya mali** — uchambuzi wa soko\n3️⃣ **Mkataba wa usimamizi** — masharti wazi\n4️⃣ **Tunachukua jukumu** — utafutaji wa wapangaji na usimamizi kamili\n\nPiga simu +254 720 854 389 au bonyeza kitufe cha WhatsApp hapa chini!",
    },
  },
  {
    patterns: ["portal", "technology", "digital", "online", "app", "dashboard", "platform", "software", "system"],
    response: {
      en: "Chabrin provides landlords with full digital visibility into their portfolio:\n\n✅ Real-time financial dashboards\n✅ Digital lease signing\n✅ Tenant communication tools\n✅ Maintenance request tracking\n✅ Monthly rent disbursement reports\n\nEverything is designed for complete transparency — accessible from any device, at any time.",
      sw: "Chabrin inawapa wamiliki mwonekano kamili wa kidijitali wa mali zao:\n\n✅ Dashibodi za fedha za wakati halisi\n✅ Kusaini mikataba kwa kidijitali\n✅ Zana za mawasiliano na wapangaji\n✅ Ufuatiliaji wa maombi ya matengenezo\n✅ Ripoti za malipo ya kodi ya kila mwezi",
    },
  },
  {
    patterns: ["how long", "find tenant", "vacancy", "how fast", "quickly", "fill vacancy", "tenant sourcing"],
    response: {
      en: "On average, Chabrin secures a qualified tenant within **2–4 weeks** for well-priced properties. Our process includes:\n\n• Multi-channel marketing (online + network)\n• Rigorous tenant vetting & reference checks\n• ID, employment, and income verification\n\nProperties priced at market rate let fastest. We'll advise you on the optimal rent.",
      sw: "Kwa wastani, Chabrin hupata mpangaji aliyehitimu ndani ya **wiki 2–4** kwa mali zenye bei ya soko. Mchakato wetu unajumuisha:\n\n• Uuzaji kupitia njia nyingi\n• Uchunguzi wa kina wa wapangaji\n• Uthibitishaji wa kitambulisho, ajira, na mapato",
    },
  },
  {
    patterns: ["zone", "zones", "area", "areas", "cover", "coverage", "nairobi", "westlands", "kilimani", "karen", "kiambu", "upper hill", "lavington", "eastlands", "machakos", "kajiado", "thika", "ruiru", "kasarani", "kitengela", "embakasi"],
    response: {
      en: "Chabrin manages properties across **7 metropolitan zones**:\n\n📍 **Zone A** — Northern Commuter Corridor (Murang'a → Githurai 45)\n📍 **Zone B** — Kasarani-Ruaraka Belt (Githurai 44 → Lucky Summer)\n📍 **Zone C** — Inner East Urban Core (Huruma, Mathare, Eastleigh)\n📍 **Zone D** — Classic Eastlands Hub (Dandora, Kariobangi, Buruburu)\n📍 **Zone E** — Premium, CBD & Inner Ring (Westlands, Kilimani, CBD)\n📍 **Zone F** — Greater Eastlands (Umoja, Kayole, Imara Daima)\n📍 **Zone G** — Southern Metro & Airport Corridor (Embakasi → Kitengela)\n\nWe cover the entire Nairobi Metropolitan area — from Murang'a down to Kitengela.",
      sw: "Chabrin inasimamia mali katika **maeneo 7 ya jiji**:\n\n📍 **Eneo A** — Njia ya Kaskazini (Murang'a → Githurai 45)\n📍 **Eneo B** — Ukanda wa Kasarani-Ruaraka\n📍 **Eneo C** — Mji wa Mashariki (Huruma, Mathare, Eastleigh)\n📍 **Eneo D** — Kitovu cha Eastlands (Dandora, Kariobangi, Buruburu)\n📍 **Eneo E** — Premium, CBD & Pete ya Ndani\n📍 **Eneo F** — Eastlands Kubwa (Umoja, Kayole, Imara Daima)\n📍 **Eneo G** — Ukanda wa Kusini (Embakasi → Kitengela)",
    },
  },
  {
    patterns: ["lease", "contract", "agreement", "duration", "term", "months", "year", "how long is the lease"],
    response: {
      en: "Standard leases at Chabrin:\n\n🏠 **Residential** — 12 months (standard), renewable\n🏢 **Commercial** — 2–3 years (negotiable)\n\nWe handle all lease preparation, digital signing, and ensure every agreement complies with Kenyan tenancy law. Deposits equivalent to **2 months' rent** are held in a designated account.",
      sw: "Mikataba ya kawaida ya Chabrin:\n\n🏠 **Makazi** — miezi 12 (kawaida), inaweza kuhuishwa\n🏢 **Biashara** — miaka 2–3 (inaweza kujadiliwa)\n\nTunashughulikia uandishi wote wa mikataba na kusaini kwa dijiti. Amana sawa na **kodi ya miezi 2** huhifadhiwa katika akaunti maalum.",
    },
  },
  {
    patterns: ["vetting", "screening", "background check", "credit check", "qualify", "tenant requirements", "who qualifies"],
    response: {
      en: "Our tenant vetting process includes:\n\n✅ National ID / passport verification\n✅ 3 months' payslips or business records\n✅ Previous landlord reference checks\n✅ Credit & background checks\n✅ Employment confirmation letter\n\nThis protects your property and ensures reliable, long-term tenancy.",
      sw: "Mchakato wetu wa uchunguzi wa wapangaji unajumuisha:\n\n✅ Uthibitishaji wa kitambulisho cha taifa/pasipoti\n✅ Stakabadhi za mshahara za miezi 3 au kumbukumbu za biashara\n✅ Ukaguzi wa marejeo ya mmiliki wa awali\n✅ Ukaguzi wa mkopo na historia\n✅ Barua ya uthibitisho wa ajira",
    },
  },
  {
    patterns: ["maintenance", "repair", "emergency", "fix", "broken", "plumbing", "electrical", "issue", "problem", "fault"],
    response: {
      en: "Chabrin offers **24/7 emergency maintenance response** through our vetted contractor network:\n\n🔧 Plumbing, electrical, structural & general repairs\n📱 All requests tracked and reported digitally\n🔔 Landlords notified for every job raised\n💰 Maintenance costs transparently reported monthly\n\nPreventive maintenance schedules are also included for managed properties.",
      sw: "Chabrin inatoa **majibu ya matengenezo ya dharura 24/7** kupitia mtandao wetu wa makandarasi:\n\n🔧 Mabomba, umeme, muundo & ukarabati wa jumla\n📱 Maombi yote yanafuatiliwa na kuripotiwa kwa kidijitali\n🔔 Wamiliki wanaarifu kwa kila kazi iliyoanzishwa\n💰 Gharama za matengenezo zinaarifu wazi kila mwezi",
    },
  },
  {
    patterns: ["payment", "rent payment", "pay rent", "mpesa", "bank transfer", "cheque", "collection", "how rent is paid", "disbursement"],
    response: {
      en: "Rent collection at Chabrin:\n\n💳 **Channels** — M-Pesa, bank transfer, cheque\n📅 **Disbursement** — by the **10th of each month**, net of fees\n📊 **Statement** — detailed financial statement included\n📱 **Tracking** — real-time visibility via your landlord dashboard\n\nLate payments are managed proactively — we follow up with tenants so you don't have to.",
      sw: "Ukusanyaji wa kodi katika Chabrin:\n\n💳 **Njia** — M-Pesa, uhamisho wa benki, hundi\n📅 **Malipo** — ifikapo **tarehe 10 ya kila mwezi**, baada ya kukata ada\n📊 **Taarifa** — taarifa ya kina ya fedha imejumuishwa\n📱 **Ufuatiliaji** — mwonekano wa wakati halisi kupitia dashibodi yako",
    },
  },
  {
    patterns: ["valuation", "value", "worth", "market value", "rental value", "how much is my property", "property value"],
    response: {
      en: "We offer **professional property valuations** by our registered valuers:\n\n📋 Residential & commercial valuations\n🏦 Mortgage & insurance valuations\n📈 Market rental value assessments\n⚖️ Reports meeting bank and legal standards\n\nValuations are typically conducted within **3–5 business days**. Book via our contact page or call us directly.",
      sw: "Tunatoa **tathmini za kitaalamu za mali** na wathamini wetu waliosajiliwa:\n\n📋 Tathmini za makazi na biashara\n🏦 Tathmini za mikopo na bima\n📈 Tathmini za thamani ya kodi ya soko\n⚖️ Ripoti zinazokidhi viwango vya benki na kisheria\n\nTathmini kwa kawaida hufanywa ndani ya siku za kazi **3–5**.",
    },
  },
  {
    patterns: ["report", "financial report", "monthly report", "statement", "landlord report", "how often"],
    response: {
      en: "Landlords receive a **monthly financial statement** by the 5th of each month, covering:\n\n• Total rent collected\n• Management fee breakdown\n• Maintenance costs (with receipts)\n• Net disbursement amount\n• Occupancy status per unit\n\nAll reports are delivered digitally and accessible 24/7 via your landlord portal.",
      sw: "Wamiliki hupokea **taarifa ya fedha ya kila mwezi** ifikapo tarehe 5, ikijumuisha:\n\n• Jumla ya kodi iliyokusanywa\n• Muundo wa ada ya usimamizi\n• Gharama za matengenezo (na risiti)\n• Kiasi cha malipo ya jumla\n• Hali ya ukaliaji kwa kila kitengo",
    },
  },
  {
    patterns: ["earb", "registered", "licensed", "regulated", "accredited", "compliant", "legal", "legitimate"],
    response: {
      en: "Chabrin Agencies is **fully licensed and regulated**:\n\n🏛️ **EARB Registered** — Estate Agents Registration Board of Kenya\n🔒 **KDPA Compliant** — Kenya Data Protection Act 2019\n🏢 **Registered Company** — Registrar of Companies, Kenya\n⭐ **30+ Years** of experience since the 1990s\n\nYour property is in safe, accountable, and professionally regulated hands.",
      sw: "Chabrin Agencies ina **leseni kamili na inadhibitiwa**:\n\n🏛️ **Imesajiliwa EARB** — Bodi ya Usajili wa Mawakala wa Mali ya Kenya\n🔒 **Inafuata KDPA** — Sheria ya Ulinzi wa Data ya Kenya 2019\n🏢 **Kampuni Iliyosajiliwa** — Msajili wa Makampuni, Kenya\n⭐ **Miaka 30+** ya uzoefu tangu miaka ya 1990",
    },
  },
];

// ── Suggested Quick Questions ─────────────────────────────────────────────────

const SUGGESTIONS = {
  en: [
    "What are your management fees?",
    "How do you screen tenants?",
    "Where are you located?",
    "I am a tenant needing help.",
  ],
  sw: [
    "Ada za usimamizi ni ngapi?",
    "Mnawachunguza wapangaji vipi?",
    "Mko wapi?",
    "Mimi ni mpangaji nahitaji msaada.",
  ],
};

// ── FAQ Matcher ───────────────────────────────────────────────────────────────

function matchFaq(query: string, locale: string): string | null {
  const lower = query.toLowerCase();
  for (const faq of FAQS) {
    if (faq.patterns.some((p) => lower.includes(p))) {
      return locale === "sw" ? faq.response.sw : faq.response.en;
    }
  }
  return null;
}

// ── Message Renderer (supports **bold** and newlines) ─────────────────────────

function BotText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className={line === "" ? "h-2" : undefined}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold text-brand-navy">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ChatbotWidget() {
  const locale = useLocale();
  const isEn = locale !== "sw";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [leadStep, setLeadStep] = useState<LeadStep>("idle");
  const [leadName, setLeadName] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);

  const nextId = () => String(++idCounter.current);

  const GREETING = isEn
    ? "Hi! I'm the Chabrin Property Assistant. I can help you with management fees, tenant screening, property listings, and general inquiries. What would you like to know?"
    : "Habari! Mimi ni Msaidizi wa Mali wa Chabrin. Ninaweza kukusaidia kuhusu ada za usimamizi, uchunguzi wa wapangaji, orodha za mali, na maswali ya jumla. Ungependa kujua nini?";

  // Initialise greeting when widget opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: nextId(), role: "bot", text: GREETING }]);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addMessage = useCallback((role: MessageRole, text: string) => {
    setMessages((prev) => [...prev, { id: nextId(), role, text }]);
  }, []);

  const handleReset = useCallback(() => {
    setMessages([{ id: nextId(), role: "bot", text: GREETING }]);
    setInput("");
    setLeadStep("idle");
    setLeadName("");
    setLastQuery("");
  }, [GREETING]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text) return;

      setInput("");
      addMessage("user", text);

      // ── Lead capture flow ──
      if (leadStep === "ask_name") {
        setLeadName(text);
        setLeadStep("ask_phone");
        setTimeout(() => {
          addMessage(
            "bot",
            isEn
              ? `Thanks ${text}! And what's the best phone number for our team to reach you?`
              : `Asante ${text}! Na nambari gani ya simu timu yetu inaweza kukufikia?`
          );
        }, 400);
        return;
      }

      if (leadStep === "ask_phone") {
        setLeadStep("submitting");
        setTimeout(async () => {
          addMessage(
            "bot",
            isEn
              ? "Perfect — I'm passing your details to our team right now..."
              : "Vizuri — ninawapelekea timu yetu maelezo yako sasa hivi..."
          );

          const result = await saveChatbotLead({
            name: leadName,
            phone: text,
            lastQuery: lastQuery || undefined,
            locale,
          });

          setTimeout(() => {
            if (result.success) {
              addMessage(
                "bot",
                isEn
                  ? `✅ Done! Our team has your details and will call you back shortly.\n\nIn the meantime, you can also reach us directly:\n📞 ${siteConfig.contact.phone}\n📧 ${siteConfig.contact.email}`
                  : `✅ Imekamilika! Timu yetu ina maelezo yako na itakupigia simu hivi karibuni.\n\nKwa wakati huu, unaweza pia kuwasiliana nasi moja kwa moja:\n📞 ${siteConfig.contact.phone}\n📧 ${siteConfig.contact.email}`
              );
            } else {
              addMessage(
                "bot",
                isEn
                  ? `Something went wrong on my end. Please contact us directly:\n📞 ${siteConfig.contact.phone}\n📧 ${siteConfig.contact.email}`
                  : `Kuna tatizo kutoka upande wangu. Tafadhali wasiliana nasi moja kwa moja:\n📞 ${siteConfig.contact.phone}\n📧 ${siteConfig.contact.email}`
              );
            }
            setLeadStep("done");
          }, 800);
        }, 600);
        return;
      }

      // ── FAQ matching ──
      const answer = matchFaq(text, locale);
      if (answer) {
        setTimeout(() => {
          addMessage("bot", answer);
        }, 450);
      } else {
        setTimeout(() => {
          addMessage(
            "bot",
            isEn
              ? "That is a great question. For specific details, I recommend speaking directly with one of our property experts. You can click the WhatsApp button above to chat with our team right now!"
              : "Hiyo ni swali zuri. Kwa maelezo maalum, napendekeza kuzungumza moja kwa moja na mmoja wa wataalamu wetu wa mali. Unaweza kubonyeza kitufe cha WhatsApp hapo juu kuzungumza na timu yetu sasa hivi!"
          );
        }, 450);
      }
    },
    [leadStep, leadName, lastQuery, locale, isEn, addMessage]
  );

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    isEn
      ? "Hello, I have a property enquiry from the Chabrin website."
      : "Habari, nina swali la mali kutoka tovuti ya Chabrin."
  )}`;

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isEn ? "Open property assistant chat" : "Fungua msaidizi wa mali"}
        aria-expanded={isOpen}
        aria-controls="chatbot-panel"
        className={`
          fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-300
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2
          ${isOpen
            ? "bg-slate-700 hover:bg-slate-800"
            : "bg-brand-navy hover:bg-brand-navy-dark"
          }
        `}
      >
        {isOpen ? (
          // Close icon
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Chat bubble icon
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 .55-.45 1-1 1H6l-4 4V5c0-.55.45-1 1-1h17c.55 0 1 .45 1 1v11z" />
          </svg>
        )}
        {/* Notification dot */}
        {!isOpen && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-cyan rounded-full
                       border-2 border-white animate-pulse"
            aria-hidden="true"
          />
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div
        id="chatbot-panel"
        role="dialog"
        aria-label={isEn ? "Chabrin property assistant" : "Msaidizi wa mali wa Chabrin"}
        aria-hidden={!isOpen}
        className={`
          fixed bottom-24 right-4 sm:right-6 z-50
          w-[calc(100vw-2rem)] sm:w-96
          bg-white rounded-2xl shadow-2xl border border-slate-200
          flex flex-col overflow-hidden
          transition-all duration-300 ease-out
          ${isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
          }
        `}
        style={{ maxHeight: "min(560px, calc(100vh - 8rem))" }}
      >
        {/* ── Header ── */}
        <div className="bg-brand-navy px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-brand-cyan/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-2M5 21H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-4a1 1 0 00-1 1v5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">
              {isEn ? "Chabrin Property Assistant" : "Msaidizi wa Mali Chabrin"}
            </p>
            <p className="text-brand-cyan text-xs mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" aria-hidden="true" />
              {isEn ? "Online — here to help" : "Mtandaoni — hapa kusaidia"}
            </p>
          </div>
          <button
            onClick={handleReset}
            aria-label={isEn ? "Start a new chat" : "Anza mazungumzo mapya"}
            title={isEn ? "New chat" : "Mazungumzo mapya"}
            className="flex-shrink-0 flex items-center gap-1 text-white/60 hover:text-white
                       text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isEn ? "New" : "Upya"}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isEn ? "Contact us on WhatsApp" : "Wasiliana nasi kwenye WhatsApp"}
            className="flex-shrink-0 flex items-center gap-1.5 bg-green-500 hover:bg-green-600
                       text-white text-xs font-semibold px-2.5 py-1.5 rounded-full transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>

        {/* ── Messages ── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-surface"
          aria-live="polite"
          aria-label={isEn ? "Chat messages" : "Ujumbe wa mazungumzo"}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <div className="w-7 h-7 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <svg className="w-4 h-4 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5" />
                  </svg>
                </div>
              )}
              <div
                className={`
                  max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.role === "bot"
                    ? "bg-white text-slate-700 shadow-sm rounded-tl-sm border border-slate-100"
                    : "bg-brand-navy text-white rounded-tr-sm"
                  }
                `}
              >
                {msg.role === "bot" ? (
                  <BotText text={msg.text} />
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* ── Suggestions ── */}
        {messages.length > 0 && leadStep === "idle" && (
          <div className="px-4 pt-2 pb-1 bg-surface border-t border-slate-100 flex-shrink-0">
            <p className="text-xs text-slate-400 mb-2 font-medium">
              {isEn ? "Quick questions:" : "Maswali ya haraka:"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(isEn ? SUGGESTIONS.en : SUGGESTIONS.sw).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-brand-navy text-brand-navy
                             hover:bg-brand-navy hover:text-white transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input ── */}
        <div className="px-3 py-3 bg-white border-t border-slate-100 flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
            aria-label={isEn ? "Send a message" : "Tuma ujumbe"}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={leadStep === "submitting"}
              placeholder={
                leadStep === "ask_name"
                  ? isEn ? "Your full name..." : "Jina lako kamili..."
                  : leadStep === "ask_phone"
                  ? isEn ? "Your phone number..." : "Nambari yako ya simu..."
                  : isEn ? "Ask me anything about property..." : "Niulize chochote kuhusu mali..."
              }
              aria-label={isEn ? "Type your message" : "Andika ujumbe wako"}
              className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200
                         focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20
                         disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || leadStep === "submitting"}
              aria-label={isEn ? "Send message" : "Tuma ujumbe"}
              className="w-9 h-9 rounded-xl bg-brand-navy text-white flex items-center justify-center
                         hover:bg-brand-navy-dark disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors flex-shrink-0"
            >
              {leadStep === "submitting" ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-300 mt-2">
            {isEn ? "Powered by Chabrin Agencies" : "Inayoendeshwa na Chabrin Agencies"}
          </p>
        </div>
      </div>
    </>
  );
}
