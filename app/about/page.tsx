import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

const CheckCircleGreen = () => (
  <svg
    className="w-6 h-6 text-green-600 shrink-0 mt-1"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const PhaseCheckGreen = () => (
  <svg
    className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const PhaseClockBlue = () => (
  <svg
    className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const PhaseClockGray = () => (
  <svg
    className="w-5 h-5 text-gray-400 shrink-0 mt-0.5"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="">
            <Image
              src={"/logo/logo_black.svg"}
              alt="Logo"
              width={50}
              height={50}
              className="w-40"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/#features"
              className="text-gray-600 hover:text-primary transition hidden md:inline"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-600 hover:text-primary transition hidden md:inline"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-primary font-semibold hidden md:inline"
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-primary transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primaryHover transition font-semibold"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-linear-to-br from-green-50 to-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block bg-green-100 text-green-800 px-6 py-2 rounded-full font-semibold mb-6">
            Made in Nigeria 🇳🇬
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight fade-in">
            Finally, A Grammar Checker
            <br />
            Built for <span className="text-primary">Our English</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 fade-in">
            We built 234Grammar because we were tired of international tools
            flagging our perfectly valid Nigerian expressions as
            &quot;errors.&quot;
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-left max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircleGreen />
              <div>
                <div className="font-semibold">Founded in Lagos</div>
                <div className="text-sm text-gray-600">
                  Built by Nigerians, for Nigerians
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircleGreen />
              <div>
                <div className="font-semibold">Launched 2026</div>
                <div className="text-sm text-gray-600">
                  First Pidgin grammar checker
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircleGreen />
              <div>
                <div className="font-semibold">1000+ Users</div>
                <div className="text-sm text-gray-600">Growing community</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              The Problem We&apos;re Solving
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              International grammar checkers weren&apos;t built with Nigerian
              writers in mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-8">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-3">Payment Frustration</h3>
              <p className="text-gray-700 mb-4">
                Trying to pay for Grammarly? Good luck. Virtual dollar cards
                fail 70% of the time. Exchange rates change daily. It&apos;s a
                nightmare.
              </p>
              <div className="bg-white rounded-lg p-4 text-sm">
                <p className="font-mono text-red-600">❌ Card declined</p>
                <p className="text-gray-600 mt-1">
                  You&apos;ve probably seen this too many times
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-8">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-3">Cultural Disconnect</h3>
              <p className="text-gray-700 mb-4">
                &quot;I&apos;m coming&quot; gets flagged as wrong. &quot;Drop
                your contact&quot; is an error. &quot;No wahala&quot; confuses
                the AI. These tools don&apos;t understand us.
              </p>
              <div className="bg-white rounded-lg p-4 text-sm">
                <p className="font-mono">
                  &quot;I&apos;m{" "}
                  <span className="underline decoration-red-500 decoration-wavy">
                    coming
                  </span>{" "}
                  now&quot;
                </p>
                <p className="text-red-600 mt-1">
                  ❌ Grammarly: &quot;Did you mean &apos;going&apos;?&quot;
                </p>
              </div>
            </div>

            <div className="bg-purple-50 border-2 border-purple-100 rounded-2xl p-8">
              <div className="text-4xl mb-4">🗣</div>
              <h3 className="text-xl font-bold mb-3">No Pidgin Support</h3>
              <p className="text-gray-700 mb-4">
                75 million Nigerians speak Pidgin. BBC even has a Pidgin
                service. But not a single grammar checker supports it. Until
                now.
              </p>
              <div className="bg-white rounded-lg p-4 text-sm">
                <p className="font-mono">&quot;Wetin dey happen?&quot;</p>
                <p className="text-red-600 mt-1">
                  ❌ Other tools: Everything is &quot;wrong&quot;
                </p>
                <p className="text-green-600 mt-1">
                  ✓ 234Grammar: Correct Pidgin!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We got tired of explaining to international tools how Nigerian
              English works. So we built our own.
            </p>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-primary text-white px-4 py-2 rounded-lg font-semibold mb-6">
                Our Story
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                How 234Grammar Started
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  It started with a simple frustration. As a Nigerian developer
                  writing daily — code documentation, client emails, blog posts
                  — I kept hitting the same wall:{" "}
                  <strong>
                    every grammar checker treated Nigerian English like broken
                    English.
                  </strong>
                </p>
                <p>
                  &quot;I&apos;m coming&quot; would get flagged. &quot;Hold my
                  hand small&quot; was an error. &quot;No wahala&quot; confused
                  the AI. I found myself either ignoring suggestions or spending
                  time explaining to the tool how we actually speak.
                </p>
                <p>
                  The final straw? Trying to pay for Grammarly Premium. Three
                  virtual dollar cards. All declined. ₦5,000 in failed
                  transaction fees. Just to check my grammar.
                </p>
                <p>
                  I thought:{" "}
                  <strong>&quot;There has to be a better way.&quot;</strong>
                </p>
                <p>
                  So I built 234Grammar. A tool that understands how we write.
                  That accepts naira. That doesn&apos;t make you feel like your
                  English is &quot;wrong&quot; just because it&apos;s Nigerian.
                </p>
                <p className="text-primary font-semibold">— Henry, Founder</p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl">
                    H
                  </div>
                  <div>
                    <div className="font-bold text-lg">Henry</div>
                    <div className="text-gray-600">Founder &amp; Developer</div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Based in Lagos, Nigeria
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    <span className="text-gray-700">
                      Flutter &amp; Web Developer
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-gray-700">
                      3+ apps on Google Play
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-gray-600 italic">
                    &quot;I built 234Grammar because I needed it myself. Every
                    feature is something I wished existed when I was
                    writing.&quot;
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 rounded-full -z-10 float" />
              <div
                className="absolute -top-6 -left-6 w-24 h-24 bg-gold opacity-20 rounded-full -z-10 float"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="py-20 md:py-28 bg-primary text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Our Mission</h2>
          <p className="text-2xl md:text-3xl font-semibold mb-12 leading-relaxed max-w-4xl mx-auto opacity-90">
            &quot;Make grammar checking accessible, affordable, and culturally
            relevant for every Nigerian writer&quot;
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Accessibility</h3>
              <p className="opacity-90">
                No dollar cards. No payment failures. Just fair naira pricing
                that actually works.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <div className="text-4xl mb-4">🇳🇬</div>
              <h3 className="text-xl font-bold mb-3">Cultural Fit</h3>
              <p className="opacity-90">
                Built by Nigerians who understand how we speak, write, and
                communicate.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Quality</h3>
              <p className="opacity-90">
                Professional-grade grammar checking without compromising on
                Nigerian English.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide how we build 234Grammar
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Nigerian English is Valid English
                  </h3>
                  <p className="text-gray-700">
                    We don&apos;t treat Nigerian expressions as &quot;errors to
                    fix.&quot; Your English isn&apos;t broken — it&apos;s just
                    different. And that&apos;s exactly how it should be.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Privacy is Non-Negotiable
                  </h3>
                  <p className="text-gray-700">
                    Your writing is yours. Our grammar engine runs locally in
                    your browser. We don&apos;t read your documents. We
                    don&apos;t sell your data. Ever.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Built for the Community
                  </h3>
                  <p className="text-gray-700">
                    Every feature request matters. We listen to Nigerian
                    writers, students, and creators. This tool exists because of
                    you, and it&apos;s shaped by your feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Fair Pricing, No Games
                  </h3>
                  <p className="text-gray-700">
                    ₦1,500/month. No hidden fees. No surprise charges. No
                    &quot;premium premium&quot; tier. Just honest, transparent
                    pricing that makes sense for Nigerian pockets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE JOURNEY */}
      <section className="py-20 md:py-28 bg-linear-to-br from-green-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600">
              From idea to launch, and what&apos;s coming next
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary hidden md:block" />

            <div className="space-y-12">
              {/* Phase 1 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 md:left-5 w-6 h-6 bg-primary rounded-full border-4 border-white hidden md:block" />
                <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full font-bold text-sm">
                      COMPLETED
                    </span>
                    <span className="text-gray-500 font-semibold">
                      January 2026
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    Phase 1: Foundation
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {[
                      "Rule-based grammar engine for Nigerian English",
                      "Paystack integration for naira payments",
                      "Basic Pidgin validation",
                      // "Web app with offline capability",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <PhaseCheckGreen />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 md:left-5 w-6 h-6 bg-primary rounded-full border-4 border-white hidden md:block" />
                <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-primary">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-bold text-sm">
                      IN PROGRESS
                    </span>
                    <span className="text-gray-500 font-semibold">Q1 2026</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    Phase 2: AI Features
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {[
                      "AI-powered rewrites and suggestions",
                      "Pidgin ↔ English translation",
                      "Tone detection and adjustment",
                      "Document collaboration (Pro)",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <PhaseClockBlue />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 md:left-5 w-6 h-6 bg-gray-300 rounded-full border-4 border-white hidden md:block" />
                <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-100 opacity-75">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full font-bold text-sm">
                      PLANNED
                    </span>
                    <span className="text-gray-500 font-semibold">
                      Q2-Q3 2026
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    Phase 3: Expansion
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {[
                      "Mobile apps (iOS & Android)",
                      "Browser extensions (Chrome, Firefox)",
                      "Support for Ghanaian and Kenyan English",
                      "API for developers",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <PhaseClockGray />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            We&apos;re building 234Grammar with Nigerian writers, for Nigerian
            writers. Your feedback shapes what we build next.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <a
              href="https://x.com/234grammar"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition group"
            >
              <FaXTwitter className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-primary transition" />
              <h3 className="font-bold text-lg mb-2">Twitter/X</h3>
              <p className="text-sm text-gray-600">
                Follow for updates, tips, and Nigerian writing news
              </p>
            </a>

            <a
              href="mailto:hello@234grammar.com"
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition group"
            >
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-primary transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-sm text-gray-600">
                Questions, feedback, or just want to say hi?
              </p>
            </a>

            <Link
              href="/feedback"
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition group"
            >
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-primary transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <h3 className="font-bold text-lg mb-2">Feedback</h3>
              <p className="text-sm text-gray-600">
                Request features, report bugs, share ideas
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-linear-to-r from-primary to-green-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Write Better Nigerian English?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 1,000+ Nigerian writers using 234Grammar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-xl inline-block"
            >
              Start Free — No Card Required
            </Link>
            <Link
              href="/#pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white/10 transition inline-block"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Image
                src={"/logo/logo_white.svg"}
                alt="Logo"
                width={50}
                height={50}
                className="w-40 mb-4"
              />
              <p className="text-sm">
                Built for Nigerian &amp; West African English.
              </p>
              <p className="text-sm mt-2">Made with 💚 in Lagos, Nigeria</p>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/#features"
                    className="hover:text-white transition"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="hover:text-white transition"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/#faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:support@234grammar.com"
                    className="hover:text-white transition"
                  >
                    support@234grammar.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 234Grammar. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="https://x.comammar"
                className="hover:text-white transition"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/234grammar"
                className="hover:text-white transition"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
