
import { useEffect } from 'react'

export function useKeyboard({ emails, selected, setSelected, onReply, onCompose, onArchive }) {
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return
      if (e.key === 'r' || e.key === 'R') onReply()
      if (e.key === 'c' || e.key === 'C') onCompose()
      if (e.key === 'e' || e.key === 'E') onArchive()
      if (e.key === 'j') {
        const idx = emails.findIndex(em => em.id === selected?.id)
        if (idx < emails.length - 1) setSelected(emails[idx + 1])
      }
      if (e.key === 'k') {
        const idx = emails.findIndex(em => em.id === selected?.id)
        if (idx > 0) setSelected(emails[idx - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [emails, selected])
}