"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { IoIosCheckmarkCircle } from "react-icons/io";

export default function SignupPage() {
  const [activePlan, setActivePlan] = useState<"free" | "pro">("free");
  const [freeEmail, setFreeEmail] = useState("");
  const [freePassword, setFreePassword] = useState("");
  const [freeTerms, setFreeTerms] = useState(false);
  const [freeLoading, setFreeLoading] = useState(false);
  const [showFreePassword, setShowFreePassword] = useState(false);
  const [proEmail, setProEmail] = useState("");
  const [proPassword, setProPassword] = useState("");
  const [proTerms, setProTerms] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const [showProPassword, setShowProPassword] = useState(false);
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  async function handleFreeSignup(e: React.FormEvent) {
    e.preventDefault();
    setFreeLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: freeEmail, password: freePassword, plan: "free" }),
      });
      const data = await response.json();
      if (response.ok) { setVerifyEmail(data.email || freeEmail); setShowVerifyPrompt(true); }
      else { toast.error(data.message || "Signup failed. Please try again."); setFreeLoading(false); }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setFreeLoading(false);
    }
  }

  async function handleProSignup(e: React.FormEvent) {
    e.preventDefault();
    setProLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: proEmail, password: proPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("pendingUpgrade", "true");
        setVerifyEmail(data.email || proEmail);
        setShowVerifyPrompt(true);
      } else { toast.error(data.message || "Signup failed. Please try again."); setProLoading(false); }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setProLoading(false);
    }
  }

  const EyeOpen = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
  const EyeOff = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  const GoogleButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}
      className="w-full flex items-center cursor-pointer justify-center gap-3 px-4 py-3 border-2 border-ink/12 rounded-xl hover:border-ink/25 transition font-semibold text-sm">
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Continue with Google
    </button>
  );

  return (
    <div className="bg-cream text-ink font-sans min-h-screen flex flex-col">

      {/* NAVBAR */}
      <nav className="bg-cream/95 backdrop-blur-sm border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo/logo_black.svg" alt="234Grammar" width={50} height={50} className="w-36" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink/45 hidden sm:inline">Already have an account?</span>
            <Link href="/login" className="text-primary font-semibold hover:underline text-sm">Login</Link>
          </div>
        </div>
      </nav>

      <section className="flex-1 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-6">

          {showVerifyPrompt ? (
            /* ── VERIFY EMAIL PROMPT ── */
            <div className="max-w-lg mx-auto text-center py-16 fade-in">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-display text-4xl text-ink mb-3">Check your inbox</h2>
              <p className="text-ink/50 text-lg mb-2">We sent a verification link to:</p>
              <p className="font-semibold text-ink text-lg mb-6 break-all">{verifyEmail}</p>
              <div className="bg-white rounded-2xl border border-ink/10 p-6 mb-8 text-left">
                <p className="font-semibold text-ink mb-3 text-sm">Next steps:</p>
                <ol className="text-ink/60 text-sm space-y-2 list-decimal list-inside">
                  <li>Open the email from 234Grammar</li>
                  <li>Click the &ldquo;Verify your email&rdquo; link</li>
                  <li>You&apos;ll be taken through a quick setup</li>
                </ol>
              </div>
              <p className="text-sm text-ink/40">
                Didn&apos;t receive it? Check your spam folder, or{" "}
                <button onClick={() => setShowVerifyPrompt(false)} className="text-primary hover:underline font-medium">
                  try again
                </button>.
              </p>
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="text-center mb-12 fade-in">
                <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">Get Started</p>
                <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">
                  Start Writing Better Nigerian English
                </h1>
                <p className="text-ink/50 max-w-xl mx-auto text-sm leading-relaxed">
                  Choose your plan and start checking your grammar in seconds. No card required for free plan.
                </p>
              </div>

              {/* PLAN TABS */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="flex bg-white rounded-2xl ring-1 ring-ink/10 overflow-hidden p-1.5 gap-1.5">
                  {(["free", "pro"] as const).map((plan) => (
                    <button key={plan} onClick={() => setActivePlan(plan)}
                      className={`flex-1 py-3.5 px-6 rounded-xl font-semibold cursor-pointer transition ${
                        activePlan === plan
                          ? plan === 'pro' ? 'bg-ink text-white' : 'bg-primary text-white'
                          : 'text-ink/60 hover:text-ink'
                      }`}>
                      <div className="text-sm font-bold">{plan === 'free' ? 'Free Plan' : 'Pro Plan'}</div>
                      <div className={`text-xs mt-0.5 ${activePlan === plan ? 'opacity-70' : plan === 'pro' ? 'text-primary' : 'text-ink/40'}`}>
                        {plan === 'free' ? '₦0/month' : '₦1,500/month'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">

                {/* FORM */}
                <div className="fade-in">
                  {activePlan === "free" ? (
                    <div className="bg-white rounded-2xl p-8 ring-1 ring-ink/10">
                      <h2 className="font-display text-3xl text-ink mb-1">Create Free Account</h2>
                      <p className="text-ink/45 text-sm mb-6">Start with 100 checks per month. No card required.</p>
                      <form onSubmit={handleFreeSignup} className="space-y-5">
                        <div>
                          <label htmlFor="freeEmail" className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">Email Address</label>
                          <input type="email" id="freeEmail" required placeholder="you@example.com"
                            value={freeEmail} onChange={(e) => setFreeEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-ink/12 rounded-xl focus:border-primary focus:outline-none transition bg-white text-sm" />
                        </div>
                        <div>
                          <label htmlFor="freePassword" className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">Password</label>
                          <div className="relative">
                            <input type={showFreePassword ? "text" : "password"} id="freePassword" required minLength={8}
                              placeholder="At least 8 characters" value={freePassword}
                              onChange={(e) => setFreePassword(e.target.value)}
                              className="w-full px-4 py-3 border-2 border-ink/12 rounded-xl focus:border-primary focus:outline-none transition pr-12 bg-white text-sm" />
                            <button type="button" onClick={() => setShowFreePassword(!showFreePassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition cursor-pointer">
                              {showFreePassword ? <EyeOff /> : <EyeOpen />}
                            </button>
                          </div>
                          <p className="text-xs text-ink/35 mt-1">Must be at least 8 characters</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <input type="checkbox" id="freeTerms" required checked={freeTerms}
                            onChange={(e) => setFreeTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-primary cursor-pointer" />
                          <label htmlFor="freeTerms" className="text-sm text-ink/55">
                            I agree to the{" "}
                            <a href="/terms" className="text-primary hover:underline">Terms</a> and{" "}
                            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                          </label>
                        </div>
                        <button type="submit" disabled={freeLoading}
                          className="w-full bg-primary text-white py-3.5 rounded-xl cursor-pointer font-bold hover:bg-primaryHover transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70">
                          <span>{freeLoading ? "Creating Account..." : "Create Free Account"}</span>
                          {freeLoading && <span className="spinner" />}
                        </button>
                      </form>
                      <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink/8" /></div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-4 bg-white text-ink/35">Or continue with</span>
                        </div>
                      </div>
                      <GoogleButton onClick={() => alert("Google signup coming soon! Please use email signup for now.")} />
                    </div>
                  ) : (
                    <div className="bg-ink text-white rounded-2xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-gold text-ink text-xs font-bold px-4 py-2 rounded-bl-2xl">PRO</div>
                      <h2 className="font-display text-3xl mb-1">Create Pro Account</h2>
                      <p className="text-white/45 text-sm mb-6">Sign up and complete Pro setup after verifying your email. ₦1,500/month.</p>
                      <form onSubmit={handleProSignup} className="space-y-5">
                        <div>
                          <label htmlFor="proEmail" className="block text-xs font-semibold uppercase tracking-wide text-white/40 mb-2">Email Address</label>
                          <input type="email" id="proEmail" required placeholder="you@example.com"
                            value={proEmail} onChange={(e) => setProEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-white/15 rounded-xl focus:border-gold focus:outline-none transition bg-white/10 text-white placeholder:text-white/30 text-sm" />
                        </div>
                        <div>
                          <label htmlFor="proPassword" className="block text-xs font-semibold uppercase tracking-wide text-white/40 mb-2">Password</label>
                          <div className="relative">
                            <input type={showProPassword ? "text" : "password"} id="proPassword" required minLength={8}
                              placeholder="At least 8 characters" value={proPassword}
                              onChange={(e) => setProPassword(e.target.value)}
                              className="w-full px-4 py-3 border-2 border-white/15 rounded-xl focus:border-gold focus:outline-none transition pr-12 bg-white/10 text-white placeholder:text-white/30 text-sm" />
                            <button type="button" onClick={() => setShowProPassword(!showProPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition cursor-pointer">
                              {showProPassword ? <EyeOff /> : <EyeOpen />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <input type="checkbox" id="proTerms" required checked={proTerms}
                            onChange={(e) => setProTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-gold cursor-pointer" />
                          <label htmlFor="proTerms" className="text-sm text-white/55">
                            I agree to the{" "}
                            <a href="/terms" className="text-gold hover:underline">Terms</a> and{" "}
                            <a href="/privacy" className="text-gold hover:underline">Privacy Policy</a>
                          </label>
                        </div>
                        <div className="bg-white/8 rounded-xl p-4 border border-white/10">
                          <p className="font-semibold text-white text-xs mb-2">What happens next:</p>
                          <ul className="text-white/55 text-xs space-y-1">
                            <li>• Verify your email</li>
                            <li>• Complete Pro setup &amp; pay ₦1,500/month</li>
                            <li>• Start writing with unlimited checks</li>
                          </ul>
                        </div>
                        <button type="submit" disabled={proLoading}
                          className="w-full bg-gold text-ink py-3.5 rounded-xl cursor-pointer font-bold hover:bg-yellow-300 transition flex items-center justify-center gap-2 disabled:opacity-70">
                          <span>{proLoading ? "Creating Account..." : "Create Account →"}</span>
                          {proLoading && <span className="spinner" />}
                        </button>
                      </form>
                      <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-4 bg-ink text-white/30">Or continue with</span>
                        </div>
                      </div>
                      <GoogleButton onClick={() => alert("Google signup coming soon! Please use email signup for now.")} />
                    </div>
                  )}
                </div>

                {/* FEATURES PANEL */}
                <div className="fade-in">
                  {activePlan === "free" ? (
                    <div className="bg-white rounded-2xl p-8 ring-1 ring-ink/10 h-full">
                      <h3 className="font-semibold text-ink mb-6">What&apos;s Included in Free</h3>
                      <ul className="space-y-4 mb-8">
                        {[
                          { title: "100 Grammar Checks/Month", desc: "Perfect for casual writing" },
                          { title: "Nigerian English Support", desc: "Understands \"I'm coming\" and local expressions" },
                          { title: "Basic Pidgin Validation", desc: "Won't flag Pidgin as errors" },
                          { title: "Works Offline", desc: "Grammar checking runs in your browser" },
                          { title: "Privacy-First", desc: "Your writing stays on your device" },
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <IoIosCheckmarkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-ink text-sm">{item.title}</p>
                              <p className="text-xs text-ink/45 mt-0.5">{item.desc}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-6 border-t border-ink/8">
                        <p className="text-xs text-ink/45 mb-3"><strong className="text-ink font-semibold">Want more?</strong> Upgrade to Pro anytime for:</p>
                        <ul className="text-xs text-ink/55 space-y-2">
                          {["Unlimited checks", "Document storage & sync", "Advanced Pidgin support", "Export to PDF/DOCX"].map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="text-primary">→</span>{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-cream rounded-2xl p-8 ring-1 ring-ink/10 h-full">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-ink">What&apos;s Included in Pro</h3>
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">₦1,500/mo</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        {[
                          { title: "Unlimited Grammar Checks", desc: "No monthly limits" },
                          { title: "Everything in Free", desc: "Nigerian English, Pidgin, offline mode" },
                          { title: "Document Storage (100 docs)", desc: "Auto-save, search, access anywhere" },
                          { title: "Advanced Pidgin Checking", desc: "Grammar corrections and style suggestions" },
                          { title: "Export Documents", desc: "Download as PDF, DOCX, or TXT" },
                          { title: "Priority Support", desc: "Email support within 24 hours" },
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <IoIosCheckmarkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-ink text-sm">{item.title}</p>
                              <p className="text-xs text-ink/45 mt-0.5">{item.desc}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-6 border-t border-ink/8">
                        <div className="bg-ink/5 rounded-xl p-4">
                          <p className="text-xs font-semibold text-ink mb-2">🚀 Coming Soon:</p>
                          <ul className="text-xs text-ink/55 space-y-1">
                            <li>• AI-powered rewrites</li>
                            <li>• Pidgin ↔ English translation</li>
                            <li>• Tone detection</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TRUST SIGNALS */}
              <div className="max-w-4xl mx-auto mt-12">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  {[
                    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Secure & Private", desc: "Your data is encrypted" },
                    { icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z", title: "Easy Cancellation", desc: "Cancel anytime, no questions" },
                    { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", title: "Pay in Naira", desc: "Monnify secure payment" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 ring-1 ring-ink/10 flex flex-col items-center">
                      <svg className="w-8 h-8 text-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <p className="font-semibold text-ink text-sm">{item.title}</p>
                      <p className="text-xs text-ink/40 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/10 py-6 bg-cream">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink/35">© 2026 234Grammar. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-ink/40">
            <a href="/privacy" className="hover:text-ink transition">Privacy</a>
            <a href="/terms" className="hover:text-ink transition">Terms</a>
            <Link href="/contact" className="hover:text-ink transition">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
