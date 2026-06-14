import { useState } from 'react'

export default function ComposeModal({ onClose }) {
  const [compose, setCompose] = useState({ to: '', subject: '', body: '' })
  const [sending, setSending] = useState(false)

  async function handleSend() {
    if (!compose.to || !compose.body) return
    setSending(true)
    try {
      await fetch('/api/emails/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compose),
      })
      onClose()
    } catch (err) { console.error(err) }
    setSending(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-end z-50 p-6">
      <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <span className="text-xs font-semibold text-white/60">New Message</span>
          <button onClick={onClose} className="text-white/30 hover:text-white/60">✕</button>
        </div>
        <div className="p-4 space-y-3">
          {[
            { label: 'To', key: 'to', placeholder: 'recipient@email.com' },
            { label: 'Subject', key: 'subject', placeholder: 'Subject' },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="flex items-center gap-3 border-b border-white/[0.06] pb-2">
              <span className="text-[10px] text-white/25 uppercase tracking-wider w-12">{label}</span>
              <input
                value={compose[key]}
                onChange={e => setCompose(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-xs text-white/60 placeholder-white/20 outline-none"
              />
            </div>
          ))}
          <textarea
            value={compose.body}
            onChange={e => setCompose(prev => ({ ...prev, body: e.target.value }))}
            placeholder="Write your message..."
            className="w-full bg-transparent text-xs text-white/55 placeholder-white/20 outline-none resize-none h-32"
          />
        </div>
        <div className="flex justify-between items-center px-4 pb-4">
          <button onClick={onClose} className="text-xs text-white/30 hover:text-white/60">Discard</button>
          <button
            onClick={handleSend}
            disabled={sending || !compose.to || !compose.body}
            className="flex items-center gap-2 text-xs text-[#0f0f0f] bg-[#4ade80] px-4 py-1.5 rounded-lg font-medium disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send'}
            <kbd className="text-[#0f0f0f]/50 text-[10px]">⌘↵</kbd>
          </button>
        </div>
      </div>
    </div>
  )
}