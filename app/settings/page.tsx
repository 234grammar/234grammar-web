'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('free');
  const [checksUsed, setChecksUsed] = useState(0);
  const [checksResetAt, setChecksResetAt] = useState('');
  const [languageMode, setLanguageMode] = useState('nigerian-english');

  const [savingPrefs, setSavingPrefs] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [startingUpgrade, setStartingUpgrade] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const isPro = plan === 'pro';

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/user/preferences');
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email ?? '');
        setPlan(data.plan ?? 'free');
        setChecksUsed(data.checks_used ?? 0);
        setChecksResetAt(data.checks_reset_at ?? '');
        setLanguageMode(data.mode ?? 'nigerian-english');
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    const res = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: languageMode }),
    });
    setSavingPrefs(false);
    if (res.ok) {
      toast.success('Preferences saved!');
    } else {
      toast.error('Failed to save preferences.');
    }
  };

  const handleChangePassword = async () => {
    setSendingReset(true);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSendingReset(false);
    if (res.ok) {
      toast.success('Password reset email sent! Check your inbox.');
    } else {
      toast.error('Failed to send reset email. Please try again.');
    }
  };

  const handleUpgrade = async () => {
    setStartingUpgrade(true);
    const res = await fetch('/api/payment/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billingCycle: 'pro_monthly' }),
    });
    const data = await res.json();
    if (res.ok && data.authorization_url) {
      window.location.href = data.authorization_url;
    } else {
      toast.error(data.message || 'Could not initialize payment. Please try again.');
      setStartingUpgrade(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    const res = await fetch('/api/user/account', { method: 'DELETE' });
    if (res.ok) {
      const supabase = createClient();
      await supabase.auth.signOut();
      localStorage.removeItem('userPlan');
      localStorage.removeItem('checksUsed');
      router.push('/');
    } else {
      toast.error('Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  const checksPercent = Math.min((checksUsed / 100) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
          <Link href="/">
            <Image src="/logo/logo_black.svg" alt="Logo" width={50} height={50} className="w-36" />
          </Link>
          <h1 className="text-lg font-bold">Settings</h1>
          <Link href="/editor" className="text-sm font-semibold text-primary hover:underline">
            ← Back to Editor
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Profile */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-4">Profile</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-4">Preferences</h2>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Default Language Mode</label>
            <select
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="nigerian-english">🇳🇬 Nigerian English</option>
              <option value="standard-english">🇬🇧 Standard English</option>
              <option value="pidgin">🗣 Pidgin</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">This will be the default mode when you open the editor.</p>
          </div>
          <button
            onClick={handleSavePreferences}
            disabled={savingPrefs}
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primaryHover transition cursor-pointer disabled:opacity-50"
          >
            {savingPrefs ? 'Saving...' : 'Save Preferences'}
          </button>
        </section>

        {/* Plan & Billing */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-4">Plan &amp; Billing</h2>

          <div className="flex items-center gap-3 mb-5">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${isPro ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
              {isPro ? 'Pro' : 'Free'}
            </span>
            {isPro && <span className="text-sm text-gray-500">₦1,500 / month</span>}
          </div>

          {!isPro ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1.5">
                  <span>Grammar checks this month</span>
                  <span className="font-semibold">{checksUsed} / 100</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${checksPercent >= 100 ? 'bg-red-500' : checksPercent >= 80 ? 'bg-yellow-500' : 'bg-primary'}`}
                    style={{ width: `${checksPercent}%` }}
                  />
                </div>
                {checksResetAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Resets on {new Date(checksResetAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">Upgrade to Pro</div>
                    <div className="text-primary font-bold text-xl">₦1,500<span className="text-sm text-gray-500 font-normal">/month</span></div>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Unlimited grammar checks</li>
                  <li>• Document storage (up to 100 docs)</li>
                  <li>• Export to PDF, DOCX, TXT</li>
                  <li>• Advanced Pidgin support</li>
                </ul>
                <button
                  onClick={handleUpgrade}
                  disabled={startingUpgrade}
                  className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primaryHover transition cursor-pointer disabled:opacity-50"
                >
                  {startingUpgrade ? 'Redirecting...' : 'Upgrade to Pro — ₦1,500/month'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">To manage your subscription, please contact <a href="/contact" className="text-primary hover:underline font-semibold">support</a>.</p>
          )}
        </section>

        {/* Security */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-1">Security</h2>
          <p className="text-sm text-gray-500 mb-4">
            We&apos;ll send a password reset link to <span className="font-semibold text-gray-700">{email}</span>.
          </p>
          <button
            onClick={handleChangePassword}
            disabled={sendingReset}
            className="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            {sendingReset ? 'Sending...' : 'Send Password Reset Email'}
          </button>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-2xl border-2 border-red-200 p-6">
          <h2 className="text-lg font-bold text-red-600 mb-1">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete your account and all your data. This cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Delete Account
          </button>
        </section>

      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Delete Account</h3>
            <p className="text-gray-600 text-sm mb-5">
              This will permanently delete your account, all your documents, and all your data. <strong>This cannot be undone.</strong>
            </p>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type <span className="font-mono text-red-600">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm mb-5 focus:border-red-400 focus:outline-none"
              placeholder="DELETE"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleting}
                className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
