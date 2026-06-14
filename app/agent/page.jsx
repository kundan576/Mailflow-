'use client'
import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import { AGENT_CAPABILITIES } from '../../lib/mockData'

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    text: "Hey! I can send emails, create calendar invites, or search your inbox.",
    badge: null,
  },
  {
    id: 2,
    role: 'user',
    text: 'Send a calendar invite to dev@corsair.dev at 9am Thursday',
    badge: null,
  },
  {
    id: 3,
    role: 'assistant',
    text: 'Done! Invite sent to dev@corsair.dev for Thu Jun 5 at 9:00 AM. Want me to send them an email too?',
    badge: 'via Corsair MCP',
  },
]

export default function AgentPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { id: Date.now(), role: 'user', text, badge: null }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are Mailflow's AI email and calendar assistant. 
You help users send emails, create calendar invites, search their inbox, draft replies, and reschedule meetings — all via Corsair MCP which connects to Gmail and Google Calendar.
Keep responses short and conversational. When the user asks you to do something, confirm you've done it and offer a next step.
Always mention "via Corsair MCP" when you take an action.`,
          messages: [
            ...messages
              .filter(m => m.role !== 'system')
              .map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: text },
          ],
        }),
      })

      const data = await res.json()
      const reply = data?.content?.[0]?.text || "I couldn't process that. Try again."
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: reply, badge: 'via Corsair MCP' },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: 'Something went wrong. Please try again.', badge: null },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <AppShell>
      <div className="h-full flex overflow-hidden">

        {/* ── CHAT PANEL ── */}
        <div className="w-[460px] border-r border-white/[0.06] flex flex-col shrink-0">

          {/* Chat header */}
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-xs font-semibold text-white/70 tracking-wide">AI assistant</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#4ade80]/20 border border-[#4ade80]/30 text-[#4ade80]'
                      : 'bg-white/[0.04] border border-white/[0.06] text-white/55'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.badge && (
                    <span className="inline-block mt-2 text-[10px] bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/25 px-2 py-0.5 rounded-full">
                      {msg.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-[#4ade80]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#4ade80]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#4ade80]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 focus-within:border-[#4ade80]/30 transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-xs text-white/55 placeholder-white/20 outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg bg-[#4ade80] flex items-center justify-center disabled:opacity-30 hover:bg-[#4ade80]/90 transition-all shrink-0"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── CAPABILITIES PANEL ── */}
        <div className="flex-1 flex flex-col justify-center px-12">
          <h2 className="text-sm font-semibold text-white/60 mb-6 tracking-tight">
            What the agent can do
          </h2>
          <ul className="space-y-3 mb-8">
            {AGENT_CAPABILITIES.map((cap) => (
              <li key={cap} className="flex items-center gap-3 text-xs text-white/45">
                <span className="text-white/20">·</span>
                {cap}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-white/20">
            Powered by Corsair MCP + Claude API
          </p>
        </div>
      </div>
    </AppShell>
  )
}
