'use client'
export default function NotesList({ notes, selected, loading, onSelect }) {
  return (
    <div className="w-[280px] border-r border-white/[0.06] flex flex-col shrink-0 h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Notes</span>
        <span className="text-[10px] text-white/25 border border-white/10 px-2 py-0.5 rounded-full">
          {notes.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3 px-4 py-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-white/[0.06] rounded w-3/4 mb-2" />
                <div className="h-2 bg-white/[0.04] rounded w-full" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/10">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <p className="text-white/20 text-xs">No notes yet</p>
            <p className="text-white/10 text-[10px]">Open an email and click Note to add one</p>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.emailId}
              onClick={() => onSelect(note)}
              className={`px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors ${
                selected?.emailId === note.emailId
                  ? 'bg-white/[0.06] border-l-2 border-l-[#4ade80]'
                  : 'hover:bg-white/[0.03] border-l-2 border-l-transparent'
              }`}
            >
              <p className="text-xs text-white/60 font-medium truncate mb-0.5">
                {note.emailSubject || 'No subject'}
              </p>
              <p className="text-[10px] text-white/30 truncate mb-1">
                {note.emailSender?.split('<')[0].trim() || 'Unknown'}
              </p>
              <p className="text-[10px] text-white/20 truncate">{note.note}</p>
              <p className="text-[10px] text-white/15 mt-1">
                {new Date(note.updatedAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}