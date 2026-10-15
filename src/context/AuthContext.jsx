import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // onAuthStateChange fires INITIAL_SESSION immediately with the current
    // session — no need for a separate getSession() call (which caused race
    // conditions and the "Maximum update depth exceeded" loop).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (cancelled) return
        setSession(session)
        setUser(session?.user ?? null)
        if (!cancelled) setLoading(false)
      }
    )

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(email, password) {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setLoading(false)
      return { error }
    }
    setSession(data.session)
    setUser(data.user)
    setLoading(false)
    return { data }
  }

  async function signUp(email, password) {
    return supabase.auth.signUp({ email, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
