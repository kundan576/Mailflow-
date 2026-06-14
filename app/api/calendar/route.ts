import { corsair } from '../../../src/server/corsair'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const tenant = corsair.withTenant(tenantId)
    const now = new Date()
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

    const data = await tenant.googlecalendar.api.events.getMany({
      timeMin: now.toISOString(),
      timeMax: twoWeeksLater.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50,
    })

    const events = (data.items || []).map((e: any) => ({
      id: e.id,
      title: e.summary || '(no title)',
      start: e.start?.dateTime || e.start?.date,
      end: e.end?.dateTime || e.end?.date,
    }))

    return NextResponse.json({ events })
  } catch (err) {
    console.error('Calendar fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}