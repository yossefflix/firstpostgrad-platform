with open('app/dashboard/page.js', encoding='utf-8') as f:
    content = f.read()

# Find everything between the two profile?.specialty blocks and remove the duplicate
first = content.find('profile?.specialty && (')
second = content.find('profile?.specialty && (', first + 1)

print(f'First occurrence at: {first}')
print(f'Second occurrence at: {second}')

if second != -1:
    # Find end of second block
    depth = 0
    i = second
    in_jsx = False
    while i < len(content):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end_second = i + 1
                break
        i += 1
    
    # Also need to capture the closing )} after
    # Find the next )} after end_second
    next_close = content.find(')}', end_second)
    if next_close - end_second < 5:
        end_second = next_close + 2
    
    print('Removing old block from', second, 'to', end_second)
    print('Old block preview:', repr(content[second:second+100]))
    
    # Remove the old block (keep only the new one which is first)
    content = content[:second] + content[end_second:]
    
    with open('app/dashboard/page.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS - removed duplicate')
else:
    print('No duplicate found')
    # Show what we have
    idx = content.find('My specialty')
    print('Context:', content[idx-100:idx+300])
