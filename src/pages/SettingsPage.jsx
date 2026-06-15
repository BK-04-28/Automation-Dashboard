import React, { useState } from 'react';

/* ─── Reusable primitives ─── */
function Toggle({ checked, onChange }) {
  return (
    <label className="af-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="af-toggle-slider" />
    </label>
  );
}

function PwField({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="sett-pw-wrap">
      <input
        type={show ? 'text' : 'password'}
        className="af-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button className="sett-pw-eye" type="button" onClick={() => setShow(s => !s)} tabIndex={-1}>
        <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} />
      </button>
    </div>
  );
}

function SettRow({ label, desc, children }) {
  return (
    <div className="sett-row">
      <div className="sett-row-info">
        <div className="sett-row-label">{label}</div>
        {desc && <div className="sett-row-desc">{desc}</div>}
      </div>
      <div className="sett-row-control">{children}</div>
    </div>
  );
}

/* ─── General Tab ─── */
function GeneralTab({ dark, setDark, addToast }) {
  const [appName, setAppName] = useState('AutoFlow');
  const [tz, setTz] = useState('Asia/Kolkata');
  const [trigger, setTrigger] = useState('Scheduled');
  const [maxRuns, setMaxRuns] = useState(3);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    addToast && addToast('Settings saved successfully ✓');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <div className="sett-content-header">
        <div className="sett-content-title">General Settings</div>
        <div className="sett-content-sub">Configure your AutoFlow application preferences</div>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Application</div>
        <div className="sett-section-sub">Basic application configuration</div>
        <SettRow label="App Name" desc="Display name shown throughout the interface">
          <input className="af-input sett-input" value={appName} onChange={e => setAppName(e.target.value)} />
        </SettRow>
        <SettRow label="Timezone" desc="All timestamps are shown in this timezone">
          <select className="af-input af-select-input sett-select-input" value={tz} onChange={e => setTz(e.target.value)}>
            <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="Europe/Berlin">Europe/Berlin (CET)</option>
          </select>
        </SettRow>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Automation Defaults</div>
        <div className="sett-section-sub">Default values for new automations</div>
        <SettRow label="Default Trigger" desc="Default trigger type for newly created automations">
          <div className="sett-radio-group">
            {['Manual','Scheduled','Event'].map(opt => (
              <label key={opt} className={`sett-radio${trigger === opt ? ' active' : ''}`}>
                <input type="radio" name="trigger" value={opt} checked={trigger === opt} onChange={() => setTrigger(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </SettRow>
        <SettRow label="Max Concurrent Runs" desc="Maximum automations running simultaneously">
          <input type="number" className="af-input sett-num" min={1} max={20} value={maxRuns} onChange={e => setMaxRuns(Number(e.target.value))} />
        </SettRow>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Appearance</div>
        <SettRow label="Dark Mode" desc="Toggle between light and dark interface">
          <div className="af-toggle-group">
            <Toggle checked={dark} onChange={() => setDark(d => !d)} />
            <span className="af-toggle-label">{dark ? 'Dark' : 'Light'}</span>
          </div>
        </SettRow>
      </div>
      <div className="sett-footer">
        {saved && <span className="sett-saved"><i className="bi bi-check-circle-fill" /> Settings saved successfully</span>}
        <button className="af-btn-primary" style={{ marginLeft: 0 }} onClick={handleSave}>
          <i className="bi bi-floppy" /> Save Changes
        </button>
      </div>
    </>
  );
}

/* ─── Notifications Tab ─── */
function NotificationsTab({ addToast }) {
  const [emailOn, setEmailOn] = useState(true);
  const [email, setEmail] = useState('admin@autoflow.dev');
  const [notify, setNotify] = useState({ Success: true, Failure: true, Start: false, Timeout: false });
  const [slackUrl, setSlackUrl] = useState('');
  const [digest, setDigest] = useState('Realtime');

  const testSlack = () => {
    if (!slackUrl) { addToast && addToast('Please enter a Slack Webhook URL', 'error'); return; }
    addToast && addToast('Slack test message sent ✓');
  };

  return (
    <>
      <div className="sett-content-header">
        <div className="sett-content-title">Notifications</div>
        <div className="sett-content-sub">Configure how and when you receive alerts</div>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Email Alerts</div>
        <SettRow label="Email Notifications" desc="Send alerts to the configured email address">
          <div className="af-toggle-group">
            <Toggle checked={emailOn} onChange={() => setEmailOn(e => !e)} />
            <span className="af-toggle-label">{emailOn ? 'Enabled' : 'Disabled'}</span>
          </div>
        </SettRow>
        {emailOn && (
          <SettRow label="Alert Email" desc="Recipient address for all notifications">
            <input type="email" className="af-input sett-input" value={email} onChange={e => setEmail(e.target.value)} />
          </SettRow>
        )}
        <SettRow label="Notify On" desc="Which events should trigger a notification">
          <div className="sett-check-group">
            {Object.entries(notify).map(([k, v]) => (
              <label key={k} className={`sett-check${v ? ' active' : ''}`} onClick={() => setNotify(n => ({ ...n, [k]: !n[k] }))}>
                <input type="checkbox" checked={v} onChange={() => {}} />
                <i className={`bi ${v ? 'bi-check-square-fill' : 'bi-square'}`} />
                {k}
              </label>
            ))}
          </div>
        </SettRow>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Integrations</div>
        <SettRow label="Slack Webhook" desc="Post notifications to a Slack channel">
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <input className="af-input" style={{ flex: 1 }} placeholder="https://hooks.slack.com/…" value={slackUrl} onChange={e => setSlackUrl(e.target.value)} />
            <button className="af-btn-secondary" onClick={testSlack} style={{ marginLeft: 0 }}>
              <i className="bi bi-send" /> Test
            </button>
          </div>
        </SettRow>
        <SettRow label="Digest Frequency" desc="How often to receive summary digests">
          <div className="sett-radio-group">
            {['Realtime','Hourly','Daily'].map(opt => (
              <label key={opt} className={`sett-radio${digest === opt ? ' active' : ''}`}>
                <input type="radio" name="digest" value={opt} checked={digest === opt} onChange={() => setDigest(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </SettRow>
      </div>
    </>
  );
}

/* ─── Security Tab ─── */
function SecurityTab({ addToast }) {
  const [cur, setCur] = useState('');
  const [nw, setNw] = useState('');
  const [conf, setConf] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState('30min');
  const [twoFA, setTwoFA] = useState(false);
  const RAW_KEY = 'ak_live_abcd1234efgh5678';
  const MASKED  = '••••••••••••abcd1234';

  const handleUpdatePw = () => {
    if (!cur || !nw || !conf) { addToast && addToast('Please fill all password fields', 'error'); return; }
    if (nw !== conf)           { addToast && addToast('Passwords do not match', 'error'); return; }
    addToast && addToast('Password updated successfully ✓');
    setCur(''); setNw(''); setConf('');
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(RAW_KEY);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
    addToast && addToast('API key copied to clipboard ✓');
  };

  return (
    <>
      <div className="sett-content-header">
        <div className="sett-content-title">Security</div>
        <div className="sett-content-sub">Manage your credentials, API keys and security settings</div>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Account</div>
        <div className="sett-user-card">
          <div className="af-user-avatar sett-avatar">BK</div>
          <div>
            <div className="sett-user-name">BK Developer</div>
            <div className="sett-user-email">admin@autoflow.dev</div>
          </div>
          <span className="sett-role-badge"><i className="bi bi-shield-fill" /> Admin</span>
        </div>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Change Password</div>
        <div className="sett-pw-grid">
          <div className="af-form-group">
            <label>Current Password</label>
            <PwField placeholder="••••••••" value={cur} onChange={e => setCur(e.target.value)} />
          </div>
          <div className="af-form-group">
            <label>New Password</label>
            <PwField placeholder="••••••••" value={nw} onChange={e => setNw(e.target.value)} />
          </div>
          <div className="af-form-group">
            <label>Confirm Password</label>
            <PwField placeholder="••••••••" value={conf} onChange={e => setConf(e.target.value)} />
          </div>
        </div>
        <button className="af-btn-primary sett-pw-btn" style={{ marginTop: 16, marginLeft: 0 }} onClick={handleUpdatePw}>
          <i className="bi bi-lock" /> Update Password
        </button>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">API Key</div>
        <div className="sett-api-row">
          <div className="sett-api-key">
            <i className="bi bi-key" />
            <span style={{ flex: 1 }}>{showKey ? RAW_KEY : MASKED}</span>
          </div>
          <button className="sett-api-btn" onClick={() => setShowKey(s => !s)} title={showKey ? 'Hide' : 'Reveal'}>
            <i className={`bi ${showKey ? 'bi-eye-slash' : 'bi-eye'}`} />
          </button>
          <button className={`sett-api-btn${copied ? ' copied' : ''}`} onClick={handleCopy} title="Copy">
            <i className={`bi ${copied ? 'bi-check2' : 'bi-clipboard'}`} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button className="sett-api-btn sett-api-danger" onClick={() => addToast && addToast('API key regenerated ✓', 'warning')}>
            <i className="bi bi-arrow-repeat" /> Regenerate
          </button>
        </div>
      </div>
      <div className="sett-section">
        <SettRow label="Session Timeout" desc="Auto-logout after period of inactivity">
          <select className="af-input af-select-input" style={{ width: 200 }} value={session} onChange={e => setSession(e.target.value)}>
            <option value="15min">15 minutes</option>
            <option value="30min">30 minutes</option>
            <option value="1hr">1 hour</option>
            <option value="4hr">4 hours</option>
          </select>
        </SettRow>
        <SettRow label="Two-Factor Authentication" desc="Extra security layer for your account">
          <div className="af-toggle-group">
            <Toggle checked={twoFA} onChange={() => { setTwoFA(t => !t); addToast && addToast(`2FA ${!twoFA ? 'enabled' : 'disabled'} ✓`); }} />
            <span className="af-toggle-label" style={{ color: twoFA ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
              {twoFA ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </SettRow>
      </div>
    </>
  );
}

/* ─── Appearance Tab ─── */
const ACCENT_COLORS = [
  { name: 'Purple',  value: '#6c47ff' },
  { name: 'Blue',    value: '#3b82f6' },
  { name: 'Teal',    value: '#0d9488' },
  { name: 'Green',   value: '#12b76a' },
  { name: 'Orange',  value: '#f97316' },
  { name: 'Red',     value: '#ef4444' },
  { name: 'Pink',    value: '#ec4899' },
  { name: 'Indigo',  value: '#4f46e5' },
];

function AppearanceTab({ dark, setDark, addToast }) {
  const [theme, setTheme]   = useState(dark ? 'dark' : 'light');
  const [accent, setAccent] = useState('#6c47ff');
  const [fontSize, setFontSize] = useState('Medium');

  const handleTheme = t => {
    setTheme(t);
    if (t === 'dark')  setDark(true);
    if (t === 'light') setDark(false);
    if (t === 'system') setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  const ThemePreview = ({ mode }) => (
    <div className={`sett-theme-preview${mode === 'dark' ? ' sett-theme-preview-dark' : ' sett-theme-preview-light'}`}>
      <div className="sett-preview-sidebar" style={{ background: mode === 'dark' ? '#090d1e' : '#6c47ff22' }} />
      <div className="sett-preview-content">
        <div className="sett-preview-bar" style={{ background: mode === 'dark' ? '#1e2a4a' : '#e2e6f0', width: '80%' }} />
        <div className="sett-preview-card" style={{ background: mode === 'dark' ? '#0e1428' : '#ffffff', border: `1px solid ${mode === 'dark' ? '#1e2a4a' : '#e2e6f0'}` }} />
        <div className="sett-preview-bar" style={{ background: '#6c47ff', width: '50%', marginTop: 2 }} />
      </div>
    </div>
  );

  return (
    <>
      <div className="sett-content-header">
        <div className="sett-content-title">Appearance</div>
        <div className="sett-content-sub">Customize how AutoFlow looks and feels</div>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Theme</div>
        <div className="sett-section-sub">Choose your preferred color scheme</div>
        <div className="sett-theme-grid">
          {[
            { key: 'light', label: 'Light' },
            { key: 'dark',  label: 'Dark'  },
            { key: 'system',label: 'System' },
          ].map(t => (
            <div key={t.key} className={`sett-theme-card${theme === t.key ? ' selected' : ''}`} onClick={() => handleTheme(t.key)}>
              <div className="sett-theme-check"><i className="bi bi-check" /></div>
              {t.key === 'system'
                ? <div style={{ width: 80, height: 56, borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ flex: 1, background: '#f0f2f8' }} />
                    <div style={{ flex: 1, background: '#080c18' }} />
                  </div>
                : <ThemePreview mode={t.key} />
              }
              <div className="sett-theme-label">{t.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Accent Color</div>
        <div className="sett-section-sub">Choose the primary highlight color</div>
        <div className="sett-color-grid">
          {ACCENT_COLORS.map(c => (
            <div
              key={c.value}
              className={`sett-color-swatch${accent === c.value ? ' selected' : ''}`}
              style={{ background: c.value }}
              title={c.name}
              onClick={() => { setAccent(c.value); addToast && addToast(`Accent color changed to ${c.name} ✓`); }}
            />
          ))}
        </div>
      </div>
      <div className="sett-section">
        <div className="sett-section-title">Font Size</div>
        <div className="sett-section-sub">Adjust the base text size across the interface</div>
        <div className="sett-font-steps">
          {['Small', 'Medium', 'Large'].map(s => (
            <div key={s} className={`sett-font-step${fontSize === s ? ' active' : ''}`} onClick={() => setFontSize(s)}>
              <span style={{ fontSize: s === 'Small' ? 12 : s === 'Large' ? 16 : 14 }}>Aa</span>
              <div style={{ fontSize: 11, marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="sett-footer">
        <button className="af-btn-primary" style={{ marginLeft: 0 }} onClick={() => addToast && addToast('Appearance settings saved ✓')}>
          <i className="bi bi-floppy" /> Apply Changes
        </button>
      </div>
    </>
  );
}

/* ─── Settings Page (Vertical Tabs) ─── */
const TABS = [
  { key: 'general',       label: 'General',       icon: 'bi-sliders' },
  { key: 'notifications', label: 'Notifications',  icon: 'bi-bell'   },
  { key: 'security',      label: 'Security',       icon: 'bi-shield-lock' },
  { key: 'appearance',    label: 'Appearance',     icon: 'bi-palette' },
];

export default function SettingsPage({ dark, setDark, addToast }) {
  const [activeTab, setActiveTab] = useState('general');
  return (
    <div className="af-page-fade">
      <div className="pg-header">
        <div>
          <h1 className="pg-title">Settings</h1>
          <p className="pg-sub">Manage your application configuration and preferences</p>
        </div>
      </div>

      <div className="sett-layout">
        {/* Vertical nav */}
        <div className="sett-sidebar-nav">
          <div className="sett-nav-card">
            <div className="sett-nav-label">Configuration</div>
            {TABS.map(t => (
              <button
                key={t.key}
                className={`sett-tab-btn${activeTab === t.key ? ' active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                <i className={`bi ${t.icon}`} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="sett-content-area">
          <div className="sett-content-card">
            {activeTab === 'general'       && <GeneralTab dark={dark} setDark={setDark} addToast={addToast} />}
            {activeTab === 'notifications' && <NotificationsTab addToast={addToast} />}
            {activeTab === 'security'      && <SecurityTab addToast={addToast} />}
            {activeTab === 'appearance'    && <AppearanceTab dark={dark} setDark={setDark} addToast={addToast} />}
          </div>
        </div>
      </div>
    </div>
  );
}
