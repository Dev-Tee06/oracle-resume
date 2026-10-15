import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.jpg'

export default function LoginPage() {
  const { signIn, signUp, signOut, session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState('signIn')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/admin/dashboard'

  // Already logged in — redirect away from login page
  if (session) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setLoading(true)

    if (mode === 'signUp') {
      const { data, error: signUpError } = await signUp(email.trim(), password)
      if (signUpError) {
        setError(signUpError.message || 'Account creation failed.')
        setLoading(false)
        return
      }
      if (data.session) await signOut()
      setNotice(data.user?.identities?.length === 0
        ? 'An account with this email already exists. Try signing in.'
        : 'Account created and email saved. Sign in with this email and password to open the dashboard.')
      setLoading(false)
      return
    }

    const { error: signInError } = await signIn(email.trim(), password)
    if (signInError) {
      const message = signInError.message || ''
      setError(signInError.code === 'email_not_confirmed' || /email not confirmed/i.test(message)
        ? 'Supabase still requires email confirmation. In your Supabase dashboard, open Authentication → Sign In / Providers → Email and turn off Confirm email, then try signing in again.'
        : message || 'Login failed. Check your credentials.')
      setLoading(false)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#06080f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#045496]/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#05d1ed]/10 rounded-full blur-3xl" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <div className="bg-[#0f1729] border border-white/8 rounded-3xl p-8 shadow-2xl">
          {/* Logo + brand */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="Oracle's Mind"
              className="w-16 h-16 rounded-full object-contain border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(5,209,237,0.2)] mb-3"
            />
            <h1 className="text-white font-bold text-xl">Oracle's Mind</h1>
            <p className="text-white/40 text-sm mt-1">Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-white/60 mb-1.5">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-white/60 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
                  required
                  minLength={mode === 'signUp' ? 6 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </motion.div>
            )}

            {notice && (
              <div role="status" className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-sm">
                {notice}
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : null}
              {loading ? (mode === 'signUp' ? 'Creating account…' : 'Signing in…') : (mode === 'signUp' ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-5">
            {mode === 'signIn' ? 'Need an account?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'signIn' ? 'signUp' : 'signIn'); setError(null); setNotice(null) }}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {mode === 'signIn' ? 'Create one' : 'Sign in'}
            </button>
          </p>

          {/* Footer note */}
          <p className="text-center text-white/25 text-xs mt-6">
            This area is restricted to the portfolio owner.
          </p>
        </div>

        {/* Back to site */}
        <div className="text-center mt-4">
          <a href="/" className="text-white/30 hover:text-white/60 text-sm transition">
            ← Back to website
          </a>
        </div>
      </motion.div>
    </div>
  )
}
