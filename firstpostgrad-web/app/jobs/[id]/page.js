'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../utils/supabase/client'
import Link from 'next/link'
import { useTheme } from '../../context/ThemeContext'
import { useParams } from 'next/navigation'

function getTheme(dark) {
  if (dark) return {
    bg: '#0d1f18', surface: '#132318', surface2: '#1a2f22',
    border: 'rgba(93,202,165,0.14)', borderMd: 'rgba(93,202,165,0.26)',
    teal: '#0F6E56', tealMid: '#5DCAA5', tealLight: '#1D9E75',
    text: '#e8f0eb', textMid: '#8aab98', textDim: '#4d6b5c',
    red: '#b4432a', amber: '#c9832a', navBg: '#0a1912',
  }
  return {
    bg: '#f4f8f6', surface: '#ffffff', surface2: '#f0f7f3',
    border: 'rgba(15,110,86,0.12)', borderMd: 'rgba(15,110,86,0.24)',
    teal: '#0F6E56', tealMid: '#1D9E75', tealLight: '#5DCAA5',
    text: '#0d1f18', textMid: '#3a4a42', textDim: '#6b7c74',
    red: '#b4432a', amber: '#8a5a18', navBg: '#0d1f18',
  }
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button onClick={onToggle} style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 100, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
      {isDark
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      }
    </button>
  )
}

function analyseCVAgainstJob(cvText, jobDescription) {
  if (!cvText || !jobDescription) return null
  const cv = cvText.toLowerCase()
  const jd = jobDescription.toLowerCase()
  const checks = [
    { requirement: 'GMC registration', keywords: ['gmc', 'general medical council', 'licence to practice'], cvKeywords: ['gmc', 'general medical council', 'registered'] },
    { requirement: 'Foundation training', keywords: ['foundation training', 'foundation year', 'fy1', 'fy2'], cvKeywords: ['foundation', 'fy1', 'fy2'] },
    { requirement: 'MRCS qualification', keywords: ['mrcs', 'core surgical'], cvKeywords: ['mrcs', 'core surgical'] },
    { requirement: 'MRCP qualification', keywords: ['mrcp', 'core medical'], cvKeywords: ['mrcp', 'core medical'] },
    { requirement: 'Audit experience', keywords: ['audit', 'service evaluation', 'quality improvement'], cvKeywords: ['audit', 'quality improvement'] },
    { requirement: 'Teaching experience', keywords: ['teaching', 'education', 'supervision'], cvKeywords: ['teaching', 'taught', 'supervision'] },
    { requirement: 'Research experience', keywords: ['research', 'publication'], cvKeywords: ['research', 'publication', 'published'] },
    { requirement: 'Team working', keywords: ['team', 'multidisciplinary', 'mdt'], cvKeywords: ['team', 'multidisciplinary', 'mdt'] },
    { requirement: 'Clinical experience', keywords: ['clinical experience', 'sho', 'clinical fellow'], cvKeywords: ['clinical', 'rotation', 'sho'] },
  ]
  const strongPoints = []
  const missingPoints = []
  checks.forEach(check => {
    const jobMentions = check.keywords.some(k => jd.includes(k))
    if (!jobMentions) return
    if (check.cvKeywords.some(k => cv.includes(k))) strongPoints.push(check.requirement)
    else missingPoints.push(check.requirement)
  })
  const total = strongPoints.length + missingPoints.length
  const score = total > 0 ? Math.min(95, Math.max(25, Math.round((strongPoints.length / total) * 100))) : 50
  return { strongPoints, missingPoints, score }
}

function extractSections(text) {
  if (!text) return []
  const lower = text.toLowerCase()
  const sectionNames = ['job summary', 'main duties of the job', 'about us', 'person specification', 'job responsibilities']
  const sections = []

  sectionNames.forEach(name => {
    const idx = lower.indexOf(name)
    if (idx === -1) return
    const nextSection = sectionNames
      .map(n => lower.indexOf(n, idx + 1))
      .filter(i => i > idx)
      .sort((a, b) => a - b)[0] || idx + 1200
    const body = text.slice(idx + name.length, nextSection).trim()
    if (body.length > 30) {
      sections.push({
        title: name.charAt(0).toUpperCase() + name.slice(1),
        body: body.slice(0, 600).trim()
      })
    }
  })

  return sections
}

