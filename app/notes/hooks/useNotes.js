import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/notes')
      .then(res => {
        if (res.status === 401) { router.replace('/'); return null }
        return res.json()
      })
      .then(data => {
        if (data?.notes) setNotes(data.notes)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function saveNote(emailId, emailSubject, emailSender, note) {
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailId, emailSubject, emailSender, note }),
    })
    setNotes(prev => prev.map(n =>
      n.emailId === emailId ? { ...n, note, updatedAt: new Date().toISOString() } : n
    ))
  }

  async function deleteNote(emailId) {
    await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailId }),
    })
    setNotes(prev => prev.filter(n => n.emailId !== emailId))
  }

  return { notes, loading, saveNote, deleteNote, setNotes }
}