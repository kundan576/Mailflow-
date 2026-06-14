import { processOAuthCallback } from 'corsair/oauth'
import { corsair } from '../../../src/server/corsair'
import { db } from '../../../src/db'
import { users } from '../../../src/db/schema'
import { randomUUID } from 'crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const REDIRECT_URI = `${process.env.APP_URL}/api/auth`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const storedState = request.cookies.get('oauth_state')?.value

  if (error) {
    return NextResponse.redirect(`${process.env.APP_URL}/?error=${error}`)
  }

  if (!code || !state || storedState !== state) {
    return NextResponse.redirect(`${process.env.APP_URL}/?error=auth_failed`)
  }

  try {
    const result = await processOAuthCallback(corsair, {
      code,
      state,
      redirectUri: REDIRECT_URI,
    })

    const tenant = corsair.withTenant(result.tenantId)

    // Get user email from Gmail
    let userEmail = ''
    try {
      const list = await tenant.gmail.api.messages.list({
        maxResults: 1,
        labelIds: ['INBOX'],
      })
      if (list.messages?.[0]) {
        const msg = await tenant.gmail.api.messages.get({
          id: list.messages[0].id,
        })
        const headers = msg.payload?.headers || []
        const deliveredTo = headers.find(
          (h: any) => h.name.toLowerCase() === 'delivered-to'
        )
        const toHeader = headers.find(
          (h: any) => h.name.toLowerCase() === 'to'
        )
        userEmail = deliveredTo?.value || toHeader?.value || ''
      }
    } catch (emailErr) {
      console.error('Could not fetch user email:', emailErr)
    }

    // Save user to DB
    if (userEmail) {
      await db.insert(users)
        .values({
          id: randomUUID(),
          tenantId: result.tenantId,
          email: userEmail,
        })
        .onConflictDoUpdate({
          target: [users.tenantId],
          set: { email: userEmail },
        })
    }

    const response = NextResponse.redirect(`${process.env.APP_URL}/inbox`)
    response.cookies.delete('oauth_state')
    response.cookies.set('tenant_id', result.tenantId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('OAuth error:', message)
    return NextResponse.redirect(`${process.env.APP_URL}/?error=auth_failed`)
  }
  console.log('code:', code?.slice(0, 10))
console.log('state from URL:', state?.slice(0, 20))
console.log('storedState from cookie:', storedState?.slice(0, 20))
console.log('match:', storedState === state)
}