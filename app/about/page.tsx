import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { ImLinkedin2 } from "react-icons/im";
import { NavAuthButtons } from "../components/NavAuthButtons";

export default function AboutPage() {
  return (
    <div className="bg-cream text-ink font-sans">

      {/* NAVBAR */}
      <nav className="bg-cream/95 backdrop-blur-sm sticky top-0 z-50 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo/logo_black.svg" alt="234Grammar" width={50} height={50} className="w-36" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/#features" className="text-ink/50 hover:text-ink transition hidden md:inline text-sm">Features</Link>
            <Link href="/#pricing" className="text-ink/50 hover:text-ink transition hidden md:inline text-sm">Pricing</Link>
            <Link href="/about" className="text-primary font-semibold hidden md:inline text-sm">About</Link>
            <NavAuthButtons />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-deepGreen text-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-xs font-semibold mb-8 border border-white/15">
            <span>🇳🇬</span>
            <span>Made in Nigeria</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl mb-6 leading-[1.0] fade-in">
            Finally, A Grammar<br />Checker Built for<br /><em className="text-gold">Our English</em>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-14 fade-in">
            We built 234Grammar because we were tired of international tools flagging our perfectly valid Nigerian expressions as &ldquo;errors.&rdquo;
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-left max-w-3xl mx-auto">
            {[
              { title: "Founded in Lagos", desc: "Built by Nigerians, for Nigerians" },
              { title: "Launched 2026", desc: "First Pidgin grammar checker" },
              { title: "1000+ Users", desc: "Growing community" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{item.title}</div>
                  <div className="text-xs text-white/45 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">The Problem</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">The Problem We&apos;re Solving</h2>
            <p className="text-ink/50 max-w-2xl mx-auto">International grammar checkers weren&apos;t built with Nigerian writers in mind</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "💳", title: "Payment Frustration",
                desc: "Trying to pay for Grammarly? Good luck. Virtual dollar cards fail 70% of the time. Exchange rates change daily.",
                example: "❌ Card declined",
                exampleNote: "You've probably seen this too many times",
                bg: "bg-red-50", border: "border-red-100",
              },
              {
                icon: "🌍", title: "Cultural Disconnect",
                desc: '"I\'m coming" gets flagged as wrong. "Drop your contact" is an error. These tools don\'t understand us.',
                example: '"I\'m coming now"',
                exampleNote: '❌ Grammarly: "Did you mean \'going\'?"',
                exampleNoteColor: "text-red-600",
                bg: "bg-amber-50", border: "border-amber-100",
              },
              {
                icon: "🗣", title: "No Pidgin Support",
                desc: "75 million Nigerians speak Pidgin. BBC has a Pidgin service. But not a single grammar checker supports it. Until now.",
                example: '"Wetin dey happen?"',
                exampleNote: "✓ 234Grammar: Correct Pidgin!",
                exampleNoteColor: "text-primary",
                bg: "bg-purple-50", border: "border-purple-100",
              },
            ].map((card, i) => (
              <div key={i} className={`${card.bg} border-2 ${card.border} rounded-2xl p-8`}>
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold mb-3 text-ink">{card.title}</h3>
                <p className="text-ink/65 text-sm mb-5 leading-relaxed">{card.desc}</p>
                <div className="bg-white rounded-xl p-4 text-sm">
                  <p className="font-mono text-ink/70 mb-1">{card.example}</p>
                  <p className={`text-xs mt-1 ${card.exampleNoteColor || 'text-ink/45'}`}>{card.exampleNote}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-ink/50 mt-10 max-w-xl mx-auto text-sm leading-relaxed">
            We got tired of explaining to international tools how Nigerian English works. So we built our own.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-5">Our Story</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink mb-8 leading-[1.05]">
                How 234Grammar <em>Started</em>
              </h2>
              <div className="space-y-4 text-ink/65 leading-relaxed">
                <p>
                  It started with a simple frustration. As a Nigerian developer writing daily — code documentation, client emails, blog posts — I kept hitting the same wall:{" "}
                  <strong className="text-ink font-semibold">every grammar checker treated Nigerian English like broken English.</strong>
                </p>
                <p>
                  &ldquo;I&apos;m coming&rdquo; would get flagged. &ldquo;Hold my hand small&rdquo; was an error. I found myself either ignoring suggestions or spending time explaining to the tool how we actually speak.
                </p>
                <p>
                  The final straw? Trying to pay for Grammarly Premium. Three virtual dollar cards. All declined. ₦5,000 in failed transaction fees. Just to check my grammar.
                </p>
                <p>
                  I thought: <strong className="text-ink font-semibold">&ldquo;There has to be a better way.&rdquo;</strong>
                </p>
                <p>
                  So I built 234Grammar. A tool that understands how we write. That accepts naira. That doesn&apos;t make you feel like your English is &ldquo;wrong&rdquo; just because it&apos;s Nigerian.
                </p>
                <p className="text-primary font-semibold">— Henry, Founder</p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 ring-1 ring-ink/10 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl font-display">H</div>
                  <div>
                    <div className="font-bold text-ink">Henry</div>
                    <div className="text-ink/45 text-sm">Founder &amp; Developer</div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { icon: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z", label: "Based in Lagos, Nigeria" },
                    { icon: "M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z", label: "Flutter & Web Developer" },
                    { icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z", label: "3+ apps on Google Play" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-ink/60">
                      <svg className="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
                      </svg>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-ink/8">
                  <p className="text-ink/55 italic text-sm leading-relaxed">
                    &ldquo;I built 234Grammar because I needed it myself. Every feature is something I wished existed when I was writing.&rdquo;
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full -z-10 float" />
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gold/20 rounded-full -z-10 float" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="py-20 md:py-28 bg-ink text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-5">Our Mission</p>
          <h2 className="font-display text-4xl md:text-5xl mb-8">Our Mission</h2>
          <p className="font-display text-2xl md:text-3xl text-white/70 mb-16 leading-relaxed max-w-3xl mx-auto italic">
            &ldquo;Make grammar checking accessible, affordable, and culturally relevant for every Nigerian writer&rdquo;
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Accessibility", desc: "No dollar cards. No payment failures. Just fair naira pricing that actually works." },
              { icon: "🇳🇬", title: "Cultural Fit", desc: "Built by Nigerians who understand how we speak, write, and communicate." },
              { icon: "⚡", title: "Quality", desc: "Professional-grade grammar checking without compromising on Nigerian English." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">Values</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">What We Stand For</h2>
            <p className="text-ink/50 max-w-xl mx-auto text-sm">The principles that guide how we build 234Grammar</p>
          </div>
          <div className="space-y-4">
            {[
              { color: "bg-primary/10", iconColor: "text-primary", title: "Nigerian English is Valid English", desc: "We don't treat Nigerian expressions as \"errors to fix.\" Your English isn't broken — it's just different. And that's exactly how it should be." },
              { color: "bg-blue-50", iconColor: "text-blue-600", title: "Privacy is Non-Negotiable", desc: "Your writing is yours. Our grammar engine runs locally in your browser. We don't read your documents. We don't sell your data. Ever." },
              { color: "bg-purple-50", iconColor: "text-purple-600", title: "Built for the Community", desc: "Every feature request matters. We listen to Nigerian writers, students, and creators. This tool exists because of you, and it's shaped by your feedback." },
              { color: "bg-amber-50", iconColor: "text-amber-600", title: "Fair Pricing, No Games", desc: "₦1,500/month. No hidden fees. No surprise charges. Just honest, transparent pricing that makes sense for Nigerian pockets." },
            ].map((item, i) => (
              <div key={i} className="bg-cream rounded-2xl p-7 ring-1 ring-ink/8 hover:ring-primary/30 transition flex items-start gap-5">
                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <span className={`text-lg ${item.iconColor}`}>✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-ink mb-1.5">{item.title}</h3>
                  <p className="text-ink/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE JOURNEY */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">Roadmap</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">Our Journey</h2>
            <p className="text-ink/50 text-sm">From idea to launch, and what&apos;s coming next</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-ink/10 hidden md:block" />
            <div className="space-y-8">
              {[
                {
                  status: "COMPLETED", statusBg: "bg-primary/10 text-primary", date: "January 2026",
                  title: "Phase 1: Foundation", borderColor: "ring-primary/20",
                  items: ["Rule-based grammar engine for Nigerian English", "Monnify integration for naira payments", "Basic Pidgin validation"],
                  itemIcon: "✓", itemColor: "text-primary",
                },
                {
                  status: "IN PROGRESS", statusBg: "bg-blue-100 text-blue-700", date: "Q1 2026",
                  title: "Phase 2: AI Features", borderColor: "ring-primary/40",
                  items: ["AI-powered rewrites and suggestions", "Pidgin ↔ English translation", "Tone detection and adjustment", "Document collaboration (Pro)"],
                  itemIcon: "◷", itemColor: "text-blue-600",
                },
                {
                  status: "PLANNED", statusBg: "bg-ink/5 text-ink/40", date: "Q2–Q3 2026",
                  title: "Phase 3: Expansion", borderColor: "ring-ink/10", opacity: "opacity-60",
                  items: ["Mobile apps (iOS & Android)", "Browser extensions (Chrome, Firefox)", "Support for Ghanaian and Kenyan English", "API for developers"],
                  itemIcon: "◷", itemColor: "text-ink/35",
                },
              ].map((phase, i) => (
                <div key={i} className={`relative pl-0 md:pl-20 ${phase.opacity || ''}`}>
                  <div className="absolute left-5 w-6 h-6 bg-cream rounded-full border-2 border-ink/20 hidden md:block" />
                  <div className={`bg-white rounded-2xl p-8 ring-1 ${phase.borderColor}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`${phase.statusBg} px-3 py-1 rounded-full font-bold text-xs`}>{phase.status}</span>
                      <span className="text-ink/35 text-sm">{phase.date}</span>
                    </div>
                    <h3 className="font-bold text-xl text-ink mb-4">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-ink/65">
                          <span className={`${phase.itemColor} shrink-0 mt-0.5`}>{phase.itemIcon}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">Community</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">Join Our Community</h2>
          <p className="text-ink/50 mb-14 max-w-xl mx-auto text-sm">
            We&apos;re building 234Grammar with Nigerian writers, for Nigerian writers. Your feedback shapes what we build next.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { href: "https://x.com/234grammar", isExternal: true, icon: <FaXTwitter className="w-8 h-8" />, title: "Twitter/X", desc: "Follow for updates, tips, and Nigerian writing news", cta: "@234grammar →" },
              { href: "mailto:hello@234grammar.com", isExternal: false, icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: "Email Us", desc: "Questions, feedback, or just want to say hi?", cta: "hello@234grammar.com" },
              { href: "/contact", isExternal: false, icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>, title: "Feedback", desc: "Request features, report bugs, share ideas", cta: "Send Feedback →" },
            ].map((item, i) => (
              <a key={i} href={item.href} {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="bg-cream rounded-2xl p-8 ring-1 ring-ink/10 hover:ring-primary/30 hover:shadow-md transition group text-center">
                <div className="flex justify-center mb-4 text-ink/30 group-hover:text-primary transition">{item.icon}</div>
                <h3 className="font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-ink/45 mb-4">{item.desc}</p>
                <span className="text-primary font-semibold text-sm">{item.cta}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-deepGreen text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-6">Get Started</p>
          <h2 className="font-display text-4xl md:text-6xl mb-6 leading-[1.0]">
            Ready to Write Better<br /><em className="text-gold">Nigerian English?</em>
          </h2>
          <p className="text-white/50 mb-10 text-lg">Join 1,000+ Nigerian writers using 234Grammar</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-gold text-ink px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition shadow-xl">
              Start Free — No Card Required
            </Link>
            <Link href="/#pricing" className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:border-white/40 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
                <li><Link href="/#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition">Pricing</Link></li>
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
                <li><Link href="/#faq" className="hover:text-white transition">FAQ</Link></li>
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
