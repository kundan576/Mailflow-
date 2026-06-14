import { corsair } from '../../../src/server/corsair'
import { NextRequest, NextResponse } from 'next/server'

function decodeBase64(data: string): string {
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
}

function extractBody(payload: any): string {
  // Check direct body
  if (payload?.body?.data) {
    return decodeBase64(payload.body.data)
  }

  // Check parts
  if (payload?.parts) {
    // Prefer text/plain
    const textPart = payload.parts.find((p: any) => p.mimeType === 'text/plain')
    if (textPart?.body?.data) return decodeBase64(textPart.body.data)

    // Try nested parts
    for (const part of payload.parts) {
      if (part.parts) {
        const nested = part.parts.find((p: any) => p.mimeType === 'text/plain')
        if (nested?.body?.data) return decodeBase64(nested.body.data)
      }
    }

    // Fallback to html
    const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html')
    if (htmlPart?.body?.data) {
      return decodeBase64(htmlPart.body.data)
        .replace(/<[^>]*>/g, '')  // strip HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim()
    }
  }

  return ''
}

export async function GET(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const tenant = corsair.withTenant(tenantId)

    const list = await tenant.gmail.api.messages.list({
      maxResults: 20,
      labelIds: ['INBOX'],
    })

    if (!list.messages?.length) return NextResponse.json({ emails: [] })

    const emails = await Promise.all(
      list.messages.map(async (msg: any) => {
        const full = await tenant.gmail.api.messages.get({
          id: msg.id,
          format: 'full',
        })
        const headers = full.payload?.headers || []
        const getHeader = (name: string) =>
          headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || ''

        const body = extractBody(full.payload)

        return {
          id: msg.id,
          threadId: full.threadId,
          subject: getHeader('subject') || '(no subject)',
          sender: getHeader('from'),
          senderEmail: getHeader('from').match(/<(.+)>/)?.[1] || getHeader('from'),
          time: getHeader('date'),
          snippet: full.snippet || '',
          body: body || full.snippet || '',
          unread: full.labelIds?.includes('UNREAD') || false,
        }
      })
    )

    return NextResponse.json({ emails })
  } catch (err) {
    console.error('Gmail error:', err)
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 })
  }
}