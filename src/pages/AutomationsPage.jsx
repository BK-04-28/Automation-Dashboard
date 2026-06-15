import React, { useState, useRef, useEffect } from 'react';
import { fakeLogs, CATEGORY_COLORS } from '../data/automations';

/* ═══════════════════════════════════
   CONSTANTS
═══════════════════════════════════ */
const JOB_ICONS = {
  Storage:       { gradient: 'linear-gradient(135deg,#7c5cff 0%,#a855f7 100%)', icon: 'bi-database-fill'      },
  Communication: { gradient: 'linear-gradient(135deg,#0891b2 0%,#06b6d4 100%)', icon: 'bi-envelope-fill'      },
  Analytics:     { gradient: 'linear-gradient(135deg,#d97706 0%,#fb923c 100%)', icon: 'bi-bar-chart-line-fill' },
  Integration:   { gradient: 'linear-gradient(135deg,#2563eb 0%,#818cf8 100%)', icon: 'bi-arrow-left-right'   },
  Maintenance:   { gradient: 'linear-gradient(135deg,#059669 0%,#34d399 100%)', icon: 'bi-gear-wide-connected' },
  Default:       { gradient: 'linear-gradient(135deg,#475569 0%,#94a3b8 100%)', icon: 'bi-lightning-charge-fill'},
};

/* ─── Status config (class-based for dark/light compat) ─── */
const JOB_STATUS = {
  Running:   { cls: 'js-running',   label: 'Running',   pulse: true  },
  Scheduled: { cls: 'js-scheduled', label: 'Scheduled', pulse: false },
  Completed: { cls: 'js-completed', label: 'Completed', pulse: false },
  Failed:    { cls: 'js-failed',    label: 'Failed',    pulse: false },
  Paused:    { cls: 'js-paused',    label: 'Paused',    pulse: false },
};

