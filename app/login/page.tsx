'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    const remembered = localStorage.getItem('remembered_email');
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'signup') setSuccessMsg('Account created! Please login to continue.');
    if (params.get('expired') === 'true') setErrorMsg('Your session has expired. Please login again.');
    if (params.get('verified') === 'true') setSuccessMsg('Email verified! You can now login.');
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setLoginLoading(true);

    if (remember) {
      localStorage.setItem('remembered_email', email);
    } else {
      localStorage.removeItem('remembered_email');
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      });
      if (response.ok) {
        const params = new URLSearchParams(window.location.search);
        window.location.href = params.get('redirect') || '/editor';
      } else {
        const error = await response.json();
        setErrorMsg(error.message || 'Invalid email or password. Please try again.');
        setLoginLoading(false);
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setLoginLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (response.ok) {
        setShowForgotModal(false);
        setResetEmail('');
        setSuccessMsg('Check your email for a password reset link');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to send reset link. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
    setResetLoading(false);
  }

  return (
    <div className="bg-linear-to-br from-green-50 to-white text-gray-900 font-sans min-h-screen">
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
            <span className="text-sm text-gray-600 hidden sm:inline">Don&apos;t have an account?</span>
            <Link href="/signup" className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primaryHover transition font-semibold">
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <section className="py-12 md:py-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* LOGIN FORM */}
            <div className="order-2 md:order-1 fade-in">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100">
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome Back!</h1>
                  <p className="text-gray-600">Login to continue writing better Nigerian English</p>
                </div>

                {errorMsg && (
                  <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-red-800">Login Failed</p>
                        <p className="text-sm text-red-700 mt-1">{errorMsg}</p>
                      </div>
                    </div>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-green-800">Check Your Email</p>
                        <p className="text-sm text-green-700 mt-1">{successMsg}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="password" className="text-sm font-semibold">Password</label>
                      <button type="button" onClick={() => setShowForgotModal(true)} className="text-sm text-primary hover:underline font-semibold">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        required
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 password-toggle"
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

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-700">Remember me for 30 days</label>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primaryHover transition shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <span>{loginLoading ? 'Logging in...' : 'Login'}</span>
                    {loginLoading && <span className="spinner ml-3" />}
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Google login coming soon! Please use email login for now.')}
                  className="w-full flex items-center cursor-pointer justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition font-semibold"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-primary font-semibold hover:underline">Sign up for free</Link>
                  </p>
                </div>
              </div>
            </div>

            {/* BENEFITS */}
            <div className="order-1 md:order-2 fade-in">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Continue Your Writing Journey</h2>
                <p className="text-lg text-gray-600">Pick up right where you left off with 234Grammar</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    bg: 'bg-green-100', iconColor: 'text-green-600',
                    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                    title: 'Access Your Documents', desc: 'All your saved documents in one place, synced across devices',
                  },
                  {
                    bg: 'bg-blue-100', iconColor: 'text-blue-600',
                    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                    title: 'Track Your Progress', desc: 'See how your writing improves over time with analytics',
                  },
                  {
                    bg: 'bg-purple-100', iconColor: 'text-purple-600',
                    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                    title: 'Nigerian English Mode', desc: 'Your personalized settings and language preferences',
                  },
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 flex items-start gap-4">
                    <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center shrink-0`}>
                      <svg className={`w-6 h-6 ${card.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[{ val: '1000+', label: 'Active Users' }, { val: '50K+', label: 'Documents' }, { val: '99.9%', label: 'Uptime' }].map((stat, i) => (
                    <div key={i}>
                      <div className="text-2xl font-bold text-primary">{stat.val}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-gray-700">
                <strong className="font-semibold">Secure login:</strong> Your connection is encrypted and your data is protected with industry-standard security.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForgotModal(false); }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-8 fade-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your email to receive a reset link</p>
              </div>
              <button onClick={() => setShowForgotModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  id="resetEmail"
                  required
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                />
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primaryHover transition flex items-center justify-center"
              >
                <span>{resetLoading ? 'Sending...' : 'Send Reset Link'}</span>
                {resetLoading && <span className="spinner ml-3" />}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => setShowForgotModal(false)} className="text-sm text-gray-600 hover:text-primary">
                Back to login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2026 234Grammar. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-primary">Privacy</a>
              <a href="/terms" className="text-gray-600 hover:text-primary">Terms</a>
              <Link href="/contact" className="text-gray-600 hover:text-primary">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
