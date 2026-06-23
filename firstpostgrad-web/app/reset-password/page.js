'use client'

import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

function getTheme(dark) {
  if (dark) return { bg: '#0d1f18', surface: '#132318', border: 'rgba(93,202,165,0.14)', teal: '#0F6E56', tealMid: '#5DCAA5', text: '#e8f0eb', textDim: '#4d6b5c', red: '#b4432a', inputBg: '#1a2f22' }
  return { bg: '#f4f8f6', surface: '#ffffff', border: 'rgba(15,110,86,0.12)', teal: '#0F6E56', tealMid: '#1D9E75', text: '#0d1f18', textDim: '#6b7c74', red: '#b4432a', inputBg: '#f0f7f3' }
}

function ThemeToggle({ isDark, onToggle, C }) {
  return (
    <button onClick={onToggle} style={{ position: 'fixed', top: 16, right: 16, background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 100, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textDim, zIndex: 10 }}>
      {isDark ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>}
    </button>
  )
}

export default function ResetPassword() {
  const { isDark, toggleTheme } = useTheme()
  const C = getTheme(isDark)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const inputStyle = { width: '100%', padding: '11px 14px', border: `0.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.text, outline: 'none', boxSizing: 'border-box', background: C.inputBg, fontFamily: 'DM Sans, sans-serif' }
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 500, color: C.textDim, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }

  const handleReset = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/update-password` })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true); setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', fontFamily: 'DM Sans, sans-serif', position: 'relative', transition: 'background 0.2s' }}>
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} C={C} />
      <div style={{ margin: 'auto', width: '100%', maxWidth: 400, padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, letterSpacing: '-0.02em' }}>
            <span style={{ fontWeight: 300, color: C.text }}>First</span>
            <span style={{ fontWeight: 600, color: C.tealMid }}>Postgrad</span>
          </span>
          <p style={{ fontSize: 13, color: C.textDim, margin: '10px 0 0' }}>Reset your password.</p>
        </div>
        <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: '2rem' }}>
          {sent ? (
            <div style={{ background: `${C.tealMid}15`, border: `0.5px solid ${C.tealMid}40`, borderRadius: 8, padding: '14px', fontSize: 13, color: C.tealMid, lineHeight: 1.6 }}>
              Check your inbox — we sent a reset link to <strong>{email}</strong>.<br /><br />
              <Link href="/login" style={{ color: C.tealMid, fontWeight: 500 }}>Back to sign in</Link>
            </div>
          ) : (
            <>
              {error && <div style={{ background: `${C.red}18`, border: `0.5px solid ${C.red}40`, borderRadius: 8, padding: '11px 14px', marginBottom: '1.25rem', fontSize: 13, color: C.red }}>{error}</div>}
              <form onSubmit={handleReset}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? C.textDim : C.teal, color: '#fff', padding: '12px', borderRadius: 100, fontSize: 14, fontWeight: 500, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: 13, color: C.textDim, marginTop: '1.25rem' }}>
                <Link href="/login" style={{ color: C.tealMid, textDecoration: 'none', fontWeight: 500 }}>Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}