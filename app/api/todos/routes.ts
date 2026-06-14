import { db } from '../../../src/db'
import { todos } from '../../../src/db/schema'
import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const allTodos = await db.select().from(todos)
      .where(eq(todos.tenantId, tenantId))
    return NextResponse.json({ todos: allTodos })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, description, dueDate } = await request.json()
    const todo = await db.insert(todos).values({
      id: randomUUID(),
      tenantId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
    }).returning()
    return NextResponse.json({ todo: todo[0] })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, completed, title, description, dueDate } = await request.json()
    await db.update(todos)
      .set({ completed, title, description, dueDate: dueDate ? new Date(dueDate) : null })
      .where(and(eq(todos.id, id), eq(todos.tenantId, tenantId)))
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    await db.delete(todos)
      .where(and(eq(todos.id, id), eq(todos.tenantId, tenantId)))
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}