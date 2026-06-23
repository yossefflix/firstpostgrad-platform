'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

function getTheme(dark) {
  if (dark) return { bg: '#0d1f18', surface: '#132318', surface2: '#1a2f22', border: 'rgba(93,202,165,0.14)', borderMd: 'rgba(93,202,165,0.26)', teal: '#0F6E56', tealMid: '#5DCAA5', tealLight: '#1D9E75', text: '#e8f0eb', textMid: '#8aab98', textDim: '#4d6b5c', amber: '#c9832a', red: '#b4432a', white: '#ffffff' }
  return { bg: '#f4f8f6', surface: '#ffffff', surface2: '#f0f7f3', border: 'rgba(15,110,86,0.12)', borderMd: 'rgba(15,110,86,0.24)', teal: '#0F6E56', tealMid: '#1D9E75', tealLight: '#5DCAA5', text: '#0d1f18', textMid: '#3a4a42', textDim: '#6b7c74', amber: '#8a5a18', red: '#b4432a', white: '#ffffff' }
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
  const suggestions = []

  checks.forEach(check => {
    const jobMentions = check.keywords.some(k => jd.includes(k))
    if (!jobMentions) return
    if (check.cvKeywords.some(k => cv.includes(k))) strongPoints.push(check.requirement)
    else missingPoints.push(check.requirement)
  })

  const specialtyWords = jd.match(/\b(plastic surgery|general surgery|obstetrics|gynaecology|trauma|orthopaedic|paediatric|psychiatry|medicine|emergency|anaesthetic)\b/gi) || []
  const uniqueSpecialties = [...new Set(specialtyWords.map(s => s.toLowerCase()))]
  uniqueSpecialties.forEach(spec => {
    if (cv.includes(spec)) {
      if (!strongPoints.find(p => p.toLowerCase().includes(spec))) strongPoints.push(`${spec.charAt(0).toUpperCase() + spec.slice(1)} experience`)
    } else {
      suggestions.push(`Add any ${spec} exposure or rotations to your CV`)
    }
  })

  const checkedStrong=checks.filter(ch=>ch.keywords.some(k=>jd.includes(k))&&ch.cvKeywords.some(k=>cv.includes(k))).length;const checkedTotal=checks.filter(ch=>ch.keywords.some(k=>jd.includes(k))).length;const score=checkedTotal>0?Math.min(95,Math.max(25,Math.round((checkedStrong/checkedTotal)*100))):50;const total=strongPoints.length+missingPoints.length
  return { strongPoints, missingPoints, suggestions, score }
}

