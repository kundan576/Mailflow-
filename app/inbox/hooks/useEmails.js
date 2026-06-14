import { useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useEmails() {
  const [emails, setEmails] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
   const [archivedIds, setArchivedIds] = useState([])  // ← start empty
  const router = useRouter()

  
  useEffect(() => {
    const archived = JSON.parse(localStorage.getItem('archived_emails') || '[]')
    setArchivedIds(archived)
  }, [])


  function loadEmails() {
    setLoading(true)
    fetch('/api/emails')
      .then(res => {
        if (res.status === 401) { router.replace('/'); return null }
        return res.json()
      })
      .then(data => {
        if (data?.emails && data.emails.length > 0) {
          const archived = JSON.parse(localStorage.getItem('archived_emails') || '[]')
          const filtered = data.emails.filter(e => !archived.includes(e.id))
          setEmails(filtered)
          setSelected(filtered[0] || null)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  async function archiveEmail(email) {
    if (!email) return
    const archived = JSON.parse(localStorage.getItem('archived_emails') || '[]')
    if (!archived.includes(email.id)) {
      archived.push(email.id)
      localStorage.setItem('archived_emails', JSON.stringify(archived))
      setArchivedIds(archived)
    }
    await fetch('/api/emails/archive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: email.id }),
    })
    const remaining = emails.filter(e => e.id !== email.id)
    setEmails(remaining)
    setSelected(remaining[0] || null)
  }

  return { emails, selected, setSelected, loading, archivedIds, loadEmails, archiveEmail }
}