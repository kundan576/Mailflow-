export default function SenderDetails({ email }) {
  if (!email) return null
  return (
    <div className="mb-4 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-xs space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#4ade80]/15 flex items-center justify-center shrink-0">
          <span className="text-[#4ade80] text-sm font-semibold">
            {email.sender?.split('<')[0].trim().slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-white/80 font-medium">{email.sender?.split('<')[0].trim()}</p>
          <p className="text-white/40">{email.sender?.match(/<(.+)>/)?.[1] || email.sender}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
        <div>
          <p className="text-white/25 text-[10px] uppercase tracking-wider mb-0.5">Date</p>
          <p className="text-white/60">{new Date(email.time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div>
          <p className="text-white/25 text-[10px] uppercase tracking-wider mb-0.5">Time</p>
          <p className="text-white/60">{new Date(email.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div>
          <p className="text-white/25 text-[10px] uppercase tracking-wider mb-0.5">From</p>
          <p className="text-white/60 truncate">{email.sender?.match(/<(.+)>/)?.[1] || email.sender}</p>
        </div>
        <div>
          <p className="text-white/25 text-[10px] uppercase tracking-wider mb-0.5">Subject</p>
          <p className="text-white/60 truncate">{email.subject}</p>
        </div>
      </div>
    </div>
  )
}