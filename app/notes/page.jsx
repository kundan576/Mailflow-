// 'use client'
// import { useEffect, useState } from 'react'
// import AppShell from '../../components/layout/AppShell'  
// import { useRouter } from 'next/navigation'
// import { useNotes } from './hooks/useNotes'
// import { useTodos } from './hooks/useTodos'
// import NotesList from './components/NotesList'
// import NoteDetail from './components/NoteDetail'
// import TodoPanel from './components/TodoPanel'

// export default function NotesPage() {
//   const [notes, setNotes] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selected, setSelected] = useState(null)
//   const [editing, setEditing] = useState(false)
//   const [editText, setEditText] = useState('')
//   const [saving, setSaving] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     fetch('/api/notes')
//       .then(res => {
//         if (res.status === 401) { router.replace('/'); return null }
//         return res.json()
//       })
//       .then(data => {
//         if (data?.notes) {
//           setNotes(data.notes)
//           if (data.notes.length > 0) setSelected(data.notes[0])
//         }
//         setLoading(false)
//       })
//   }, [])

//   async function handleSave() {
//     if (!editText.trim() || !selected) return
//     setSaving(true)
//     try {
//       await fetch('/api/notes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           emailId: selected.emailId,
//           emailSubject: selected.emailSubject,
//           emailSender: selected.emailSender,
//           note: editText,
//         }),
//       })
//       setNotes(prev => prev.map(n =>
//         n.emailId === selected.emailId
//           ? { ...n, note: editText, updatedAt: new Date().toISOString() }
//           : n
//       ))
//       setSelected(prev => ({ ...prev, note: editText }))
//       setEditing(false)
//     } catch (err) { console.error(err) }
//     setSaving(false)
//   }

//   async function handleDelete(emailId) {
//     try {
//       await fetch('/api/notes', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ emailId }),
//       })
//       const remaining = notes.filter(n => n.emailId !== emailId)
//       setNotes(remaining)
//       setSelected(remaining[0] || null)
//       setEditing(false)
//     } catch (err) { console.error(err) }
//   }

//   return (
//     <AppShell>
//       <div className="flex h-full">

