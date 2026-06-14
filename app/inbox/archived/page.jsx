'use client'
import { useEffect, useState } from 'react'
import AppShell from '../../../components/layout/AppShell'
import { useRouter } from 'next/navigation'

export default function ArchivedPage() {
  const [emails, setEmails] = useState([])
  const [allEmails, setAllEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/emails')
      .then(res => {
        if (res.status === 401) { router.replace('/'); return null }
        return res.json()
      })
      .then(data => {
        if (data?.emails) {
          setAllEmails(data.emails)
          const archived = JSON.parse(localStorage.getItem('archived_emails') || '[]')
          const archivedEmails = data.emails.filter(e => archived.includes(e.id))
          setEmails(archivedEmails)
        }
        setLoading(false)
      })
  }, [])

  function handleUnarchive(emailId) {
    const archived = JSON.parse(localStorage.getItem('archived_emails') || '[]')
    const updated = archived.filter(id => id !== emailId)
    localStorage.setItem('archived_emails', JSON.stringify(updated))
    setEmails(prev => prev.filter(e => e.id !== emailId))

    // Also unarchive in Gmail
    fetch('/api/emails/unarchive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: emailId }),
    })
  }

  return (
    <AppShell>
      <div className="h-full flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Archived
            </span>
            <span className="text-[10px] text-white/25 border border-white/10 px-2 py-0.5 rounded-full">
              {emails.length} emails
            </span>
          </div>
          {/* Close button */}
          <button
            onClick={() => router.push('/inbox')}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-3 px-6 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-white/[0.06] rounded w-3/4 mb-2" />
                  <div className="h-2 bg-white/[0.04] rounded w-full mb-1" />
                  <div className="h-2 bg-white/[0.03] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <p className="text-white/20 text-sm">No archived emails</p>
              <button
                onClick={() => router.push('/inbox')}
                className="text-xs text-[#4ade80] hover:text-[#4ade80]/80 transition-colors"
              >
                ← Back to inbox
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {emails.map(email => (
                <div
                  key={email.id}
                  className="flex items-start justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Email info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white/40 text-[10px] font-semibold">
                        {email.sender?.split('<')[0].trim().slice(0, 2).toUpperCase() || 'UN'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-white/50">
                          {email.sender?.split('<')[0].trim() || 'Unknown'}
                        </span>
                        <span className="text-[10px] text-white/20">
                          {new Date(email.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-white/35 truncate mb-0.5">{email.subject}</p>
                      <p className="text-[10px] text-white/20 truncate">{email.snippet}</p>
                    </div>
                  </div>

                  {/* Unarchive button */}
                  <button
                    onClick={() => handleUnarchive(email.id)}
                    className="ml-4 shrink-0 text-[10px] text-[#4ade80] border border-[#4ade80]/30 bg-[#4ade80]/5 px-3 py-1.5 rounded-lg hover:bg-[#4ade80]/15 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Unarchive
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}