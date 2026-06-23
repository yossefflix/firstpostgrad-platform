with open('app/dashboard/page.js', encoding='utf-8') as f:
    content = f.read()

# Find the malformed section - it has `)>` which is the join point
idx = content.find(')>\n              <span style={{ fontSize: 11, color: C.textDim }}>My specialty</span>')
print(f'Found malformed join at: {idx}')

if idx != -1:
    # Find end of the old switch block after this point
    old_switch_start = idx + 1  # skip the )
    # Find the closing )} of the old switch block
    # The old block ends with: </button>\n            </div>\n          )}
    end_marker = '              </button>\n            </div>\n          )}'
    end_idx = content.find(end_marker, old_switch_start)
    print(f'End of old block at: {end_idx}')
    
    if end_idx != -1:
        remove_start = idx + 1  # after the )
        remove_end = end_idx + len(end_marker)
        print('Removing:', repr(content[remove_start:remove_start+50]))
        content = content[:remove_start] + content[remove_end:]
        
        with open('app/dashboard/page.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print('SUCCESS')
    else:
        print('Could not find end marker')
        print('Context after join:', repr(content[old_switch_start:old_switch_start+400]))
else:
    print('Join point not found')
    idx2 = content.find('position: \'relative\'')
    print('Toggle switch at:', idx2)
    print(repr(content[idx2-100:idx2+200]))
