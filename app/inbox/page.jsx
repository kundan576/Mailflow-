'use client'
import { useEffect, useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import EmailList from './components/EmailList'
import EmailThread from './components/EmailThread'
import ComposeModal from './components/ComposeModal'
import { useEmails } from './hooks/useEmails'
import { useKeyboard } from './hooks/useKeyboard'

export default function InboxPage() {
  const { emails, selected, setSelected, loading, archivedIds, loadEmails, archiveEmail } = useEmails()
  const [showCompose, setShowCompose] = useState(false)
  const [archiving, setArchiving] = useState(false)

  useEffect(() => { loadEmails() }, [])

  async function handleArchive() {
    if (!selected) return
    setArchiving(true)
    await archiveEmail(selected)
    setArchiving(false)
  }

  useKeyboard({
    emails,
    selected,
    setSelected,
    onReply: () => {},
    onCompose: () => setShowCompose(true),
    onArchive: handleArchive,
  })

  return (
  
  <AppShell>
    <div className="flex w-full h-full overflow-hidden">
      
      <EmailList
        emails={emails}
        selected={selected}
        loading={loading}
        archivedIds={archivedIds}
        onSelect={(email) => setSelected(email)}
        onRefresh={loadEmails}
        onCompose={() => setShowCompose(true)}
      />
      
      <EmailThread
        selected={selected}
        onArchive={handleArchive}
        archiving={archiving}
      />
    </div>
    
    {showCompose && <ComposeModal onClose={() => setShowCompose(false)} />}
  </AppShell>
)
   
}