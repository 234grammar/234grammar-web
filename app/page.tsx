"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosCheckmarkCircle, IoIosStar } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { ImLinkedin2 } from "react-icons/im";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How is this different from other platforms?",
      a: '234Grammar understands Nigerian English expressions like "I\'m coming" and supports Pidgin grammar checking. Plus, you pay in naira (₦1,500 vs ₦20,000+) with your regular bank card — no virtual dollar cards needed.',
    },
    {
      q: "Can I really use it offline?",
      a: "Yes! The grammar engine runs in your browser using WebAssembly. After the first load, no internet connection is needed for basic grammar checking. Document sync requires internet.",
    },
    {
      q: "Do you really support Pidgin?",
      a: "Yes! Free tier validates basic Pidgin grammar structures. Pro tier includes enhanced Pidgin checking with style suggestions. Coming soon: Pidgin ↔ English translation for Pro users.",
    },
    {
      q: "How do I pay?",
      a: "Pay in naira through Paystack using your debit card, bank transfer, or USSD. No virtual dollar cards needed. Cancel anytime with one click.",
    },
    {
      q: "What happens after the 7-day trial?",
      a: "After 7 days, you'll be charged ₦1,500/month. You can cancel anytime during the trial with no charges. We'll send you a reminder 2 days before the trial ends.",
    },
    {
      q: "Will the price really stay at ₦1,500 forever?",
      a: "Yes! This is our launch price for early adopters. When we add AI features (rewrites, translation), new users will pay ₦3,500/month — but you'll keep ₦1,500/month as long as you stay subscribed.",
    },
    {
      q: "Is my writing data private?",
      a: "Yes. Grammar checking happens locally in your browser — your text never leaves your device. Only saved documents (if you choose to save) are stored encrypted on our servers. We never sell or share your writing.",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Image
            src={"/logo/logo_black.svg"}
            alt="Logo"
            width={50}
            height={50}
            className="w-40"
          />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <IoMenu className="w-6 h-6" />
          </button>

          {/* Desktop Menu */}
          <div className="space-x-6 hidden md:flex items-center">
            <a
              href="#features"
              className="text-gray-600 hover:text-primary transition"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-primary transition"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-primary transition"
            >
              FAQ
            </a>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 border-t">
            <a
              href="#features"
              className="block py-3 text-gray-600 hover:text-primary"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block py-3 text-gray-600 hover:text-primary"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="block py-3 text-gray-600 hover:text-primary"
            >
              FAQ
            </a>
            <Link
              href="/login"
              className="block py-3 text-gray-600 hover:text-primary"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block mt-3 bg-primary text-white px-5 py-3 rounded-lg text-center font-semibold hover:bg-primaryHover transition"
            >
              Start Free
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Pay less for grammar checking
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              For just <strong className=" text-primary">₦1,500/month</strong>,
              get grammar checking that actually understands Nigerian English
              and supports Pidgin. No dollar cards needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/signup"
                className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primaryHover transition text-center shadow-lg hover:shadow-xl"
              >
                Start Free — No Login Required
              </Link>
              <a
                href="#features"
                className="border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:border-primary hover:text-primary transition text-center"
              >
                See How It Works
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              {["100% Offline", "Pay in Naira"].map((item) => (
                <div key={item} className="flex items-center">
                  <IoIosCheckmarkCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Demo Preview */}
          <div className="bg-white shadow-2xl rounded-2xl p-6 border-2 border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-500 text-sm font-medium">Try it live:</p>
              <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-semibold">
                🇳🇬 Nigerian English
              </span>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border-2 border-gray-200 min-h-45 mb-4">
              <section className="text-gray-800 leading-relaxed text-base">
                I&apos;m{" "}
                <span className="relative inline-block group cursor-help">
                  <span className="underline decoration-purple-500 decoration-2 decoration-wavy animate-pulse-slow">
                    coming
                  </span>
                  <span className="absolute bottom-full left-0 mb-2 w-72 p-4 bg-white shadow-xl rounded-lg border-2 border-purple-200 text-sm text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <span className="text-purple-600 font-bold flex items-center mb-2">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Nigerian English ✓
                    </span>
                    <p className="text-gray-700">
                      &quot;I&apos;m coming&quot; means &quot;I&apos;ll be right
                      back&quot; in Nigerian English.
                    </p>
                    <p className="text-green-600 text-xs mt-2 font-semibold">
                      No correction needed
                    </p>
                  </span>
                </span>{" "}
                now o. Please{" "}
                <span className="relative inline-block group cursor-help">
                  <span className="underline decoration-green-500 decoration-2 decoration-wavy">
                    drop your contact
                  </span>
                  <span className="absolute bottom-full left-0 mb-2 w-72 p-4 bg-white shadow-xl rounded-lg border-2 border-green-200 text-sm text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <span className="text-green-600 font-bold flex items-center mb-2">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Nigerian English ✓
                    </span>
                    <p className="text-gray-700">
                      &quot;Drop your contact&quot; means &quot;share your phone
                      number&quot; in Nigerian context.
                    </p>
                    <p className="text-green-600 text-xs mt-2 font-semibold">
                      Correctly recognized
                    </p>
                  </span>
                </span>
                .
              </section>
              <p className="text-gray-400 text-sm mt-3 italic">
                Hover over underlined text
              </p>
            </div>
            <div className="flex justify-between items-center text-sm border-t pt-4">
              <div className="text-gray-600">
                <span className="text-green-600 font-semibold">✓ 0 errors</span>{" "}
                •{" "}
                <span className="text-purple-600">
                  2 Nigerian expressions recognized
                </span>
              </div>
              <Link
                href="/signup"
                className="text-primary font-semibold hover:underline"
              >
                Try full editor →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white py-8 border-y">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm mb-6">
            Trusted by Nigerian writers and students
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-40">
            <span className="font-semibold text-lg">
              Students • Writers • Professionals
            </span>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Writing Shouldn&apos;t Be This Frustrating.
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              International tools weren&apos;t built for Nigerian English. We
              were.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💳",
                title: "Payment Stress",
                desc: "Stop buying virtual dollar cards and dealing with declined payments just to check your grammar.",
              },
              {
                icon: "🌍",
                title: "Cultural Mismatch",
                desc: 'International tools flag valid Nigerian expressions like "I\'m coming," "No wahala," and "Drop your contact" as errors.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-xs border-2 border-gray-100 hover:border-primary transition"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">
                  {item.title}
                </h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">
            What Nigerian Writers Are Saying
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  '"Finally! No more virtual dollar card wahala just to check my grammar. And it understands Nigerian English!"',
                name: "— Chidi O.",
                role: "Content Creator, Lagos",
              },
              {
                quote:
                  '"The Pidgin mode is a game changer. I can write my content naturally now without everything being flagged as wrong."',
                name: "— Amaka J.",
                role: "Student, UNILAG",
              },
              {
                quote:
                  '"₦1,500 vs ₦20,000 for other platforms? Easy choice. Plus it actually understands how we write in Nigeria."',
                name: "— Tunde M.",
                role: "Freelance Writer",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200"
              >
                <div className="flex items-center  mb-4">
                  <IoIosStar className="text-yellow-400" />
                  <IoIosStar className="text-yellow-400" />
                  <IoIosStar className="text-yellow-400" />
                  <IoIosStar className="text-yellow-400" />
                  <IoIosStar className="text-yellow-400" />
                </div>
                <p className="text-gray-700 mb-4 italic">{t.quote}</p>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Makes 234Grammar Different
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-linear-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-8 hover:shadow-xl transition">
              <h4 className="text-2xl font-bold mb-4 text-green-900 flex items-center">
                <span className="text-3xl mr-3">🇳🇬</span>Built for Nigerian
                English
              </h4>
              <p className="text-gray-700 mb-6 text-lg">
                Other platforms flag &quot;I&apos;m coming&quot; as wrong. We
                understand it means &quot;I&apos;ll be right back&quot; in
                Nigerian context.
              </p>
              <div className="bg-white rounded-xl p-5 border-2 border-green-100">
                <p className="font-mono text-sm mb-3 text-gray-800">
                  &quot;Please{" "}
                  <span className="underline decoration-green-500 decoration-2">
                    hold my hand
                  </span>{" "}
                  small&quot;
                </p>
                <p className="text-green-700 font-semibold flex items-center">
                  <IoIosCheckmarkCircle className="w-5 h-5 mr-2 text-green-600" />
                  Valid Nigerian expression — means &quot;help me a bit&quot;
                </p>
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-8 hover:shadow-xl transition">
              <h4 className="text-2xl font-bold mb-4 text-purple-900 flex items-center">
                <span className="text-3xl mr-3">🗣</span>Nigerian Pidgin Support
              </h4>
              <p className="text-gray-700 mb-6 text-lg">
                First grammar checker to understand and validate Nigerian Pidgin
                grammar structures.
              </p>
              <div className="bg-white rounded-xl p-5 border-2 border-purple-100">
                <p className="font-mono text-sm mb-3 text-gray-800">
                  &quot;Wetin dey happen? I no fit come today o&quot;
                </p>
                <p className="text-purple-700 font-semibold flex items-center">
                  <IoIosCheckmarkCircle className="w-5 h-5 mr-2" />
                  Valid Pidgin grammar — no corrections needed
                </p>
              </div>
            </div>

            <div className="bg-linear-to-br from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-8 hover:shadow-xl transition">
              <h4 className="text-2xl font-bold mb-4 text-orange-900 flex items-center">
                <span className="text-3xl mr-3">💳</span>Pay in Naira, Instantly
              </h4>
              <p className="text-gray-700 mb-6 text-lg">
                No virtual dollar cards. No declined payments. No exchange rate
                surprises.
              </p>
              <div className="space-y-3">
                {[
                  "Paystack payment (card, transfer, USSD)",
                  "₦1,500/month (93% cheaper than other platforms)",
                  "Cancel anytime, no questions asked",
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <IoIosCheckmarkCircle className="w-5 h-5 text-orange-600 mr-3 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGE MODES */}
      <section id="features" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Three Language Modes
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Switch between modes depending on your writing context
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                flag: "🇳🇬",
                title: "Nigerian English",
                desc: "Understands local expressions and won't flag valid Nigerian usage as errors.",
                items: [
                  '"I\'m coming" recognized',
                  "Terminal intensifiers (o, na, sha)",
                  "Local idioms validated",
                ],
              },
              {
                flag: "🇬🇧",
                title: "Standard English",
                desc: "Strict British and American grammar rules for formal writing and international audiences.",
                items: [
                  "Academic writing",
                  "Business correspondence",
                  "International clients",
                ],
              },
              {
                flag: "🗣",
                title: "Pidgin Mode",
                desc: "Validates common Pidgin structures and vocabulary for authentic Nigerian communication.",
                items: [
                  '"Wetin dey happen?" valid',
                  "Copula variations (dey, be, na)",
                  "Pidgin vocabulary recognized",
                ],
              },
            ].map((mode, i) => (
              <div
                key={i}
                className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{mode.flag}</div>
                <h4 className="text-xl font-bold mb-4">{mode.title}</h4>
                <p className="text-gray-600 mb-4">{mode.desc}</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  {mode.items.map((item, j) => (
                    <li key={j} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Nigerian Writers Choose 234Grammar
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            See how we compare to international grammar checkers
          </p>
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border-2 border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left p-4 md:p-6 font-bold">Feature</th>
                  <th className="text-center p-4 md:p-6 font-bold text-primary">
                    234Grammar
                  </th>
                  <th className="text-center p-4 md:p-6 font-bold text-gray-600">
                    Other platforms
                  </th>
                  {/* <th className="text-center p-4 md:p-6 font-bold text-gray-600">
                    LanguageTool
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { feature: "Payment in Naira", highlight: false },
                  { feature: "Nigerian English Support", highlight: true },
                  { feature: "Pidgin Grammar Checking", highlight: false },
                  // { feature: "Works Offline", highlight: true },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className={`${row.highlight ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"} transition`}
                  >
                    <td className="p-4 md:p-6 font-medium">{row.feature}</td>
                    <td className="p-4 md:p-6 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <IoIosCheckmarkCircle className="w-5 h-5 text-green-600" />
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-center">
                      <span className="text-red-600 font-bold text-xl">✗</span>
                    </td>
                    {/* <td className="p-4 md:p-6 text-center">
                      {row.feature === "Works Offline" ? (
                        <span className="text-yellow-600 text-sm">Partial</span>
                      ) : (
                        <span className="text-red-600 font-bold text-xl">
                          ✗
                        </span>
                      )}
                    </td> */}
                  </tr>
                ))}
                <tr className="hover:bg-gray-50 transition border-t-2 border-primary">
                  <td className="p-4 md:p-6 font-bold">Monthly Price</td>
                  <td className="p-4 md:p-6 text-center">
                    <div className="font-bold text-2xl text-primary">
                      ₦1,500
                    </div>
                    <div className="text-xs text-green-600 font-semibold mt-1">
                      Launch price
                    </div>
                  </td>
                  <td className="p-4 md:p-6 text-center text-gray-600">
                    <div className="font-semibold">₦20,000+</div>
                  </td>
                  {/* <td className="p-4 md:p-6 text-center text-gray-600">
                    <div className="font-semibold">Free / €5</div>
                  </td> */}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-600 mt-8">
            <strong className="text-primary">93% cheaper</strong> than other
            platforms with features they don&apos;t have
          </p>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Perfect For
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Whatever you write, we&apos;ve got you covered
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: "🎓",
                title: "Students",
                desc: "JAMB, WAEC, university essays, and assignments",
              },
              {
                icon: "✍️",
                title: "Content Creators",
                desc: "Blogs, YouTube scripts, social media posts",
              },
              {
                icon: "💼",
                title: "Professionals",
                desc: "Business emails, proposals, and reports",
              },
              {
                icon: "🌍",
                title: "Freelancers",
                desc: "Compete globally with perfect English",
              },
            ].map((uc, i) => (
              <div
                key={i}
                className="text-center p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{uc.icon}</div>
                <h4 className="font-bold text-lg mb-2">{uc.title}</h4>
                <p className="text-sm text-gray-600">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EARLY ADOPTER BENEFITS */}
      <section className="bg-linear-to-r from-[#0F172A] to-black text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Early Adopter Benefits
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              // {
              //   icon: "🔒",
              //   title: "Lock In ₦1,500/Month",
              //   desc: "Your rate never increases, even when we add AI features and raise prices to ₦3,500/month",
              // },
              {
                icon: "🚀",
                title: "First Access to New Features",
                desc: "Get AI-powered rewrites and Pidgin translation before anyone else when we launch them",
              },
              {
                icon: "💬",
                title: "Shape the Product",
                desc: "Your feedback directly influences what features we build next",
              },
            ].map((b, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur rounded-2xl p-8 border-2 border-white/20"
              >
                <div className="text-5xl mb-4">{b.icon}</div>
                <h4 className="font-bold text-xl mb-3">{b.title}</h4>
                <p className="opacity-90">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h3>
            <p className="text-lg text-gray-600">
              No hidden fees. No dollar conversion. Just fair naira pricing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
            {/* FREE */}
            <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition">
              <h4 className="text-xl font-semibold mb-2">Free</h4>
              <div className="mb-6">
                <p className="text-4xl font-bold">₦0</p>
                <p className="text-sm text-gray-500">Forever free</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "100 grammar checks per month",
                  "Nigerian English validation",
                  "Basic Pidgin support",
                  "Works offline",
                  "No login required",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <IoIosCheckmarkCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center border-2 border-primary text-primary py-3 rounded-lg hover:bg-primary hover:text-white transition font-semibold"
              >
                Start Free Now
              </Link>
            </div>
            {/* PRO */}
            <div className="border-2 border-primary rounded-2xl p-8 shadow-2xl relative bg-linear-to-b from-white to-green-50">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  BEST VALUE
                </span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Pro</h4>
              <div className="mb-4">
                <p className="text-4xl font-bold text-primary">
                  ₦1,500
                  <span className="text-lg font-normal text-gray-600">
                    /month
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  ₦15,000/year (save ₦3,000)
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  { text: "Unlimited grammar checks", bold: true },
                  { text: "All Free features", bold: false },
                  { text: "Advanced Nigerian English detection", bold: false },
                  { text: "Enhanced Pidgin grammar checking", bold: false },
                  { text: "Document history (100 documents)", bold: false },
                  { text: "Auto-save & cloud sync", bold: false },
                  { text: "Export to PDF, DOCX, TXT", bold: false },
                  { text: "Priority support", bold: false },
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <IoIosCheckmarkCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 shrink-0" />
                    <span
                      className={
                        item.bold
                          ? "text-gray-900 font-semibold"
                          : "text-gray-700"
                      }
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center bg-primary text-white py-4 rounded-lg hover:bg-primaryHover transition font-bold mb-3 shadow-lg hover:shadow-xl"
              >
                Start 7-Day Free Trial
              </Link>
              <p className="text-xs text-center text-gray-500 mb-4">
                No credit card required • Cancel anytime
              </p>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Pay with Paystack • Card, Bank Transfer, or USSD
                </p>
              </div>
            </div>
          </div>

          {/* Future Features Teaser */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">🚀</div>
                <div>
                  <h4 className="font-bold text-xl text-blue-900 mb-3">
                    Coming Soon to Pro
                  </h4>
                  <p className="text-blue-800 mb-6 text-lg">
                    For ₦3,500/month,
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: "🤖",
                        title: "AI Rewrites",
                        desc: "Smart suggestions for clarity",
                      },
                      {
                        icon: "🔄",
                        title: "Translation",
                        desc: "Pidgin ↔ English instantly",
                      },
                      {
                        icon: "🎯",
                        title: "Tone Detection",
                        desc: "Match your writing style",
                      },
                    ].map((f, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg p-4 border border-blue-200"
                      >
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">{f.icon}</span>
                          <div>
                            <p className="font-semibold text-blue-900">
                              {f.title}
                            </p>
                            <p className="text-sm text-gray-600">{f.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-primary transition"
              >
                <button
                  className="w-full p-6 text-left font-semibold text-lg flex justify-between items-center cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === i && (
                  <p className="text-gray-600 px-6 pb-6 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-r from-primary to-green-700 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Start Writing Smarter Today.
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Join Nigerian writers who&apos;ve stopped paying for grammar
            checking in dollars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/signup"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-xl inline-block"
            >
              Start Free — No Card Required
            </Link>
            <a
              href="#pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white/10 transition inline-block"
            >
              View Pricing
            </a>
          </div>
          <p className="text-sm opacity-75">
            ✓ 7-day free trial • ✓ No credit card needed • ✓ Cancel anytime
          </p>
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
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Pricing
                  </a>
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
                  <a href="/blog" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#faq" className="hover:text-white transition">
                    FAQ
                  </a>
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
                href="https://x.com/234grammar"
                className="hover:text-white transition"
                aria-label="Twitter"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/234grammar"
                className="hover:text-white transition"
                aria-label="LinkedIn"
              >
                <ImLinkedin2 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
