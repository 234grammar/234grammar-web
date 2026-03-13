"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { NavAuthButtons } from "../components/NavAuthButtons";
import Link from "next/link";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { ImLinkedin2 } from "react-icons/im";

export default function ContactPage() {
  const [category, setCategory] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const categoryMap: Record<string, string> = {
      "#support-form": "support",
      "#sales-form": "sales",
      "#feedback-form": "feedback",
    };
    if (categoryMap[hash]) setCategory(categoryMap[hash]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, firstName, lastName, email, subject, message, timestamp: new Date().toISOString() }),
      });
      if (response.ok) {
        toast.success("Message sent! We'll get back to you within 24 hours.");
        setCategory(""); setFirstName(""); setLastName(""); setEmail(""); setSubject(""); setMessage("");
      } else {
        toast.error("Failed to send message. Please try again or email us directly.");
      }
    } catch {
      toast.error("Something went wrong. Please email us at hello@234grammar.com");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border-2 border-ink/12 rounded-xl focus:border-primary focus:outline-none transition bg-white text-sm";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2";

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
            <Link href="/about" className="text-ink/50 hover:text-ink transition hidden md:inline text-sm">About</Link>
            <NavAuthButtons />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-deepGreen text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-6">Contact</p>
          <h1 className="font-display text-5xl md:text-7xl mb-6 leading-[1.0] fade-in">
            Get in <em className="text-gold">Touch</em>
          </h1>
          <p className="text-white/55 text-lg mb-8 fade-in max-w-md mx-auto leading-relaxed">
            We&apos;re here to help. Choose the best way to reach us below.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 px-5 py-2.5 rounded-full text-sm border border-white/15">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            We typically respond within 24 hours
          </div>
        </div>
      </section>

      {/* CONTACT TYPE CARDS */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { href: "#support-form", cat: "support", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: "Support", desc: "Having trouble? We're here to help", cta: "Get Help →", accent: "text-blue-600", accentBg: "bg-blue-50" },
              { href: "#sales-form", cat: "sales", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", title: "Sales & Enterprise", desc: "Bulk licenses or custom plans", cta: "Contact Sales →", accent: "text-primary", accentBg: "bg-primary/8" },
              { href: "#feedback-form", cat: "feedback", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z", title: "Feedback", desc: "Feature requests or suggestions", cta: "Share Ideas →", accent: "text-purple-600", accentBg: "bg-purple-50" },
              { href: "mailto:hello@234grammar.com", cat: "", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", title: "Press & Media", desc: "Journalists and media inquiries", cta: "hello@234grammar.com", accent: "text-amber-600", accentBg: "bg-amber-50" },
            ].map((item, i) => (
              <a key={i} href={item.href} onClick={() => item.cat && setCategory(item.cat)}
                className="bg-cream rounded-2xl p-7 ring-1 ring-ink/10 hover:ring-primary/30 hover:shadow-md transition text-center group">
                <div className={`w-12 h-12 ${item.accentBg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors`}>
                  <svg className={`w-6 h-6 ${item.accent} group-hover:text-white transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-ink mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-ink/45 mb-4 leading-relaxed">{item.desc}</p>
                <span className="text-primary font-semibold text-xs">{item.cta}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTACT FORM */}
      <section id="contact-form" className="py-12 md:py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* FORM */}
            <div>
              <div className="bg-white rounded-2xl p-8 md:p-10 ring-1 ring-ink/10">
                <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">Send a Message</p>
                <h2 className="font-display text-3xl text-ink mb-6">Send Us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="category" className={labelClass}>What can we help you with?</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className={inputClass}>
                      <option value="">Select a category</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing &amp; Payments</option>
                      <option value="sales">Sales &amp; Enterprise</option>
                      <option value="feedback">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press &amp; Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className={labelClass}>First Name</label>
                      <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Chidi" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>Last Name</label>
                      <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Okonkwo" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="subject" className={labelClass}>Subject</label>
                    <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Brief description of your inquiry" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>Message</label>
                    <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={6}
                      placeholder="Tell us more about your question or feedback..."
                      className={`${inputClass} resize-none`} />
                    <p className="text-xs text-ink/35 mt-1.5">Please include as much detail as possible</p>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primaryHover transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70">
                    {loading ? (<><span>Sending...</span><span className="spinner" /></>) : "Send Message"}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: INFO + FAQ */}
            <div className="space-y-6">

              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-8 ring-1 ring-ink/10">
                <h3 className="font-bold text-ink mb-6">Contact Information</h3>
                <div className="space-y-5">
                  {[
                    { bg: "bg-blue-50", iconColor: "text-blue-600", label: "Email Us", value: "hello@234grammar.com", href: "mailto:hello@234grammar.com", note: "General inquiries & support", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                    { bg: "bg-primary/8", iconColor: "text-primary", label: "Technical Support", value: "support@234grammar.com", href: "mailto:support@234grammar.com", note: "Response within 24 hours", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
                    { bg: "bg-purple-50", iconColor: "text-purple-600", label: "Office Location", value: "Lagos, Nigeria 🇳🇬", note: "West Africa's tech hub", icon: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                        <svg className={`w-5 h-5 ${item.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-ink text-sm mb-0.5">{item.label}</div>
                        {item.href ? (
                          <a href={item.href} className="text-primary hover:underline text-sm">{item.value}</a>
                        ) : (
                          <p className="text-ink/65 text-sm">{item.value}</p>
                        )}
                        <p className="text-xs text-ink/35 mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="bg-white rounded-2xl p-8 ring-1 ring-ink/10">
                <h3 className="font-bold text-ink mb-5">Quick Answers</h3>
                <div className="space-y-0">
                  {[
                    { q: "How fast do you respond?", a: "We aim to respond within 24 hours during business days. Pro users get priority support." },
                    { q: "Can I request a feature?", a: "Absolutely! Select \"Feature Request\" and tell us what you'd like to see. We read every suggestion." },
                    { q: "Need urgent help?", a: "Email support@234grammar.com with \"URGENT\" in the subject line." },
                    { q: "Looking for bulk licenses?", a: "Select \"Sales & Enterprise\" or email hello@234grammar.com for custom pricing." },
                  ].map(({ q, a }, i) => (
                    <details key={i} className={`group ${i > 0 ? 'border-t border-ink/8' : ''}`}>
                      <summary className="flex items-center justify-between cursor-pointer font-semibold py-4 text-sm">
                        <span className="text-ink">{q}</span>
                        <svg className="w-4 h-4 text-ink/25 group-open:rotate-180 transition shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <p className="text-xs text-ink/55 pb-4 leading-relaxed">{a}</p>
                    </details>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-ink/8">
                  <Link href="/#faq" className="text-primary font-semibold text-sm hover:underline flex items-center gap-1.5">
                    View all FAQs
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Response times */}
              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-ink mb-3 text-sm">Response Times</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        { color: "bg-primary", label: "Support", time: "Within 24 hours" },
                        { color: "bg-blue-500", label: "Sales", time: "Within 12 hours" },
                        { color: "bg-purple-500", label: "Press", time: "Within 48 hours" },
                      ].map((rt, i) => (
                        <div key={i} className="flex items-center gap-2 text-ink/65">
                          <span className={`w-2 h-2 ${rt.color} rounded-full`} />
                          <strong className="text-ink font-semibold">{rt.label}:</strong> {rt.time}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-ink/35 mt-3">Monday – Friday, 9 AM – 6 PM WAT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OTHER WAYS */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">Connect</p>
          <h2 className="font-display text-4xl text-ink mb-4">Other Ways to Reach Us</h2>
          <p className="text-ink/45 mb-12 text-sm max-w-md mx-auto">Choose the method that works best for you</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a href="https://x.com/234grammar" target="_blank" rel="noopener noreferrer"
              className="bg-cream rounded-2xl p-8 ring-1 ring-ink/10 hover:ring-primary/30 hover:shadow-md transition group text-center">
              <FaXTwitter className="w-10 h-10 mx-auto mb-4 text-ink/25 group-hover:text-primary transition" />
              <h3 className="font-bold text-ink mb-2">X/Twitter Community</h3>
              <p className="text-xs text-ink/45 mb-4">Join conversations and get quick answers</p>
              <span className="text-primary font-semibold text-sm">Follow @234grammar →</span>
            </a>
            <a href="https://calendly.com/234grammar" target="_blank" rel="noopener noreferrer"
              className="bg-cream rounded-2xl p-8 ring-1 ring-ink/10 hover:ring-primary/30 hover:shadow-md transition group text-center">
              <svg className="w-10 h-10 mx-auto mb-4 text-ink/25 group-hover:text-primary transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-bold text-ink mb-2">Schedule a Call</h3>
              <p className="text-xs text-ink/45 mb-4">Book a time with our team (Enterprise only)</p>
              <span className="text-primary font-semibold text-sm">Book Meeting →</span>
            </a>
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
