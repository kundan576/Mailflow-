import { useState, useEffect } from 'react'

export default function EmailNote({ emailId }) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState(false)

  // Load note when email changes
  useEffect(() => {
    if (!emailId) return
    setNote('')
    setEditing(false)
    fetch(`/api/notes?emailId=${emailId}`)
      .then(res => res.json())
      .then(data => {
        if (data.note) {
          setNote(data.note)
        }
      })
  }, [emailId])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId, note }),
      })
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Save note error:', err)
    }
    setSaving(false)
  }

  async function handleDelete() {
    try {
      await fetch('/api/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId }),
      })
      setNote('')
      setEditing(false)
    } catch (err) {
      console.error('Delete note error:', err)
    }
  }

  return (
    <div className="mx-8 mb-4 border border-white/[0.06] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#4ade80]/60">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Private note</span>
          {saved && <span className="text-[10px] text-[#4ade80] animate-pulse">Saved!</span>}
        </div>
        <div className="flex items-center gap-2">
          {note && !editing && (
            <button
              onClick={handleDelete}
              className="text-[10px] text-white/20 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => setEditing(!editing)}
            className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
              editing
                ? 'text-white/40 hover:text-white/60'
                : 'text-[#4ade80]/60 hover:text-[#4ade80]'
            }`}
          >
            {editing ? 'Cancel' : note ? 'Edit' : '+ Add note'}
          </button>
        </div>
      </div>

      {/* Note content */}
      {editing ? (
        <div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a private note about this email..."
            autoFocus
            className="w-full bg-transparent px-4 py-3 text-xs text-white/55 placeholder-white/20 outline-none resize-none h-24"
          />
          <div className="flex justify-end px-4 pb-3 gap-2">
            <button
              onClick={() => setEditing(false)}
              className="text-[10px] text-white/30 hover:text-white/60 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-[10px] text-[#0f0f0f] bg-[#4ade80] px-4 py-1.5 rounded-lg font-medium hover:bg-[#4ade80]/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save note'}
            </button>
          </div>
        </div>
      ) : note ? (
        <div className="px-4 py-3">
          <p className="text-xs text-white/40 leading-relaxed whitespace-pre-line">{note}</p>
        </div>
      ) : (
        <div className="px-4 py-3">
          <p className="text-[10px] text-white/15 italic">No note yet. Click "+ Add note" to add one.</p>
        </div>
      )}
    </div>
  )
}