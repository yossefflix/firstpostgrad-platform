with open('app/dashboard/page.js', encoding='utf-8') as f:
    content = f.read()

# Replace the SolyStrip scoring with exact same logic as feedback page
old_score = """  const cv = cvText.toLowerCase()
  const jd = (jobDescription || jobTitle + ' ' + jobTrust).toLowerCase()
  const checks = [
    { keywords: ['gmc', 'licence to practice'], cvKeywords: ['gmc', 'registered'] },
    { keywords: ['foundation training', 'fy1', 'fy2'], cvKeywords: ['foundation', 'fy1', 'fy2'] },
    { keywords: ['mrcs', 'core surgical'], cvKeywords: ['mrcs', 'core surgical'] },
    { keywords: ['mrcp', 'core medical'], cvKeywords: ['mrcp', 'core medical'] },
    { keywords: ['audit', 'service evaluation'], cvKeywords: ['audit', 'quality improvement'] },
    { keywords: ['teaching', 'supervision'], cvKeywords: ['teaching', 'supervision'] },
    { keywords: ['research', 'publication'], cvKeywords: ['research', 'published'] },
    { keywords: ['team', 'multidisciplinary'], cvKeywords: ['team', 'multidisciplinary'] },
    { keywords: ['clinical experience', 'sho'], cvKeywords: ['clinical', 'sho'] },
  ]
  let strong = 0, total = 0
  checks.forEach(check => {
    if (!check.keywords.some(k => jd.includes(k))) return
    total++
    if (check.cvKeywords.some(k => cv.includes(k))) strong++
  })
  const score = total > 0 ? Math.min(95, Math.max(25, Math.round((strong / total) * 100))) : 50"""

new_score = """  const cv = cvText.toLowerCase()
  const jd = (jobDescription || jobTitle + ' ' + jobTrust).toLowerCase()
  const checks = [
    { keywords: ['gmc', 'general medical council', 'licence to practice'], cvKeywords: ['gmc', 'general medical council', 'registered'] },
    { keywords: ['foundation training', 'foundation year', 'fy1', 'fy2'], cvKeywords: ['foundation', 'fy1', 'fy2'] },
    { keywords: ['mrcs', 'core surgical'], cvKeywords: ['mrcs', 'core surgical'] },
    { keywords: ['mrcp', 'core medical'], cvKeywords: ['mrcp', 'core medical'] },
    { keywords: ['audit', 'service evaluation', 'quality improvement'], cvKeywords: ['audit', 'quality improvement'] },
    { keywords: ['teaching', 'education', 'supervision'], cvKeywords: ['teaching', 'taught', 'supervision'] },
    { keywords: ['research', 'publication'], cvKeywords: ['research', 'publication', 'published'] },
    { keywords: ['team', 'multidisciplinary', 'mdt'], cvKeywords: ['team', 'multidisciplinary', 'mdt'] },
    { keywords: ['clinical experience', 'sho', 'clinical fellow'], cvKeywords: ['clinical', 'rotation', 'sho'] },
  ]
  let strong = 0, total = 0
  checks.forEach(check => {
    if (!check.keywords.some(k => jd.includes(k))) return
    total++
    if (check.cvKeywords.some(k => cv.includes(k))) strong++
  })
  // Add specialty bonus exactly like feedback page
  const specialtyWords = jd.match(/\\b(plastic surgery|general surgery|obstetrics|gynaecology|trauma|orthopaedic|paediatric|psychiatry|medicine|emergency|anaesthetic)\\b/gi) || []
  const uniqueSpecialties = [...new Set(specialtyWords.map(s => s.toLowerCase()))]
  uniqueSpecialties.forEach(spec => {
    total++
    if (cv.includes(spec)) strong++
  })
  const score = total > 0 ? Math.min(95, Math.max(25, Math.round((strong / total) * 100))) : 50"""

if old_score in content:
    content = content.replace(old_score, new_score)
    with open('app/dashboard/page.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS - Soly score now identical to feedback page')
else:
    print('ERROR - old score not found')
    idx = content.find('let strong = 0')
    print('Current:', content[idx:idx+100])
