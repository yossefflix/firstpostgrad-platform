with open('app/profile/page.js', encoding='utf-8') as f:
    content = f.read()

# Fix .doc error message to be helpful
old_msg = "setError('Could not read this Word file. Please save it as .docx and try again.')"
new_msg = "setError('To upload a .doc file: open it in Word, click File \u2192 Save As \u2192 Word Document (.docx), then upload the new file.')"

content = content.replace(old_msg, new_msg)

with open('app/profile/page.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('profile fixed:', old_msg not in open('app/profile/page.js', encoding='utf-8').read())

# Check dashboard jobs fetch - does it include description?
with open('app/dashboard/page.js', encoding='utf-8') as f:
    dash = f.read()

idx = dash.find('.from(\'jobs\')')
print('\nJobs fetch:', dash[idx:idx+200])
