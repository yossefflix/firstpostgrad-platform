'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

// ── Theme ──────────────────────────────────────────────────
function getTheme(dark) {
  if (dark) return {
    bg:       '#0d1f18',
    surface:  '#132318',
    surface2: '#1a2f22',
    border:   'rgba(93,202,165,0.14)',
    borderMd: 'rgba(93,202,165,0.26)',
    teal:     '#0F6E56',
    tealMid:  '#5DCAA5',
    tealLight:'#1D9E75',
    text:     '#e8f0eb',
    textMid:  '#8aab98',
    textDim:  '#4d6b5c',
    amber:    '#c9832a',
    red:      '#b4432a',
    white:    '#ffffff',
    navBg:    '#0a1912',
    cardBg:   '#132318',
    inputBg:  '#1a2f22',
  }
  return {
    bg:       '#f4f8f6',
    surface:  '#ffffff',
    surface2: '#f0f7f3',
    border:   'rgba(15,110,86,0.12)',
    borderMd: 'rgba(15,110,86,0.24)',
    teal:     '#0F6E56',
    tealMid:  '#1D9E75',
    tealLight:'#5DCAA5',
    text:     '#0d1f18',
    textMid:  '#3a4a42',
    textDim:  '#6b7c74',
    amber:    '#8a5a18',
    red:      '#b4432a',
    white:    '#ffffff',
    navBg:    '#0d1f18',
    cardBg:   '#ffffff',
    inputBg:  '#f4f8f6',
  }
}

// ── Wordmark ───────────────────────────────────────────────
const SPECIALTY_KEYWORDS = {
  "general medicine": ["general medicine", "internal medicine", "acute medicine", "acute medical", "general medical", "geriatric"],
  "general surgery": ["general surgery", "surgical", "urology", "colorectal"],
  "emergency medicine": ["emergency medicine", "emergency department", "a&e"],
  "paediatrics": ["paediatric", "pediatric", "neonatal"],
  "psychiatry": ["psychiatry", "psychiatric", "mental health", "older peoples"],
  "obstetrics & gynaecology": ["obstetrics", "gynaecology", "gynecology", "o&g"],
  "anaesthetics": ["anaesthetic", "anaesthesia", "intensive care", "critical care"],
  "radiology": ["radiology", "radiolog"],
  "trauma & orthopaedics": ["trauma", "orthopaedic", "orthopedic", "spinal"],
  "ent": ["ent", "ear nose", "maxillofacial", "omfs"],
  "ophthalmology": ["ophthalmol", "oculoplastic", "eye"],
  "gp / primary care": ["gp", "primary care", "general practice"],
  "cardiology": ["cardiology", "cardiac"],
  "gastroenterology": ["gastroenterology", "gastro"],
  "haematology": ["haematology", "hematology"],
  "oncology": ["oncology", "cancer"],
  "neurology": ["neurology", "neuroscience", "stroke"],
  "renal medicine": ["renal", "nephrology", "transplant"],
}

function Wordmark({ dark = true, size = 16 }) {
  return (
    <span style={{
      fontFamily: 'Fraunces, Georgia, serif',
      fontSize: size,
      letterSpacing: '-0.02em',
      lineHeight: 1,
      userSelect: 'none',
    }}>
      <span style={{ fontWeight: 300, color: dark ? 'rgba(255,255,255,0.9)' : '#0d1f18' }}>First</span>
      <span style={{ fontWeight: 600, color: '#5DCAA5' }}>Postgrad</span>
    </span>
  )
}

// ── Sun/Moon toggle ────────────────────────────────────────
function ThemeToggle({ isDark, onToggle, C }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'transparent',
        border: `0.5px solid ${C.border}`,
        borderRadius: 100,
        width: 32, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: C.textDim, flexShrink: 0,
      }}
    >
      {isDark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  )
}

function DeadlinePill({ text, C }) {
  if (!text || text === 'Unknown') return null
  const days = Math.ceil((new Date(text) - new Date()) / 86400000)
  const color = days <= 3 ? C.red : days <= 7 ? C.amber : C.tealMid
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 100, background: `${color}18`, color, border: `0.5px solid ${color}35` }}>
      {days <= 0 ? 'Closing today' : `${days}d left`}
    </span>
  )
}

