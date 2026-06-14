'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CallbackPage() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const userId = params.get('user_id')
    if (userId) {
      localStorage.setItem('user_id', userId)
      router.push('/inbox')
    } else {
      router.push('/')
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center font-mono">
      <div className="flex items-center gap-3 text-white/30 text-sm">
        <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse" />
        Signing you in…
      </div>
    </div>
  )
}
