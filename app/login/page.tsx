//must change this ui cries

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const ALLOWED_DOMAIN = '@student.ri.edu.sg' // change to your actual school domain

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      setError(`Please use your RI school email (${ALLOWED_DOMAIN})`)
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setStep('code')
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/opportunities')
    router.refresh()
  }

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-8 animate-popup">
        <h1 className="text-2xl font-bold text-center mb-1">
          {step === 'email' ? 'Welcome back' : 'Check your email'}
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          {step === 'email'
            ? 'Log in with your school email'
            : `We sent a code to ${email}`}
        </p>

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="student@student.ri.edu.sg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-white/80 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-white/80 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Log In'}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-sm text-gray-500 hover:text-black transition-all duration-200"
            >
              ← Use a different email
            </button>
          </form>
        )}
      </div>
    </main>
  )
}