function SolyStrip({ cvText, jobId, jobTitle, jobTrust, jobDescription, C }) {
  if (!cvText) return (
    <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: C.surface2, borderRadius: 8, textDecoration: 'none', marginTop: 12, border: `0.5px solid ${C.border}` }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: `${C.tealMid}18`, border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600, color: C.tealMid, flexShrink: 0 }}>S</span>
      <span style={{ fontSize: 12, color: C.textDim }}>Upload your CV so Soly can score this role</span>
    </Link>
  )

  const cv = cvText.toLowerCase()
  const jd = (jobDescription || jobTitle + ' ' + jobTrust).toLowerCase()
  const checks = [
    { keywords: ['gmc', 'general medical council', 'licence to practice'], cvKeywords: ['gmc', 'registered'] },
    { keywords: ['foundation training', 'foundation year', 'fy1', 'fy2'], cvKeywords: ['foundation', 'fy1', 'fy2'] },
    { keywords: ['mrcs', 'core surgical'], cvKeywords: ['mrcs', 'core surgical'] },
    { keywords: ['mrcp', 'core medical'], cvKeywords: ['mrcp', 'core medical'] },
    { keywords: ['audit', 'service evaluation'], cvKeywords: ['audit', 'quality improvement'] },
    { keywords: ['teaching', 'education', 'supervision'], cvKeywords: ['teaching', 'taught', 'supervision'] },
    { keywords: ['research', 'publication'], cvKeywords: ['research', 'publication', 'published'] },
    { keywords: ['team', 'multidisciplinary'], cvKeywords: ['team', 'multidisciplinary'] },
    { keywords: ['clinical experience', 'sho', 'clinical fellow'], cvKeywords: ['clinical', 'rotation', 'sho'] },
  ]
  let strong = 0, total = 0
  checks.forEach(check => {
    if (!check.keywords.some(k => jd.includes(k))) return
    total++
    if (check.cvKeywords.some(k => cv.includes(k))) strong++
  })
  const score = total > 0 ? Math.min(95, Math.max(25, Math.round((strong / total) * 100))) : 50
  const color = score >= 75 ? C.tealMid : score >= 55 ? C.amber : C.red

  return (
    <Link href={`/feedback?job=${jobId}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 12px', background: C.surface2, borderRadius: 8, textDecoration: 'none', marginTop: 12, border: `0.5px solid ${C.border}`, cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: `${C.tealMid}18`, border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600, color: C.tealMid, flexShrink: 0 }}>S</span>
        <span style={{ fontSize: 12, color: C.textDim }}>Soly's CV fit</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 15, fontWeight: 400, color }}>{score}%</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </div>
    </Link>
  )
}

function JobCard({ job, cvText, C }) {
  return (
    <div style={{ background: C.cardBg, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, fontWeight: 500 }}>{job.trust}</p>
        <DeadlinePill text={job.closing_date} C={C} />
      </div>
      <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', fontWeight: 400, color: C.text, margin: '0 0 10px', lineHeight: 1.35 }}>{job.title}</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: C.textMid, display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 00-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 00-8-8z"/></svg>
          {job.location}
        </span>
        <span style={{ fontSize: 12, color: C.textMid, display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 6c-.8-1.2-2-2-3.5-2-2.5 0-4 2-4 4.5V13H7m0 3h10M7 20h11c-1.5-1-2-2-2-4v-3"/></svg>
          {job.salary}
        </span>
      </div>
      <Link href={`/jobs/${job.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.teal, color: '#fff', padding: '9px 20px', borderRadius: 100, fontSize: 12, fontWeight: 500, textDecoration: 'none', marginTop: 'auto' }}>
        View details
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </Link>
      <SolyStrip cvText={cvText} jobId={job.id} jobTitle={job.title} jobTrust={job.trust} jobDescription={job.description} C={C} />
    </div>
  )
}

