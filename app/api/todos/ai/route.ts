import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { prompt } = await request.json()

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: `You are a todo assistant. When the user describes tasks, extract them and return ONLY a JSON array like:
[{"title": "Task title", "description": "Optional description", "dueDate": "2026-06-15T10:00:00Z or null"}]
No other text, just the JSON array.`,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    const text = data.content[0].text
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json({ todos: parsed })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to generate todos' }, { status: 500 })
  }
}