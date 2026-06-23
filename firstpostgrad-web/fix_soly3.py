with open('app/dashboard/page.js', encoding='utf-8') as f:
    content = f.read()

old_score_end = """  const score = total > 0 ? Math.min(95, Math.max(25, Math.round((strong / total) * 100))) : 50
  const color = score >= 75 ? C.tealMid : score >= 55 ? C.amber : C.red"""

new_score_end = """  // Add specialty bonus exactly like feedback page
  const specialtyWords = jd.match(/\\b(plastic surgery|general surgery|obstetrics|gynaecology|trauma|orthopaedic|paediatric|psychiatry|medicine|emergency|anaesthetic)\\b/gi) || []
  const uniqueSpecialties = [...new Set(specialtyWords.map(s => s.toLowerCase()))]
  uniqueSpecialties.forEach(spec => {
    total++
    if (cv.includes(spec)) strong++
  })
  const score = total > 0 ? Math.min(95, Math.max(25, Math.round((strong / total) * 100))) : 50
  const color = score >= 75 ? C.tealMid : score >= 55 ? C.amber : C.red"""

if old_score_end in content:
    content = content.replace(old_score_end, new_score_end)
    with open('app/dashboard/page.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS - specialty bonus added')
else:
    print('ERROR - pattern not found')
    idx = content.find('const score = total > 0')
    print('Context:', content[idx:idx+150])
