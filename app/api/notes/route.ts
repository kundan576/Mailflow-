import { db } from '../../../src/db'
import { emailNotes } from '../../../src/db/schema'
import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// GET — fetch all notes OR single note
export async function GET(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const emailId = request.nextUrl.searchParams.get('emailId')

  try {
    if (emailId) {
      // Single note for email
      const notes = await db.select().from(emailNotes)
        .where(and(eq(emailNotes.tenantId, tenantId), eq(emailNotes.emailId, emailId)))
      return NextResponse.json({ note: notes[0] || null })
    } else {
      // All notes
      const notes = await db.select().from(emailNotes)
        .where(eq(emailNotes.tenantId, tenantId))
      return NextResponse.json({ notes })
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST — save or update note
export async function POST(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { emailId, emailSubject, emailSender, note } = await request.json()
    if (!note?.trim()) return NextResponse.json({ error: 'Empty note' }, { status: 400 })

    await db.insert(emailNotes)
      .values({
        id: randomUUID(),
        tenantId,
        emailId,
        emailSubject,
        emailSender,
        note,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [emailNotes.tenantId, emailNotes.emailId],
        set: { note, emailSubject, emailSender, updatedAt: new Date() },
      })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { emailId } = await request.json()
    await db.delete(emailNotes)
      .where(and(eq(emailNotes.tenantId, tenantId), eq(emailNotes.emailId, emailId)))
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}