import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Users, BarChart3, Zap, Shield, Sparkles, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Chatbot from '@/components/Chatbot';

/* ─── Google Fonts injected once ─────────────────────────────────────────── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ─── Animated counter ────────────────────────────────────────────────────── */
const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 22);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Poll preview card ───────────────────────────────────────────────────── */
const PollCard = () => {
  const [voted, setVoted] = useState(null);
  const options = [
    { label: 'Product Design', pct: 54 },
    { label: 'Engineering', pct: 28 },
    { label: 'Marketing', pct: 18 },
  ];
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="bg-white rounded-2xl border border-stone-200 shadow-xl p-6 w-full max-w-sm mx-auto">
      <p className="text-xs font-medium text-amber-600 uppercase tracking-widest mb-3">Live Poll</p>
      <h4 className="text-stone-800 font-semibold text-base mb-5 leading-snug">
        Which team drives the most business value?
      </h4>
      <div className="space-y-3">
        {options.map((o, i) => (
          <button
            key={i}
            onClick={() => setVoted(i)}
            className="w-full text-left group relative overflow-hidden rounded-xl border transition-all duration-200"
            style={{
              borderColor: voted === i ? '#d97706' : '#e7e5e4',
              background: voted === i ? '#fffbeb' : '#fafaf9',
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-xl transition-all duration-700"
              style={{
                width: voted !== null ? `${o.pct}%` : '0%',
                background: voted === i
                  ? 'linear-gradient(90deg,#fde68a,#fbbf24)'
                  : 'linear-gradient(90deg,#f5f5f4,#e7e5e4)',
              }}
            />
            <div className="relative flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-stone-700">{o.label}</span>
              {voted !== null && (
                <span className="text-xs font-semibold text-stone-500">{o.pct}%</span>
              )}
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-stone-400 mt-4">
        {voted !== null ? '1,284 votes · tap to change' : 'Tap an option to vote'}
      </p>
    </div>
  );
};

/* ─── Main component ──────────────────────────────────────────────────────── */
const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Lightning Fast',
      desc: 'Launch a poll in under 30 seconds with our distraction-free creator.',
      accent: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Real-time Analytics',
      desc: 'Live charts update as votes roll in — no refresh needed.',
      accent: '#0ea5e9',
      bg: '#f0f9ff',
      border: '#bae6fd',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Secure & Private',
      desc: 'Your data, your rules. End-to-end encryption by default.',
      accent: '#10b981',
      bg: '#f0fdf4',
      border: '#a7f3d0',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Team Collaboration',
      desc: 'Invite teammates, assign roles, and co-edit polls seamlessly.',
      accent: '#8b5cf6',
      bg: '#faf5ff',
      border: '#ddd6fe',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      ),
      title: 'Custom Branding',
      desc: 'White-label polls with your logo, fonts, and brand palette.',
      accent: '#f43f5e',
      bg: '#fff1f2',
      border: '#fecdd3',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
      ),
      title: 'Advanced Controls',
      desc: 'Set deadlines, limit votes, randomize options and much more.',
      accent: '#f97316',
      bg: '#fff7ed',
      border: '#fed7aa',
    },
  ];

  const steps = [
    { num: '01', title: 'Create your poll', desc: 'Add a question and options in seconds.' },
    { num: '02', title: 'Share the link', desc: 'One link works on every device, no app required.' },
    { num: '03', title: 'Watch results live', desc: 'Track votes and insights in real time.' },
  ];

  return (
    <>
      <FontLoader />
      <style>{`
        :root {
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
          --ink: #1c1917;
          --ink-2: #57534e;
          --ink-3: #a8a29e;
          --paper: #fafaf9;
          --paper-2: #f5f4f2;
          --border: #e7e5e4;
          --amber: #f59e0b;
          --amber-light: #fef3c7;
        }
        * { box-sizing: border-box; }
        body { background: var(--paper); }

        .syne { font-family: var(--font-display); }
        .dm { font-family: var(--font-body); }

        /* noise overlay */
        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: inherit;
        }

        /* nav pill */
        .nav-pill {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
        }

        /* hero glow */
        .hero-glow {
          background: radial-gradient(ellipse 80% 60% at 50% 0%, #fef3c740 0%, transparent 70%);
        }

        /* tag badge */
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          background: var(--amber-light);
          border: 1px solid #fde68a;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #92400e;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* CTA primary */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          background: var(--ink);
          color: #fff;
          border-radius: 12px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 16px rgba(28,25,23,0.18);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(28,25,23,0.24);
        }

        /* CTA secondary */
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          background: transparent;
          color: var(--ink);
          border-radius: 12px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.02em;
          border: 1.5px solid var(--border);
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .btn-secondary:hover {
          border-color: var(--ink);
          background: var(--paper-2);
        }

        /* stat cards */
        .stat-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(28,25,23,0.08);
        }

        /* feature card */
        .feat-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .feat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(28,25,23,0.10);
        }
        .feat-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
        }

        /* step */
        .step-num {
          font-family: var(--font-display);
          font-size: 48px;
          font-weight: 800;
          line-height: 1;
          color: #e7e5e4;
        }

        /* CTA band */
        .cta-band {
          background: var(--ink);
          border-radius: 28px;
          overflow: hidden;
          position: relative;
        }
        .cta-band::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 80% 50%, #f59e0b22, transparent);
        }

        /* footer */
        .footer-link {
          color: #78716c;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.15s;
        }
        .footer-link:hover { color: #e7e5e4; }

        /* divider */
        .divider { border: none; border-top: 1px solid var(--border); }

        /* nav link */
        .nav-link {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-2);
          background: none; border: none; cursor: pointer;
          padding: 6px 12px;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover { background: var(--paper-2); color: var(--ink); }

        /* responsive */
        @media (max-width: 640px) {
          .hero-h1 { font-size: 2.6rem !important; }
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; gap: 10px !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .feat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <div className="dm" style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>

        {/* ── NAV ── */}
        <nav className="nav-pill" style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)', maxWidth: 1100, zIndex: 100,
          borderRadius: 16, padding: '0 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32,
                background: 'var(--ink)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BarChart3 style={{ width: 16, height: 16, color: '#fbbf24' }} />
              </div>
              <span className="syne" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                WePollin
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="nav-link" onClick={() => navigate('/login')}>Log in</button>
              <button className="btn-primary" style={{ padding: '8px 18px', fontSize: 14 }} onClick={() => navigate('/signup')}>
                Get started <ArrowUpRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="hero-glow" style={{ paddingTop: 120, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
          {/* decorative circles */}
          <div style={{
            position: 'absolute', top: -80, right: -80, width: 400, height: 400,
            borderRadius: '50%', border: '1px solid #e7e5e4', opacity: 0.6, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 250, height: 250,
            borderRadius: '50%', border: '1px solid #e7e5e4', opacity: 0.5, pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
              {/* left */}
              <div style={{ flex: '1 1 420px', minWidth: 0 }}>
                <div className="badge" style={{ marginBottom: 24 }}>
                  <Sparkles style={{ width: 12, height: 12 }} />
                  Create polls in seconds
                </div>

                <h1 className="syne hero-h1" style={{
                  fontSize: '3.8rem', fontWeight: 800, lineHeight: 1.08,
                  color: 'var(--ink)', marginBottom: 20, letterSpacing: '-0.03em',
                }}>
                  Polls that<br />
                  <span style={{
                    WebkitTextStroke: '2px var(--ink)',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}>
                    actually&nbsp;matter
                  </span>
                </h1>

                <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: 32, maxWidth: 440 }}>
                  Engage your audience with beautiful, interactive polls. Get real-time insights and make data-driven decisions — effortlessly.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <button className="btn-primary" onClick={() => navigate('/signup')}>
                    Start for free <ChevronRight style={{ width: 16, height: 16 }} />
                  </button>
                  <button className="btn-secondary" onClick={() => navigate('/login')}>
                    View demo
                  </button>
                </div>

                <p style={{ marginTop: 16, fontSize: 13, color: 'var(--ink-3)' }}>
                  No credit card required · Free forever plan
                </p>
              </div>

              {/* right — live poll preview */}
              <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', inset: -20,
                    background: 'radial-gradient(ellipse at center, #fef3c7 0%, transparent 70%)',
                    borderRadius: 40, pointerEvents: 'none',
                  }} />
                  <PollCard />
                </div>
              </div>
            </div>

            {/* stats row */}
            <div className="stats-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 64,
            }}>
              {[
                { val: 10000, suffix: '+', label: 'Active Polls' },
                { val: 50000, suffix: '+', label: 'Total Votes' },
                { val: 5000, suffix: '+', label: 'Happy Users' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="syne" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>
                    <Counter end={s.val} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" style={{ margin: '0 auto', maxWidth: 1100, padding: '0 24px', border: 'none', borderTop: '1px solid var(--border)' }} />

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: '96px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 56, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16, justifyContent: 'space-between' }}>
            <div>
              <p className="badge" style={{ marginBottom: 12, display: 'inline-flex' }}>How it works</p>
              <h2 className="syne" style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
                Three steps to<br />insight
              </h2>
            </div>
            <p style={{ maxWidth: 320, color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.65, margin: 0 }}>
              From idea to live poll in the time it takes to brew a coffee.
            </p>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: 32,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div className="step-num">{s.num}</div>
                <h3 className="syne" style={{ fontSize: '1.1rem', fontWeight: 700, margin: '12px 0 8px', color: 'var(--ink)' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 38, right: -12,
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--amber-light)',
                    border: '1.5px solid #fde68a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2,
                  }}>
                    <ChevronRight style={{ width: 12, height: 12, color: '#92400e' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ background: 'var(--paper-2)', padding: '96px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p className="badge" style={{ marginBottom: 14, display: 'inline-flex' }}>Features</p>
              <h2 className="syne" style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
                Everything you need,<br />nothing you don't
              </h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
                Powerful features that make polling feel effortless.
              </p>
            </div>

            <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {features.map((f, i) => (
                <div key={i} className="feat-card">
                  {/* subtle accent blob */}
                  <div style={{
                    position: 'absolute', top: -20, right: -20,
                    width: 100, height: 100, borderRadius: '50%',
                    background: f.bg, opacity: 0.8, pointerEvents: 'none',
                  }} />
                  <div className="feat-icon" style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                    <span style={{ color: f.accent }}>{f.icon}</span>
                  </div>
                  <h3 className="syne" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="cta-band" style={{ padding: '72px 48px', textAlign: 'center' }}>
              <p className="badge" style={{
                display: 'inline-flex', marginBottom: 20,
                background: '#ffffff18', border: '1px solid #ffffff30', color: '#fde68a',
              }}>
                Ready to start?
              </p>
              <h2 className="syne" style={{
                fontSize: '2.8rem', fontWeight: 800, color: '#fff',
                letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16,
              }}>
                Your first poll is<br />30 seconds away
              </h2>
              <p style={{ color: '#a8a29e', fontSize: 16, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
                Join thousands of creators who trust WePollin to understand their audiences better.
              </p>
              <button
                className="btn-primary"
                style={{ background: '#f59e0b', color: '#1c1917', boxShadow: '0 8px 32px #f59e0b44' }}
                onClick={() => navigate('/signup')}
              >
                Create your first poll <ArrowUpRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: 'var(--ink)', color: '#e7e5e4', padding: '60px 24px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 40, marginBottom: 48 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 30, height: 30, background: '#f59e0b', borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BarChart3 style={{ width: 15, height: 15, color: '#1c1917' }} />
                  </div>
                  <span className="syne" style={{ fontSize: 17, fontWeight: 700 }}>WePollin</span>
                </div>
                <p style={{ fontSize: 13, color: '#78716c', lineHeight: 1.65, maxWidth: 200 }}>
                  Empowering decisions through beautiful, intuitive polling.
                </p>
              </div>
              <div>
                <p className="syne" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#57534e', marginBottom: 14 }}>Features</p>
                {['Real-time Analytics', 'Team Collaboration', 'Custom Branding', 'Advanced Security'].map(l => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <a href="#" className="footer-link">{l}</a>
                  </div>
                ))}
              </div>
              <div>
                <p className="syne" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#57534e', marginBottom: 14 }}>Resources</p>
                {['Documentation', 'API Reference', 'Tutorials'].map(l => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <a href="#" className="footer-link">{l}</a>
                  </div>
                ))}
              </div>
              <div>
                <p className="syne" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#57534e', marginBottom: 14 }}>Contact</p>
                <p style={{ fontSize: 13, color: '#78716c', marginBottom: 6 }}>ra920453@gmail.com</p>
                <p style={{ fontSize: 13, color: '#78716c' }}>Developer: Owais Ahmed</p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #292524', marginBottom: 24 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <p style={{ fontSize: 13, color: '#57534e', margin: 0 }}>
                © {new Date().getFullYear()} WePollin. All rights reserved.
              </p>
              <p style={{ fontSize: 13, color: '#57534e', margin: 0 }}>
                Crafted with ❤️ by Owais Ahmed
              </p>
            </div>
          </div>
        </footer>

        <Chatbot />
      </div>
    </>
  );
};

export default LandingPage;