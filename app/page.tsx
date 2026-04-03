"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosCheckmarkCircle, IoIosStar } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { ImLinkedin2 } from "react-icons/im";
import { NavAuthButtons } from "./components/NavAuthButtons";
import { useScrollReveal } from "./hooks/useScrollReveal";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Stats counter
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counts, setCounts] = useState({ checks: 0, modes: 0 });

  useScrollReveal();

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 2.5);
      setCounts({ checks: Math.round(eased * 50), modes: Math.round(eased * 3) });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [statsVisible]);

  const faqs = [
    {
      q: "How is this different from other platforms?",
      a: "234Grammar understands Nigerian English expressions like \"I'm coming\" and supports Pidgin grammar checking — all completely free with unlimited checks. Pro features start at just ₦1,500/month, paid in naira with your regular bank card.",
    },
    {
      q: "Can I really use it offline?",
      a: "Yes! The grammar engine runs in your browser using WebAssembly. After the first load, no internet connection is needed for basic grammar checking. Document sync requires internet.",
    },
    {
      q: "Do you really support Pidgin?",
      a: "Yes! Full Pidgin grammar checking is available to everyone — vocabulary recognition, structure validation, and style suggestions. Coming soon: Pidgin ↔ English translation.",
    },
    {
      q: "How do I pay?",
      a: "Pay in naira through Monnify using your debit card, bank transfer, or USSD. No virtual dollar cards needed. Cancel anytime with one click.",
    },
    {
      q: "Is my writing data private?",
      a: "Yes. Grammar checking happens locally in your browser — your text never leaves your device. Only saved documents (if you choose to save) are stored encrypted on our servers. We never sell or share your writing.",
    },
  ];

  return (
    <div className="bg-cream text-ink font-sans">

      {/* ── NAVBAR ── */}
      <nav className="bg-cream/95 backdrop-blur-sm sticky top-0 z-50 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Image src="/logo/logo_black.svg" alt="234Grammar" width={50} height={50} className="w-36" />

          <button
            className="md:hidden text-ink"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-ink/50 hover:text-ink transition text-sm font-medium">Features</a>
            <a href="#pricing" className="text-ink/50 hover:text-ink transition text-sm font-medium">Pricing</a>
            <a href="#faq" className="text-ink/50 hover:text-ink transition text-sm font-medium">FAQ</a>
            <NavAuthButtons />
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-6 border-t border-ink/10 bg-cream">
            <a href="#features" className="block py-3 text-sm text-ink/60 hover:text-ink border-b border-ink/5">Features</a>
            <a href="#pricing" className="block py-3 text-sm text-ink/60 hover:text-ink border-b border-ink/5">Pricing</a>
            <a href="#faq" className="block py-3 text-sm text-ink/60 hover:text-ink border-b border-ink/5">FAQ</a>
            <div className="pt-4"><NavAuthButtons mobile /></div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-cream min-h-[92vh] flex items-center py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative">

          {/* Left — staggered entrance */}
          <div>
            <div className="hero-fade hero-fade-1 inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8 border border-primary/20">
              <span>🇳🇬</span>
              <span>Built for Nigerian Writers</span>
            </div>

            <h1 className="font-display text-[3.5rem] md:text-[5rem] leading-none mb-8 text-ink tracking-tight">
              <span className="hero-line hero-line-1">Grammar that</span>
              <span className="hero-line hero-line-2">
                <em className="text-primary">gets</em> Nigeria.
              </span>
            </h1>

            <p className="hero-fade hero-fade-1 text-lg text-ink/55 mb-8 max-w-sm leading-relaxed">
              Check your grammar in Nigerian English, Standard English, or Pidgin — <strong className="text-ink font-semibold">completely free</strong>. No limits. No dollar cards. No wahala.
            </p>

            <div className="hero-fade hero-fade-2 flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/signup"
                className="bg-primary text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-primaryHover active:scale-95 transition shadow-lg shadow-primary/20 text-center">
                Get Started Free
              </Link>
              <a href="#features"
                className="px-7 py-3.5 rounded-xl font-semibold border-2 border-ink/15 hover:border-ink/30 active:scale-95 transition text-center">
                See How It Works
              </a>
            </div>

            <div className="hero-fade hero-fade-3 flex flex-wrap gap-5 text-sm text-ink/45">
              {["Unlimited free checks", "No login for basic use", "Works offline"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <IoIosCheckmarkCircle className="text-primary w-4 h-4 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right — slides in from right */}
          <div className="relative hero-card">
            <div className="absolute -top-5 -right-3 md:right-0 z-10 bg-white rounded-2xl shadow-xl border border-ink/10 px-4 py-3 text-sm max-w-50">
              <div className="flex items-center gap-1.5 text-primary font-semibold mb-1 text-xs">
                <IoIosCheckmarkCircle className="w-4 h-4" />
                Nigerian English ✓
              </div>
              <p className="text-ink/60 text-xs leading-snug">&ldquo;I&apos;m coming&rdquo; means &ldquo;I&apos;ll be right back&rdquo;</p>
            </div>

            <div className="absolute -bottom-4 -left-3 md:-left-6 z-10 bg-white rounded-2xl shadow-xl border border-ink/10 px-4 py-3 text-sm max-w-47.5">
              <div className="flex items-center gap-1.5 text-purple-600 font-semibold mb-1 text-xs">
                <IoIosCheckmarkCircle className="w-4 h-4" />
                Pidgin Valid ✓
              </div>
              <p className="text-ink/60 text-xs leading-snug">&ldquo;No fit&rdquo; = can&apos;t. Pidgin copula recognized.</p>
            </div>

            <div className="bg-ink rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <div className="bg-white/5 px-5 py-3.5 flex items-center gap-2 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-white/25 text-xs ml-3 font-mono">cover-letter.txt</span>
                <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full bg-primary/25 text-primary font-semibold">🇳🇬 Nigerian English</span>
              </div>

              <div className="p-6 min-h-52 font-mono text-sm leading-loose">
                <p className="text-white/75">
                  I&apos;m{" "}
                  <span className="border-b-2 border-dotted border-purple-400 cursor-help">coming</span>
                  {" "}now o. Please{" "}
                  <span className="border-b-2 border-dotted border-gold cursor-help">drop your contact</span>
                  {" "}wen you reach.
                </p>
                <p className="text-white/75 mt-3">
                  Wetin dey happen? I{" "}
                  <span className="border-b-2 border-dotted border-purple-400 cursor-help">no fit</span>
                  {" "}come tomorrow sha.
                </p>
                <p className="text-white/75 mt-3">
                  The report{" "}
                  <span className="border-b-2 border-wavy border-red-400 cursor-help">dont</span>
                  {" "}cover the full scope.
                </p>
                <span className="inline-block w-0.5 h-4 bg-white/50 animate-pulse ml-0.5 mt-1" />
              </div>

              <div className="border-t border-white/10 px-6 py-3 flex items-center justify-between text-xs text-white/35">
                <span>
                  <span className="text-green-400 font-medium">✓ 0 expr. errors</span>
                  {" · "}
                  <span className="text-red-400">1 spelling</span>
                </span>
                <span className="text-purple-400">4 Nigerian expressions</span>
                <Link href="/signup" className="text-gold hover:text-gold/70 transition font-semibold">Try editor →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-ink text-white py-14">
        <div ref={statsRef} className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div data-reveal="up" data-delay="1">
              <div className="font-display text-3xl md:text-4xl text-gold tabular-nums">
                {statsVisible ? counts.checks : 0}
              </div>
              <div className="text-white/40 text-sm mt-1.5">Free documents</div>
            </div>
            <div data-reveal="up" data-delay="2">
              <div className="font-display text-3xl md:text-4xl text-gold">₦1,500</div>
              <div className="text-white/40 text-sm mt-1.5">Pro plan/month</div>
            </div>
            <div data-reveal="up" data-delay="3">
              <div className="font-display text-3xl md:text-4xl text-gold tabular-nums">
                {statsVisible ? counts.modes : 0}
              </div>
              <div className="text-white/40 text-sm mt-1.5">Language modes</div>
            </div>
            <div data-reveal="up" data-delay="4">
              <div className="font-display text-3xl md:text-4xl text-gold">🇳🇬</div>
              <div className="text-white/40 text-sm mt-1.5">Built for Nigeria</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div data-reveal="left">
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-5">The Problem</p>
              <h2 className="font-display text-4xl md:text-[3.5rem] leading-[1.05] text-ink mb-6">
                Writing shouldn&apos;t<br />be this <em>frustrating.</em>
              </h2>
              <p className="text-ink/55 text-lg leading-relaxed">
                International grammar tools weren&apos;t built for Nigerian English. They flag your perfectly correct expressions as errors — because they&apos;ve never heard of &ldquo;no wahala.&rdquo;
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: "💳", title: "Payment Stress", desc: "Stop buying virtual dollar cards and dealing with declined payments just to check your grammar." },
                { icon: "🌍", title: "Cultural Mismatch", desc: "International tools flag valid Nigerian expressions like \"I'm coming,\" \"No wahala,\" and \"Drop your contact\" as errors." },
              ].map((item, i) => (
                <div key={i} data-reveal="right" data-delay={String(i + 1)}
                  className="bg-white rounded-2xl p-6 border border-ink/10 flex gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <span className="text-3xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-ink mb-1.5">{item.title}</h4>
                    <p className="text-ink/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-28 bg-deepGreen text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div data-reveal="up">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-5 text-center">Testimonials</p>
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16">
              What Nigerian Writers Are Saying
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Finally! No more virtual dollar card wahala just to check my grammar. And it understands Nigerian English!", name: "Chidi O.", role: "Content Creator, Lagos" },
              { quote: "The Pidgin mode is a game changer. I can write my content naturally now without everything being flagged as wrong.", name: "Amaka J.", role: "Student, UNILAG" },
              { quote: "₦1,500 vs ₦20,000 for other platforms? Easy choice. Plus it actually understands how we write in Nigeria.", name: "Tunde M.", role: "Freelance Writer" },
            ].map((t, i) => (
              <div key={i} data-reveal="up" data-delay={String(i + 1)}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:-translate-y-1 transition-all duration-200 flex flex-col">
                <div className="flex gap-0.5 mb-5">
                  {Array(5).fill(0).map((_, j) => (
                    <IoIosStar key={j} className="text-gold w-4 h-4" />
                  ))}
                </div>
                <p className="text-white/75 leading-relaxed italic flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-white/35 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div data-reveal="up">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-5 text-center">Why 234Grammar</p>
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-ink">
              Built Different, <em>By Design</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div data-reveal="up" data-delay="1"
              className="rounded-2xl p-8 bg-white ring-1 ring-ink/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              style={{ borderLeft: "4px solid #008751" }}>
              <span className="text-3xl mb-5 block">🇳🇬</span>
              <h4 className="text-xl font-bold mb-3 text-primary">Nigerian English</h4>
              <p className="text-ink/55 mb-6 text-sm leading-relaxed">
                Other platforms flag &ldquo;I&apos;m coming&rdquo; as wrong. We understand it means &ldquo;I&apos;ll be right back.&rdquo;
              </p>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <p className="font-mono text-sm text-ink/70 mb-2">&ldquo;Please hold my hand small&rdquo;</p>
                <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <IoIosCheckmarkCircle className="w-4 h-4" />
                  Valid Nigerian expression
                </p>
              </div>
            </div>

            <div data-reveal="up" data-delay="2"
              className="rounded-2xl p-8 bg-white ring-1 ring-ink/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              style={{ borderLeft: "4px solid #9333ea" }}>
              <span className="text-3xl mb-5 block">🗣</span>
              <h4 className="text-xl font-bold mb-3 text-purple-700">Nigerian Pidgin</h4>
              <p className="text-ink/55 mb-6 text-sm leading-relaxed">
                First grammar checker to understand and validate Nigerian Pidgin grammar structures.
              </p>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="font-mono text-sm text-ink/70 mb-2">&ldquo;Wetin dey happen? I no fit come&rdquo;</p>
                <p className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
                  <IoIosCheckmarkCircle className="w-4 h-4" />
                  Valid Pidgin grammar
                </p>
              </div>
            </div>

            <div data-reveal="up" data-delay="3"
              className="rounded-2xl p-8 bg-white ring-1 ring-ink/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              style={{ borderLeft: "4px solid #f59e0b" }}>
              <span className="text-3xl mb-5 block">💳</span>
              <h4 className="text-xl font-bold mb-3 text-amber-700">Pay in Naira</h4>
              <p className="text-ink/55 mb-6 text-sm leading-relaxed">
                No virtual dollar cards. No declined payments. No exchange rate surprises.
              </p>
              <div className="space-y-2.5">
                {["Monnify (card, transfer, USSD)", "₦1,500/month (93% cheaper)", "Cancel anytime"].map((b, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-ink/65">
                    <IoIosCheckmarkCircle className="w-4 h-4 text-amber-600 shrink-0" />{b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LANGUAGE MODES ── */}
      <section id="features" className="py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div data-reveal="up">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-5 text-center">Language Modes</p>
            <h2 className="font-display text-4xl md:text-5xl text-center mb-4 text-ink">
              Three Modes. <em>One Tool.</em>
            </h2>
            <p className="text-center text-ink/45 mb-16 max-w-md mx-auto text-sm">
              Switch depending on your writing context — formal, local, or Pidgin.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { flag: "🇳🇬", title: "Nigerian English", bg: "bg-primary", textBase: "text-white", textMuted: "text-white/60", desc: "Understands local expressions and won't flag valid Nigerian usage as errors.", items: ["\"I'm coming\" recognized", "Terminal intensifiers (o, na, sha)", "Local idioms validated"] },
              { flag: "🇬🇧", title: "Standard English", bg: "bg-white", textBase: "text-ink", textMuted: "text-ink/55", desc: "Strict British and American grammar rules for formal writing and international audiences.", items: ["Academic writing", "Business correspondence", "International clients"] },
              { flag: "🗣", title: "Pidgin Mode", bg: "bg-ink", textBase: "text-white", textMuted: "text-white/55", desc: "Validates common Pidgin structures and vocabulary for authentic Nigerian communication.", items: ["\"Wetin dey happen?\" valid", "Copula variations (dey, be, na)", "Pidgin vocabulary recognized"] },
            ].map((mode, i) => (
              <div key={i} data-reveal="up" data-delay={String(i + 1)}
                className={`${mode.bg} rounded-2xl p-8 ring-1 ring-ink/10 hover:-translate-y-1 transition-transform duration-200`}>
                <span className="text-4xl mb-5 block">{mode.flag}</span>
                <h4 className={`text-xl font-bold mb-3 ${mode.textBase}`}>{mode.title}</h4>
                <p className={`${mode.textMuted} text-sm mb-6 leading-relaxed`}>{mode.desc}</p>
                <ul className="space-y-2.5">
                  {mode.items.map((item, j) => (
                    <li key={j} className={`text-sm ${mode.textMuted} flex items-start gap-2`}>
                      <span className="text-gold mt-0.5 shrink-0">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div data-reveal="up">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-5 text-center">Compare</p>
            <h2 className="font-display text-4xl md:text-5xl text-center mb-4 text-ink">
              Why Choose <em>234Grammar</em>
            </h2>
            <p className="text-center text-ink/45 mb-14 max-w-md mx-auto text-sm">
              See how we compare to international grammar checkers
            </p>
          </div>

          <div data-reveal="scale" className="overflow-x-auto rounded-2xl shadow-lg ring-1 ring-ink/10">
            <table className="w-full">
              <thead className="bg-ink text-white">
                <tr>
                  <th className="text-left p-5 md:p-6 font-medium text-white/50 text-sm">Feature</th>
                  <th className="text-center p-5 md:p-6 font-bold text-gold">234Grammar</th>
                  <th className="text-center p-5 md:p-6 font-medium text-white/50 text-sm">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5 bg-white">
                {["Payment in Naira", "Nigerian English Support", "Pidgin Grammar Checking"].map((feature, i) => (
                  <tr key={i} className="hover:bg-primary/3 transition">
                    <td className="p-5 md:p-6 font-medium text-ink text-sm">{feature}</td>
                    <td className="p-5 md:p-6 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-primary/10 rounded-full">
                        <IoIosCheckmarkCircle className="w-5 h-5 text-primary" />
                      </span>
                    </td>
                    <td className="p-5 md:p-6 text-center text-red-400 font-bold text-lg">✗</td>
                  </tr>
                ))}
                <tr className="hover:bg-gold/5 transition" style={{ borderTop: "2px solid rgba(252,209,42,0.3)" }}>
                  <td className="p-5 md:p-6 font-bold text-ink">Monthly Price</td>
                  <td className="p-5 md:p-6 text-center">
                    <div className="font-display text-2xl text-primary">₦1,500</div>
                    <div className="text-xs text-primary/60 font-semibold mt-0.5">Launch price</div>
                  </td>
                  <td className="p-5 md:p-6 text-center text-ink/40 font-medium">₦20,000+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p data-reveal="up" className="text-center text-ink/45 mt-8 text-sm">
            <strong className="text-primary">93% cheaper</strong> than other platforms — with features they don&apos;t have
          </p>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div data-reveal="up">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-5 text-center">Who It&apos;s For</p>
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-ink">
              Perfect <em>For Everyone</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: "🎓", title: "Students", desc: "JAMB, WAEC, university essays, and assignments" },
              { icon: "✍️", title: "Content Creators", desc: "Blogs, YouTube scripts, social media posts" },
              { icon: "💼", title: "Professionals", desc: "Business emails, proposals, and reports" },
              { icon: "🌍", title: "Freelancers", desc: "Compete globally with polished English" },
            ].map((uc, i) => (
              <div key={i} data-reveal="up" data-delay={String(i + 1)}
                className="bg-white rounded-2xl p-6 border border-ink/10 text-center hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{uc.icon}</div>
                <h4 className="font-bold text-ink mb-2 text-sm">{uc.title}</h4>
                <p className="text-xs text-ink/45 leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARLY ADOPTER ── */}
      <section className="py-20 md:py-28 bg-ink text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div data-reveal="up">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-5 text-center">Early Access</p>
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16">
              Early Adopter <em className="text-gold">Benefits</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🚀", title: "First Access to New Features", desc: "Get AI-powered rewrites and Pidgin translation before anyone else when we launch them." },
              { icon: "💬", title: "Shape the Product", desc: "Your feedback directly influences what features we build next." },
            ].map((b, i) => (
              <div key={i} data-reveal="up" data-delay={String(i + 1)}
                className="border border-white/10 rounded-2xl p-8 hover:border-gold/30 hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-4xl mb-5">{b.icon}</div>
                <h4 className="font-bold text-xl mb-3">{b.title}</h4>
                <p className="text-white/50 leading-relaxed text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div data-reveal="up">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-5 text-center">Pricing</p>
            <h2 className="font-display text-4xl md:text-5xl text-center mb-4 text-ink">
              Simple, Honest <em>Pricing</em>
            </h2>
            <p className="text-center text-ink/45 mb-16 max-w-md mx-auto text-sm">
              No hidden fees. No dollar conversion. Just fair naira pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* FREE */}
            <div data-reveal="left" className="rounded-2xl p-8 ring-1 ring-ink/12 hover:ring-ink/20 transition-all duration-200">
              <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-5">Free</p>
              <div className="font-display text-5xl text-ink mb-1">₦0</div>
              <p className="text-ink/35 text-sm mb-8">Forever free</p>
              <ul className="space-y-3 mb-8">
                {["Unlimited grammar checks", "Nigerian English validation", "Full Pidgin support", "AI rewrite, summarize & tone", "Pidgin ↔ English translation", "50 document saves", "Export to PDF, DOCX, TXT"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-ink/65">
                    <IoIosCheckmarkCircle className="text-primary w-4 h-4 shrink-0" />{item}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center border-2 border-ink/15 text-ink py-3 rounded-xl hover:border-primary hover:text-primary active:scale-95 transition font-semibold text-sm">
                Start Free Now
              </Link>
            </div>

            {/* PRO */}
            <div data-reveal="right" className="rounded-2xl p-8 bg-ink text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gold text-ink text-xs font-bold px-4 py-2 rounded-bl-2xl">BEST VALUE</div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">Pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <div className="font-display text-5xl text-gold">₦1,500</div>
                <span className="text-white/35 text-sm">/month</span>
              </div>
              <p className="text-white/35 text-sm mb-8">Billed monthly · Cancel anytime</p>
              <ul className="space-y-3 mb-8">
                {[
                  { text: "Everything in Free", bold: true },
                  { text: "100 document saves", bold: false },
                  { text: "Priority support", bold: false },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <IoIosCheckmarkCircle className="text-gold w-4 h-4 shrink-0" />
                    <span className={item.bold ? "text-white font-semibold" : "text-white/60"}>{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center bg-gold text-ink py-3.5 rounded-xl hover:bg-yellow-300 active:scale-95 transition font-bold text-sm mb-4">
                Upgrade to Pro — ₦1,500/month
              </Link>
              <p className="text-center text-white/25 text-xs">Pay with Monnify · Card, Bank Transfer, USSD</p>
            </div>
          </div>

          {/* Coming soon teaser */}
          <div data-reveal="up" className="mt-12 max-w-3xl mx-auto rounded-2xl border border-ink/10 p-8 bg-cream">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🚀</span>
              <div className="flex-1">
                <h4 className="font-bold text-ink mb-1">Coming Soon to Pro</h4>
                <p className="text-ink/45 text-sm mb-5">These features are in development for Pro subscribers:</p>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { icon: "🤖", title: "AI Rewrites", desc: "Smart suggestions for clarity" },
                    { icon: "🔄", title: "Translation", desc: "Pidgin ↔ English instantly" },
                    { icon: "🎯", title: "Tone Detection", desc: "Match your writing style" },
                  ].map((f, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-ink/10 flex items-start gap-3">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <p className="font-semibold text-ink text-sm">{f.title}</p>
                        <p className="text-xs text-ink/40 mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-28 bg-cream">
        <div className="max-w-3xl mx-auto px-6">
          <div data-reveal="up">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-5 text-center">FAQ</p>
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-ink">
              Got <em>Questions?</em>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} data-reveal="up" data-delay={String(i + 1)}>
              <div
                className={`bg-white rounded-xl border-2 transition-all duration-200 ${openFaq === i ? "border-primary" : "border-ink/8 hover:border-ink/15"}`}>
                <button
                  className="w-full p-6 text-left flex justify-between items-center gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-ink text-sm leading-snug">{faq.q}</span>
                  <svg className={`w-5 h-5 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180 text-primary" : "text-ink/25"}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <p className="text-ink/55 px-6 pb-6 text-sm leading-relaxed">{faq.a}</p>
                )}
              </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-32 bg-deepGreen text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p data-reveal="up" className="text-gold text-xs font-semibold uppercase tracking-widest mb-6">Get Started</p>
          <h2 data-reveal="scale" className="font-display text-5xl md:text-7xl mb-6 leading-none">
            Start Writing<br /><em className="text-gold">Smarter</em> Today.
          </h2>
          <p data-reveal="up" data-delay="1" className="text-white/50 text-lg mb-12 max-w-md mx-auto leading-relaxed">
            Join Nigerian writers who&apos;ve stopped paying for grammar checking in dollars.
          </p>
          <div data-reveal="up" data-delay="2" className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/signup"
              className="bg-gold text-ink px-8 py-4 rounded-xl text-base font-bold hover:bg-yellow-300 active:scale-95 transition shadow-xl shadow-gold/20">
              Start Free — No Card Required
            </Link>
            <a href="#pricing"
              className="border-2 border-white/20 text-white px-8 py-4 rounded-xl text-base font-semibold hover:border-white/40 active:scale-95 transition">
              View Pricing
            </a>
          </div>
          <p data-reveal="up" data-delay="3" className="text-white/25 text-sm tracking-wide">
            ✓ Free plan available &nbsp;·&nbsp; ✓ Pay in Naira &nbsp;·&nbsp; ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-ink text-white/35 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <Image src="/logo/logo_white.svg" alt="234Grammar" width={50} height={50} className="w-36 mb-5" />
              <p className="text-sm leading-relaxed">Built for Nigerian &amp; West African English.</p>
              <p className="text-sm mt-2">Made with 💚 in Lagos, Nigeria</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4 text-sm">Product</h5>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><Link href="/signup" className="hover:text-white transition">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Login</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4 text-sm">Company</h5>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4 text-sm">Support</h5>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><a href="mailto:support@234grammar.com" className="hover:text-white transition">support@234grammar.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 234Grammar. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="https://x.com/234grammar" className="hover:text-white transition" aria-label="Twitter"><FaXTwitter className="w-5 h-5" /></a>
              <a href="https://linkedin.com/company/234grammar" className="hover:text-white transition" aria-label="LinkedIn"><ImLinkedin2 className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