//         {/* ── NOTES LIST ── */}
//         <div className="w-[280px] border-r border-white/[0.06] flex flex-col shrink-0">
//           <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
//             <span className="text-xs font-semibold text-white/60 tracking-widest uppercase">Notes</span>
//             <span className="text-[10px] text-white/25 border border-white/10 px-2 py-0.5 rounded-full">
//               {notes.length}
//             </span>
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             {loading ? (
//               <div className="flex flex-col gap-3 px-4 py-4">
//                 {[...Array(4)].map((_, i) => (
//                   <div key={i} className="animate-pulse">
//                     <div className="h-3 bg-white/[0.06] rounded w-3/4 mb-2" />
//                     <div className="h-2 bg-white/[0.04] rounded w-full" />
//                   </div>
//                 ))}
//               </div>
//             ) : notes.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full gap-2 px-4">
//                 <p className="text-white/20 text-xs text-center">No notes yet</p>
//                 <p className="text-white/10 text-[10px] text-center">Open an email and click the Note button to add one</p>
//               </div>
//             ) : (
//               notes.map(note => (
//                 <div
//                   key={note.emailId}
//                   onClick={() => { setSelected(note); setEditing(false) }}
//                   className={`px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors ${
//                     selected?.emailId === note.emailId
//                       ? 'bg-white/[0.06] border-l-2 border-l-[#4ade80]'
//                       : 'hover:bg-white/[0.03] border-l-2 border-l-transparent'
//                   }`}
//                 >
//                   <p className="text-xs text-white/60 font-medium truncate mb-0.5">
//                     {note.emailSubject || 'No subject'}
//                   </p>
//                   <p className="text-[10px] text-white/30 truncate mb-1">
//                     {note.emailSender?.split('<')[0].trim() || 'Unknown'}
//                   </p>
//                   <p className="text-[10px] text-white/20 truncate">{note.note}</p>
//                   <p className="text-[10px] text-white/15 mt-1">
//                     {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* ── NOTE DETAIL ── */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {!selected ? (
//             <div className="flex-1 flex flex-col items-center justify-center gap-3">
//               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/10">
//                 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
//                 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
//               </svg>
//               <p className="text-white/20 text-sm">Select a note to view</p>
//             </div>
//           ) : (
//             <>
//               {/* Note header */}
//               <div className="px-8 pt-8 pb-4 border-b border-white/[0.06]">
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="flex-1">
//                     <h1 className="text-base font-semibold text-white/80 tracking-tight mb-1">
//                       {selected.emailSubject || 'No subject'}
//                     </h1>
//                     <div className="flex items-center gap-2">
//                       <span className="text-[10px] text-white/30">
//                         {selected.emailSender?.split('<')[0].trim()}
//                       </span>
//                       <span className="text-white/15">·</span>
//                       <span className="text-[10px] text-white/20">
//                         Updated {new Date(selected.updatedAt).toLocaleDateString('en-US', {
//                           month: 'long', day: 'numeric', year: 'numeric'
//                         })}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-2 ml-4">
//                     <button
//                       onClick={() => router.push('/inbox')}
//                       className="text-[10px] text-white/30 hover:text-white/60 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       View email →
//                     </button>
//                     <button
//                       onClick={() => { setEditing(true); setEditText(selected.note) }}
//                       className="text-[10px] text-[#4ade80] border border-[#4ade80]/30 bg-[#4ade80]/5 px-3 py-1.5 rounded-lg hover:bg-[#4ade80]/15 transition-colors"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(selected.emailId)}
//                       className="text-[10px] text-white/20 hover:text-red-400 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Note body */}
//               <div className="flex-1 overflow-y-auto px-8 py-6">
//                 {editing ? (
//                   <div className="h-full flex flex-col gap-3">
//                     <textarea
//                       value={editText}
//                       onChange={e => setEditText(e.target.value)}
//                       placeholder="Write your note..."
//                       autoFocus
//                       className="flex-1 w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white/60 placeholder-white/20 outline-none resize-none focus:border-[#4ade80]/30 transition-colors"
//                     />
//                     <div className="flex justify-end gap-2">
//                       <button
//                         onClick={() => setEditing(false)}
//                         className="text-xs text-white/30 hover:text-white/60 border border-white/10 px-4 py-2 rounded-lg transition-colors"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleSave}
//                         disabled={saving || !editText.trim()}
//                         className="text-xs text-[#0f0f0f] bg-[#4ade80] px-4 py-2 rounded-lg font-medium hover:bg-[#4ade80]/90 transition-colors disabled:opacity-50"
//                       >
//                         {saving ? 'Saving...' : 'Save note'}
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
//                     {selected.note}
//                   </p>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </AppShell>
//   )
// }

'use client'
import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import NotesList from './components/NotesList'
import NoteDetail from './components/NoteDetail'
import TodoPanel from './components/TodoPanel'
import { useNotes } from './hooks/useNotes'
import { useTodos } from './hooks/useTodos'

export default function NotesPage() {
  const { notes, loading: notesLoading, saveNote, deleteNote, setNotes } = useNotes()
  const { todos, loading: todosLoading, addTodo, toggleTodo, deleteTodo } = useTodos()
  const [selected, setSelected] = useState(null)

  async function handleSave(emailId, emailSubject, emailSender, note) {
    await saveNote(emailId, emailSubject, emailSender, note)
    setNotes(prev => prev.map(n =>
      n.emailId === emailId
        ? { ...n, note, updatedAt: new Date().toISOString() }
        : n
    ))
    setSelected(prev => prev ? { ...prev, note } : null)
  }

  async function handleDelete(emailId) {
    await deleteNote(emailId)
    setNotes(prev => {
      const remaining = prev.filter(n => n.emailId !== emailId)
      setSelected(remaining[0] || null)
      return remaining
    })
  }

  return (
    <AppShell>
      <div className="flex h-full overflow-hidden">

        {/* LEFT — Notes list */}
        <NotesList
          notes={notes}
          selected={selected}
          loading={notesLoading}
          onSelect={setSelected}
        />

        {/* CENTER — Note detail */}
        <NoteDetail
          note={selected}
          onSave={handleSave}
          onDelete={handleDelete}
        />

        {/* RIGHT — Todo panel */}
        <TodoPanel
          todos={todos}
          loading={todosLoading}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />

      </div>
    </AppShell>
  )
}