with open('app/profile/page.js', encoding='utf-8') as f:
    c = f.read()

# Add a separate cvError state
c = c.replace(
    "  const [cvUploading, setCvUploading] = useState(false)\n  const [cvSaved, setCvSaved] = useState(false)",
    "  const [cvUploading, setCvUploading] = useState(false)\n  const [cvSaved, setCvSaved] = useState(false)\n  const [cvError, setCvError] = useState('')"
)

# Replace setError with setCvError in the CV upload handler
c = c.replace(
    "setError('Please change the extension of your word file to .docx and reupload.')\n        setCvUploading(false)\n        return",
    "setCvError('Please change the extension of your word file to .docx and reupload.')\n        setCvUploading(false)\n        return"
)

# Also fix the catch block
c = c.replace(
    "setError('Failed to read file. Please try a .docx or .txt file.')",
    "setCvError('Please change the extension of your word file to .docx and reupload.')"
)

# Clear cvError when upload starts
c = c.replace(
    "setCvUploading(true); setCvSaved(false)",
    "setCvUploading(true); setCvSaved(false); setCvError('')"
)

# Add cvError display in the CV card section (after the CV card h2)
old_cv_card_start = """          <p style={{ fontSize: 12, color: C.textDim, margin: '0.75rem 0 1.25rem', lineHeight: 1.6 }}>
            Upload your CV so Soly can calculate your fit score for each job. Stored privately, never shared.
          </p>"""

new_cv_card_start = """          {cvError && (
            <div style={{ background: `${C.red}18`, border: `0.5px solid ${C.red}40`, borderRadius: 8, padding: '10px 14px', margin: '0.75rem 0', fontSize: 13, color: C.red }}>
              {cvError}
            </div>
          )}
          <p style={{ fontSize: 12, color: C.textDim, margin: '0.75rem 0 1.25rem', lineHeight: 1.6 }}>
            Upload your CV so Soly can calculate your fit score for each job. Stored privately, never shared.
          </p>"""

c = c.replace(old_cv_card_start, new_cv_card_start)

with open('app/profile/page.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('SUCCESS' if 'cvError' in c else 'FAILED')
