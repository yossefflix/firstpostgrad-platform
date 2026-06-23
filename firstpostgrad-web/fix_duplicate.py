with open('app/dashboard/page.js', encoding='utf-8') as f:
    content = f.read()

# Remove the duplicate specialty block (keep only one)
duplicate = """  // Add specialty bonus exactly like feedback page
  const specialtyWords = jd.match(/\\b(plastic surgery|general surgery|obstetrics|gynaecology|trauma|orthopaedic|paediatric|psychiatry|medicine|emergency|anaesthetic)\\b/gi) || []
  const uniqueSpecialties = [...new Set(specialtyWords.map(s => s.toLowerCase()))]
  uniqueSpecialties.forEach(spec => {
    total++
    if (cv.includes(spec)) strong++
  })
  const score = total > 0 ? Math.min(95, Math.max(25, Math.round((strong / total) * 100))) : 50
  const color = score >= 75 ? C.tealMid : score >= 55 ? C.amber : C.red"""

single = """  const score = total > 0 ? Math.min(95, Math.max(25, Math.round((strong / total) * 100))) : 50
  const color = score >= 75 ? C.tealMid : score >= 55 ? C.amber : C.red"""

# Count occurrences
count = content.count('const specialtyWords')
print(f'specialtyWords appears {count} times')

if count == 2:
    # Remove first occurrence of the specialty block
    first_idx = content.find('  // Add specialty bonus exactly like feedback page')
    second_idx = content.find('  // Add specialty bonus exactly like feedback page', first_idx + 1)
    
    if first_idx != -1 and second_idx != -1:
        # Remove from first occurrence to before "const score"
        end_first = content.find('  const score = total > 0', first_idx)
        content = content[:first_idx] + content[end_first:]
        print('Removed duplicate')
    
elif count == 1:
    print('Only one occurrence - no duplicate to remove')

with open('app/dashboard/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
count_after = open('app/dashboard/page.js', encoding='utf-8').read().count('const specialtyWords')
print(f'After fix: specialtyWords appears {count_after} times')