/* ═══════════════════════════════════
   MORE MENU
═══════════════════════════════════ */
function MoreMenu({ auto, onPause, onDelete, addToast }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  const isPaused = auto.status === 'Paused';
  return (
    <div className="jm-wrap" ref={ref}>
      <button className="jc-ghost-btn jm-trigger" onClick={() => setOpen(o => !o)} title="More options" aria-label="More options">
        <i className="bi bi-three-dots" />
      </button>
      {open && (
        <div className="jm-dropdown">
          <button className="jm-item" onClick={() => { onPause(); setOpen(false); }}>
            <i className={`bi ${isPaused ? 'bi-play-fill' : 'bi-pause-fill'}`} />
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button className="jm-item" onClick={() => { addToast?.(`"${auto.name}" duplicated ✓`); setOpen(false); }}>
            <i className="bi bi-copy" /> Duplicate
          </button>
          <div className="jm-sep" />
          <button className="jm-item jm-danger" onClick={() => { onDelete(); setOpen(false); }}>
            <i className="bi bi-trash3" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   LOG VIEWER MODAL
═══════════════════════════════════ */
function LogsModal({ auto, onClose }) {
  const logs = fakeLogs[auto?.id] || [];
  return (
    <div className="af-modal-overlay" onClick={onClose}>
      <div className="af-modal af-modal-lg" onClick={e => e.stopPropagation()}>
        <div className="af-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: (JOB_ICONS[auto.category] || JOB_ICONS.Default).gradient, color: '#fff', fontSize: 13,
            }}>
              <i className={`bi ${(JOB_ICONS[auto.category] || JOB_ICONS.Default).icon}`} />
            </span>
            <span>{auto?.name} — Logs</span>
          </div>
          <button className="af-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="af-terminal">
          <div className="af-terminal-bar">
            <span className="af-tb-dot" style={{ background: '#ef4444' }} />
            <span className="af-tb-dot" style={{ background: '#f59e0b' }} />
            <span className="af-tb-dot" style={{ background: '#10b981' }} />
            <span className="af-tb-title">terminal — {auto?.name}</span>
          </div>
          <div className="af-terminal-body">
            {logs.length
              ? logs.map((l, i) => <div key={i} className={`af-log-line af-log-${l.type}`}><span className="af-line-num">{i+1}</span><span>{l.msg}</span></div>)
              : <div className="af-log-line af-log-info"><span className="af-line-num">1</span><span>No log output found for this run.</span></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   EDIT / NEW MODAL
═══════════════════════════════════ */
function AutomationModal({ auto, onClose, onSave }) {
  const isNew = !auto;
  const [form, setForm] = useState({
    name:        auto?.name        || '',
    description: auto?.description || '',
    category:    auto?.category    || 'Storage',
    trigger:     auto?.trigger     || 'Scheduled',
    schedule:    auto?.schedule    || '0 8 * * *',
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <div className="af-modal-overlay" onClick={onClose}>
      <div className="af-modal" onClick={e => e.stopPropagation()}>
        <div className="af-modal-header">
          <span><i className={`bi ${isNew ? 'bi-plus-circle' : 'bi-pencil'}`} style={{ color: 'var(--accent)', marginRight: 6 }} />{isNew ? 'New Automation' : `Edit — ${auto.name}`}</span>
          <button className="af-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="af-modal-body">
          <div className="af-form-group">
            <label>Name</label>
            <input className="af-input" placeholder="Automation name" value={form.name} onChange={set('name')} />
          </div>
          <div className="af-form-group">
            <label>Description</label>
            <textarea className="af-input af-textarea" placeholder="What does this automation do?" value={form.description} onChange={set('description')} />
          </div>
          <div className="af-form-row">
            <div className="af-form-group" style={{ flex: 1 }}>
              <label>Category</label>
              <select className="af-input af-select-input" value={form.category} onChange={set('category')}>
                {Object.keys(JOB_ICONS).filter(k => k !== 'Default').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="af-form-group" style={{ flex: 1 }}>
              <label>Trigger</label>
              <select className="af-input af-select-input" value={form.trigger} onChange={set('trigger')}>
                {['Scheduled','Manual','Webhook','Event'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          {form.trigger === 'Scheduled' && (
            <div className="af-form-group">
              <label>Cron Expression</label>
              <input className="af-input" placeholder="0 8 * * *" value={form.schedule} onChange={set('schedule')} style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
          )}
          <div className="af-modal-footer">
            <button className="af-btn-secondary" style={{ marginLeft: 0 }} onClick={onClose}>Cancel</button>
            <button className="af-btn-primary" onClick={() => onSave(form)}>
              <i className="bi bi-check-lg" /> {isNew ? 'Create Automation' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   SKELETON CARD
═══════════════════════════════════ */
function SkeletonCard() {
  return (
    <div className="job-card" style={{ gap: 16, cursor: 'default' }}>
      <div className="jc-header">
        <div className="af-skel" style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="af-skel" style={{ height: 15, width: '60%', borderRadius: 6 }} />
          <div className="af-skel" style={{ height: 11, width: '35%', borderRadius: 20 }} />
        </div>
        <div className="af-skel" style={{ width: 62, height: 22, borderRadius: 6 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div className="af-skel" style={{ height: 12, borderRadius: 6 }} />
        <div className="af-skel" style={{ height: 12, width: '78%', borderRadius: 6 }} />
      </div>
      <div className="jc-meta">
        {[52, 74, 68, 44].map((w, i) => (
          <div key={i} className="af-skel" style={{ height: 11, width: w, borderRadius: 6 }} />
        ))}
      </div>
      <div className="jc-actions" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <div className="af-skel" style={{ height: 32, width: 72, borderRadius: 8 }} />
        <div className="af-skel" style={{ height: 32, width: 120, borderRadius: 8, marginLeft: 'auto' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   DRAWER (SIDE PANEL)
═══════════════════════════════════ */
function DrawerPanel({ auto, onClose }) {
  if (!auto) return null;
  const iconCfg = JOB_ICONS[auto.category] || JOB_ICONS.Default;
  return (
    <div className="af-drawer-overlay" onClick={onClose}>
      <div className="af-drawer" onClick={e => e.stopPropagation()}>
        <div className="af-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="jc-icon" style={{ background: iconCfg.gradient, width: 40, height: 40, borderRadius: 10, fontSize: 16 }}>
              <i className={`bi ${iconCfg.icon}`} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{auto.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{auto.category} Automation</div>
            </div>
          </div>
          <button className="af-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="af-drawer-body">
          <div className="af-drawer-section">
            <h3>Description</h3>
            <p className="af-drawer-p">{auto.description || 'No description provided.'}</p>
          </div>
          <div className="af-drawer-section">
            <h3>Automation Details</h3>
            <div className="af-drawer-grid">
              <div className="ad-grid-item">
                <span className="ad-label">Status</span>
                <span className="ad-value" style={{ color: auto.status === 'Running' ? 'var(--amber)' : auto.status === 'Failed' ? 'var(--red)' : '' }}>{auto.status}</span>
              </div>
              <div className="ad-grid-item">
                <span className="ad-label">Trigger</span>
                <span className="ad-value">{auto.trigger || 'Scheduled'}</span>
              </div>
              <div className="ad-grid-item">
                <span className="ad-label">Schedule</span>
                <span className="ad-value">{auto.schedule || '—'}</span>
              </div>
              <div className="ad-grid-item">
                <span className="ad-label">Owner</span>
                <span className="ad-value">{auto.triggeredBy || 'System'}</span>
              </div>
              <div className="ad-grid-item">
                <span className="ad-label">Last Run</span>
                <span className="ad-value">{auto.lastRun || 'Never'}</span>
              </div>
              <div className="ad-grid-item">
                <span className="ad-label">Next Run</span>
                <span className="ad-value">{auto.nextRun || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   AUTOMATION CARD (Enterprise SaaS)
═══════════════════════════════════ */
function AutomationCard({ auto, onRunNow, onViewLogs, onEdit, onPause, onDelete, addToast, onViewDetails }) {
  const statusCfg = JOB_STATUS[auto.status] || JOB_STATUS.Scheduled;
  const iconCfg   = JOB_ICONS[auto.category] || JOB_ICONS.Default;
  const catStyle  = CATEGORY_COLORS[auto.category] || CATEGORY_COLORS.Default;
  const isRunning = auto.status === 'Running';
  
  // Status classes for outer card
  let statusClass = 'is-scheduled';
  if (isRunning) statusClass = 'is-running';
  else if (auto.status === 'Completed') statusClass = 'is-completed';
  else if (auto.status === 'Failed') statusClass = 'is-failed';
  else if (auto.status === 'Paused') statusClass = 'is-paused';

  const etaMins = auto.progress !== undefined ? Math.max(1, Math.round((100 - auto.progress) / 10)) : 1;

  return (
    <div className={`job-card ${statusClass}`}>
      {/* Absolute Category Badge */}
      <span className="jc-cat-badge" style={{ color: catStyle.text, borderColor: catStyle.text, background: catStyle.bg }}>
        {auto.category}
      </span>

      {/* ── HEADER ── */}
      <div className="jc-header">
        <div className="jc-icon" style={{ background: iconCfg.gradient }}>
          <i className={`bi ${iconCfg.icon}`} />
        </div>
        <div className="jc-header-body">
          <div className="jc-title-row">
            <span className="jc-title" title={auto.name}>{auto.name}</span>
            <span className={`jc-status-inline st-${auto.status.toLowerCase()}`}>
              <span className={`st-dot ${statusCfg.pulse ? 'pulse' : ''}`} style={{ background: 'currentColor' }} />
              {auto.status}
            </span>
          </div>
          <div className="jc-desc-area">
            <p className="jc-desc">{auto.description}</p>
            {auto.description && (
              <button className="jc-view-details" onClick={() => onViewDetails(auto)}>
                View Details <i className="bi bi-arrow-right-short" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── METRICS CHIPS ── */}
      <div className="jc-metrics">
        <div className="jc-metric-chip" title="Owner"><i className="bi bi-person-fill" /> {auto.triggeredBy || 'System'}</div>
        <div className="jc-metric-chip" title="Duration"><i className="bi bi-stopwatch" /> {auto.duration && auto.duration !== '—' && auto.duration !== 'Running…' ? auto.duration : '2m 14s'}</div>
        <div className="jc-metric-chip" title="Last Run"><i className="bi bi-clock-history" /> {auto.lastRun || 'Never'}</div>
        <div className="jc-metric-chip" title="Next Run"><i className="bi bi-calendar2-check" /> {auto.nextRun || '—'}</div>
      </div>

      {/* ── PROGRESS (Running only) ── */}
      {isRunning && auto.progress !== undefined && (
        <div className="jc-progress-area">
          <div className="jc-prog-top">
            <span>{auto.progress}% Complete</span>
            <span className="jc-prog-eta">Estimated {etaMins}m remaining</span>
          </div>
          <div className="jc-progress-track">
            <div className="jc-progress-fill" style={{ width: `${auto.progress}%` }} />
          </div>
        </div>
      )}

      {/* ── ACTION BAR ── */}
      <div className="jc-actions">
        <button
          className={`jc-ghost-btn jc-run-btn ${isRunning ? 'jc-run-active' : ''}`}
          onClick={() => !isRunning && onRunNow(auto.id)}
          disabled={isRunning}
        >
          {isRunning ? <><i className="bi bi-arrow-repeat jc-spin" /> Running…</> : <><i className="bi bi-play-fill" /> Run</>}
        </button>

        <button className="jc-ghost-btn" onClick={() => onViewLogs(auto)}>
          <i className="bi bi-file-earmark-text" /> Logs
        </button>
        <button className="jc-ghost-btn" onClick={() => onEdit(auto)}>
          <i className="bi bi-pencil" /> Edit
        </button>

        <div style={{ marginLeft: 'auto' }}>
          <MoreMenu auto={auto} onPause={() => onPause(auto.id)} onDelete={() => onDelete(auto.id)} addToast={addToast} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   AUTOMATIONS PAGE
═══════════════════════════════════ */
export default function AutomationsPage({ automations, setAutomations, addToast, searchQuery }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy,       setSortBy]       = useState('Last Run');
  const [localSearch,  setLocalSearch]  = useState(searchQuery || '');
  const [logModal,     setLogModal]     = useState(null);
  const [editModal,    setEditModal]    = useState(null);
  const [newModal,     setNewModal]     = useState(false);
  const [drawerAuto,   setDrawerAuto]   = useState(null);
  const [loading,      setLoading]      = useState(true);

  /* Simulate brief skeleton on first render */
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const filtered = automations
    .filter(a => {
      const q = localSearch.toLowerCase();
      if (q && !a.name.toLowerCase().includes(q) && !(a.description || '').toLowerCase().includes(q)) return false;
      if (statusFilter !== 'All' && a.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Name')   return a.name.localeCompare(b.name);
      if (sortBy === 'Status') return a.status.localeCompare(b.status);
      return 0;
    });

  const handleSaveNew = form => {
    const fresh = {
      id: Date.now(), ...form,
      status: 'Scheduled', lastRun: null, progress: 0,
      triggeredBy: 'Manual', nextRun: 'Tomorrow',
    };
    setAutomations(p => [fresh, ...p]);
    setNewModal(false);
    addToast?.(`"${form.name}" created ✓`);
  };

  const handleSaveEdit = form => {
    setAutomations(p => p.map(a => a.id === editModal.id ? { ...a, ...form } : a));
    setEditModal(null);
    addToast?.('Automation updated ✓');
  };

  const handleRunNow = id => {
    setAutomations(p => p.map(a => a.id === id ? { ...a, status: 'Running', progress: 0 } : a));
    addToast?.('Automation started ✓');
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 16 + 4;
      if (prog >= 100) {
        clearInterval(iv);
        setAutomations(p => p.map(a => a.id === id ? { ...a, status: 'Completed', progress: 100, lastRun: new Date().toLocaleString() } : a));
        addToast?.('Automation completed ✓');
      } else {
        setAutomations(p => p.map(a => a.id === id ? { ...a, progress: Math.round(prog) } : a));
      }
    }, 370);
  };

  const handlePause = id => {
    setAutomations(p => p.map(a => {
      if (a.id !== id) return a;
      const next = a.status === 'Paused' ? 'Scheduled' : 'Paused';
      addToast?.(`"${a.name}" ${next === 'Paused' ? 'paused' : 'resumed'} ✓`);
      return { ...a, status: next };
    }));
  };

  const handleDelete = id => {
    const name = automations.find(a => a.id === id)?.name;
    setAutomations(p => p.filter(a => a.id !== id));
    addToast?.(`"${name}" deleted`, 'warning');
  };

  /* Count by status */
  const counts = automations.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  return (
    <div className="af-page-fade">
      {/* Page header */}
      <div className="pg-header">
        <div>
          <h1 className="pg-title">Automations</h1>
          <p className="pg-sub">Manage, trigger, and monitor your automation workflows</p>
        </div>
        <button className="af-btn-primary" onClick={() => setNewModal(true)}>
          <i className="bi bi-plus-lg" /> New Automation
        </button>
      </div>

      {/* Quick status chips */}
      <div className="jc-status-strip">
        {['All', 'Running', 'Scheduled', 'Completed', 'Failed'].map(s => {
          const cfg = JOB_STATUS[s];
          const cnt = s === 'All' ? automations.length : counts[s] || 0;
          return (
            <button
              key={s}
              className={`jc-strip-chip${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s !== 'All' && <span className={`jc-dot ${cfg?.cls}`} style={{ width: 6, height: 6 }} />}
              {s}
              <span className="jc-strip-cnt">{cnt}</span>
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        {/* Search + Sort inline */}
        <div className="af-search-wrap">
          <i className="bi bi-search af-search-icon" />
          <input className="af-search" style={{ width: 200 }} placeholder="Search automations…"
            value={localSearch} onChange={e => setLocalSearch(e.target.value)} />
        </div>
        <select className="af-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          {['Last Run','Name','Status'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Result count */}
      {!loading && (
        <div className="auto-count">
          Showing <strong>{filtered.length}</strong> of <strong>{automations.length}</strong> automations
        </div>
      )}

      {/* Cards grid */}
      <div className="af-cards-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
            ? (
              <div className="jc-empty">
                <div className="jc-empty-icon">
                  <i className="bi bi-lightning-charge" />
                </div>
                <h3>No automations found</h3>
                <p>Try adjusting your search or filter, or create a new automation.</p>
                <button className="af-btn-primary" style={{ marginTop: 8 }} onClick={() => setNewModal(true)}>
                  <i className="bi bi-plus-lg" /> New Automation
                </button>
              </div>
            )
            : filtered.map(a => (
              <AutomationCard
                key={a.id}
                auto={a}
                onRunNow={handleRunNow}
                onViewLogs={a => setLogModal(a)}
                onEdit={a => setEditModal(a)}
                onPause={handlePause}
                onDelete={handleDelete}
                addToast={addToast}
                onViewDetails={a => setDrawerAuto(a)}
              />
            ))
        }
      </div>

      {/* Modals & Drawers */}
      {drawerAuto && <DrawerPanel auto={drawerAuto} onClose={() => setDrawerAuto(null)} />}
      {logModal && <LogsModal auto={logModal} onClose={() => setLogModal(null)} />}
      {newModal  && <AutomationModal onClose={() => setNewModal(false)} onSave={handleSaveNew} />}
      {editModal && <AutomationModal auto={editModal} onClose={() => setEditModal(null)} onSave={handleSaveEdit} />}
    </div>
  );
}