function FeedbackContent() {
  const { isDark, toggleTheme } = useTheme()
  const C = getTheme(isDark)
  const searchParams = useSearchParams()
  const jobId = searchParams.get('job')
  const [profile, setProfile] = useState(null)
  const [job, setJob] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
      setProfile(profile)
      if (jobId) {
        const { data: job } = await supabase.from('jobs').select('*').eq('id', jobId).single()
        setJob(job)
        if (job && profile?.cv_text) {
          setAnalysis(analyseCVAgainstJob(profile.cv_text, job.description || job.title + ' ' + job.trust))
        }
      }
      setLoading(false)
    }
    loadData()
  }, [jobId])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 18, letterSpacing: "-0.02em" }}><span style={{ fontWeight: 300, color: "rgba(255,255,255,0.9)" }}>First</span><span style={{ fontWeight: 600, color: "#5DCAA5" }}>Postgrad</span></span>
    </div>
  )

  if (!job) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: C.textDim, marginBottom: 12 }}>Job not found.</p>
        <Link href="/dashboard" style={{ color: C.tealMid, textDecoration: 'none', fontSize: 14 }}>Back to dashboard</Link>
      </div>
    </div>
  )

  const scoreColor = !analysis ? C.textDim : analysis.score >= 75 ? C.tealMid : analysis.score >= 55 ? C.amber : C.red
  const scoreLabel = !analysis ? '' : analysis.score >= 75 ? 'Strong match' : analysis.score >= 55 ? 'Partial match' : 'Needs work'

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif', color: C.text }}>

      <nav style={{ background: '#0d1f18', borderBottom: '0.5px solid rgba(93,202,165,0.12)', padding: '0 1rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 15, letterSpacing: '-0.02em' }}>
            <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.9)' }}>First</span>
            <span style={{ fontWeight: 600, color: '#5DCAA5' }}>Postgrad</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 100, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
            {isDark
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            }
          </button>
          <Link href="/dashboard" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: 'clamp(1rem, 4vw, 2.5rem) clamp(1rem, 4vw, 1.5rem) 5rem' }}>

        {/* Job title block */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px', fontWeight: 500 }}>Soly's analysis</p>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)', fontWeight: 400, color: C.text, margin: '0 0 10px', lineHeight: 1.2 }}>{job.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: C.textDim }}>{job.trust}</span>
            <span style={{ width: 2, height: 2, borderRadius: '50%', background: C.textDim }} />
            <span style={{ fontSize: 12, color: C.textDim }}>{job.location}</span>
            <span style={{ width: 2, height: 2, borderRadius: '50%', background: C.textDim }} />
            <span style={{ fontSize: 12, color: C.textDim }}>Closes {job.closing_date}</span>
          </div>
        </div>

        {!profile?.cv_text ? (
          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${C.tealMid}15`, border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.9rem', fontWeight: 500, color: C.tealMid }}>S</div>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.1rem', fontWeight: 400, color: C.text, margin: '0 0 8px' }}>Soly needs your CV first</h2>
            <p style={{ fontSize: 13, color: C.textMid, margin: '0 0 20px', lineHeight: 1.6, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>Upload your CV on your profile page and Soly will analyse it against this job description instantly.</p>
            <Link href="/profile" style={{ display: 'inline-block', background: C.teal, color: C.white, padding: '9px 22px', borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Upload CV</Link>
          </div>
        ) : analysis ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Score strip */}
            <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${C.tealMid}15`, border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.85rem', fontWeight: 500, color: C.tealMid, flexShrink: 0 }}>S</div>
                <div>
                  <p style={{ fontSize: 11, color: C.textDim, margin: '0 0 2px' }}>Soly reviewed your CV</p>
                  <p style={{ fontSize: 13, color: C.text, margin: 0, fontWeight: 500 }}>{scoreLabel}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexShrink: 0 }}>
                <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2.4rem', fontWeight: 300, color: scoreColor, lineHeight: 1 }}>{analysis.score}</span>
                <span style={{ fontSize: 14, color: scoreColor }}>%</span>
              </div>
            </div>

            {/* Verdict */}
            <div style={{ background: C.surface2, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.1rem 1.4rem' }}>
              <p style={{ fontSize: 13, color: C.textMid, margin: 0, lineHeight: 1.7 }}>
                {analysis.score >= 75
                  ? 'Your CV aligns well with what this role is asking for. Apply with confidence and lead your cover letter with your most relevant experience.'
                  : analysis.score >= 55
                  ? 'Your CV partially matches this role. The missing points below are worth addressing before you apply — they could be the difference between shortlisting and rejection.'
                  : 'Your CV needs some work before applying here. Address the missing sections below. If you have the experience but have not written it down, now is the time.'}
              </p>
            </div>

            {/* Strong + Missing — two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '1rem' }}>

              <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '1rem', paddingBottom: '0.65rem', borderBottom: `0.5px solid ${C.border}` }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.tealMid }} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.08em' }}>In your CV</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: C.textDim }}>{analysis.strongPoints.length}</span>
                </div>
                {analysis.strongPoints.length === 0 ? (
                  <p style={{ fontSize: 12, color: C.textDim, fontStyle: 'italic', margin: 0 }}>Nothing matched yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {analysis.strongPoints.map((point, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.tealMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5 }}>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '1rem', paddingBottom: '0.65rem', borderBottom: `0.5px solid ${C.border}` }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.red }} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Missing</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: C.textDim }}>{analysis.missingPoints.length}</span>
                </div>
                {analysis.missingPoints.length === 0 ? (
                  <p style={{ fontSize: 12, color: C.textDim, fontStyle: 'italic', margin: 0 }}>Nothing missing — great coverage.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {analysis.missingPoints.map((point, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        <span style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5 }}>{point}</span>
                      </div>
                    ))}
                    <p style={{ fontSize: 11, color: C.textDim, margin: '4px 0 0', lineHeight: 1.6, paddingTop: '0.6rem', borderTop: `0.5px solid ${C.border}` }}>
                      If you have this experience, add it. Recruiters cannot credit what they cannot see.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '1rem', paddingBottom: '0.65rem', borderBottom: `0.5px solid ${C.border}` }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.amber }} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suggestions</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {analysis.suggestions.map((s, i) => (
                    <p key={i} style={{ fontSize: 13, color: C.textMid, margin: 0, lineHeight: 1.6, paddingLeft: 14, borderLeft: `2px solid ${C.border}` }}>{s}</p>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: '0.5rem' }}>
              <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ background: C.teal, color: C.white, padding: '11px 24px', borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                Apply on NHS Jobs
              </a>
              <Link href="/profile" style={{ background: 'transparent', color: C.textDim, padding: '11px 24px', borderRadius: 100, fontSize: 13, fontWeight: 400, textDecoration: 'none', border: `0.5px solid ${C.border}` }}>
                Update my CV
              </Link>
            </div>

          </div>
        ) : (
          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: C.textDim, margin: 0 }}>Unable to analyse. Make sure your CV is uploaded.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0d1f18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 18, letterSpacing: "-0.02em" }}><span style={{ fontWeight: 300, color: "rgba(255,255,255,0.9)" }}>First</span><span style={{ fontWeight: 600, color: "#5DCAA5" }}>Postgrad</span></span>
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  )
}