export default function JobDetail() {
  const params = useParams()
  const id = params?.id
  const { isDark, toggleTheme } = useTheme()
  const C = getTheme(isDark)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [job, setJob] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
        setProfile(profile)
        const { data: job } = await supabase.from('jobs').select('*').eq('id', id).single()
        setJob(job)
        if (job && profile?.cv_text) {
          setAnalysis(analyseCVAgainstJob(profile.cv_text, job.description || job.title))
        }
      } else {
        const { data: job } = await supabase.from('jobs').select('*').eq('id', id).single()
        setJob(job)
      }
      setLoading(false)
    }
    loadData()
  }, [id])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 18, letterSpacing: '-0.02em' }}>
        <span style={{ fontWeight: 300, color: isDark ? 'rgba(255,255,255,0.9)' : '#0d1f18' }}>First</span>
        <span style={{ fontWeight: 600, color: '#5DCAA5' }}>Postgrad</span>
      </span>
    </div>
  )

  if (!job) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: C.textDim, marginBottom: 12 }}>Job not found or has expired.</p>
        <Link href="/dashboard" style={{ color: C.tealMid, textDecoration: 'none', fontSize: 14 }}>Go to dashboard</Link>
      </div>
    </div>
  )

  const scoreColor = !analysis ? C.textDim : analysis.score >= 75 ? C.tealMid : analysis.score >= 55 ? C.amber : C.red
  const scoreLabel = !analysis ? '' : analysis.score >= 75 ? 'Strong match' : analysis.score >= 55 ? 'Partial match' : 'Needs work'

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif', color: C.text, transition: 'background 0.2s' }}>

      {/* Nav */}
      <nav style={{ background: C.navBg, borderBottom: 'rgba(93,202,165,0.1) 0.5px solid', padding: '0 1rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <Link href={user ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 15, letterSpacing: '-0.02em' }}>
            <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.9)' }}>First</span>
            <span style={{ fontWeight: 600, color: '#5DCAA5' }}>Postgrad</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          {user ? (
            <>
              <Link href="/dashboard" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Dashboard
              </Link>
              <button onClick={handleSignOut} style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', padding: '5px 14px', borderRadius: 100, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" style={{ background: C.teal, color: '#fff', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
              Sign in
            </Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem) clamp(1rem, 4vw, 1.5rem) 5rem' }}>

        {/* Job header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{job.source || 'NHS Jobs'}</span>
            {job.closing_date && job.closing_date !== 'Unknown' && (
              <>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: C.textDim, display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: C.textDim }}>Closes {job.closing_date}</span>
              </>
            )}
          </div>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', fontWeight: 400, color: C.text, margin: '0 0 8px', lineHeight: 1.2 }}>{job.title}</h1>
          <p style={{ fontSize: 14, color: C.textMid, margin: '0 0 16px' }}>{job.trust}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: C.textMid, display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 00-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 00-8-8z"/></svg>
              {job.location}
            </span>
            <span style={{ fontSize: 13, color: C.textMid, display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 6c-.8-1.2-2-2-3.5-2-2.5 0-4 2-4 4.5V13H7m0 3h10M7 20h11c-1.5-1-2-2-2-4v-3"/></svg>
              {job.salary}
            </span>
          </div>
          <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.teal, color: '#fff', padding: '11px 24px', borderRadius: 100, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            Apply on NHS Jobs
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
          </a>
        </div>

        {/* Soly score — only if logged in */}
        {user && analysis && (
          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${C.tealMid}15`, border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.8rem', fontWeight: 500, color: C.tealMid, flexShrink: 0 }}>S</div>
              <div>
                <p style={{ fontSize: 11, color: C.textDim, margin: '0 0 2px' }}>Soly's CV fit</p>
                <p style={{ fontSize: 13, color: C.text, margin: 0, fontWeight: 500 }}>{scoreLabel}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2rem', fontWeight: 300, color: scoreColor, lineHeight: 1 }}>{analysis.score}</span>
                <span style={{ fontSize: 13, color: scoreColor }}>%</span>
              </div>
              <Link href={`/feedback?job=${job.id}`} style={{ background: 'transparent', color: C.tealMid, padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 500, textDecoration: 'none', border: `0.5px solid ${C.borderMd}`, whiteSpace: 'nowrap' }}>
                Full feedback
              </Link>
            </div>
          </div>
        )}

        {user && !profile?.cv_text && (
          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 13, color: C.textDim, margin: 0 }}>Upload your CV to see Soly's fit score for this role.</p>
            <Link href="/profile" style={{ background: C.teal, color: '#fff', padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Upload CV</Link>
          </div>
        )}

        {!user && (
          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 13, color: C.text, fontWeight: 500, margin: '0 0 3px' }}>Get your CV fit score for this role</p>
              <p style={{ fontSize: 12, color: C.textDim, margin: 0 }}>Sign up free and Soly will analyse your CV against this job description.</p>
            </div>
            <Link href="/signup" style={{ background: C.teal, color: '#fff', padding: '9px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Join free</Link>
          </div>
        )}

        {/* Job description */}
        {job.description && extractSections(job.description).length > 0 && (
          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', fontWeight: 400, color: C.text, margin: '0 0 1.25rem', paddingBottom: '0.75rem', borderBottom: `0.5px solid ${C.border}` }}>About this role</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {extractSections(job.description).map((section, i) => (
                <div key={i}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: C.tealMid, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>{section.title}</p>
                  <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.75, margin: 0 }}>{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: '0.5rem' }}>
          <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ background: C.teal, color: '#fff', padding: '11px 24px', borderRadius: 100, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            Apply on NHS Jobs
          </a>
          {user && (
            <Link href="/dashboard" style={{ background: 'transparent', color: C.textDim, padding: '11px 24px', borderRadius: 100, fontSize: 14, textDecoration: 'none', border: `0.5px solid ${C.border}` }}>
              Back to dashboard
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}
