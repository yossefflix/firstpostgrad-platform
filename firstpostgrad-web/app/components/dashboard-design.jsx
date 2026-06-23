// Dashboard — two variants (rich cards / email digest)
const { useState: useStateD, useMemo } = React;

const Dashboard = ({ go, prefs, tweaks, setTweaks }) => {
  const [variant, setVariant] = useStateD(tweaks.dashVariant || 'rich');
  const [specialtyFilter, setSpecialtyFilter] = useStateD('all');
  const [saved, setSaved] = useStateD({});
  const [applied, setApplied] = useStateD({});
  const [expanded, setExpanded] = useStateD(null);

  const changeVariant = (v) => {
    setVariant(v);
    setTweaks(t => ({ ...t, dashVariant: v }));
  };

  const jobs = useMemo(() => {
    if (specialtyFilter === 'all') return JOBS;
    if (specialtyFilter === 'saved') return JOBS.filter(j => saved[j.id]);
    return JOBS.filter(j => j.specialty === specialtyFilter);
  }, [specialtyFilter, saved]);

  const toggleSaved = (id) => setSaved(s => ({ ...s, [id]: !s[id] }));
  const markApplied = (id) => setApplied(a => ({ ...a, [id]: true }));

  const name = prefs.name || 'doctor';

  return (
    <div className="screen" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* topbar */}
      <nav className="nav" style={{ background: 'rgba(244,248,246,0.92)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ cursor: 'pointer' }} onClick={() => go('landing')}>
              <Wordmark />
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
              <TopLink active>Alerts</TopLink>
              <TopLink>CV</TopLink>
              <TopLink>Applications</TopLink>
              <TopLink>Community</TopLink>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={iconBtn}><ISearch size={16} strokeWidth={1.75} /></button>
            <button style={iconBtn}><IBell size={16} strokeWidth={1.75} /><span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)' }} /></button>
            <button style={iconBtn}><ISettings size={16} strokeWidth={1.75} /></button>
            <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>{name[0].toUpperCase()}</div>
          </div>
        </div>
      </nav>

      {/* greeting strip */}
      <div style={{ padding: '36px 36px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Eyebrow>Thursday 17 April &middot; 06:42 GMT</Eyebrow>
          <h1 className="serif" style={{ fontSize: 32, lineHeight: 1.35, margin: 0, fontWeight: 300, color: 'var(--dark)', maxWidth: 640 }}>
            Morning {name}. <em style={{ fontWeight: 300 }}>Six new posts fit you today.</em>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 620, margin: 0 }}>
            Filtered down from 1,247 SHO-grade postings across NHS Jobs, Trac and trust pages since 04:00.
            Two close this week &mdash; open those first.
          </p>
        </div>

        {/* variant toggle */}
        <div className="seg" style={{ width: 240, flexShrink: 0 }}>
          <button className={variant === 'rich' ? 'on' : ''} onClick={() => changeVariant('rich')}>
            <IGrid size={12} strokeWidth={1.75} style={{ verticalAlign: -2, marginRight: 5 }} /> Rich cards
          </button>
          <button className={variant === 'digest' ? 'on' : ''} onClick={() => changeVariant('digest')}>
            <IList size={12} strokeWidth={1.75} style={{ verticalAlign: -2, marginRight: 5 }} /> Digest
          </button>
        </div>
      </div>

      {/* filters */}
      <div style={{ padding: '0 36px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
        <Chip on={specialtyFilter === 'all'} onClick={() => setSpecialtyFilter('all')}>All ({JOBS.length})</Chip>
        <Chip on={specialtyFilter === 'saved'} onClick={() => setSpecialtyFilter('saved')}>
          <IBookmark size={12} strokeWidth={1.75} /> Saved ({Object.values(saved).filter(Boolean).length})
        </Chip>
        <div style={{ width: 1, height: 16, background: 'var(--line)', margin: '0 6px' }} />
        {[...new Set(JOBS.map(j => j.specialty))].map(s => (
          <Chip key={s} on={specialtyFilter === s} onClick={() => setSpecialtyFilter(s)}>{s}</Chip>
        ))}
      </div>

      {/* content */}
      <div style={{ padding: '0 36px 80px' }}>
        {variant === 'rich'
          ? <RichGrid jobs={jobs} saved={saved} applied={applied} toggleSaved={toggleSaved} markApplied={markApplied} expanded={expanded} setExpanded={setExpanded} />
          : <DigestList jobs={jobs} saved={saved} applied={applied} toggleSaved={toggleSaved} markApplied={markApplied} />
        }
      </div>

      {/* footer strip */}
      <div style={{
        background: 'var(--dark)', color: 'rgba(255,255,255,0.65)',
        padding: '32px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <CharAza size={32} />
          <div style={{ fontSize: 13 }}>
            <span style={{ color: 'var(--teal-mid)' }}>Aza</span> is watching 47 sources. Last check: <span className="mono">2 minutes ago</span>.
          </div>
        </div>
        <div style={{ fontSize: 13 }}>
          Missing something? <a href="#" style={{ color: 'var(--teal-mid)' }}>Tell Khaled &rarr;</a>
        </div>
      </div>
    </div>
  );
};

const TopLink = ({ children, active }) => (
  <a href="#" style={{
    padding: '8px 14px',
    borderRadius: 100,
    background: active ? 'var(--teal-pale)' : 'transparent',
    color: active ? 'var(--teal)' : 'var(--mid)',
    textDecoration: 'none',
    fontWeight: active ? 500 : 400,
  }}>{children}</a>
);

const iconBtn = {
  width: 36, height: 36, borderRadius: '50%', border: '0.5px solid var(--line)',
  background: 'var(--white)', cursor: 'pointer', color: 'var(--mid)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
};

// ---------- RICH GRID ----------
const RichGrid = ({ jobs, saved, applied, toggleSaved, markApplied, expanded, setExpanded }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
    {jobs.map(j => (
      <JobCardRich key={j.id} j={j}
        saved={!!saved[j.id]} applied={!!applied[j.id]}
        toggleSaved={() => toggleSaved(j.id)}
        markApplied={() => markApplied(j.id)}
        expanded={expanded === j.id}
        toggleExpanded={() => setExpanded(expanded === j.id ? null : j.id)}
      />
    ))}
    {jobs.length === 0 && (
      <div style={{ gridColumn: '1/-1', padding: 80, textAlign: 'center', color: 'var(--muted)' }}>
        Nothing in this filter yet. Change the filter or check back tomorrow.
      </div>
    )}
  </div>
);

const JobCardRich = ({ j, saved, applied, toggleSaved, markApplied, expanded, toggleExpanded }) => (
  <div className="card" style={{
    padding: 0, overflow: 'hidden',
    borderColor: applied ? 'var(--teal-mid)' : 'var(--line)',
    background: applied ? 'var(--teal-wash)' : 'var(--white)',
  }}>
    {/* header strip */}
    <div style={{
      padding: '14px 20px',
      borderBottom: '0.5px solid var(--line)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: 'var(--teal-wash)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <CharIcon who={j.char} size={26} />
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          <span style={{ color: 'var(--dark)', fontWeight: 500 }}>{CHAR_META[j.char].name}</span> flagged this &middot; {j.posted}
        </div>
      </div>
      <DeadlinePill text={'closes ' + j.deadline} color={j.deadlineColor} />
    </div>

    <div style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{j.trust}</div>
          <h3 className="serif" style={{ fontSize: 22, lineHeight: 1.2, color: 'var(--dark)', margin: 0, fontWeight: 400 }}>{j.role}</h3>
        </div>
        <FitMeter value={j.fit} />
      </div>

      <div style={{ display: 'flex', gap: 18, marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
        <MetaInline icon={<IMap size={13}/>} text={j.location} />
        <MetaInline icon={<IPound size={13}/>} text={j.salary.split(' — ')[0]} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
        {j.tags.map(t => (
          <span key={t} style={{ padding: '4px 10px', borderRadius: 100, background: 'var(--bg)', fontSize: 12, color: 'var(--mid)' }}>{t}</span>
        ))}
      </div>

      <div style={{
        marginTop: 18, padding: '14px 16px',
        borderLeft: '2px solid var(--teal)', background: 'var(--teal-wash)',
        borderRadius: '0 10px 10px 0',
      }}>
        <div style={{ fontSize: 11, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, marginBottom: 6 }}>
          CV tip &middot; Jennifer
        </div>
        <div style={{ fontSize: 13, color: 'var(--dark)', lineHeight: 1.55 }}>
          {j.cvTip}
        </div>
      </div>

      {expanded && (
        <div className="fade-up" style={{ marginTop: 16, padding: '14px 16px', background: '#fbfaf6', border: '0.5px dashed #e8dfc4', borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: '#8a5a18', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, marginBottom: 6 }}>
            Why we sent this
          </div>
          <div style={{ fontSize: 13, color: 'var(--dark)', lineHeight: 1.55 }}>{j.why}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="primary" size="sm" onClick={markApplied}>
            {applied ? <><ICheck size={14} strokeWidth={2.25}/> Applied</> : <>Open job <IArrow size={14} strokeWidth={2}/></>}
          </Btn>
          <Btn variant="ghost" size="sm" onClick={toggleSaved}>
            <IBookmark size={14} strokeWidth={1.75} stroke={saved ? 'var(--teal)' : 'currentColor'} fill={saved ? 'var(--teal-pale)' : 'none'} />
            {saved ? 'Saved' : 'Save'}
          </Btn>
        </div>
        <button onClick={toggleExpanded} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, color: 'var(--muted)', fontFamily: 'DM Sans',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {expanded ? 'Less' : 'Why this one?'} <IArrow size={11} strokeWidth={1.75} style={{ transform: expanded ? 'rotate(-90deg)' : 'rotate(90deg)' }}/>
        </button>
      </div>
    </div>
  </div>
);

const MetaInline = ({ icon, text }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{icon}{text}</span>
);

// ---------- DIGEST ----------
const DigestList = ({ jobs, saved, applied, toggleSaved, markApplied }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden', maxWidth: 900, margin: '0 auto' }}>
    {/* email-header */}
    <div style={{
      padding: '22px 28px', borderBottom: '0.5px solid var(--line)',
      background: 'var(--teal-wash)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>From &middot; Aza &lt;alerts@firstpostgrad.co.uk&gt;</div>
          <div className="serif" style={{ fontSize: 22, color: 'var(--dark)', fontWeight: 400, lineHeight: 1.2 }}>
            {jobs.length} posts today worth your time
          </div>
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>Digest #147</div>
      </div>
    </div>

    {jobs.length === 0 && (
      <div style={{ padding: 64, textAlign: 'center', color: 'var(--muted)' }}>Nothing in this filter yet.</div>
    )}

    {jobs.map((j, i) => (
      <DigestRow key={j.id} j={j} i={i}
        saved={!!saved[j.id]} applied={!!applied[j.id]}
        toggleSaved={() => toggleSaved(j.id)}
        markApplied={() => markApplied(j.id)}
      />
    ))}

    <div style={{ padding: '22px 28px', borderTop: '0.5px solid var(--line)', fontSize: 13, color: 'var(--muted)', background: 'var(--bg)', textAlign: 'center' }}>
      <div className="serif italic" style={{ fontSize: 15, color: 'var(--dark)', marginBottom: 6, fontWeight: 300 }}>
        That&rsquo;s everything for today.
      </div>
      See you tomorrow morning. &mdash; Aza
    </div>
  </div>
);

const DigestRow = ({ j, i, saved, applied, toggleSaved, markApplied }) => (
  <div style={{
    padding: '20px 28px',
    borderBottom: '0.5px solid var(--line)',
    display: 'grid',
    gridTemplateColumns: '40px 1fr auto',
    gap: 20,
    alignItems: 'center',
    background: applied ? 'var(--teal-wash)' : 'transparent',
  }}>
    <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{String(i + 1).padStart(2, '0')}</div>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{j.trust} &middot; {j.location}</div>
        <DeadlinePill text={j.deadline + ' left'} color={j.deadlineColor} />
      </div>
      <div className="serif" style={{ fontSize: 18, color: 'var(--dark)', fontWeight: 400, lineHeight: 1.25, marginBottom: 6 }}>
        {j.role}
      </div>
      <div style={{ fontSize: 13, color: 'var(--mid)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <CharIcon who={j.char} size={18} />
        <span style={{ fontStyle: 'italic' }}>&ldquo;{j.cvTip}&rdquo;</span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ textAlign: 'right', marginRight: 6 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fit</div>
        <div className="serif" style={{ fontSize: 20, color: 'var(--teal)', fontWeight: 400 }}>{j.fit}</div>
      </div>
      <Btn variant="ghost" size="sm" onClick={toggleSaved}>
        <IBookmark size={13} strokeWidth={1.75} fill={saved ? 'var(--teal-pale)' : 'none'} stroke={saved ? 'var(--teal)' : 'currentColor'} />
      </Btn>
      <Btn variant="primary" size="sm" onClick={markApplied}>
        {applied ? <ICheck size={13} strokeWidth={2.25} /> : <>Open <IArrow size={12} strokeWidth={2} /></>}
      </Btn>
    </div>
  </div>
);

Object.assign(window, { Dashboard });
