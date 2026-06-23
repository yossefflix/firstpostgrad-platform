with open('app/profile/page.js', encoding='utf-8') as f:
    c = f.read()

# Accept only .docx
c = c.replace('accept=".docx,.txt"', 'accept=".docx"')
c = c.replace('accept=".docx,.doc,.txt,.rtf"', 'accept=".docx"')
c = c.replace('accept=".docx,.txt,.rtf"', 'accept=".docx"')

# Fix all error messages
for old in [
    'To upload a .doc file: open it in Word, click File \u2192 Save As \u2192 Word Document (.docx), then upload the new file.',
    'Could not read this Word file. Please save it as .docx and try again.',
    'Please upload a .docx or .txt file.',
    'Please upload a Word document (.docx) or text file (.txt).',
]:
    c = c.replace(old, 'Please change the extension of your word file to .docx and reupload.')

# Remove description text
for old in [
    'Upload your CV as a Word (.docx, .doc) or text (.txt, .rtf). Soly reads it and shows you a fit score beside every job on your dashboard.',
    'Upload your CV as a Word document (.docx) or plain text (.txt). Soly reads it and shows you a fit score beside every job on your dashboard.',
    'Upload your CV as a Word document (.docx) or plain text (.txt). PDF coming soon.',
    'Upload your CV as a Word document (.docx) or plain text (.txt). Soly reads it and shows you a fit score beside every job.',
]:
    c = c.replace(old, '')

# Fix subtitle text
c = c.replace('Word (.docx, .doc) or text (.txt, .rtf)', 'Word document (.docx)')
c = c.replace('Word (.docx) or plain text (.txt)', 'Word document (.docx)')
c = c.replace('Word document (.docx) or plain text (.txt)', 'Word document (.docx)')

# Also reject non-docx files
old_handler = "const name = file.name.toLowerCase()\n      if (name.endsWith('.docx')) {"
new_handler = "const name = file.name.toLowerCase()\n      if (!name.endsWith('.docx')) {\n        setError('Please change the extension of your word file to .docx and reupload.')\n        setCvUploading(false)\n        return\n      }\n      if (name.endsWith('.docx')) {"
c = c.replace(old_handler, new_handler)

with open('app/profile/page.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('SUCCESS')
print('accept values:', [c[i:i+30] for i in range(len(c)) if c[i:i+7]=='accept='])
