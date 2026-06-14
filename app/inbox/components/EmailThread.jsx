'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SenderDetails from './SenderDetails'
import ReplyBox from './ReplyBox'
import SchedulePanel from './SchedulePanel'

export default function EmailThread({ selected, onArchive, archiving }) {
  const [showReply, setShowReply] = useState(false)
  const [showSenderDetails, setShowSenderDetails] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()

  async function handleSend() {
    if (!reply.trim() || !selected) return
    setSending(true)
    try {
      const res = await fetch('/api/emails/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selected.senderEmail,
          subject: `Re: ${selected.subject}`,
          body: reply,
          threadId: selected.threadId,
        }),
      })
      const data = await res.json()
      if (data.success) { setReply(''); setShowReply(false) }
    } catch (err) { console.error(err) }
    setSending(false)
  }

  function renderBody(text) {
  if (!text) return null
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.split('\n').map((line, i) => {
    const parts = line.split(urlRegex)
    return (
      <p key={i} className="break-words overflow-wrap-anywhere min-w-0">
        {parts.map((part, j) =>
          urlRegex.test(part) ? (
            <a
              key={j}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4ade80]/60 hover:text-[#4ade80] underline"
              style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
            >
              {part.length > 50 ? part.slice(0, 50) + '...' : part}
            </a>
          ) : (
            <span key={j} style={{ wordBreak: 'break-word' }}>{part}</span>
          )
        )}
      </p>
    )
  })
}

  if (!selected) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/20 text-sm">Select an email to read</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0 max-w-full">

      {/* ── THREAD HEADER ── */}
      <div className="px-4 md:px-8 pt-6 pb-4 border-b border-white/[0.06] shrink-0">

        {/* Subject */}
        <h1 className="text-base font-semibold text-white/85 tracking-tight mb-3 truncate">
          {selected.subject}
        </h1>

        {/* Sender row */}
        <div className="flex items-center gap-2 mb-4 min-w-0">
          <button
            onClick={() => setShowSenderDetails(!showSenderDetails)}
            className="w-8 h-8 rounded-full bg-[#4ade80]/15 flex items-center justify-center shrink-0 hover:bg-[#4ade80]/25 transition-colors"
          >
            <span className="text-[#4ade80] text-[10px] font-semibold">
              {selected.sender?.split('<')[0].trim().slice(0, 2).toUpperCase() || 'UN'}
            </span>
          </button>
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <button
              onClick={() => setShowSenderDetails(!showSenderDetails)}
              className="text-xs font-medium text-white/70 hover:text-white/90 transition-colors truncate shrink-0"
            >
              {selected.sender?.split('<')[0].trim()}
            </button>
            <span className="text-xs text-white/30 shrink-0">·</span>
            <span className="text-xs text-white/30 truncate">
              {selected.sender?.match(/<(.+)>/)?.[1] || selected.sender}
            </span>
          </div>
          <span className="text-xs text-white/25 shrink-0 ml-2">
            {new Date(selected.time).toLocaleString()}
          </span>
        </div>

        {showSenderDetails && <SenderDetails email={selected} />}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setShowReply(!showReply); setShowSchedule(false) }}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              showReply
                ? 'text-[#4ade80] border-[#4ade80]/50 bg-[#4ade80]/15'
                : 'text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/10 hover:bg-[#4ade80]/20'
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 14-4-4 4-4"/><path d="M5 10h11a4 4 0 0 1 0 8h-1"/>
            </svg>
            Reply <span className="opacity-50 text-[10px]">R</span>
          </button>

          <button
            onClick={() => router.push('/notes')}
            className="flex items-center gap-1.5 text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Note
          </button>

          <button
            onClick={onArchive}
            disabled={archiving}
            className="flex items-center gap-1.5 text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors disabled:opacity-50"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            {archiving ? 'Archiving...' : 'Archive'} <span className="opacity-50 text-[10px]">E</span>
          </button>

          <button
            onClick={() => { setShowSchedule(!showSchedule); setShowReply(false) }}
            className={`flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg transition-colors ${
              showSchedule
                ? 'text-white/60 border-white/20 bg-white/[0.06]'
                : 'text-white/40 border-white/10 hover:bg-white/[0.04]'
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Schedule
          </button>
        </div>

        {showSchedule && (
          <SchedulePanel selected={selected} onClose={() => setShowSchedule(false)} />
        )}
      </div>
{/* ── EMAIL BODY ── */}
<div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 py-6">
  <div className="text-sm text-white/55 leading-relaxed max-w-full space-y-2 email-body">
    {renderBody(selected.body || selected.snippet)}
  </div>
</div>

      {/* ── REPLY BOX ── */}
      {showReply && (
        <ReplyBox
          selected={selected}
          reply={reply}
          setReply={setReply}
          sending={sending}
          onSend={handleSend}
          onClose={() => setShowReply(false)}
        />
      )}
    </div>
  )
}