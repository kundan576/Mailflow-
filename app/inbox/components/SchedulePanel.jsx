import { useState } from 'react'

export default function SchedulePanel({ selected, onClose }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [duration, setDuration] = useState('30 min')
  const [title, setTitle] = useState(`Meeting: ${selected?.subject || ''}`)
  const [sending, setSending] = useState(false)

  async function handleCreate() {
    if (!date || !selected) return
    setSending(true)
    const mins = { '15 min': 15, '30 min': 30, '45 min': 45, '1 hour': 60 }[duration] || 30
    const start = new Date(`${date}T${time}`)
    const end = new Date(start.getTime() + mins * 60000)

    try {
      const res = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          start: start.toISOString(),
          end: end.toISOString(),
          attendee: selected.senderEmail,
        }),
      })
      const data = await res.json()
      if (data.success) {
        alert(`✅ Meeting scheduled for ${start.toLocaleString()}`)
        onClose()
      } else {
        alert('Failed: ' + data.error)
      }
    } catch (err) {
      alert('Failed to create meeting')
    }
    setSending(false)
  }

  return (
    <div className="mt-3 bg-[#141414] border border-white/[0.08] rounded-xl p-4 shadow-xl">
      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Schedule a meeting</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-[10px] text-white/25 uppercase tracking-wider block mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/60 outline-none focus:border-[#4ade80]/40"
            style={{ colorScheme: 'dark' }} />
        </div>
        <div>
          <label className="text-[10px] text-white/25 uppercase tracking-wider block mb-1">Time</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/60 outline-none focus:border-[#4ade80]/40"
            style={{ colorScheme: 'dark' }} />
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-white/25 uppercase tracking-wider block mb-1">Duration</label>
        <div className="flex gap-2">
          {['15 min', '30 min', '45 min', '1 hour'].map(d => (
            <button key={d} onClick={() => setDuration(d)}
              className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${
                duration === d ? 'text-[#4ade80] border-[#4ade80]/40 bg-[#4ade80]/10' : 'text-white/30 border-white/10 hover:border-white/20'
              }`}>{d}</button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-white/25 uppercase tracking-wider block mb-1">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/60 placeholder-white/20 outline-none focus:border-[#4ade80]/40" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
        <p className="text-[10px] text-white/20">Inviting {selected?.senderEmail}</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="text-[10px] text-white/30 px-3 py-1.5 rounded-lg border border-white/10">Cancel</button>
          <button onClick={handleCreate} disabled={!date || sending}
            className="text-[10px] text-[#0f0f0f] bg-[#4ade80] px-4 py-1.5 rounded-lg font-medium disabled:opacity-50">
            {sending ? 'Creating...' : 'Create meeting'}
          </button>
        </div>
      </div>
    </div>
  )
}