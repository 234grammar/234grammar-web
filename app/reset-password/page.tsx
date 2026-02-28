'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase puts the access_token in the URL hash on redirect
    // The client SDK picks it up automatically when initialized
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });

    // Also handle the hash-based token exchange
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || 'Failed to update password. Please try again.');
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Password updated!</h2>
        <p className="text-gray-600 mb-6">Your password has been changed successfully.</p>
        <Link
          href="/login"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primaryHover transition"
        >
          Login now →
        </Link>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="text-center py-8">
        <div className="spinner mx-auto mb-4" style={{ width: 32, height: 32 }} />
        <p className="text-gray-600">Verifying reset link…</p>
        <p className="text-sm text-gray-400 mt-2">
          If this takes too long,{' '}
          <Link href="/login" className="text-primary hover:underline">
            request a new reset link
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="password" className="block text-sm font-semibold mb-2">
          New Password
        </label>
        <input
          type="password"
          id="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
        />
      </div>

      <div>
        <label htmlFor="confirm" className="block text-sm font-semibold mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirm"
          required
          minLength={8}
          placeholder="Repeat your new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primaryHover transition shadow-lg flex items-center justify-center"
      >
        <span>{loading ? 'Updating…' : 'Set New Password'}</span>
        {loading && <span className="spinner ml-3" />}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-gray-50 text-gray-900 font-sans min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Image src="/logo/logo_black.svg" alt="Logo" width={50} height={50} className="w-40" />
          </Link>
        </div>
      </nav>

      <section className="py-20 min-h-screen flex items-center">
        <div className="max-w-md mx-auto w-full px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">Set a new password</h1>
              <p className="text-gray-600 text-sm">
                Choose a strong password you haven&apos;t used before.
              </p>
            </div>

            <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading…</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
