'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NoteDetail({ note, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (note) { setEditText(note.note); setEditing(false) }
  }, [note?.emailId])

  async function handleSave() {
    if (!editText.trim()) return
    setSaving(true)
    await onSave(note.emailId, note.emailSubject, note.emailSender, editText)
    setSaving(false)
    setEditing(false)
  }

  if (!note) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/10">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      <p className="text-white/20 text-sm">Select a note to view</p>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.06] shrink-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-white/80 truncate mb-1">
              {note.emailSubject || 'No subject'}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30">
                {note.emailSender?.split('<')[0].trim()}
              </span>
              <span className="text-white/15">·</span>
              <span className="text-[10px] text-white/20">
                {new Date(note.updatedAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => router.push('/inbox')}
              className="text-[10px] text-white/30 hover:text-white/60 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              View email →
            </button>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-[10px] text-[#4ade80] border border-[#4ade80]/30 bg-[#4ade80]/5 px-3 py-1.5 rounded-lg hover:bg-[#4ade80]/15 transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(note.emailId)}
              className="text-[10px] text-white/20 hover:text-red-400 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {editing ? (
          <div className="h-full flex flex-col gap-3">
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              autoFocus
              className="flex-1 w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white/60 placeholder-white/20 outline-none resize-none focus:border-[#4ade80]/30 transition-colors"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-white/30 border border-white/10 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs text-[#0f0f0f] bg-[#4ade80] px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
            {note.note}
          </p>
        )}
      </div>
    </div>
  )
}