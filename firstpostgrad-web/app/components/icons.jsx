// Icons — simple, single-stroke where possible
const { createElement: h } = React;

const Icon = ({ children, size = 18, stroke = 'currentColor', fill = 'none', strokeWidth = 1.5, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

const IArrow    = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
const IArrowL   = (p) => <Icon {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></Icon>;
const ICheck    = (p) => <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7.5"/></Icon>;
const IClose    = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>;
const IMail     = (p) => <Icon {...p}><path d="M3 6.5h18v11H3zM3 7l9 6.5L21 7"/></Icon>;
const IBell     = (p) => <Icon {...p}><path d="M6 16V11a6 6 0 0112 0v5l2 2H4l2-2zM10 20a2 2 0 004 0"/></Icon>;
const IBookmark = (p) => <Icon {...p}><path d="M6 4h12v17l-6-4-6 4z"/></Icon>;
const IMap      = (p) => <Icon {...p}><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 00-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 00-8-8z"/></Icon>;
const IClock    = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IBag      = (p) => <Icon {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a4 4 0 018 0v2"/></Icon>;
const IPound    = (p) => <Icon {...p}><path d="M16 6c-.8-1.2-2-2-3.5-2-2.5 0-4 2-4 4.5V13H7m0 3h10M7 20h11c-1.5-1-2-2-2-4v-3"/></Icon>;
const ISearch   = (p) => <Icon {...p}><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></Icon>;
const IFilter   = (p) => <Icon {...p}><path d="M4 6h16M7 12h10M10 18h4"/></Icon>;
const IUser     = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 5-7 8-7s7 2 8 7"/></Icon>;
const ISpark    = (p) => <Icon {...p}><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3"/></Icon>;
const IPulse    = (p) => <Icon {...p}><path d="M3 12h4l2-7 4 14 2-7h6"/></Icon>;
const IDoc      = (p) => <Icon {...p}><path d="M6 3h9l4 4v14H6zM14 3v5h5"/></Icon>;
const IGrid     = (p) => <Icon {...p}><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></Icon>;
const IList     = (p) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16"/></Icon>;
const IDoor     = (p) => <Icon {...p}><path d="M5 21V5l8-2v20zM13 12v.01M5 21h15M17 21V7l-4-1"/></Icon>;
const ILogout   = (p) => <Icon {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M9 12h12"/></Icon>;
const ISettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></Icon>;
const IHelp     = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 4M12 17v.01"/></Icon>;
const IFlag     = (p) => <Icon {...p}><path d="M4 21V4M4 4h14l-3 4 3 4H4"/></Icon>;
const ISliders  = (p) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="7" cy="18" r="2" fill="currentColor"/></Icon>;

// Brand mark — door ajar + pulse line hybrid
const Mark = ({ size = 28, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* door frame */}
    <path d="M6 27V7l13-3v26z" />
    {/* door edge detail */}
    <path d="M19 14v.01" />
    {/* pulse line across base */}
    <path d="M2 27h4l2-4 3 8 2-4h19" strokeWidth="1.25" />
  </svg>
);

// Full wordmark
const Wordmark = ({ dark = false, size = 20 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
    <Mark size={size + 8} color={dark ? '#fff' : '#0d1f18'} />
    <div style={{
      fontFamily: 'Fraunces', fontSize: size, letterSpacing: '-0.015em',
      color: dark ? '#fff' : '#0d1f18', lineHeight: 1,
    }}>
      <span style={{ fontWeight: 300 }}>First</span><span style={{ fontWeight: 500, color: dark ? '#5DCAA5' : '#0F6E56' }}>Postgrad</span>
    </div>
  </div>
);

// Character icons — Aza (envelope + pulse), Mai (grid), Jennifer (doc + tick)
const CharAza = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="23" fill="#E1F5EE" stroke="#5DCAA5" strokeWidth="0.5" />
    <rect x="12" y="18" width="24" height="16" rx="2" stroke="#0F6E56" strokeWidth="1.25" fill="#fff" />
    <path d="M12.5 19L24 27l11.5-8" stroke="#0F6E56" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 34h4.5l1.5-3 2 5 1.5-3h1.5" stroke="#1D9E75" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="36" cy="16" r="2" fill="#5DCAA5" />
  </svg>
);

const CharMai = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="23" fill="#E1F5EE" stroke="#5DCAA5" strokeWidth="0.5" />
    <rect x="13" y="13" width="10" height="10" rx="1.5" fill="#fff" stroke="#0F6E56" strokeWidth="1.25" />
    <rect x="25" y="13" width="10" height="10" rx="1.5" fill="#0F6E56" stroke="#0F6E56" strokeWidth="1.25" />
    <rect x="13" y="25" width="10" height="10" rx="1.5" fill="#0F6E56" stroke="#0F6E56" strokeWidth="1.25" />
    <rect x="25" y="25" width="10" height="10" rx="1.5" fill="#fff" stroke="#0F6E56" strokeWidth="1.25" />
    <circle cx="30" cy="30" r="2" fill="#5DCAA5" />
  </svg>
);

const CharJennifer = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="23" fill="#E1F5EE" stroke="#5DCAA5" strokeWidth="0.5" />
    <path d="M15 12h13l5 5v19H15z" fill="#fff" stroke="#0F6E56" strokeWidth="1.25" strokeLinejoin="round"/>
    <path d="M28 12v5h5" stroke="#0F6E56" strokeWidth="1.25" strokeLinejoin="round" fill="none"/>
    <path d="M19 23h10M19 27h10M19 31h6" stroke="#6b7c74" strokeWidth="0.8" strokeLinecap="round"/>
    <circle cx="33" cy="33" r="5" fill="#0F6E56" />
    <path d="M31 33l1.5 1.5L35 32" stroke="#fff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const CharIcon = ({ who, size = 44 }) => {
  if (who === 'aza') return <CharAza size={size} />;
  if (who === 'mai') return <CharMai size={size} />;
  if (who === 'jennifer') return <CharJennifer size={size} />;
  return null;
};

const CHAR_META = {
  aza: { name: 'Aza', role: 'sends the alerts', tone: 'Quiet, reliable, always on time.' },
  mai: { name: 'Mai', role: 'organises the matches', tone: 'Keeps the signal clean.' },
  jennifer: { name: 'Jennifer', role: 'reads the JDs honestly', tone: 'Calls it like it is.' },
};

Object.assign(window, {
  Icon, IArrow, IArrowL, ICheck, IClose, IMail, IBell, IBookmark, IMap, IClock, IBag,
  IPound, ISearch, IFilter, IUser, ISpark, IPulse, IDoc, IGrid, IList, IDoor,
  ILogout, ISettings, IHelp, IFlag, ISliders,
  Mark, Wordmark, CharAza, CharMai, CharJennifer, CharIcon, CHAR_META,
});
