// Onboarding — multi-step with validation
const { useState: useStateO } = React;

const Onboarding = ({ go, prefs, setPrefs }) => {
  const [step, setStep] = useStateO(0);
  const [errors, setErrors] = useStateO({});

  const steps = ['You', 'Where', 'What', 'When'];

  const update = (k, v) => setPrefs(p => ({ ...p, [k]: v }));
  const toggle = (k, v) => setPrefs(p => {
    const arr = p[k] || [];
    return { ...p, [k]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] };
  });

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!prefs.name || prefs.name.trim().length < 2) e.name = 'Your first name, please';
      if (!prefs.email || !/^\S+@\S+\.\S+$/.test(prefs.email)) e.email = 'A real email &mdash; we send alerts here';
      if (!prefs.stage) e.stage = 'Pick whichever is closest';
    }
    if (step === 1) {
      if (!prefs.regions || prefs.regions.length === 0) e.regions = 'Pick at least one region';
      if (prefs.visa === undefined) e.visa = 'Let us know about sponsorship';
    }
    if (step === 2) {
      if (!prefs.specialties || prefs.specialties.length === 0) e.specialties = 'Pick one or more';
      if (!prefs.grade) e.grade = 'Pick the grade you&rsquo;re aiming for';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 3) setStep(step + 1);
    else go('dashboard');
  };

  return (
    <div className="screen" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', minHeight: '100vh' }}>
      {/* LEFT panel — emotional context */}
      <div style={{
        background: 'var(--dark)',
        color: 'white',
        padding: '64px 72px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div className="dot-grid" style={{ position: 'absolute', inset: 0 }} />
        <ConcentricDecor right={-100} top={420} size={500} onDark />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ cursor: 'pointer' }} onClick={() => go('landing')}>
            <Wordmark dark />
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: 96, maxWidth: 460 }}>
          <Eyebrow onDark>Three minutes, no account needed yet</Eyebrow>
          <h1 className="serif" style={{ fontSize: 46, lineHeight: 1.1, margin: '28px 0 22px', fontWeight: 300, color: 'white' }}>
            Tell us where you are, <em style={{ color: 'var(--teal-mid)' }}>and where you&rsquo;d go.</em>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, marginBottom: 44 }}>
            Everything you share here is used only to filter jobs. We don&rsquo;t sell it,
            forward it to recruiters, or add you to any list.
          </p>

          <div style={{ marginTop: 36 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 0', opacity: i > step ? 0.4 : 1,
                borderBottom: i < steps.length - 1 ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '0.5px solid ' + (i < step ? 'var(--teal-mid)' : i === step ? 'var(--teal-mid)' : 'rgba(255,255,255,0.2)'),
                  background: i < step ? 'var(--teal-mid)' : 'transparent',
                  color: i < step ? 'var(--dark)' : i === step ? 'var(--teal-mid)' : 'rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontFamily: 'JetBrains Mono', fontWeight: 500,
                }}>
                  {i < step ? <ICheck size={14} strokeWidth={2.5} /> : String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 15, color: i === step ? 'white' : i < step ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)', fontWeight: i === step ? 500 : 400 }}>
                  {s}
                </div>
                {i === step && <span className="pulse-dot" style={{ marginLeft: 'auto' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* footer quote */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto', paddingTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <CharAza size={40} />
            <div>
              <div style={{ fontSize: 12, color: 'var(--teal-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Aza will handle it from here</div>
              <div className="serif italic" style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: 300, lineHeight: 1.5, maxWidth: 380 }}>
                &ldquo;Once this is set, I&rsquo;ll only email you when something matches. Usually once or twice a week.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ background: 'var(--bg)', padding: '64px 72px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Step {String(step + 1).padStart(2, '0')} of 04 &middot; {steps[step]}
          </div>
          <Btn variant="ghost" size="sm" onClick={() => go('landing')}><IClose size={14} strokeWidth={2} /> Save &amp; exit</Btn>
        </div>
        <div className="progress-track" style={{ marginTop: 14 }}>
          <div className="progress-fill" style={{ width: `${((step + 1) / 4) * 100}%` }} />
        </div>

        <div style={{ marginTop: 48, maxWidth: 480, width: '100%' }}>
          <div className="fade-up" key={step}>
            {step === 0 && <StepYou prefs={prefs} update={update} errors={errors} />}
            {step === 1 && <StepWhere prefs={prefs} update={update} toggle={toggle} errors={errors} />}
            {step === 2 && <StepWhat prefs={prefs} update={update} toggle={toggle} errors={errors} />}
            {step === 3 && <StepWhen prefs={prefs} update={update} />}
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Btn variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : go('landing')}>
            <IArrowL size={14} strokeWidth={2} /> {step > 0 ? 'Back' : 'Home'}
          </Btn>
          <Btn variant="primary" size="lg" onClick={next}>
            {step < 3 ? 'Continue' : 'See my alerts'} <IArrow size={16} strokeWidth={2} />
          </Btn>
        </div>
      </div>
    </div>
  );
};

