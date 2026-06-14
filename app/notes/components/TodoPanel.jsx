'use client'
import { useState } from 'react'
import TodoAIChat from './TodoAIChat'

export default function TodoPanel({ todos, loading, onAdd, onToggle, onDelete, onAddMany }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' })

  async function handleAdd() {
    if (!form.title.trim()) return
    await onAdd(form.title, form.description, form.dueDate || null)
    setForm({ title: '', description: '', dueDate: '' })
    setShowForm(false)
  }

  async function handleAITodos(aiTodos) {
    for (const todo of aiTodos) {
      await onAdd(todo.title, todo.description, todo.dueDate)
    }
  }

  const pending = todos.filter(t => !t.completed)
  const completed = todos.filter(t => t.completed)

  return (
    <div className="w-[320px] border-l border-white/[0.06] flex flex-col shrink-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Todo</span>
          <span className="text-[10px] text-white/25 border border-white/10 px-2 py-0.5 rounded-full">
            {pending.length} pending
          </span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] text-[#0f0f0f] bg-[#4ade80] px-3 py-1.5 rounded-lg font-medium hover:bg-[#4ade80]/90 transition-colors"
        >
          + New
        </button>
      </div>

      {/* New todo form */}
      {showForm && (
        <div className="px-4 py-3 border-b border-white/[0.06] space-y-2">
          <input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Task title"
            autoFocus
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/60 placeholder-white/20 outline-none focus:border-[#4ade80]/40 transition-colors"
          />
          <input
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Description (optional)"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/60 placeholder-white/20 outline-none focus:border-[#4ade80]/40 transition-colors"
          />
          <div>
            <label className="text-[10px] text-white/25 uppercase tracking-wider block mb-1">Due date & reminder</label>
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/60 outline-none focus:border-[#4ade80]/40 transition-colors"
              style={{ colorScheme: 'dark' }}
            />
            {form.dueDate && (
              <p className="text-[10px] text-[#4ade80]/60 mt-1">
                ⏰ You'll get a reminder email when this is due
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 text-[10px] text-white/30 border border-white/10 py-1.5 rounded-lg">
              Cancel
            </button>
            <button onClick={handleAdd} className="flex-1 text-[10px] text-[#0f0f0f] bg-[#4ade80] py-1.5 rounded-lg font-medium">
              Add task
            </button>
          </div>
        </div>
      )}

      {/* Todo list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3 px-4 py-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse h-8 bg-white/[0.04] rounded" />
            ))}
          </div>
        ) : todos.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-white/15 text-xs">No todos yet</p>
          </div>
        ) : (
          <div className="py-2">
            {/* Pending */}
            {pending.length > 0 && (
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-wider px-4 py-2">Pending</p>
                {pending.map(todo => (
                  <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
                ))}
              </div>
            )}
            {/* Completed */}
            {completed.length > 0 && (
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-wider px-4 py-2 mt-2">Completed</p>
                {completed.map(todo => (
                  <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Chat */}
      <TodoAIChat onAddTodos={handleAITodos} />
    </div>
  )
}

function TodoItem({ todo, onToggle, onDelete }) {
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date()

  return (
    <div className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/[0.02] group transition-colors">
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-[#4ade80] border-[#4ade80]'
            : 'border-white/20 hover:border-[#4ade80]/50'
        }`}
      >
        {todo.completed && (
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-xs truncate ${todo.completed ? 'text-white/25 line-through' : 'text-white/60'}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-[10px] text-white/25 truncate">{todo.description}</p>
        )}
        {todo.dueDate && (
          <p className={`text-[10px] mt-0.5 ${isOverdue ? 'text-red-400' : 'text-white/20'}`}>
            {isOverdue ? '⚠ Overdue · ' : '⏰ '}
            {new Date(todo.dueDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}