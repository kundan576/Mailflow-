import { corsair } from '../../../../src/server/corsair'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    const tenant = corsair.withTenant(tenantId)

    await tenant.gmail.api.messages.modify({
      id,
      addLabelIds: [],
      removeLabelIds: ['INBOX'],
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Archive error:', err)
    return NextResponse.json({ error: 'Failed to archive' }, { status: 500 })
  }
}