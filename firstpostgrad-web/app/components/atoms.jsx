// Shared atoms — eyebrow, button, card, etc. as React components
const { useState, useEffect, useRef } = React;

const Eyebrow = ({ children, onDark = false }) => (
  <span className={`eyebrow ${onDark ? 'on-dark' : ''}`}>
    <span className="dot" />{children}
  </span>
);

const Btn = ({ children, variant = 'primary', size, onClick, ...rest }) => {
  const cls = `btn btn-${variant} ${size ? 'btn-' + size : ''}`;
  return <button className={cls} onClick={onClick} {...rest}>{children}</button>;
};

const Callout = ({ children }) => <div className="callout">{children}</div>;

const TrustRow = ({ items }) => (
  <div className="trust-row">
    {items.map((t, i) => (
      <div key={i} className="trust"><span className="tdot"/>{t}</div>
    ))}
  </div>
);

const Chip = ({ on, onClick, children }) => (
  <button type="button" className={`chip ${on ? 'on' : ''}`} onClick={onClick}>
    {on && <ICheck size={12} strokeWidth={2} />}
    {children}
  </button>
);

const DeadlinePill = ({ text, color = 'green' }) => {
  const bg = color === 'red' ? '#fce8e4' : color === 'amber' ? '#fbf0dc' : '#e1f5ee';
  const fg = color === 'red' ? '#b4432a' : color === 'amber' ? '#8a5a18' : '#0F6E56';
  return (
    <span style={{
      fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 100,
      background: bg, color: fg, display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      <IClock size={12} strokeWidth={1.75} /> {text}
    </span>
  );
};

const FitMeter = ({ value }) => {
  const color = value >= 85 ? '#0F6E56' : value >= 75 ? '#1D9E75' : '#6b7c74';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: 44, height: 44 }}>
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" fill="none" stroke="#E1F5EE" strokeWidth="3" />
          <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${(value/100)*113} 113`} strokeLinecap="round"
            transform="rotate(-90 22 22)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 500, color: '#0d1f18', fontFamily: 'DM Sans' }}>{value}</div>
      </div>
      <div style={{ fontSize: 11, color: '#6b7c74', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Fit
      </div>
    </div>
  );
};

// Concentric circle decoration
const ConcentricDecor = ({ right, top, size = 420, onDark = true }) => (
  <>
    {[0.35, 0.55, 0.75, 0.95].map((s, i) => (
      <div key={i} className="concentric" style={{
        width: size * s, height: size * s,
        right: right - (size*s)/2, top: top - (size*s)/2,
        borderColor: onDark ? 'rgba(93,202,165,0.14)' : 'rgba(15,110,86,0.1)',
      }} />
    ))}
  </>
);

// Placeholder image — subtle stripes, mono label
const Placeholder = ({ w = '100%', h = 200, label = 'image', dark = false }) => (
  <div style={{
    width: w, height: h, borderRadius: 10,
    background: dark
      ? 'repeating-linear-gradient(135deg, #16302a, #16302a 8px, #0d1f18 8px, #0d1f18 16px)'
      : 'repeating-linear-gradient(135deg, #eef4f1, #eef4f1 8px, #f7faf8 8px, #f7faf8 16px)',
    border: dark ? '0.5px solid rgba(93,202,165,0.15)' : '0.5px solid #dfe8e3',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'JetBrains Mono', fontSize: 11,
    color: dark ? '#5DCAA5' : '#6b7c74',
    letterSpacing: '0.02em',
  }}>{label}</div>
);

Object.assign(window, {
  Eyebrow, Btn, Callout, TrustRow, Chip, DeadlinePill, FitMeter,
  ConcentricDecor, Placeholder,
});
