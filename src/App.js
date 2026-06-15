import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import './components/cards.css';

import automationsData from './data/automations';
import DashboardPage   from './pages/DashboardPage';
import AutomationsPage from './pages/AutomationsPage';
import LogsPage        from './pages/LogsPage';
import SchedulePage    from './pages/SchedulePage';
import SettingsPage    from './pages/SettingsPage';

/* ═══════════════════════
   TOAST SYSTEM (premium)
═══════════════════════ */
function ToastItem({ toast, onClose }) {
  return (
    <div className={`af-toast af-toast-${toast.type}`} role="alert">
      <div className="af-toast-inner">
        <i className={`bi af-toast-icon ${
          toast.type === 'success' ? 'bi-check-circle-fill' :
          toast.type === 'error'   ? 'bi-x-circle-fill'    :
          toast.type === 'warning' ? 'bi-exclamation-triangle-fill' :
          'bi-info-circle-fill'
        }`} />
        <span className="af-toast-msg">{toast.msg}</span>
        <button className="af-toast-close" onClick={() => onClose(toast.id)}>
          <i className="bi bi-x-lg" />
        </button>
      </div>
      <div className="af-toast-progress" />
    </div>
  );
}

function Toast({ toasts, onClose }) {
  return (
    <div className="af-toast-container">
      {toasts.map(t => <ToastItem key={t.id} toast={t} onClose={onClose} />)}
    </div>
  );
}

/* ═══════════════════════
   SIDEBAR
═══════════════════════ */
const NAV_ITEMS = [
  { key: 'automations', icon: 'bi-lightning-charge', label: 'Automations', group: 'main' },
  { key: 'dashboard',   icon: 'bi-grid-1x2',         label: 'Dashboard',   group: 'main' },
  { key: 'logs',        icon: 'bi-terminal',          label: 'Logs',        group: 'system' },
  { key: 'schedule',    icon: 'bi-calendar3',         label: 'Schedule',    group: 'system' },
  { key: 'settings',    icon: 'bi-gear',              label: 'Settings',    group: 'system' },
];

