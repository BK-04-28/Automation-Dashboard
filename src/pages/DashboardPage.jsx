import React, { useState, useEffect } from 'react';
import automationsData, { activityLog, weeklyChartData, STATUS_META } from '../data/automations';

function useCountUp(target, duration = 1000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let s = null;
    const step = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

/* ─── Stat Card ─── */
function StatCard({ label, value, icon, color, colorSoft, trend, trendUp }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 120); return () => clearTimeout(t); }, []);
  const count = useCountUp(value, 900, ready);

  return (
    <div className="af-stat-card">
      <div className="af-stat-top">
        <div className="af-stat-icon" style={{ background: colorSoft, color }}>
          <i className={`bi ${icon}`} />
        </div>
      </div>
      <div className="af-stat-body">
        <div className="af-stat-value">{count}</div>
        <div className="af-stat-label">{label}</div>
      </div>
      <div className={`af-stat-trend ${trendUp ? 'up' : 'down'}`}>
        <i className={`bi ${trendUp ? 'bi-arrow-up-right' : 'bi-arrow-down-right'}`} />
        {trend}
      </div>
    </div>
  );
}

/* ─── Bar Chart ─── */
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.runs));
  const yLabels = [max, Math.round(max * 0.67), Math.round(max * 0.33), 0];

  return (
    <div className="dash-bar-chart">
      <div className="dash-y-axis">
        {yLabels.map((v, i) => (
          <span key={i} className="dash-y-label">{v}</span>
        ))}
      </div>
      <div className="dash-chart-area">
        <div className="dash-y-lines">
          {yLabels.map((_, i) => <div key={i} className="dash-y-line" />)}
        </div>
        <div className="dash-bars">
          {data.map((d, i) => (
            <div key={i} className="dash-bar-col">
              <div className="dash-bar-wrap">
                <div
                  className="dash-bar-fill"
                  style={{
                    '--bar-h': `${(d.runs / max) * 100}%`,
                    '--bar-delay': `${i * 55}ms`,
                  }}
                >
                  <div className="dash-bar-tooltip">{d.runs} runs</div>
                </div>
              </div>
              <div className="dash-bar-label">{d.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard Page ─── */
export default function DashboardPage({ allAutomations, onRunNow, addToast }) {
  const data = allAutomations || automationsData;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const stats = [
    { label: 'Total Automations', value: data.length,                                         icon: 'bi-lightning-charge', color: 'var(--accent)', colorSoft: 'var(--accent-soft)', trend: '+2 this week',     trendUp: true  },
    { label: 'Running Now',       value: data.filter(a => a.status === 'Running').length,      icon: 'bi-arrow-repeat',     color: 'var(--amber)',  colorSoft: 'var(--amber-soft)',  trend: 'live now',         trendUp: true  },
    { label: 'Completed Today',   value: data.filter(a => a.status === 'Completed').length,    icon: 'bi-check-circle',     color: 'var(--green)',  colorSoft: 'var(--green-soft)',  trend: '+12% vs avg',      trendUp: true  },
    { label: 'Failed',            value: data.filter(a => a.status === 'Failed').length,       icon: 'bi-x-circle',         color: 'var(--red)',    colorSoft: 'var(--red-soft)',    trend: '-1 vs yesterday',  trendUp: false },
  ];

  const quickRun = data.slice(0, 3);

  return (
    <div className="af-page-fade">
      {/* Hero Banner */}
      <div className="dash-welcome">
        <div className="dash-welcome-text">
          <h1>{greeting}, BK Developer 👋</h1>
          <p className="dash-welcome-sub">Here's your automation overview for today</p>
          <div className="dash-date-pill">
            <i className="bi bi-calendar3" /> {today}
          </div>
        </div>
        <div className="dash-welcome-badge">
          All systems operational
        </div>
      </div>

      {/* Stat Cards */}
      <div className="af-stat-grid">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="dash-two-col">
        {/* Weekly Run Chart */}
        <div className="af-card">
          <div className="dash-section-header">
            <span><i className="bi bi-bar-chart" style={{ color: 'var(--accent)', marginRight: 7 }} />Weekly Runs</span>
            <span className="dash-section-sub">Last 7 days</span>
          </div>
          <BarChart data={weeklyChartData} />
        </div>

        {/* Recent Activity */}
        <div className="af-card" style={{ padding: '24px 0' }}>
          <div className="dash-section-header" style={{ padding: '0 24px 14px', borderBottom: '1px solid var(--border)' }}>
            <span><i className="bi bi-activity" style={{ color: 'var(--accent)', marginRight: 7 }} />Recent Activity</span>
            <span className="dash-section-sub">Last 5 runs</span>
          </div>
          <div className="dash-feed">
            {activityLog.slice(0, 5).map(entry => {
              const meta = STATUS_META[entry.status];
              return (
                <div key={entry.id} className="dash-feed-item">
                  <span className="dash-feed-dot" style={{ background: meta.color }} />
                  <div className="dash-feed-info">
                    <span className="dash-feed-name">{entry.name}</span>
                    <span className="dash-feed-meta">{entry.triggeredBy} · {entry.ago}</span>
                  </div>
                  <span className="af-status-badge af-status-sm" style={{ background: meta.bg, color: meta.color }}>
                    <span className="af-pulse-dot" style={{ background: meta.color }} />
                    {entry.status}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="dash-feed-link">
            <span>View all logs</span> <i className="bi bi-arrow-right" style={{ fontSize: 12 }} />
          </div>
        </div>
      </div>

      <div className="dash-two-col">
        {/* Quick Run */}
        <div className="af-card">
          <div className="dash-section-header">
            <span><i className="bi bi-play-circle" style={{ color: 'var(--green)', marginRight: 7 }} />Quick Run</span>
            <span className="dash-section-sub">Trigger instantly</span>
          </div>
          <div className="dash-quick-run">
            {quickRun.map(a => (
              <button key={a.id} className="dash-quick-btn"
                onClick={() => { onRunNow(a.id); addToast(`"${a.name}" triggered ✓`); }}>
                <i className="bi bi-play-fill dash-qbtn-icon" />
                <div>
                  <div className="dash-qbtn-name">{a.name}</div>
                  <div className="dash-qbtn-sub">{a.category}</div>
                </div>
                <i className="bi bi-chevron-right ms-auto" style={{ opacity: 0.3, fontSize: 12 }} />
              </button>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="af-card">
          <div className="dash-section-header">
            <span><i className="bi bi-heart-pulse" style={{ color: 'var(--red)', marginRight: 7 }} />System Health</span>
            <span className="dash-health-ok"><i className="bi bi-circle-fill" style={{ fontSize: 7 }} /> Healthy</span>
          </div>
          <div className="dash-health-grid">
            {[
              { label: 'CPU Usage',   value: '72%',       pct: 72,  color: 'var(--amber)',  icon: 'bi-cpu',         colorSoft: 'var(--amber-soft)'  },
              { label: 'Memory',      value: '4.2 / 8 GB', pct: 52, color: 'var(--blue)',   icon: 'bi-memory',      colorSoft: 'var(--blue-soft)'   },
              { label: 'Last Backup', value: '2h ago',     pct: null,color: 'var(--green)',  icon: 'bi-cloud-check', colorSoft: 'var(--green-soft)'  },
            ].map((h, i) => (
              <div key={i} className="dash-health-card">
                <div className="dash-health-icon" style={{ background: h.colorSoft, color: h.color }}>
                  <i className={`bi ${h.icon}`} />
                </div>
                <div className="dash-health-body">
                  <div className="dash-health-label">{h.label}</div>
                  <div className="dash-health-val">{h.value}</div>
                  {h.pct !== null && (
                    <div className="dash-health-bar">
                      <div className="dash-health-bar-fill" style={{ width: `${h.pct}%`, background: h.color }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
