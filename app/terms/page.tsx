import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions for using 234Grammar.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
          <Link href="/">
            <Image src="/logo/logo_black.svg" alt="234Grammar" width={50} height={50} className="w-36" />
          </Link>
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using 234Grammar (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service. These terms apply to all users, including free and paid subscribers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              234Grammar is a grammar and style checking tool designed for Nigerian and African English, including support for Pidgin. The Service is provided via a web application at 234grammar.com. Grammar checking is performed locally in your browser — your writing is never sent to our servers for analysis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Plans and Pricing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Free Plan</h3>
                <p>The Free plan includes up to 100 grammar checks per month. Checks reset on the first day of each calendar month. The Free plan does not include document storage, export, or cloud sync.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Pro Plan</h3>
                <p>The Pro plan is billed at <strong>₦1,500 per month</strong> via Paystack. It includes unlimited grammar checks, document storage (up to 100 documents), cloud sync, export (PDF, DOCX, TXT), and advanced language features. The Pro plan renews automatically each month until cancelled.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Payments and Billing</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>All payments are processed by Paystack in Nigerian Naira (NGN).</li>
              <li>By subscribing to Pro, you authorise Paystack to charge ₦1,500 to your payment method each month.</li>
              <li>Subscriptions renew automatically. You will not receive a separate renewal notice.</li>
              <li>We do not issue refunds for partial months. If you cancel mid-cycle, you retain Pro access until the end of the billing period.</li>
              <li>Prices may change. We will notify existing subscribers at least 14 days before any price increase takes effect.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cancellation</h2>
            <p>
              You may cancel your Pro subscription at any time by contacting us at <a href="mailto:support@234grammar.com" className="text-primary hover:underline font-semibold">support@234grammar.com</a>. Upon cancellation, your plan will revert to Free at the end of the current billing period. We do not charge cancellation fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Account Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 13 years old to use the Service.</li>
              <li>You agree not to share your account with others or create multiple accounts to circumvent plan limits.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Acceptable Use</h2>
            <p>You agree not to use 234Grammar to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Transmit spam, malware, or harmful content</li>
              <li>Attempt to reverse-engineer, scrape, or overload our systems</li>
              <li>Impersonate another person or entity</li>
            </ul>
            <p className="mt-3">We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Intellectual Property</h2>
            <p>
              The 234Grammar platform, including its design, code, and content, is owned by 234Grammar and protected by applicable intellectual property laws. You retain full ownership of any content you write using the Service. We claim no rights over your documents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Service will be error-free, uninterrupted, or that grammar suggestions will always be accurate. Grammar checking is a tool to assist your writing — not a substitute for your own judgement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, 234Grammar shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability to you for any claim shall not exceed the amount you paid us in the 3 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. We will notify you of significant changes by email or via a notice in the app. Continued use of the Service after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Contact</h2>
            <p>
              For questions about these terms, contact us at <a href="mailto:support@234grammar.com" className="text-primary hover:underline font-semibold">support@234grammar.com</a> or via our <Link href="/contact" className="text-primary hover:underline font-semibold">contact form</Link>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
        <p>© 2026 234Grammar. All rights reserved. · <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link></p>
      </footer>
    </div>
  );
}
