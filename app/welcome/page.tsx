"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [userPlan, setUserPlan] = useState("free");

  // Personalization form state
  const [useCase, setUseCase] = useState("");
  const [defaultMode, setDefaultMode] = useState("nigerian-english");
  const [emailTips, setEmailTips] = useState(false);
  const [emailFeatures, setEmailFeatures] = useState(true);
  const [emailProduct, setEmailProduct] = useState(false);

  useEffect(() => {
    const plan = searchParams.get("plan") || "free";
    setUserPlan(plan);
  }, [searchParams]);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const skipToEditor = () => {
    router.push("/editor?onboarding=skipped");
  };

  const completeOnboarding = async () => {
    const preferences = {
      useCase,
      defaultMode,
      emailTips,
      emailFeatures,
      emailProduct,
    };

    try {
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
    } catch {
      // Still redirect even if saving fails
    }

    router.push(`/editor?mode=${defaultMode}&welcome=true`);
  };

  const isPro = userPlan === "pro";

  return (
    <div className="bg-linear-to-br from-green-50 to-white text-gray-900 font-sans min-h-screen">
      {/* PROGRESS INDICATOR */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="">
              <Image
                src={"/logo/logo_black.svg"}
                alt="Logo"
                width={50}
                height={50}
                className="w-40"
              />
            </Link>

            {/* Progress Dots */}
            <div className="flex items-center gap-3">
              <div
                className={`progress-dot w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep >= 1 ? "bg-primary scale-110" : "bg-gray-200"
                }`}
              />
              <div className="w-8 h-0.5 bg-gray-200" />
              <div
                className={`progress-dot w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep >= 2 ? "bg-primary scale-110" : "bg-gray-200"
                }`}
              />
              <div className="w-8 h-0.5 bg-gray-200" />
              <div
                className={`progress-dot w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep >= 3 ? "bg-primary scale-110" : "bg-gray-200"
                }`}
              />
            </div>

            <button
              onClick={skipToEditor}
              className="text-sm text-gray-600 cursor-pointer hover:text-primary font-semibold transition"
            >
              Skip →
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* STEP 1: WELCOME */}
          {currentStep === 1 && (
            <div className="text-center fade-in">
              <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold mb-6 text-lg">
                🎉 Welcome!
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 slide-in-left delay-100">
                You&apos;re All Set!
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto slide-in-right delay-200">
                {isPro
                  ? "You've started your 7-day Pro trial. Experience unlimited checks, document storage, and advanced features — all for just ₦1,500/month after trial."
                  : "You're ready to start checking your grammar. Get 100 free checks per month, with support for Nigerian English and Pidgin."}
              </p>

              {/* Plan Badge */}
              <div className="inline-block mb-12 fade-in delay-300">
                {isPro ? (
                  <div className="bg-linear-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl shadow-lg">
                    <div className="text-sm font-semibold opacity-90">
                      Your Plan
                    </div>
                    <div className="text-2xl font-bold">Pro Trial</div>
                    <div className="text-sm opacity-90">
                      7 days free, then ₦1,500/month
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 border-2 border-gray-300 px-8 py-4 rounded-xl">
                    <div className="text-sm font-semibold text-gray-600">
                      Your Plan
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      Free
                    </div>
                    <div className="text-sm text-gray-600">
                      100 checks/month
                    </div>
                  </div>
                )}
              </div>

              {/* Feature Highlights */}
              <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 fade-in delay-100">
                  <div className="text-4xl mb-3">🇳🇬</div>
                  <h3 className="font-bold mb-2">Nigerian English</h3>
                  <p className="text-sm text-gray-600">
                    Understands local expressions
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 fade-in delay-200">
                  <div className="text-4xl mb-3">🗣</div>
                  <h3 className="font-bold mb-2">Pidgin Support</h3>
                  <p className="text-sm text-gray-600">
                    First grammar checker for Pidgin
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 fade-in delay-300">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="font-bold mb-2">Works Offline</h3>
                  <p className="text-sm text-gray-600">
                    Fast, private, local checking
                  </p>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="bg-primary text-white cursor-pointer px-8 py-4 rounded-lg text-lg font-bold hover:bg-primaryHover transition shadow-lg hover:shadow-xl"
              >
                Let&apos;s Get Started →
              </button>
            </div>
          )}

          {/* STEP 2: QUICK TUTORIAL */}
          {currentStep === 2 && (
            <div className="fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-gray-600">
                  234Grammar is simple. Here&apos;s what you need to know:
                </p>
              </div>

              <div className="space-y-8 max-w-3xl mx-auto">
                {/* Tutorial Step 1 */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 slide-in-left">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">
                        Choose Your Language Mode
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Switch between Nigerian English, Standard English, or
                        Pidgin depending on your writing context.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                        <div className="flex gap-3 flex-wrap">
                          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm">
                            🇳🇬 Nigerian English
                          </div>
                          <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-semibold text-sm">
                            🇬🇧 Standard English
                          </div>
                          <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-semibold text-sm">
                            🗣 Pidgin
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tutorial Step 2 */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 slide-in-right delay-100">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">Start Writing</h3>
                      <p className="text-gray-600 mb-4">
                        Type or paste your text. Grammar checking happens as you
                        write — instantly and privately.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 font-mono text-sm">
                        <p className="text-gray-800 mb-2">
                          I&apos;m{" "}
                          <span className="underline decoration-purple-500 decoration-2">
                            coming
                          </span>{" "}
                          now o.
                        </p>
                        <div className="text-xs text-purple-600 flex items-center">
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
                          Correct in Nigerian English
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tutorial Step 3 */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 slide-in-left delay-200">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">
                        Review &amp; Fix
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Click on underlined words to see suggestions. Accept,
                        ignore, or learn why it&apos;s flagged.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-yellow-600 font-semibold text-sm mb-1">
                                Grammar
                              </div>
                              <p className="text-gray-700 mb-2">
                                Subject-verb agreement issue
                              </p>
                              <p className="text-sm text-gray-600">
                                &quot;He go&quot; → &quot;He goes&quot;
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-primary cursor-pointer text-white text-sm rounded hover:bg-primaryHover transition">
                                Fix
                              </button>
                              <button className="px-3 py-1 border text-sm cursor-pointer rounded hover:bg-gray-50 transition">
                                Ignore
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={nextStep}
                  className="bg-primary text-white px-8 py-4 cursor-pointer rounded-lg text-lg font-bold hover:bg-primaryHover transition shadow-lg hover:shadow-xl"
                >
                  Got It! Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PERSONALIZATION */}
          {currentStep === 3 && (
            <div className="fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Personalize Your Experience
                </h2>
                <p className="text-lg text-gray-600">
                  Help us tailor 234Grammar to your needs (optional)
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  {/* Primary Use Case */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                    <label className="block font-bold mb-4 text-lg">
                      What will you use 234Grammar for?
                    </label>
                    <div className="space-y-3">
                      {[
                        {
                          value: "student",
                          label: "🎓 Student",
                          desc: "Essays, assignments, JAMB/WAEC prep",
                        },
                        {
                          value: "content-creator",
                          label: "✍️ Content Creator",
                          desc: "Blogs, scripts, social media posts",
                        },
                        {
                          value: "professional",
                          label: "💼 Professional",
                          desc: "Business emails, reports, proposals",
                        },
                        {
                          value: "freelancer",
                          label: "🌍 Freelancer",
                          desc: "Client work, proposals, contracts",
                        },
                        {
                          value: "other",
                          label: "📝 Other",
                          desc: "Just exploring",
                        },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                            useCase === opt.value
                              ? "border-primary bg-green-50"
                              : "border-gray-200 hover:border-primary"
                          }`}
                        >
                          <input
                            type="radio"
                            name="useCase"
                            value={opt.value}
                            checked={useCase === opt.value}
                            onChange={() => setUseCase(opt.value)}
                            className="w-4 h-4 accent-primary"
                          />
                          <div className="ml-4">
                            <div className="font-semibold">{opt.label}</div>
                            <div className="text-sm text-gray-600">
                              {opt.desc}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Default Language Mode */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                    <label className="block font-bold mb-4 text-lg">
                      Which mode will you use most?
                    </label>
                    <div className="space-y-3">
                      {[
                        {
                          value: "nigerian-english",
                          label: "🇳🇬 Nigerian English",
                          desc: "Local expressions accepted",
                        },
                        {
                          value: "standard-english",
                          label: "🇬🇧 Standard English",
                          desc: "Formal British/American",
                        },
                        {
                          value: "pidgin",
                          label: "🗣 Pidgin",
                          desc: "Nigerian Pidgin grammar",
                        },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                            defaultMode === opt.value
                              ? "border-primary bg-green-50"
                              : "border-gray-200 hover:border-primary"
                          }`}
                        >
                          <input
                            type="radio"
                            name="defaultMode"
                            value={opt.value}
                            checked={defaultMode === opt.value}
                            onChange={() => setDefaultMode(opt.value)}
                            className="w-4 h-4 accent-primary"
                          />
                          <div className="ml-4">
                            <div className="font-semibold">{opt.label}</div>
                            <div className="text-sm text-gray-600">
                              {opt.desc}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Email Preferences — Pro only */}
                  {isPro && (
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                      <label className="block font-bold mb-4 text-lg">
                        Email Preferences
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailTips}
                            onChange={(e) => setEmailTips(e.target.checked)}
                            className="w-4 h-4 accent-primary rounded"
                          />
                          <span className="ml-3 text-gray-700">
                            Send me weekly writing tips
                          </span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailFeatures}
                            onChange={(e) => setEmailFeatures(e.target.checked)}
                            className="w-4 h-4 accent-primary rounded"
                          />
                          <span className="ml-3 text-gray-700">
                            Notify me about new features
                          </span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailProduct}
                            onChange={(e) => setEmailProduct(e.target.checked)}
                            className="w-4 h-4 accent-primary rounded"
                          />
                          <span className="ml-3 text-gray-700">
                            Product updates and announcements
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-12">
                  <button
                    onClick={skipToEditor}
                    className="flex-1 border-2 border-gray-300 cursor-pointer text-gray-700 px-6 py-4 rounded-lg text-lg font-bold hover:border-primary hover:text-primary transition"
                  >
                    Skip This
                  </button>
                  <button
                    onClick={completeOnboarding}
                    className="flex-1 bg-primary cursor-pointer text-white px-6 py-4 rounded-lg text-lg font-bold hover:bg-primaryHover transition shadow-lg hover:shadow-xl"
                  >
                    Start Writing →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
