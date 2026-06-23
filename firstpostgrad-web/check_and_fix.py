with open('app/dashboard/page.js', encoding='utf-8') as f:
    content = f.read()

print('=== CURRENT SOLY STRIP ===')
start = content.find('function SolyStrip')
end = content.find('\nfunction ', start + 1)
print(content[start:end])
print('=== specialtyWords count:', content.count('const specialtyWords'))
print('=== strong/total:', 'strong / total' in content)
print('=== old matches:', 'matches.length' in content)
