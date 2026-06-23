with open('app/profile/page.js', encoding='utf-8') as f:
    content = f.read()

# Update file accept
old_accept = 'accept=".docx,.txt"'
new_accept = 'accept=".docx,.doc,.txt,.rtf"'

# Update upload handler
old_handler = """      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else if (file.name.endsWith('.txt')) {
        text = await file.text()
      } else {
        setError('Please upload a .docx or .txt file.')
        setCvUploading(false)
        return
      }"""

new_handler = """      const name = file.name.toLowerCase()
      if (name.endsWith('.docx') || name.endsWith('.doc')) {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.extractRawText({ arrayBuffer })
          text = result.value
          if (!text || text.trim().length < 10) {
            throw new Error('Could not read file')
          }
        } catch {
          setError('Could not read this Word file. Please save it as .docx and try again.')
          setCvUploading(false)
          return
        }
      } else if (name.endsWith('.txt') || name.endsWith('.rtf')) {
        text = await file.text()
      } else {
        setError('Please upload a Word document (.docx) or text file (.txt).')
        setCvUploading(false)
        return
      }"""

# Update description
old_desc = 'Word (.docx) or plain text (.txt)'
new_desc = 'Word (.docx, .doc) or text (.txt, .rtf)'

old_hint = 'Upload your CV as a Word document (.docx) or plain text (.txt). PDF coming soon.'
new_hint = 'Upload your CV as a Word document (.docx, .doc) or plain text (.txt). Soly reads it and scores every job for you.'

if old_accept in content:
    content = content.replace(old_accept, new_accept)
    content = content.replace(old_handler, new_handler)
    content = content.replace(old_desc, new_desc)
    content = content.replace(old_hint, new_hint)
    with open('app/profile/page.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS - CV upload formats updated')
else:
    print('ERROR - accept attribute not found')
    idx = content.find('accept=')
    print('Current accept:', content[idx:idx+50])
