import { generateOAuthUrl } from 'corsair/oauth'
import { corsair } from '../../../src/server/corsair'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const REDIRECT_URI = `${process.env.APP_URL}/api/auth`

export async function GET(request: NextRequest) {
  const tenantId = new URL(request.url).searchParams.get('tenantId')

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })
  }

  const { url, state } = await generateOAuthUrl(corsair, 'gmail', {
    tenantId,
    redirectUri: REDIRECT_URI,
  })

  const response = NextResponse.redirect(url)
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,          // ← false for localhost
    path: '/',              // ← add this
    maxAge: 60 * 10,
  })
  response.cookies.set('tenant_id_pending', tenantId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  })
  return response
}