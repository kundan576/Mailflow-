'use client'
import Link from 'next/link'
import { config } from '../lib/config'

const FEATURES = [
  { icon: '✦', title: 'AI agent', desc: 'Send emails or book meetings in plain English.' },
  { icon: '⚡', title: 'Real-time inbox', desc: 'Emails arrive instantly via webhooks.' },
  { icon: '●', title: 'Smart priority', desc: 'AI labels every email urgent, important, or normal.' },
  { icon: '⌨', title: 'Keyboard first', desc: 'J/K navigate, C compose, R reply, E archive.' },
]

export default function Home() {

function handleLogin() {
  let tenantId = localStorage.getItem('tenantId')
  if (!tenantId) {
    tenantId = crypto.randomUUID()
    localStorage.setItem('tenantId', tenantId)
  }
  window.location.href = `/api/connect?tenantId=${tenantId}`
}


  return (
    <div className="min-h-screen bg-[#f5f4ef] font-mono flex flex-col">

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <span className="text-[#0f0f0f] font-semibold text-lg tracking-tight">
          mail<span className="text-[#1a5c2a]">flow</span>
        </span>
        <span className="text-xs text-black/30 border border-black/15 px-3 py-1 rounded-full">BETA</span>
      </nav>

      {/* HERO */}
      <main className="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-xl mx-auto w-full">
        <p className="text-xs tracking-[3px] text-[#1a5c2a] uppercase font-medium mb-6">
          Gmail + Calendar, reimagined
        </p>
        <h1 className="text-5xl font-semibold text-[#0f0f0f] leading-tight tracking-tighter mb-5">
          Your inbox,{' '}
          <span className="text-[#1a5c2a]">supercharged</span>
        </h1>
        <p className="text-base text-black/50 leading-relaxed font-light mb-10 max-w-sm">
          A faster, smarter way to manage email and calendar —
          powered by AI that works on your behalf.
        </p>

        {/* GOOGLE BUTTON */}
        <a
         
      onClick={handleLogin}
      className="inline-flex items-center gap-3 bg-white text-[#111] px-6 py-3.5 rounded-xl text-sm font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150 mb-8 border border-black/10"
        >
          <GoogleLogo />
          Continue with Google
        </a>

        {/* TRUST */}
        <div className="flex flex-wrap gap-6 justify-center">
          {['Emails never stored', 'Google OAuth secured', 'Gmail + Calendar in one'].map((t) => (
            <span key={t} className="flex items-center gap-2 text-xs text-black/35">
              <span className="w-1 h-1 rounded-full bg-[#1a5c2a] opacity-60" />
              {t}
            </span>
          ))}
        </div>
      </main>

      {/* DEMO LINKS */}
      <div className="flex gap-3 justify-center pb-8">
        {[
          { href: '/inbox', label: '→ View inbox' },
          { href: '/calendar', label: '→ View calendar' },
          { href: '/agent', label: '→ View AI agent' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-xs text-black/40 hover:text-[#1a5c2a] border border-black/15 px-4 py-2 rounded-lg transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* FEATURES */}
      <section className="max-w-3xl mx-auto px-6 py-16 w-full">
        <h2 className="text-2xl font-semibold text-[#0f0f0f] text-center tracking-tight mb-8">
          Everything you need,{' '}
          <span className="text-[#1a5c2a]">nothing you don't</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10 border border-black/10 rounded-2xl overflow-hidden">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-[#f5f4ef] hover:bg-[#eeede8] p-6 transition-colors">
              <span className="text-xl text-[#1a5c2a] block mb-3">{f.icon}</span>
              <p className="text-sm font-medium text-[#0f0f0f] mb-1">{f.title}</p>
              <p className="text-xs text-black/40 leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-black/10 px-8 py-5 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#0f0f0f] tracking-tight">
          mail<span className="text-[#1a5c2a]">flow</span>
        </span>
        <div className="flex gap-5">
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href="#" className="text-xs text-black/30 hover:text-black/60 transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}