function Sidebar({ activePage, setActivePage, open, setOpen, automations }) {
  const mainItems   = NAV_ITEMS.filter(n => n.group === 'main');
  const systemItems = NAV_ITEMS.filter(n => n.group === 'system');
  const failedCount = automations.filter(a => a.status === 'Failed').length;

  return (
    <>
      {open && <div className="af-sidebar-overlay" onClick={() => setOpen(false)} />}
      <aside className={`af-sidebar${open ? ' af-sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="af-sidebar-logo">
          <span className="af-logo-icon"><i className="bi bi-lightning-charge-fill" /></span>
          <span className="af-logo-text">AutoFlow</span>
          <button className="af-sidebar-close" onClick={() => setOpen(false)} aria-label="Close sidebar">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Nav */}
        <div className="af-sidebar-nav">
          <div className="af-nav-section">
            <span className="af-nav-section-label">Main</span>
          </div>
          {mainItems.map(n => (
            <button
              key={n.key}
              className={`af-nav-item${activePage === n.key ? ' active' : ''}`}
              onClick={() => { setActivePage(n.key); setOpen(false); }}
            >
              <i className={`bi ${n.icon}`} />
              <span>{n.label}</span>
              {n.key === 'automations' && (
                <span className="af-nav-badge">{automations.length}</span>
              )}
            </button>
          ))}

          <div className="af-nav-section" style={{ marginTop: 8 }}>
            <span className="af-nav-section-label">System</span>
          </div>
          {systemItems.map(n => (
            <button
              key={n.key}
              className={`af-nav-item${activePage === n.key ? ' active' : ''}`}
              onClick={() => { setActivePage(n.key); setOpen(false); }}
            >
              <i className={`bi ${n.icon}`} />
              <span>{n.label}</span>
              {n.key === 'logs' && failedCount > 0 && (
                <span className="af-nav-badge" style={{ background: 'var(--red-soft)', color: 'var(--red)' }}>
                  {failedCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* User card */}
        <div className="af-sidebar-footer">
          <div className="af-user-avatar">BK</div>
          <div>
            <div className="af-user-name">BK Developer</div>
            <div className="af-user-role">Administrator</div>
          </div>
          <button className="af-user-menu" aria-label="User menu">
            <i className="bi bi-three-dots-vertical" />
          </button>
        </div>
      </aside>
    </>
  );
}

/* ═══════════════════════
   TOPBAR
═══════════════════════ */
const BREADCRUMBS = {
  dashboard:   'Dashboard',
  automations: 'Automations',
  logs:        'Logs',
  schedule:    'Schedule',
  settings:    'Settings',
};

function Topbar({ dark, setDark, searchQuery, setSearchQuery, activePage, onHamburger }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="af-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="af-hamburger" onClick={onHamburger} aria-label="Toggle sidebar">
          <i className="bi bi-list" />
        </button>
        <div className="af-breadcrumb">
          <span className="af-breadcrumb-root">
            <i className="bi bi-house" /> Home
          </span>
          <i className="bi bi-chevron-right af-breadcrumb-sep" />
          <span className="af-breadcrumb-current">{BREADCRUMBS[activePage]}</span>
        </div>
      </div>

      <div className="af-topbar-right">
        <div className="af-search-wrap">
          <i className="bi bi-search af-search-icon" />
          <input
            className="af-search"
            placeholder="Search automations…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
        </div>

        <div className="af-icon-btn-wrap" ref={notifRef}>
          <button className="af-icon-btn" onClick={() => setNotifOpen(o => !o)} aria-label="Notifications">
            <i className="bi bi-bell" />
            <span className="af-notif-badge">3</span>
          </button>
          {notifOpen && (
            <div className="af-notif-dropdown">
              <div className="af-notif-header">Notifications</div>
              {[
                { icon: 'bi-x-circle-fill',    color: 'var(--red)',   msg: 'Generate Reports failed',  time: '8m ago' },
                { icon: 'bi-check-circle-fill', color: 'var(--green)', msg: 'Email Digest completed',   time: '1h ago' },
                { icon: 'bi-arrow-repeat',      color: 'var(--amber)', msg: 'Sync CRM is running…',     time: '2h ago' },
              ].map((n, i) => (
                <div key={i} className="af-notif-item">
                  <i className={`bi ${n.icon}`} style={{ color: n.color }} />
                  <div>
                    <div className="af-notif-msg">{n.msg}</div>
                    <div className="af-notif-time">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="af-icon-btn"
          onClick={() => setDark(d => !d)}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          <i className={`bi ${dark ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}
             style={{ fontSize: 15, transition: 'all 0.2s', color: dark ? '#fbbf24' : '#7c5cff' }} />
        </button>
      </div>
    </header>
  );
}

/* ═══════════════════════
   APP
═══════════════════════ */
export default function App() {
  const [dark, setDark]               = useState(true);
  const [activePage, setActivePage]   = useState('automations');
  const [automations, setAutomations] = useState(automationsData);
  const [toasts, setToasts]           = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const removeToast = id => setToasts(t => t.filter(x => x.id !== id));

  const handleRunNow = id => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: 'Running', progress: 0 } : a));
    addToast('Automation started successfully ✓');
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 15 + 5;
      if (prog >= 100) {
        clearInterval(iv);
        setAutomations(prev => prev.map(a =>
          a.id === id ? { ...a, status: 'Completed', progress: 100, lastRun: new Date().toLocaleString() } : a
        ));
      } else {
        setAutomations(prev => prev.map(a => a.id === id ? { ...a, progress: Math.round(prog) } : a));
      }
    }, 380);
  };

  const renderPage = () => {
    const props = { addToast };
    switch (activePage) {
      case 'dashboard':   return <DashboardPage allAutomations={automations} onRunNow={handleRunNow} {...props} />;
      case 'automations': return <AutomationsPage automations={automations} setAutomations={setAutomations} searchQuery={searchQuery} {...props} />;
      case 'logs':        return <LogsPage {...props} />;
      case 'schedule':    return <SchedulePage {...props} />;
      case 'settings':    return <SettingsPage dark={dark} setDark={setDark} {...props} />;
      default:            return <AutomationsPage automations={automations} setAutomations={setAutomations} {...props} />;
    }
  };

  return (
    <div className={`af-root${dark ? ' dark' : ''}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        automations={automations}
      />
      <div className="af-main">
        <Topbar
          dark={dark} setDark={setDark}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          activePage={activePage}
          onHamburger={() => setSidebarOpen(o => !o)}
        />
        <div className="af-content">
          <div key={activePage}>{renderPage()}</div>
        </div>
      </div>
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}