const StepYou = ({ prefs, update, errors }) => (
  <div>
    <h2 className="serif" style={{ fontSize: 34, lineHeight: 1.15, color: 'var(--dark)', margin: '0 0 12px', fontWeight: 400 }}>
      First, <em style={{ fontWeight: 300 }}>who are we writing to?</em>
    </h2>
    <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
      Your first name is on every alert. We use the email only for the alerts themselves.
    </p>

    <label className="field">
      <span className="lbl">First name</span>
      <input type="text" value={prefs.name || ''} onChange={e => update('name', e.target.value)} placeholder="e.g. Ayesha" />
      {errors.name && <FieldError msg={errors.name} />}
    </label>

    <label className="field">
      <span className="lbl">Email</span>
      <input type="email" value={prefs.email || ''} onChange={e => update('email', e.target.value)} placeholder="your@email.com" />
      {errors.email && <FieldError msg={errors.email} />}
    </label>

    <div className="field">
      <div className="lbl">Where are you in the process?</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { k: 'plab2', t: 'Just passed PLAB 2', s: 'Awaiting GMC decision' },
          { k: 'gmc_new', t: 'GMC registered', s: 'Under 3 months' },
          { k: 'gmc_search', t: 'GMC registered', s: '3+ months searching' },
          { k: 'other', t: 'Something else', s: 'Tell us later' },
        ].map(o => (
          <button key={o.k} type="button"
            onClick={() => update('stage', o.k)}
            style={{
              textAlign: 'left', padding: '16px 18px', borderRadius: 12,
              border: `0.5px solid ${prefs.stage === o.k ? 'var(--teal)' : 'var(--line)'}`,
              background: prefs.stage === o.k ? 'var(--teal-pale)' : 'var(--white)',
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'DM Sans',
            }}>
            <div style={{ fontSize: 14, color: 'var(--dark)', fontWeight: 500, marginBottom: 4 }}>{o.t}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{o.s}</div>
          </button>
        ))}
      </div>
      {errors.stage && <FieldError msg={errors.stage} />}
    </div>
  </div>
);

const StepWhere = ({ prefs, update, toggle, errors }) => (
  <div>
    <h2 className="serif" style={{ fontSize: 34, lineHeight: 1.15, color: 'var(--dark)', margin: '0 0 12px', fontWeight: 400 }}>
      Where would you <em style={{ fontWeight: 300 }}>actually move to?</em>
    </h2>
    <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
      Be honest with yourself. A yes here means we&rsquo;ll send you alerts there.
    </p>

    <div className="field">
      <div className="lbl">Regions open to you</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {REGIONS.map(r => (
          <Chip key={r} on={(prefs.regions || []).includes(r)} onClick={() => toggle('regions', r)}>{r}</Chip>
        ))}
      </div>
      {errors.regions && <FieldError msg={errors.regions} />}
    </div>

    <div className="field">
      <div className="lbl">Do you need Tier 2 / skilled worker sponsorship?</div>
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { k: true,  t: 'Yes, sponsorship needed' },
          { k: false, t: 'No, I have right to work' },
        ].map(o => (
          <button key={String(o.k)} type="button"
            onClick={() => update('visa', o.k)}
            style={{
              flex: 1, padding: '16px 18px', borderRadius: 12,
              border: `0.5px solid ${prefs.visa === o.k ? 'var(--teal)' : 'var(--line)'}`,
              background: prefs.visa === o.k ? 'var(--teal-pale)' : 'var(--white)',
              cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 14, color: 'var(--dark)', fontWeight: 500,
              textAlign: 'left',
            }}>
            {o.t}
          </button>
        ))}
      </div>
      {errors.visa && <FieldError msg={errors.visa} />}
    </div>

    {prefs.visa === true && (
      <Callout>
        <div style={{ fontSize: 13, color: 'var(--dark)', lineHeight: 1.6 }}>
          <strong style={{ fontWeight: 500 }}>Mai notes:</strong> 78% of UK trusts sponsor SHO grade posts.
          We&rsquo;ll only send you jobs with confirmed Certificate of Sponsorship availability.
        </div>
      </Callout>
    )}
  </div>
);

