'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      toast.error(updateError.message || 'Failed to update password. Please try again.');
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
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirm" className="block text-sm font-semibold mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            id="confirm"
            required
            minLength={8}
            placeholder="Repeat your new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirm ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

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
