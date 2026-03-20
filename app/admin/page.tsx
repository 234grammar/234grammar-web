'use client';

import { useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  checks_used: number;
  trial_ends_at: string | null;
  created_at: string;
};

type Contact = {
  id: string;
  name: string | null;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setCount(target); return; }
    let current = 0;
    const steps = 28;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 700 / steps);
    return () => clearInterval(timer);
  }, [target, active]);
  return count;
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
}

const D: React.CSSProperties = { fontFamily: 'var(--font-display, Georgia, serif)' };
const M: React.CSSProperties = { fontFamily: 'var(--font-code, monospace)' };

export default function AdminPage() {
  const [tab, setTab] = useState<'users' | 'messages'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      const [ur, cr] = await Promise.all([fetch('/api/admin/users'), fetch('/api/admin/contacts')]);
      if (ur.ok) setUsers((await ur.json()).users);
      if (cr.ok) setContacts((await cr.json()).contacts);
      setLoading(false);
      setTimeout(() => setReady(true), 80);
    }
    load();
  }, []);

  const updatePlan = async (userId: string, plan: string) => {
    setUpdatingId(userId);
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan }),
    });
    if (res.ok) setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: plan as User['plan'] } : u));
    setUpdatingId(null);
  };

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));
  const total = users.length;
  const pro = users.filter(u => u.plan === 'pro').length;
  const free = users.filter(u => u.plan === 'free').length;

  const totalN = useCountUp(total, ready);
  const proN = useCountUp(pro, ready);
  const freeN = useCountUp(free, ready);

  if (loading) {
    return (
      <div style={{ background: '#F5F2EC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: '20px', height: '20px', border: '1.5px solid #D4CFC6', borderTopColor: '#008751', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ background: '#F5F2EC', minHeight: '100vh', color: '#111111' }}>
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .r0 { opacity: 0; animation: rise 0.6s cubic-bezier(0.16,1,0.3,1) 0ms forwards; }
        .r1 { opacity: 0; animation: rise 0.6s cubic-bezier(0.16,1,0.3,1) 100ms forwards; }
        .r2 { opacity: 0; animation: rise 0.6s cubic-bezier(0.16,1,0.3,1) 180ms forwards; }
        .r3 { opacity: 0; animation: rise 0.6s cubic-bezier(0.16,1,0.3,1) 260ms forwards; }
        .urow { transition: background 0.1s; }
        .urow:hover { background: rgba(0,135,81,0.03) !important; }
        .plan-sel option { background: #fff; color: #111; }
        input:focus { outline: none; }
        .tab { transition: color 0.15s; cursor: pointer; }
        .back:hover { color: #008751 !important; }
        select:focus { outline: none; }
        ::placeholder { color: #C4BFB6 !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #D4CFC6; border-radius: 2px; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        background: '#F5F2EC', borderBottom: '1px solid #DDD9D0',
        padding: '0 48px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ ...D, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: '#111' }}>
            234Grammar
          </span>
          <span style={{ ...M, fontSize: '9px', color: '#008751', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Admin
          </span>
        </div>
        <a href="/editor" className="back" style={{ ...M, fontSize: '11px', color: '#B0AB9F', textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.15s' }}>
          ← Back to editor
        </a>
      </header>

      {/* ── STATS ── */}
      <div className="r0" style={{ borderBottom: '1px solid #DDD9D0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        {[
          { label: 'Total users', value: totalN, accent: false },
          { label: 'Pro subscribers', value: proN, accent: true },
          { label: 'Free users', value: freeN, accent: false },
        ].map((s, i) => (
          <div key={s.label} style={{
            padding: '52px 48px 44px',
            borderRight: i < 2 ? '1px solid #DDD9D0' : 'none',
          }}>
            <div style={{
              ...D, fontSize: '88px', fontWeight: 300, lineHeight: 1,
              letterSpacing: '-0.04em', marginBottom: '12px',
              color: s.accent ? '#008751' : '#111',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {s.value}
            </div>
            <div style={{ ...M, fontSize: '10px', color: '#A09A8F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 48px 96px' }}>

        {/* ── TABS ── */}
        <div className="r1" style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #DDD9D0', marginBottom: '36px' }}>
          {(['users', 'messages'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="tab" style={{
              ...D, fontSize: '18px', fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#111' : '#B0AB9F',
              background: 'none', border: 'none', padding: '0 0 14px',
              borderBottom: `2px solid ${tab === t ? '#008751' : 'transparent'}`,
              marginBottom: '-1px', letterSpacing: '-0.01em',
            }}>
              {t === 'users' ? `Users (${users.length})` : `Messages (${contacts.length})`}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <div className="r2">
            {/* Search */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#FFFFFF', border: '1px solid #DDD9D0', borderRadius: '4px',
                padding: '0 16px', width: '300px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C4BFB6" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    ...M, background: 'none', border: 'none', color: '#111',
                    fontSize: '12px', padding: '11px 0', width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Table */}
            <div style={{ background: '#FFFFFF', border: '1px solid #DDD9D0', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '2fr 110px 90px 110px',
                padding: '11px 24px', borderBottom: '1px solid #EDE9E2', background: '#FAFAF7',
              }}>
                {['Email', 'Plan', 'Checks', 'Joined'].map(h => (
                  <span key={h} style={{ ...M, fontSize: '10px', color: '#A09A8F', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div style={{ ...D, padding: '64px', textAlign: 'center', fontSize: '18px', color: '#C4BFB6', fontStyle: 'italic' }}>
                  No users found
                </div>
              ) : filtered.map((u, i) => (
                <div key={u.id} className="urow" style={{
                  display: 'grid', gridTemplateColumns: '2fr 110px 90px 110px',
                  padding: '14px 24px', alignItems: 'center',
                  borderBottom: i < filtered.length - 1 ? '1px solid #F0EDE6' : 'none',
                }}>
                  <span style={{ ...M, fontSize: '12px', color: '#333', letterSpacing: '0.01em' }}>{u.email}</span>

                  <div>
                    <select
                      value={u.plan}
                      onChange={e => updatePlan(u.id, e.target.value)}
                      disabled={updatingId === u.id}
                      className="plan-sel"
                      style={{
                        ...M, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '4px 10px', borderRadius: '20px', cursor: 'pointer',
                        border: `1px solid ${u.plan === 'pro' ? 'rgba(0,135,81,0.3)' : '#DDD9D0'}`,
                        background: u.plan === 'pro' ? 'rgba(0,135,81,0.06)' : '#F5F2EC',
                        color: u.plan === 'pro' ? '#008751' : '#888880',
                        opacity: updatingId === u.id ? 0.5 : 1,
                        appearance: 'none', WebkitAppearance: 'none',
                        paddingRight: '22px',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A09A8F' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 7px center',
                      }}
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>

                  <span style={{ ...M, fontSize: '12px', color: '#888880' }}>{u.checks_used ?? 0}</span>
                  <span style={{ ...M, fontSize: '11px', color: '#A09A8F' }}>{fmt(u.created_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === 'messages' && (
          <div className="r2">
            <div style={{ background: '#FFFFFF', border: '1px solid #DDD9D0', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '140px 180px 150px 1fr 100px',
                padding: '11px 24px', borderBottom: '1px solid #EDE9E2', background: '#FAFAF7',
              }}>
                {['Name', 'Email', 'Subject', 'Message', 'Date'].map(h => (
                  <span key={h} style={{ ...M, fontSize: '10px', color: '#A09A8F', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>

              {contacts.length === 0 ? (
                <div style={{ ...D, padding: '64px', textAlign: 'center', fontSize: '18px', color: '#C4BFB6', fontStyle: 'italic' }}>
                  No messages yet
                </div>
              ) : contacts.map((c, i) => (
                <div key={c.id} className="urow" style={{
                  display: 'grid', gridTemplateColumns: '140px 180px 150px 1fr 100px',
                  padding: '14px 24px', alignItems: 'start',
                  borderBottom: i < contacts.length - 1 ? '1px solid #F0EDE6' : 'none',
                }}>
                  <span style={{ ...M, fontSize: '12px', color: '#333' }}>{c.name || '—'}</span>
                  <span style={{ ...M, fontSize: '11px', color: '#888880', wordBreak: 'break-all', paddingRight: '12px' }}>{c.email}</span>
                  <span style={{ ...M, fontSize: '11px', color: '#888880', paddingRight: '12px' }}>{c.subject || '—'}</span>

                  <div style={{ ...M, fontSize: '11px', color: '#888880', paddingRight: '16px' }}>
                    {expandedMsg === c.id ? (
                      <div>
                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#555' }}>{c.message}</p>
                        <button onClick={() => setExpandedMsg(null)} style={{ ...M, color: '#008751', fontSize: '10px', marginTop: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.05em' }}>
                          Collapse
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</p>
                        {c.message.length > 48 && (
                          <button onClick={() => setExpandedMsg(c.id)} style={{ ...M, color: '#008751', fontSize: '10px', marginTop: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.05em' }}>
                            Read more
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <span style={{ ...M, fontSize: '11px', color: '#A09A8F' }}>{fmt(c.created_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ marginTop: '72px', paddingTop: '24px', borderTop: '1px solid #DDD9D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ ...D, fontSize: '13px', color: '#C4BFB6', fontStyle: 'italic' }}>234Grammar Admin</span>
          <span style={{ ...M, fontSize: '10px', color: '#C4BFB6', letterSpacing: '0.08em' }}>{new Date().toISOString().slice(0, 10)}</span>
        </div>
      </div>
    </div>
  );
}
