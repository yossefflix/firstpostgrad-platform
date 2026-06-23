with open('app/dashboard/page.js', encoding='utf-8') as f:
    content = f.read()

# Find and replace the current filter button with matching style
old = """          {profile?.specialty && (
            <button
              onClick={() => setFilterSpecialty(!filterSpecialty)}
              style={{
                background: filterSpecialty ? `${C.tealMid}15` : 'transparent',
                color: filterSpecialty ? C.tealMid : C.textDim,
                fontSize: 11, fontWeight: filterSpecialty ? 500 : 400,
                padding: '3px 10px', borderRadius: 100,
                border: `0.5px solid ${filterSpecialty ? C.borderMd : C.border}`,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {filterSpecialty ? `${profile.specialty} only` : 'All specialties'}
            </button>
          )}"""

new = """          {profile?.specialty && (
            <div style={{ display: 'flex', background: C.surface2, border: `0.5px solid ${C.border}`, borderRadius: 100, padding: 3, gap: 2 }}>
              <button onClick={() => setFilterSpecialty(false)} style={{ padding: '4px 12px', borderRadius: 100, border: 'none', background: !filterSpecialty ? C.teal : 'transparent', color: !filterSpecialty ? '#fff' : C.textDim, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: !filterSpecialty ? 500 : 400 }}>
                All
              </button>
              <button onClick={() => setFilterSpecialty(true)} style={{ padding: '4px 12px', borderRadius: 100, border: 'none', background: filterSpecialty ? C.teal : 'transparent', color: filterSpecialty ? '#fff' : C.textDim, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: filterSpecialty ? 500 : 400 }}>
                My specialty
              </button>
            </div>
          )}"""

if old in content:
    content = content.replace(old, new)
    with open('app/dashboard/page.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS')
else:
    print('ERROR - pattern not found')
    idx = content.find('filterSpecialty')
    print('Context:', content[idx:idx+200])
