'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'
import mammoth from 'mammoth'
import { useTheme } from '../context/ThemeContext'

function getTheme(dark) {
  if (dark) return {
    bg: '#0d1f18', surface: '#132318', surface2: '#1a2f22',
    border: 'rgba(93,202,165,0.14)', borderMd: 'rgba(93,202,165,0.26)',
    teal: '#0F6E56', tealMid: '#5DCAA5', tealLight: '#1D9E75',
    text: '#e8f0eb', textMid: '#8aab98', textDim: '#4d6b5c',
    red: '#b4432a', inputBg: '#1a2f22',
  }
  return {
    bg: '#f4f8f6', surface: '#ffffff', surface2: '#f0f7f3',
    border: 'rgba(15,110,86,0.12)', borderMd: 'rgba(15,110,86,0.24)',
    teal: '#0F6E56', tealMid: '#1D9E75', tealLight: '#5DCAA5',
    text: '#0d1f18', textMid: '#3a4a42', textDim: '#6b7c74',
    red: '#b4432a', inputBg: '#f0f7f3',
  }
}

function ThemeToggle({ isDark, onToggle, C }) {
  return (
    <button onClick={onToggle} style={{ background: 'transparent', border: `0.5px solid rgba(93,202,165,0.15)`, borderRadius: 100, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
      {isDark
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      }
    </button>
  )
}

const SPECIALTIES = [
  'General medicine', 'General surgery', 'Emergency medicine',
  'Paediatrics', 'Psychiatry', 'Obstetrics & gynaecology',
  'Anaesthetics', 'Radiology', 'Trauma & orthopaedics',
  'ENT', 'Ophthalmology', 'GP / primary care',
]

export default function Profile() {
  const { isDark, toggleTheme } = useTheme()
  const C = getTheme(isDark)

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: `0.5px solid ${C.border}`,
    borderRadius: 8, fontSize: 14, color: C.text,
    outline: 'none', boxSizing: 'border-box',
    background: C.inputBg, fontFamily: 'DM Sans, sans-serif',
  }

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 500,
    color: C.textDim, marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.07em',
  }

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [cvUploading, setCvUploading] = useState(false)
  const [cvSaved, setCvSaved] = useState(false)
  const [cvError, setCvError] = useState('')
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [region, setRegion] = useState('')
  const [cvText, setCvText] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (profile) {
        setName(profile.name || '')
        setSpecialty(profile.specialty || '')
        setRegion(profile.region || '')
        setCvText(profile.cv_text || '')
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    const supabase = createClient()
    const { error } = await supabase.from('users').update({ name, specialty, region }).eq('id', user.id)
    if (error) setError(error.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  const handleCVUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCvUploading(true); setCvSaved(false); setCvError('')
    try {
      let text = ''
      const name = file.name.toLowerCase()
      if (name.endsWith('.docx') || name.endsWith('.doc')) {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.extractRawText({ arrayBuffer })
          text = result.value
          if (!text || text.trim().length < 10) {
            throw new Error('Could not read file')
          }
        } catch {
          setError('Please change the extension of your word file to .docx and reupload.')
          setCvUploading(false)
          return
        }
      } else if (name.endsWith('.txt') || name.endsWith('.rtf')) {
        text = await file.text()
      } else {
        setCvError('Please change the extension of your word file to .docx and reupload.')
        setCvUploading(false)
        return
      }
      setCvText(text)
      const supabase = createClient()
      await supabase.from('users').update({ cv_text: text }).eq('id', user.id)
      setCvSaved(true)
      setTimeout(() => setCvSaved(false), 3000)
    } catch (err) {
      console.error('CV upload error:', err)
      setCvError('Please change the extension of your word file to .docx and reupload.')
    }
    setCvUploading(false)
  }

  const handleClearCV = async () => {
    const supabase = createClient()
    await supabase.from('users').update({ cv_text: '' }).eq('id', user.id)
    setCvText('')
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 18, letterSpacing: '-0.02em' }}>
        <span style={{ fontWeight: 300, color: C.text }}>First</span>
        <span style={{ fontWeight: 600, color: C.tealMid }}>Postgrad</span>
      </span>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif', color: C.text, transition: 'background 0.2s' }}>

      <nav style={{ background: '#0d1f18', borderBottom: 'rgba(93,202,165,0.12) 0.5px solid', padding: '0 1rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 15, letterSpacing: '-0.02em' }}>
            <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.9)' }}>First</span>
            <span style={{ fontWeight: 600, color: '#5DCAA5' }}>Postgrad</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/dashboard" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </Link>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} C={C} />
          <button onClick={handleSignOut} style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', padding: '5px 14px', borderRadius: 100, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(1rem, 4vw, 2.5rem) clamp(1rem, 4vw, 1.5rem) 5rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px', fontWeight: 500 }}>Account</p>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.6rem', fontWeight: 300, color: C.text, margin: 0 }}>Settings</h1>
        </div>

        {/* Profile card */}
        <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.75rem', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', fontWeight: 400, color: C.text, margin: '0 0 1.25rem', paddingBottom: '0.75rem', borderBottom: `0.5px solid ${C.border}` }}>Personal details</h2>
          {error && <div style={{ background: `${C.red}18`, border: `0.5px solid ${C.red}40`, borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: C.red }}>{error}</div>}
          {saved && <div style={{ background: `${C.tealMid}15`, border: `0.5px solid ${C.borderMd}`, borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: C.tealMid }}>Saved successfully.</div>}
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Ahmed Hassan" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Specialty</label>
              <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ ...inputStyle, color: specialty ? C.text : C.textDim }}>
                <option value="">Select your specialty</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Current country</label>
              <input type="text" value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. Egypt, Pakistan, Nigeria" style={inputStyle} />
            </div>
            <button type="submit" disabled={saving} style={{ background: saving ? C.textDim : C.teal, color: '#fff', padding: '10px 22px', borderRadius: 100, fontSize: 13, fontWeight: 500, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* CV card */}
        <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.75rem', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', fontWeight: 400, color: C.text, margin: '0 0 6px', paddingBottom: '0.75rem', borderBottom: `0.5px solid ${C.border}` }}>Your CV</h2>
          {cvError && (
            <div style={{ background: `${C.red}18`, border: `0.5px solid ${C.red}40`, borderRadius: 8, padding: '10px 14px', margin: '0.75rem 0', fontSize: 13, color: C.red }}>
              {cvError}
            </div>
          )}
          <p style={{ fontSize: 12, color: C.textDim, margin: '0.75rem 0 1.25rem', lineHeight: 1.6 }}>
            Upload your CV so Soly can calculate your fit score for each job. Stored privately, never shared.
          </p>
          {cvText ? (
            <div>
              <div style={{ background: `${C.tealMid}10`, border: `0.5px solid ${C.borderMd}`, borderRadius: 8, padding: '12px 16px', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 13, color: C.tealMid, fontWeight: 500, margin: '0 0 2px' }}>CV uploaded</p>
                  <p style={{ fontSize: 11, color: C.textDim, margin: 0 }}>{cvText.length.toLocaleString()} characters · Soly is ready</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <label style={{ background: 'transparent', border: `0.5px solid ${C.border}`, color: C.textDim, padding: '6px 12px', borderRadius: 100, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Replace <input type="file" accept=".docx" onChange={handleCVUpload} style={{ display: 'none' }} />
                  </label>
                  <button onClick={handleClearCV} style={{ background: 'transparent', border: `0.5px solid ${C.red}40`, color: C.red, padding: '6px 12px', borderRadius: 100, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Remove</button>
                </div>
              </div>
              {cvSaved && <p style={{ fontSize: 12, color: C.tealMid, margin: 0 }}>CV updated.</p>}
            </div>
          ) : (
            <div>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${C.border}`, borderRadius: 10, padding: '2rem', cursor: 'pointer', textAlign: 'center', background: cvUploading ? `${C.tealMid}08` : 'transparent' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${C.tealMid}15`, border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tealMid} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                </div>
                <p style={{ fontSize: 13, color: C.text, fontWeight: 500, margin: '0 0 4px' }}>{cvUploading ? 'Uploading...' : 'Upload your CV'}</p>
                <p style={{ fontSize: 11, color: C.textDim, margin: 0 }}>Word document (.docx)</p>
                <input type="file" accept=".docx" onChange={handleCVUpload} style={{ display: 'none' }} disabled={cvUploading} />
              </label>
              <div style={{ marginTop: '0.75rem', padding: '10px 12px', background: C.surface2, borderRadius: 8, border: `0.5px solid ${C.border}` }}>
                <p style={{ fontSize: 11, color: C.textDim, margin: 0, lineHeight: 1.6 }}></p>
              </div>
            </div>
          )}
        </div>

        {/* Account card */}
        <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.75rem' }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', fontWeight: 400, color: C.text, margin: '0 0 1rem', paddingBottom: '0.75rem', borderBottom: `0.5px solid ${C.border}` }}>Account</h2>
          <div style={{ marginBottom: '0.75rem' }}>
            <p style={{ fontSize: 11, color: C.textDim, margin: '0 0 2px' }}>Email address</p>
            <p style={{ fontSize: 13, color: C.text, margin: 0 }}>{user?.email}</p>
          </div>
          <Link href="/reset-password" style={{ fontSize: 13, color: C.tealMid, textDecoration: 'none', fontWeight: 500 }}>Change password</Link>
        </div>

      </div>
    </div>
  )
}