function DigestRow({ job, index, C }) {
  return (
    <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${C.border}`, display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 14, alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: C.textDim, fontFamily: 'monospace' }}>{String(index + 1).padStart(2, '0')}</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 11, color: C.textDim }}>{job.trust}</span>
          <DeadlinePill text={job.closing_date} C={C} />
        </div>
        <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.95rem', color: C.text, fontWeight: 400, lineHeight: 1.3, margin: 0 }}>{job.title}</h3>
      </div>
      <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ background: C.teal, color: '#fff', padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
        Open
      </a>
    </div>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [view, setView] = useState('cards')
  const [filterSpecialty, setFilterSpecialty] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const C = getTheme(isDark)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
      setProfile(profile)
      const { data: jobs } = await supabase.from('jobs').select('*').order('scraped_at', { ascending: false }).limit(200)
      setJobs(jobs || [])
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const parseDate = (s) => { try { return new Date(s) } catch { return new Date('9999-12-31') } }
  const displayJobs = filterSpecialty && profile?.specialty
    ? jobs.filter(job => {
        const title = job.title.toLowerCase()
        const specialty = profile.specialty.toLowerCase()
        const C_keywords = SPECIALTY_KEYWORDS[specialty] || [specialty]
        return C_keywords.some(k => title.includes(k))
      })
    : jobs

  const sortedJobs = [...displayJobs].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.scraped_at) - new Date(a.scraped_at)
    if (sortBy === 'closing_soon') return parseDate(a.closing_date) - parseDate(b.closing_date)
    if (sortBy === 'closing_late') return parseDate(b.closing_date) - parseDate(a.closing_date)
    if (sortBy === 'trust_az') return (a.trust || '').localeCompare(b.trust || '')
    return 0
  })

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Wordmark dark={isDark} size={18} />
    </div>
  )

  const cvText = profile?.cv_text || ''
  const firstName = profile?.name?.split(' ')[0] || 'Doctor'

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif', color: C.text, transition: 'background 0.2s, color 0.2s' }}>

      {/* Nav — always dark */}
      <nav style={{ background: C.navBg, borderBottom: `0.5px solid rgba(93,202,165,0.12)`, padding: '0 2rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
        <Wordmark dark={true} size={15} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/profile" style={{ fontSize: 12, color: cvText ? '#5DCAA5' : 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
            {cvText ? 'CV uploaded' : 'Upload CV'}
          </Link>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'none' }}>{profile?.name}</span>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} C={{ border: 'rgba(93,202,165,0.15)', textDim: 'rgba(255,255,255,0.4)' }} />
          <button onClick={handleSignOut} style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', padding: '5px 14px', borderRadius: 100, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Header */}
      <div style={{ background: C.navBg, borderBottom: `0.5px solid rgba(93,202,165,0.1)`, padding: 'clamp(1.25rem, 4vw, 2rem) clamp(1rem, 4vw, 2rem) 1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(93,202,165,0.06) 1px, transparent 1px)', backgroundSize: '22px 22px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', border: '0.5px solid rgba(93,202,165,0.08)', top: -110, right: -50, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1, padding: '0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(93,202,165,0.08)', border: '0.5px solid rgba(93,202,165,0.2)', borderRadius: 100, padding: '4px 12px', marginBottom: 14 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5DCAA5' }} />
            <span style={{ fontSize: 10, color: '#5DCAA5', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>AZA watching 24h</span>
          </div>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', fontWeight: 300, color: 'rgba(255,255,255,0.92)', margin: '0 0 8px', lineHeight: 1.15 }}>
            Good to see you, <em style={{ fontStyle: 'italic', color: '#5DCAA5' }}>{firstName}</em>.
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0, fontWeight: 300 }}>
            {sortedJobs.length} SHO posts available. New ones land in your inbox the moment they appear.
          </p>
          {!cvText && (
            <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14, background: 'rgba(93,202,165,0.08)', border: '0.5px solid rgba(93,202,165,0.2)', borderRadius: 100, padding: '6px 14px', textDecoration: 'none' }}>
              <span style={{ fontSize: 11, color: '#5DCAA5', fontWeight: 500 }}>Upload your CV to unlock Soly fit scores</span>
            </Link>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {profile?.specialty && (
            <div style={{ display: 'flex', background: C.surface2, border: `0.5px solid ${C.border}`, borderRadius: 100, padding: 3, gap: 2 }}>
              <button onClick={() => setFilterSpecialty(false)} style={{ padding: '4px 12px', borderRadius: 100, border: 'none', background: !filterSpecialty ? C.teal : 'transparent', color: !filterSpecialty ? '#fff' : C.textDim, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: !filterSpecialty ? 500 : 400 }}>
                All
              </button>
              <button onClick={() => setFilterSpecialty(true)} style={{ padding: '4px 12px', borderRadius: 100, border: 'none', background: filterSpecialty ? C.teal : 'transparent', color: filterSpecialty ? '#fff' : C.textDim, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: filterSpecialty ? 500 : 400 }}>
                My specialty
              </button>
            </div>
          )}
          <span style={{ fontSize: 11, color: C.textDim }}>{sortedJobs.length} posts</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', background: C.surface2, border: `0.5px solid ${C.border}`, borderRadius: 100, padding: 3, gap: 2 }}>
            {['cards', 'digest'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '4px 12px', borderRadius: 100, border: 'none', background: view === v ? C.teal : 'transparent', color: view === v ? '#fff' : C.textDim, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: view === v ? 500 : 400 }}>
                {v === 'cards' ? 'Cards' : 'Digest'}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: C.textDim }}>Sort:</span>
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'closing_soon', label: 'Closing soon' },
            { value: 'closing_late', label: 'Closing late' },
            { value: 'trust_az', label: 'A–Z' },
          ].map(o => (
            <button key={o.value} onClick={() => setSortBy(o.value)} style={{ padding: '4px 12px', borderRadius: 100, border: `0.5px solid`, borderColor: sortBy === o.value ? C.tealMid : C.border, background: sortBy === o.value ? `${C.tealMid}15` : 'transparent', color: sortBy === o.value ? C.tealMid : C.textDim, fontSize: 11, fontWeight: sortBy === o.value ? 500 : 400, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem 1rem 5rem' }}>
        {sortedJobs.length === 0 ? (
          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
            <Wordmark dark={isDark} size={16} />
            <p style={{ fontSize: 14, color: C.textDim, margin: '12px 0 0' }}>AZA is watching. Check back soon or wait for your email alert.</p>
          </div>
        ) : view === 'cards' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', gap: '1rem' }}>
            {sortedJobs.map(job => <JobCard key={job.id} job={job} cvText={cvText} C={C} />)}
          </div>
        ) : (
          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Wordmark dark={isDark} size={13} />
              <span style={{ fontSize: 12, color: C.textDim, marginLeft: 4 }}>{sortedJobs.length} posts today</span>
            </div>
            {sortedJobs.map((job, i) => <DigestRow key={job.id} job={job} index={i} C={C} />)}
            <div style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, color: C.textDim, fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic' }}>
              That is everything. See you next time. — AZA
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
