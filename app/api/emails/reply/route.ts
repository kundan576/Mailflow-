import { corsair } from '../../../../src/server/corsair'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { to, subject, body, threadId } = await request.json()

    if (!to || !body) {
      return NextResponse.json({ error: 'Missing to or body' }, { status: 400 })
    }

    const tenant = corsair.withTenant(tenantId)

    const raw = createRawEmail(to, subject, body, threadId)

    await tenant.gmail.api.messages.send({ raw })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Send email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

function createRawEmail(to: string, subject: string, body: string, threadId?: string): string {
  const lines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
  ]

  if (threadId) {
    lines.push(`In-Reply-To: ${threadId}`)
    lines.push(`References: ${threadId}`)
  }

  lines.push('', body)

  return Buffer.from(lines.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}