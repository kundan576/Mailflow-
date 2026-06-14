import { useState, useEffect, useRef } from 'react'

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const timerRefs = useRef({})

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => {
        if (data?.todos) {
          setTodos(data.todos)
          data.todos.forEach(todo => {
            if (todo.dueDate && !todo.completed) startTimer(todo)
          })
        }
        setLoading(false)
      })
  }, [])

  function startTimer(todo) {
    const timeLeft = new Date(todo.dueDate).getTime() - Date.now()
    if (timeLeft <= 0) return
    timerRefs.current[todo.id] = setTimeout(async () => {
      // Send reminder email
      await fetch('/api/todos/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoId: todo.id, title: todo.title }),
      })
      alert(`⏰ Reminder: "${todo.title}" is due now!`)
    }, timeLeft)
  }

  async function addTodo(title, description, dueDate) {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, dueDate }),
    })
    const data = await res.json()
    if (data.todo) {
      setTodos(prev => [data.todo, ...prev])
      if (data.todo.dueDate) startTimer(data.todo)
    }
  }

  async function toggleTodo(id, completed) {
    await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    })
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed } : t))
    if (completed && timerRefs.current[id]) {
      clearTimeout(timerRefs.current[id])
      delete timerRefs.current[id]
    }
  }

  async function deleteTodo(id) {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setTodos(prev => prev.filter(t => t.id !== id))
    if (timerRefs.current[id]) {
      clearTimeout(timerRefs.current[id])
      delete timerRefs.current[id]
    }
  }

  return { todos, loading, addTodo, toggleTodo, deleteTodo }
}