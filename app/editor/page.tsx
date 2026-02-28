'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type Issue = {
  text: string;
  type: string;
  message: string;
  suggestion: string;
  isCorrect: boolean;
  position: number;
};

type Document = {
  id: number;
  title: string;
  updated: string;
  wordCount: number;
};

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editorRef = useRef<HTMLDivElement>(null);
  const grammarTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [userPlan, setUserPlan] = useState('free');
  const [userEmail, setUserEmail] = useState('');
  const [checksUsed, setChecksUsed] = useState(0);
  const checksLimit = 100;
  const [languageMode, setLanguageMode] = useState('nigerian-english');
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [saveStatusColor, setSaveStatusColor] = useState('text-gray-500');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Modals
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [warningChecks, setWarningChecks] = useState(80);
  const [resetDays, setResetDays] = useState(12);

  const isPro = userPlan === 'pro' || userPlan === 'pro_trial';

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam) setLanguageMode(modeParam);

    // Days until month reset
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setResetDays(Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // Load plan from Supabase; fall back to localStorage cache
    async function loadUserData() {
      const cachedPlan = localStorage.getItem('userPlan') || 'free';
      const cachedChecks = parseInt(localStorage.getItem('checksUsed') || '0');
      setUserPlan(cachedPlan);
      setChecksUsed(cachedChecks);

      try {
        const res = await fetch('/api/user/preferences');
        if (res.ok) {
          const data = await res.json();
          const plan = data.plan ?? 'free';
          const checks = data.checks_used ?? 0;
          const defaultMode = data.default_mode ?? 'nigerian-english';
          setUserPlan(plan);
          setChecksUsed(checks);
          setUserEmail(data.email ?? '');
          if (!modeParam) setLanguageMode(defaultMode);
          localStorage.setItem('userPlan', plan);
          localStorage.setItem('checksUsed', String(checks));

          if (plan === 'pro' || plan === 'pro_trial') {
            setDocuments([
              { id: 1, title: 'My First Document', updated: '2 hours ago', wordCount: 450 },
              { id: 2, title: 'JAMB Essay Practice', updated: 'Yesterday', wordCount: 680 },
            ]);
          }
        } else {
          // Not logged in — use localStorage only
          if (cachedPlan === 'pro' || cachedPlan === 'pro_trial') {
            setDocuments([
              { id: 1, title: 'My First Document', updated: '2 hours ago', wordCount: 450 },
              { id: 2, title: 'JAMB Essay Practice', updated: 'Yesterday', wordCount: 680 },
            ]);
          }
          // Try to get email from Supabase auth directly (client-side)
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) setUserEmail(user.email);
        }
      } catch {
        // Network error — fall through to cached values
      }
    }

    loadUserData();
  }, [searchParams]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Warn before unload if unsaved
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [unsavedChanges]);

  const checkGrammarWithHarper = useCallback(async (text: string, used: number, plan: string) => {
    let newUsed = used;

    if (plan === 'free') {
      newUsed = used + 1;
      localStorage.setItem('checksUsed', String(newUsed));
      setChecksUsed(newUsed);

      if (newUsed === 80) {
        setWarningChecks(newUsed);
        setShowWarningModal(true);
      } else if (newUsed >= 110) {
        setShowLimitModal(true);
        if (editorRef.current) editorRef.current.contentEditable = 'false';
        return;
      }
    }

    // Sync check count to Supabase (fire-and-forget)
    fetch('/api/user/checks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checksUsed: newUsed }),
    }).catch(() => {/* ignore — not critical */});

    if (!text.trim()) {
      setIssues([]);
      return;
    }

    // Standard English → use Harper WASM linter
    if (languageMode === 'standard-english') {
      try {
        const { lintText } = await import('@/lib/grammar/harper');
        const harperIssues = await lintText(text);
        setIssues(harperIssues);
      } catch (err) {
        console.error('Harper lint error:', err);
        setIssues([]);
      }
      return;
    }

    // Nigerian English + Pidgin — no error issues (placeholder for future NLP)
    setIssues([]);
  }, [languageMode]);

  const handleEditorInput = useCallback(() => {
    const text = editorRef.current?.textContent || '';
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
    setWordCount(words.length);
    setReadingTime(Math.ceil(words.length / 250));
    setUnsavedChanges(true);
    setSaveStatus('Unsaved changes');
    setSaveStatusColor('text-yellow-600');

    if (grammarTimeout.current) clearTimeout(grammarTimeout.current);
    grammarTimeout.current = setTimeout(() => {
      checkGrammarWithHarper(text, checksUsed, userPlan);
    }, 1000);
  }, [checksUsed, userPlan, checkGrammarWithHarper]);

  const handleLanguageModeChange = (mode: string) => {
    setLanguageMode(mode);
    const text = editorRef.current?.textContent || '';
    checkGrammarWithHarper(text, checksUsed, userPlan);
  };

  const handleSave = async () => {
    const title = documentTitle;
    const content = editorRef.current?.textContent || '';
    console.log('Saving:', title, content);
    setSaveStatus('Saved');
    setSaveStatusColor('text-green-600');
    setUnsavedChanges(false);
    setTimeout(() => setSaveStatusColor('text-gray-500'), 2000);
  };

  const handleExport = () => {
    alert('Export feature coming soon!');
  };

  const startProTrial = async () => {
    try {
      const res = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingCycle: 'pro_monthly' }),
      });
      const data = await res.json();
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert(data.message || 'Could not initialize payment. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem('userPlan');
    localStorage.removeItem('checksUsed');
    window.location.href = '/';
  };

  const getIssueColors = (type: string) => {
    switch (type) {
      case 'spelling': return { border: 'border-red-200 bg-red-50', text: 'text-red-600' };
      case 'grammar': return { border: 'border-yellow-200 bg-yellow-50', text: 'text-yellow-600' };
      case 'style': return { border: 'border-blue-200 bg-blue-50', text: 'text-blue-600' };
      default: return { border: 'border-purple-200 bg-purple-50', text: 'text-purple-600' };
    }
  };

  const errorIssues = issues.filter((i) => !i.isCorrect);
  const usagePercent = Math.min((checksUsed / checksLimit) * 100, 100);
  const usageBarColor =
    usagePercent >= 80 ? 'bg-red-500' : usagePercent >= 50 ? 'bg-yellow-500' : 'bg-primary';

  return (
    <div className="bg-gray-50 text-gray-900 font-sans h-screen overflow-hidden flex flex-col">
      {/* TOP NAVBAR */}
      <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shrink-0 z-50">
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo + Doc Title */}
          <div className="flex items-center gap-6">
            <Link href="/" className="">
            <Image
              src={"/logo/logo_black.svg"}
              alt="Logo"
              width={50}
              height={50}
              className="w-40"
            />
          </Link>

            <div className="hidden md:flex items-center gap-2">
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-lg font-semibold border-none focus:outline-none focus:bg-gray-50 px-2 py-1 rounded w-48"
              />
              <span className={`text-xs ${saveStatusColor}`}>{saveStatus}</span>
            </div>
          </div>

          {/* Right: Mode Selector + User Menu */}
          <div className="flex items-center gap-4">
            {/* Language Mode Selector */}
            <select
              value={languageMode}
              onChange={(e) => handleLanguageModeChange(e.target.value)}
              className="hidden md:block px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold text-sm focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="nigerian-english">🇳🇬 Nigerian English</option>
              <option value="standard-english">🇬🇧 Standard English</option>
              <option value="pidgin">🗣 Pidgin</option>
            </select>

            {/* User Menu Dropdown */}
            <div className="relative" data-user-menu>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 cursor-pointer rounded-lg transition"
                data-user-menu
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  U
                </div>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b">
                    <div className="font-semibold truncate">{userEmail || 'Guest'}</div>
                    <div className="text-sm text-gray-600">
                      {userPlan === 'pro' ? 'Pro Plan' : userPlan === 'pro_trial' ? 'Pro Trial (7 days)' : 'Free Plan'}
                    </div>
                  </div>

                  <button className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50 transition">
                    <div className="font-medium">My Documents</div>
                    <div className="text-xs text-gray-500">View saved documents</div>
                  </button>

                  <button className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50 transition">
                    <div className="font-medium">Settings</div>
                    <div className="text-xs text-gray-500">Preferences &amp; account</div>
                  </button>

                  <div className="border-t my-2" />

                  <button
                    onClick={() => { setShowUserMenu(false); setShowUpgradeModal(true); }}
                    className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50 text-primary font-semibold transition"
                  >
                    Upgrade to Pro →
                  </button>

                  <div className="border-t my-2" />

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50 text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN EDITOR CONTAINER */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Documents (Pro only) */}
        {isPro && (
          <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 overflow-hidden shrink-0">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">My Documents</h2>
              <button
                onClick={() => {
                  if (editorRef.current) editorRef.current.textContent = '';
                  setDocumentTitle('Untitled Document');
                  setIssues([]);
                  setWordCount(0);
                  setReadingTime(0);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                title="New document"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No documents yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="font-semibold text-sm mb-1">{doc.title}</div>
                      <div className="text-xs text-gray-500">{doc.wordCount} words • {doc.updated}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* CENTER: EDITOR */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
            {/* Left: Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-600">{wordCount} {wordCount !== 1 ? 'words' : 'word'}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">{readingTime} min read</span>
              </div>

              <div className="flex items-center gap-2">
                {errorIssues.length === 0 ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-600">No issues</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-600 font-semibold">
                      {errorIssues.length} {errorIssues.length !== 1 ? 'issues' : 'issue'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile language mode */}
              <select
                value={languageMode}
                onChange={(e) => handleLanguageModeChange(e.target.value)}
                className="md:hidden px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="nigerian-english">🇳🇬 NG</option>
                <option value="standard-english">🇬🇧 EN</option>
                <option value="pidgin">🗣 Pidgin</option>
              </select>

              {/* Export (Pro only) */}
              <button
                onClick={isPro ? handleExport : () => setShowUpgradeModal(true)}
                className={`hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition text-sm font-semibold ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>

              {/* Save (Pro only) */}
              <button
                onClick={isPro ? handleSave : () => setShowUpgradeModal(true)}
                className={`hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primaryHover transition text-sm font-semibold ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-hidden flex">
            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-4xl mx-auto px-6 py-8">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  className="focus:outline-none min-h-125 font-serif text-base leading-relaxed"
                  style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8', fontSize: '16px' }}
                  data-placeholder="Start writing..."
                />
              </div>
            </div>

            {/* RIGHT PANEL: Issues */}
            <aside className="hidden lg:block w-80 bg-white border-l border-gray-200 overflow-hidden shrink-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="font-bold text-lg">Issues</h2>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  {issues.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-600 font-semibold">Looking good!</p>
                      <p className="text-sm text-gray-500 mt-1">No grammar issues found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {issues.map((issue, index) => {
                        const colors = getIssueColors(issue.type);
                        return (
                          <div
                            key={index}
                            className={`border-2 ${colors.border} rounded-lg p-4 cursor-pointer hover:shadow-md transition`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className={`font-semibold ${colors.text} text-sm uppercase`}>
                                {issue.type}
                              </div>
                              {issue.isCorrect && (
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <p className="text-gray-700 font-mono text-sm mb-2">&quot;{issue.text}&quot;</p>
                            <p className="text-sm text-gray-600">{issue.message}</p>
                            {!issue.isCorrect && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="text-xs text-gray-500 mb-1">Suggestion:</div>
                                <div className="font-semibold text-gray-900">{issue.suggestion}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom Bar: Usage (Free plan) */}
          {!isPro && (
            <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-semibold">{checksUsed}</span>
                  <span className="text-gray-600">/ 100 checks this month</span>
                </div>

                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${usageBarColor} transition-all`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-sm text-primary font-semibold cursor-pointer hover:underline"
              >
                Upgrade for unlimited →
              </button>
            </div>
          )}
        </main>
      </div>

      {/* UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Upgrade to Pro</h2>
                  <p className="text-gray-600">Unlock unlimited checks and premium features</p>
                </div>
                <button onClick={() => setShowUpgradeModal(false)} className="text-gray-400 cursor-pointer hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-linear-to-br from-green-50 to-white border-2 border-primary rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Pro Plan</div>
                    <div className="text-3xl font-bold text-primary">
                      ₦1,500<span className="text-lg text-gray-600">/month</span>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm">
                    7 DAYS FREE
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Lock in this price forever. New users will pay ₦3,500 when we add AI features.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { title: 'Unlimited Grammar Checks', desc: 'No monthly limits' },
                  { title: 'Document Storage (100 docs)', desc: 'Auto-save, search, access anywhere' },
                  { title: 'Advanced Pidgin Support', desc: 'Style suggestions and corrections' },
                  { title: 'Export Documents', desc: 'PDF, DOCX, TXT formats' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={startProTrial}
                className="w-full bg-primary text-white py-4 cursor-pointer rounded-lg text-lg font-bold hover:bg-primaryHover transition shadow-lg"
              >
                Start 7-Day Free Trial
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                No credit card required for trial. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WARNING MODAL (80 checks) */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Running Low on Checks</h3>
              <p className="text-gray-600">
                You&apos;ve used <strong>{warningChecks}</strong> of 100 free checks this month.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-900 font-semibold mb-2">Upgrade to Pro and get:</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Unlimited checks</li>
                <li>• Document storage</li>
                <li>• Advanced features</li>
                <li>• Only ₦1,500/month</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWarningModal(false)}
                className="flex-1 border border-gray-300 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition font-semibold"
              >
                Continue Free
              </button>
              <button
                onClick={() => { setShowWarningModal(false); setShowUpgradeModal(true); }}
                className="flex-1 bg-primary text-white px-4 py-3 rounded-lg cursor-pointer hover:bg-primaryHover transition font-semibold"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HARD LIMIT MODAL (110 checks) */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Monthly Limit Reached</h3>
              <p className="text-gray-600">
                You&apos;ve used all 110 checks this month (100 + 10 bonus).
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-3">Your limit resets in:</p>
              <p className="text-2xl font-bold text-gray-900">{resetDays} days</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { setShowLimitModal(false); setShowUpgradeModal(true); }}
                className="w-full bg-primary text-white py-4 rounded-lg text- cursor-pointer font-bold hover:bg-primaryHover transition"
              >
                Upgrade to Pro - Unlimited Checks
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full border border-gray-300 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition font-semibold"
              >
                Wait Until Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
