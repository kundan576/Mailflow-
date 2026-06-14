import { corsair } from '../../../../src/server/corsair'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, start, end, attendee } = await request.json()
    const tenant = corsair.withTenant(tenantId)

    await tenant.googlecalendar.api.events.create({
      event: {
        summary: title,
        start: { dateTime: start },
        end: { dateTime: end },
        attendees: attendee ? [{ email: attendee }] : [],
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Create event error:', err)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}