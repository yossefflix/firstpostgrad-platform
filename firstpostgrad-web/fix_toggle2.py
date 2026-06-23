with open('app/dashboard/page.js', encoding='utf-8') as f:
    content = f.read()

old = content[content.find('profile?.specialty && ('):content.find('profile?.specialty && (') + 600]
print('Found block:')
print(repr(old[:200]))

# Find the exact end of this block
start = content.find('profile?.specialty && (')
# Find the closing of this block
depth = 0
i = start
while i < len(content):
    if content[i] == '{':
        depth += 1
    elif content[i] == '}':
        depth -= 1
        if depth == 0:
            end = i + 1
            break
    i += 1

old_block = content[start:end]
print('\nFull block length:', len(old_block))

new_block = """profile?.specialty && (
            <div style={{ display: 'flex', background: C.surface2, border: `0.5px solid ${C.border}`, borderRadius: 100, padding: 3, gap: 2 }}>
              <button onClick={() => setFilterSpecialty(false)} style={{ padding: '4px 12px', borderRadius: 100, border: 'none', background: !filterSpecialty ? C.teal : 'transparent', color: !filterSpecialty ? '#fff' : C.textDim, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: !filterSpecialty ? 500 : 400 }}>
                All
              </button>
              <button onClick={() => setFilterSpecialty(true)} style={{ padding: '4px 12px', borderRadius: 100, border: 'none', background: filterSpecialty ? C.teal : 'transparent', color: filterSpecialty ? '#fff' : C.textDim, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: filterSpecialty ? 500 : 400 }}>
                My specialty
              </button>
            </div>
          )"""

content = content[:start] + new_block + content[end:]

with open('app/dashboard/page.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('SUCCESS')
