import { useState } from 'react'

export default function TodoAIChat({ onAddTodos }) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/todos/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.todos) {
        await onAddTodos(data.todos)
        setPrompt('')
      }
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <div className="border-t border-white/[0.06] p-3">
      <p className="text-[10px] text-white/25 uppercase tracking-wider mb-2">AI — describe your tasks</p>
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          placeholder="e.g. Review Q3 report by Friday, call Sarah tomorrow..."
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/60 placeholder-white/20 outline-none focus:border-[#4ade80]/40 transition-colors"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="text-xs text-[#0f0f0f] bg-[#4ade80] px-3 py-2 rounded-lg font-medium disabled:opacity-50 shrink-0"
        >
          {loading ? '...' : '✦ Generate'}
        </button>
      </div>
    </div>
  )
}