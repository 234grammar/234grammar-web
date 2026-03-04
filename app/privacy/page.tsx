import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How 234Grammar collects, uses, and protects your data.',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Overview</h2>
            <p>
              234Grammar (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This policy explains what information we collect when you use 234Grammar, how we use it, and your rights regarding your data. We are based in Lagos, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How Grammar Checking Works</h2>
            <p>
              <strong>Your writing never leaves your device.</strong> The grammar engine runs entirely in your browser using WebAssembly (WASM). When you type in the editor, text is processed locally — it is not sent to our servers for grammar analysis. This is true for all plans.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Account Information</h3>
                <p>When you create an account, we collect your email address. We use this to authenticate you and send transactional emails (e.g. email verification, password reset).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Usage Data</h3>
                <p>We track the number of grammar checks you perform each month to enforce the free tier limit (100 checks/month). This count is stored on our servers and reset monthly.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Documents (Pro users)</h3>
                <p>Pro users can optionally save documents to the cloud. Saved documents are stored on our servers (Supabase). You can delete any document at any time from the editor.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Contact Form</h3>
                <p>If you contact us via the contact form, we collect your name, email address, and message content.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Payment Information</h3>
                <p>Payments are processed by <strong>Paystack</strong>. We do not store your card details. We receive a payment confirmation and update your account plan accordingly.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and operate the 234Grammar service</li>
              <li>To authenticate your account and keep it secure</li>
              <li>To enforce plan limits (e.g. 100 free checks per month)</li>
              <li>To send transactional emails (verification, password reset, payment receipts)</li>
              <li>To respond to support requests</li>
              <li>To improve the product based on usage patterns</li>
            </ul>
            <p className="mt-3">We do not sell your data to third parties. We do not use your writing for AI training.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Services</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Supabase</h3>
                <p>We use Supabase for database storage and authentication. Your account data and saved documents are stored on Supabase infrastructure.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Paystack</h3>
                <p>We use Paystack to process payments. Your payment information is handled directly by Paystack and subject to their privacy policy.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Resend</h3>
                <p>We use Resend to send transactional emails. Your email address is shared with Resend solely for this purpose.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. If you delete your account, all your data — including saved documents — is permanently deleted from our systems. You can delete your account at any time from <Link href="/settings" className="text-primary hover:underline font-semibold">Settings</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Access the data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Delete your account and all associated data</li>
              <li>Withdraw consent for optional communications</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:support@234grammar.com" className="text-primary hover:underline font-semibold">support@234grammar.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Security</h2>
            <p>
              We take reasonable technical measures to protect your data, including encrypted connections (HTTPS), row-level security on our database, and secure authentication. No system is 100% secure, but we take your privacy seriously.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. If we make significant changes, we will notify you by email or via a notice in the app. Continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at <a href="mailto:support@234grammar.com" className="text-primary hover:underline font-semibold">support@234grammar.com</a> or via our <Link href="/contact" className="text-primary hover:underline font-semibold">contact form</Link>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
        <p>© 2026 234Grammar. All rights reserved. · <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link></p>
      </footer>
    </div>
  );
}
