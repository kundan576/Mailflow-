'use client'

export default function EmailList({ emails, selected, loading, archivedIds, onSelect, onRefresh, onCompose }) {
  return (
    <div
      className="email-list-panel relative border-r border-white/[0.06] flex flex-col shrink-0"
      style={{ width: '300px', minWidth: '220px', maxWidth: '500px' }}
    >
     {/* Header */}
<div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] gap-2">
  <div className="flex items-center gap-2 shrink-0">
    <span className="text-xs font-semibold text-white/60 tracking-widest uppercase">Inbox</span>
    {archivedIds.length > 0 && (
      <a
        href="/inbox/archived"
        className="text-[9px] text-white/25 hover:text-[#4ade80] border border-white/10 hover:border-[#4ade80]/30 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap"
      >
        {archivedIds.length} archived
      </a>
    )}
  </div>

  <div className="flex items-center gap-2 shrink-0">
    <button
      onClick={onRefresh}
      className="text-[10px] text-white/40 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors whitespace-nowrap"
    >
      {loading ? '⟳' : 'Refresh'}
    </button>
    <button
      onClick={onCompose}
      className="text-[10px] text-[#0f0f0f] bg-[#4ade80] px-3 py-1.5 rounded-lg font-medium hover:bg-[#4ade80]/90 transition-colors whitespace-nowrap"
    >
      Compose
    </button>
  </div>
</div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-3 py-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/25">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input placeholder="Search..." className="bg-transparent text-xs text-white/50 placeholder-white/25 outline-none w-full" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3 px-4 py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-white/[0.06] rounded w-3/4 mb-2" />
                <div className="h-2 bg-white/[0.04] rounded w-full mb-1" />
                <div className="h-2 bg-white/[0.03] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : emails.length === 0 ? (
          <p className="text-white/25 text-xs text-center mt-12">No emails found</p>
        ) : (
          emails.map(email => (
            <div
              key={email.id}
              onClick={() => onSelect(email)}
              className={`px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors ${
                selected?.id === email.id
                  ? 'bg-white/[0.06] border-l-2 border-l-[#4ade80]'
                  : 'hover:bg-white/[0.03] border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: email.unread ? '#f87171' : '#4ade80' }} />
                  <span className={`text-xs font-semibold truncate max-w-[140px] ${email.unread ? 'text-white/80' : 'text-white/45'}`}>
                    {email.sender?.split('<')[0].trim() || 'Unknown'}
                  </span>
                </div>
                <span className="text-[10px] text-white/25 shrink-0">
                  {new Date(email.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className={`text-xs mb-0.5 truncate pl-4 ${email.unread ? 'text-white/65' : 'text-white/35'}`}>{email.subject}</p>
              <p className="text-[10px] text-white/25 truncate pl-4">{email.snippet}</p>
            </div>
          ))
        )}
      </div>

      {/* Drag handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[4px] cursor-col-resize hover:bg-[#4ade80]/40 transition-colors z-20"
        onMouseDown={(e) => {
          e.preventDefault()
          const panel = document.querySelector('.email-list-panel')
          const startX = e.clientX
          const startWidth = panel.offsetWidth
          const onMove = (e) => {
            const newWidth = Math.min(500, Math.max(220, startWidth + e.clientX - startX))
            panel.style.width = newWidth + 'px'
          }
          const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
          }
          window.addEventListener('mousemove', onMove)
          window.addEventListener('mouseup', onUp)
        }}
      />
    </div>
  )
}