const StepWhat = ({ prefs, update, toggle, errors }) => (
  <div>
    <h2 className="serif" style={{ fontSize: 34, lineHeight: 1.15, color: 'var(--dark)', margin: '0 0 12px', fontWeight: 400 }}>
      What kind of post <em style={{ fontWeight: 300 }}>are you hoping for?</em>
    </h2>
    <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
      Pick more than one if you&rsquo;re flexible. You can change this anytime.
    </p>

    <div className="field">
      <div className="lbl">Grade</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {GRADES.map(g => (
          <Chip key={g} on={prefs.grade === g} onClick={() => update('grade', g)}>{g}</Chip>
        ))}
      </div>
      {errors.grade && <FieldError msg={errors.grade} />}
    </div>

    <div className="field">
      <div className="lbl">Specialties (up to 5)</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {SPECIALTIES.map(s => {
          const on = (prefs.specialties || []).includes(s);
          const maxed = !on && (prefs.specialties || []).length >= 5;
          return (
            <Chip key={s} on={on} onClick={() => !maxed && toggle('specialties', s)}>{s}</Chip>
          );
        })}
      </div>
      {errors.specialties && <FieldError msg={errors.specialties} />}
    </div>
  </div>
);

const StepWhen = ({ prefs, update }) => (
  <div>
    <h2 className="serif" style={{ fontSize: 34, lineHeight: 1.15, color: 'var(--dark)', margin: '0 0 12px', fontWeight: 400 }}>
      When do you want <em style={{ fontWeight: 300 }}>to hear from us?</em>
    </h2>
    <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
      We lean quiet. You can always change this later.
    </p>

    <div className="field">
      <div className="lbl">How often</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { k: 'instant', t: 'Instant', s: 'The moment something fits &mdash; can be 3&ndash;4/week' },
          { k: 'daily',   t: 'Daily digest', s: 'One email at 07:00, only if there&rsquo;s something worth saying' },
          { k: 'weekly',  t: 'Weekly summary', s: 'Sunday evening. Good for keeping a pulse while you travel' },
        ].map(o => (
          <button key={o.k} type="button"
            onClick={() => update('cadence', o.k)}
            style={{
              textAlign: 'left', padding: '18px 20px', borderRadius: 12,
              border: `0.5px solid ${prefs.cadence === o.k ? 'var(--teal)' : 'var(--line)'}`,
              background: prefs.cadence === o.k ? 'var(--teal-pale)' : 'var(--white)',
              cursor: 'pointer', fontFamily: 'DM Sans',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
            <div>
              <div style={{ fontSize: 15, color: 'var(--dark)', fontWeight: 500, marginBottom: 4 }}>{o.t}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }} dangerouslySetInnerHTML={{ __html: o.s }} />
            </div>
            {prefs.cadence === o.k && <ICheck size={18} strokeWidth={2} stroke="var(--teal)" />}
          </button>
        ))}
      </div>
    </div>

    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '18px 20px', background: 'var(--teal-wash)', borderRadius: 12, cursor: 'pointer' }}>
      <input type="checkbox" checked={!!prefs.cvTips} onChange={e => update('cvTips', e.target.checked)}
        style={{ marginTop: 3, accentColor: 'var(--teal)', width: 16, height: 16 }} />
      <div>
        <div style={{ fontSize: 14, color: 'var(--dark)', fontWeight: 500, marginBottom: 3 }}>Include CV tailoring notes</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Jennifer reads each JD and adds one honest tip. Recommended.</div>
      </div>
    </label>
  </div>
);

const FieldError = ({ msg }) => (
  <div style={{ marginTop: 6, fontSize: 12, color: '#b4432a', display: 'flex', alignItems: 'center', gap: 6 }} dangerouslySetInnerHTML={{ __html: '&mdash; ' + msg }} />
);

Object.assign(window, { Onboarding });
