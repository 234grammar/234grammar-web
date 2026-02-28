"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [activePlan, setActivePlan] = useState<"free" | "pro">("free");
  const [freeEmail, setFreeEmail] = useState("");
  const [freePassword, setFreePassword] = useState("");
  const [freeTerms, setFreeTerms] = useState(false);
  const [freeLoading, setFreeLoading] = useState(false);
  const [proEmail, setProEmail] = useState("");
  const [proPassword, setProPassword] = useState("");
  const [proTerms, setProTerms] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  async function handleFreeSignup(e: React.FormEvent) {
    e.preventDefault();
    setFreeLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: freeEmail,
          password: freePassword,
          plan: "free",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setVerifyEmail(data.email || freeEmail);
        setShowVerifyPrompt(true);
      } else {
        alert(data.message || "Signup failed. Please try again.");
        setFreeLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
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
        body: JSON.stringify({
          email: proEmail,
          password: proPassword,
          plan: "pro_trial",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setVerifyEmail(data.email || proEmail);
        setShowVerifyPrompt(true);
      } else {
        alert(data.message || "Signup failed. Please try again.");
        setProLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setProLoading(false);
    }
  }

  const CheckIcon = () => (
    <svg
      className="w-6 h-6 text-green-600 mr-3 shrink-0 mt-0.5"
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

  const GoogleButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center cursor-pointer justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition font-semibold"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </button>
  );

  return (
    <div className="bg-gray-50 text-gray-900 font-sans min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm">
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <section className="py-12 md:py-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {showVerifyPrompt ? (
            <div className="max-w-lg mx-auto text-center py-16 fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-3">Check your inbox</h2>
              <p className="text-gray-600 text-lg mb-2">We sent a verification link to:</p>
              <p className="font-semibold text-gray-900 text-lg mb-6 break-all">{verifyEmail}</p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 text-left">
                <p className="font-semibold text-green-900 mb-2">Next steps:</p>
                <ol className="text-green-800 text-sm space-y-1 list-decimal list-inside">
                  <li>Open the email from 234Grammar</li>
                  <li>Click the &quot;Verify your email&quot; link</li>
                  <li>You&apos;ll be taken straight to the editor</li>
                </ol>
              </div>
              <p className="text-sm text-gray-500">
                Didn&apos;t receive it? Check your spam folder, or{" "}
                <button
                  onClick={() => setShowVerifyPrompt(false)}
                  className="text-primary hover:underline font-medium"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
          <>

          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Start Writing Better Nigerian English
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your plan and start checking your grammar in seconds. No
              credit card required for free plan.
            </p>
          </div>

          {/* Plan Tabs */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setActivePlan("free")}
                className={`flex-1 py-4 px-6 font-semibold cursor-pointer transition ${activePlan === "free" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                <div className="text-lg">Free Plan</div>
                <div
                  className={`text-sm ${activePlan === "free" ? "opacity-90" : ""}`}
                >
                  ₦0/month
                </div>
              </button>
              <button
                onClick={() => setActivePlan("pro")}
                className={`flex-1 py-4 px-6 font-semibold cursor-pointer transition ${activePlan === "pro" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                <div className="text-lg">Pro Plan</div>
                <div
                  className={`text-sm ${activePlan === "pro" ? "opacity-90" : "text-green-600"}`}
                >
                  ₦1,500/month • 7-day trial
                </div>
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* FORMS */}
            <div className="fade-in">
              {activePlan === "free" ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                      Create Free Account
                    </h2>
                    <p className="text-gray-600">
                      Start with 100 checks per month. No credit card required.
                    </p>
                  </div>
                  <form onSubmit={handleFreeSignup} className="space-y-5">
                    <div>
                      <label
                        htmlFor="freeEmail"
                        className="block text-sm font-semibold mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="freeEmail"
                        required
                        placeholder="you@example.com"
                        value={freeEmail}
                        onChange={(e) => setFreeEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="freePassword"
                        className="block text-sm font-semibold mb-2"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="freePassword"
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        value={freePassword}
                        onChange={(e) => setFreePassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters
                      </p>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="freeTerms"
                        required
                        checked={freeTerms}
                        onChange={(e) => setFreeTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label
                        htmlFor="freeTerms"
                        className="ml-2 text-sm text-gray-600"
                      >
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={freeLoading}
                      className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primaryHover transition shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <span>
                        {freeLoading
                          ? "Creating Account..."
                          : "Create Free Account"}
                      </span>
                      {freeLoading && <span className="spinner ml-3" />}
                    </button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <GoogleButton
                    onClick={() =>
                      alert(
                        "Google signup coming soon! Please use email signup for now.",
                      )
                    }
                  />

                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600 text-center mb-3">
                      Want to try without creating an account?
                    </p>
                    <Link
                      href="/editor"
                      className="block w-full text-center border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition"
                    >
                      Start Without Login →
                    </Link>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Limited to 100 checks/month, no saved documents
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold">Start Pro Trial</h2>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                        7 DAYS FREE
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Try Pro features free for 7 days. Then ₦1,500/month.
                      Cancel anytime.
                    </p>
                  </div>
                  <form onSubmit={handleProSignup} className="space-y-5">
                    <div>
                      <label
                        htmlFor="proEmail"
                        className="block text-sm font-semibold mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="proEmail"
                        required
                        placeholder="you@example.com"
                        value={proEmail}
                        onChange={(e) => setProEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="proPassword"
                        className="block text-sm font-semibold mb-2"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="proPassword"
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        value={proPassword}
                        onChange={(e) => setProPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                      />
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="proTerms"
                        required
                        checked={proTerms}
                        onChange={(e) => setProTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label
                        htmlFor="proTerms"
                        className="ml-2 text-sm text-gray-600"
                      >
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-600 mr-2 shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="text-sm">
                          <p className="font-semibold text-green-900 mb-1">
                            What happens next:
                          </p>
                          <ul className="text-green-800 space-y-1">
                            <li>• Free for 7 days (no payment now)</li>
                            <li>
                              • We&apos;ll remind you 2 days before trial ends
                            </li>
                            <li>• Then ₦1,500/month (cancel anytime)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={proLoading}
                      className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primaryHover transition shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <span>
                        {proLoading
                          ? "Starting Trial..."
                          : "Start 7-Day Free Trial"}
                      </span>
                      {proLoading && <span className="spinner ml-3" />}
                    </button>
                    <p className="text-xs text-center text-gray-500">
                      No credit card required for trial. You&apos;ll add payment
                      details on day 5.
                    </p>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <GoogleButton
                    onClick={() =>
                      alert(
                        "Google signup coming soon! Please use email signup for now.",
                      )
                    }
                  />
                </div>
              )}
            </div>

            {/* FEATURES */}
            <div className="fade-in">
              {activePlan === "free" ? (
                <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200">
                  <h3 className="text-xl font-bold mb-6">
                    What&apos;s Included in Free
                  </h3>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "100 Grammar Checks/Month",
                        desc: "Perfect for casual writing",
                      },
                      {
                        title: "Nigerian English Support",
                        desc: 'Understands "I\'m coming" and local expressions',
                      },
                      {
                        title: "Basic Pidgin Validation",
                        desc: "Won't flag Pidgin as errors",
                      },
                      {
                        title: "Works Offline",
                        desc: "Grammar checking runs in your browser",
                      },
                      {
                        title: "Privacy-First",
                        desc: "Your writing stays on your device",
                      },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckIcon />
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-8 border-t">
                    <p className="text-sm text-gray-600 mb-3">
                      <strong className="text-gray-900">Want more?</strong>{" "}
                      Upgrade to Pro anytime for:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {[
                        "Unlimited checks",
                        "Document storage & sync",
                        "Advanced Pidgin support",
                        "Export to PDF/DOCX",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center">
                          <span className="text-primary mr-2">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-linear-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-primary">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">
                      What&apos;s Included in Pro
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full">
                      ₦1,500/mo
                    </span>
                  </div>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Unlimited Grammar Checks",
                        desc: "No monthly limits",
                      },
                      {
                        title: "Everything in Free",
                        desc: "Nigerian English, Pidgin, offline mode",
                      },
                      {
                        title: "Document Storage (100 docs)",
                        desc: "Auto-save, search, access anywhere",
                      },
                      {
                        title: "Advanced Pidgin Checking",
                        desc: "Grammar corrections and style suggestions",
                      },
                      {
                        title: "Export Documents",
                        desc: "Download as PDF, DOCX, or TXT",
                      },
                      {
                        title: "Priority Support",
                        desc: "Email support within 24 hours",
                      },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckIcon />
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-8 border-t border-green-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        🚀 Coming Soon (₦3,500/month):
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1">
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

          {/* Trust Signals */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                {
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  title: "Secure & Private",
                  desc: "Your data is encrypted",
                },
                {
                  icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
                  title: "Easy Cancellation",
                  desc: "Cancel anytime, no questions",
                },
                {
                  icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                  title: "Pay in Naira",
                  desc: "Paystack secure payment",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <svg
                    className="w-10 h-10 text-green-600 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          </>
          )} {/* end ternary */}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2026 234Grammar. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-primary">
                Privacy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-primary">
                Terms
              </a>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-primary"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
