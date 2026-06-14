import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../src/db'
import { users, todos } from '../../../../src/db/schema'
import { eq } from 'drizzle-orm'
import { corsair } from '../../../../src/server/corsair'

export async function POST(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { todoId, title } = await request.json()

    // Get user email from DB — not cookie
    const user = await db.select()
      .from(users)
      .where(eq(users.tenantId, tenantId))
      .limit(1)

    if (!user[0]?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userEmail = user[0].email
    const tenant = corsair.withTenant(tenantId)

    const body = `Hi,\n\nThis is a reminder that your task "${title}" is now due.\n\nPlease complete it as soon as possible.\n\n— Mailflow`

    await tenant.gmail.api.messages.send({
      raw: createRawEmail(userEmail, `⏰ Reminder: "${title}" is due!`, body),
    })

    await db.update(todos)
      .set({ reminderSent: true })
      .where(eq(todos.id, todoId))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reminder error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

function createRawEmail(to: string, subject: string, body: string) {
  const message = [
    `From: ${to}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    '',
    body,
  ].join('\r\n')

  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}