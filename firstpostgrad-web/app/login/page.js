'use client'

import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

function getTheme(dark) {
  if (dark) return { bg: '#0d1f18', surface: '#132318', border: 'rgba(93,202,165,0.14)', borderMd: 'rgba(93,202,165,0.26)', teal: '#0F6E56', tealMid: '#5DCAA5', text: '#e8f0eb', textMid: '#8aab98', textDim: '#4d6b5c', red: '#b4432a', inputBg: '#1a2f22' }
  return { bg: '#f4f8f6', surface: '#ffffff', border: 'rgba(15,110,86,0.12)', borderMd: 'rgba(15,110,86,0.24)', teal: '#0F6E56', tealMid: '#1D9E75', text: '#0d1f18', textMid: '#3a4a42', textDim: '#6b7c74', red: '#b4432a', inputBg: '#f0f7f3' }
}

function ThemeToggle({ isDark, onToggle, C }) {
  return (
    <button onClick={onToggle} style={{ position: 'fixed', top: 16, right: 16, background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 100, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textDim, zIndex: 10 }}>
      {isDark ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>}
    </button>
  )
}

export default function Login() {
  const { isDark, toggleTheme } = useTheme()
  const C = getTheme(isDark)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputStyle = { width: '100%', padding: '11px 14px', border: `0.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.text, outline: 'none', boxSizing: 'border-box', background: C.inputBg, fontFamily: 'DM Sans, sans-serif' }
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 500, color: C.textDim, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
    window.location.href = '/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', fontFamily: 'DM Sans, sans-serif', position: 'relative', overflow: 'hidden', transition: 'background 0.2s' }}>
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} C={C} />
      {isDark && <>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(93,202,165,0.05) 1px, transparent 1px)', backgroundSize: '22px 22px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', border: '0.5px solid rgba(93,202,165,0.07)', top: -140, right: -60, pointerEvents: 'none' }} />
      </>}
      <div style={{ margin: 'auto', width: '100%', maxWidth: 400, padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, letterSpacing: '-0.02em' }}>
            <span style={{ fontWeight: 300, color: C.text }}>First</span>
            <span style={{ fontWeight: 600, color: C.tealMid }}>Postgrad</span>
          </span>
          <p style={{ fontSize: 13, color: C.textDim, margin: '10px 0 0' }}>Welcome back.</p>
        </div>
        <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: '2rem' }}>
          {error && <div style={{ background: `${C.red}18`, border: `0.5px solid ${C.red}40`, borderRadius: 8, padding: '11px 14px', marginBottom: '1.25rem', fontSize: 13, color: C.red }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required style={inputStyle} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? C.textDim : C.teal, color: '#fff', padding: '12px', borderRadius: 100, fontSize: 14, fontWeight: 500, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 13, color: C.textDim, marginTop: '1rem' }}>
            <Link href="/reset-password" style={{ color: C.tealMid, textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: C.textDim, marginTop: '0.75rem' }}>
            No account?{' '}<Link href="/signup" style={{ color: C.tealMid, textDecoration: 'none', fontWeight: 500 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}