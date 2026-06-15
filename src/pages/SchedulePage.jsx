import React, { useState } from 'react';
import { weeklySchedule, upcomingRuns, STATUS_META } from '../data/automations';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const AUTOMATION_NAMES = [
  'Backup Database', 'Email Digest', 'Generate Reports',
  'Sync CRM', 'Good Morning Message', 'Clean Temp Files',
];

/* Per-automation fixed colors */
const CHIP_STYLES = {
  'Backup Database':     { bg: 'var(--blue-soft)',   text: 'var(--blue)',   border: 'var(--blue)'   },
  'Email Digest':        { bg: 'var(--green-soft)',  text: 'var(--green)',  border: 'var(--green)'  },
  'Sync CRM':            { bg: 'var(--amber-soft)',  text: 'var(--amber)',  border: 'var(--amber)'  },
  'Generate Reports':    { bg: 'var(--purple-soft)', text: 'var(--purple)', border: 'var(--purple)' },
  'Good Morning Message':{ bg: 'var(--teal-soft)',   text: 'var(--teal)',   border: 'var(--teal)'   },
  'Clean Temp Files':    { bg: 'var(--bg-secondary)',text: 'var(--text-secondary)', border: 'var(--text-muted)' },
};

function buildCron(days, time) {
  const [h, m] = (time || '08:00').split(':');
  const nums = days.map(d => DAYS.indexOf(d) + 1).join(',');
  return `${m || '0'} ${h || '8'} * * ${nums || '*'}`;
}

/* ─── Chip with Popover ─── */
function ScheduleChip({ chip }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(chip.active);
  const style = CHIP_STYLES[chip.name] || { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)', border: 'var(--text-muted)' };

  return (
    <div className="sched-chip-wrap">
      <button
        className="sched-chip"
        style={{ background: style.bg, color: style.text, borderLeftColor: style.border }}
        onClick={() => setOpen(o => !o)}
      >
        {chip.name}
      </button>
      {open && (
        <div className="sched-tooltip" onClick={e => e.stopPropagation()}>
          <div className="sched-tt-header" style={{ color: style.text }}>{chip.name}</div>
          <div className="sched-tt-row"><i className="bi bi-terminal" style={{ color: 'var(--accent)' }} /><code>{chip.cron}</code></div>
          <div className="sched-tt-row"><i className="bi bi-clock-history" /> {chip.lastRun}</div>
          <div className="sched-tt-row"><i className="bi bi-calendar-check" /> {chip.nextRun}</div>
          <div className="sched-tt-toggle">
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active</span>
            <label className="af-toggle">
              <input type="checkbox" checked={active} onChange={() => setActive(a => !a)} />
              <span className="af-toggle-slider" />
            </label>
            <span className="af-toggle-label" style={{ color: active ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
              {active ? 'On' : 'Off'}
            </span>
          </div>
          <button className="sched-tt-close" onClick={() => setOpen(false)}><i className="bi bi-x-lg" /></button>
        </div>
      )}
    </div>
  );
}

/* ─── Add Schedule Modal ─── */
function AddScheduleModal({ show, onClose, onSave }) {
  const [form, setForm] = useState({ automation: AUTOMATION_NAMES[0], days: ['Mon'], time: '08:00' });
  if (!show) return null;
  const toggle = d => setForm(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d] }));
  const cron = buildCron(form.days, form.time);

  return (
    <div className="af-modal-overlay" onClick={onClose}>
      <div className="af-modal" onClick={e => e.stopPropagation()}>
        <div className="af-modal-header">
          <span><i className="bi bi-calendar-plus" /> Add Schedule</span>
          <button className="af-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="af-modal-body">
          <div className="af-form-group">
            <label>Automation</label>
            <select className="af-input af-select-input" value={form.automation}
              onChange={e => setForm(f => ({ ...f, automation: e.target.value }))}>
              {AUTOMATION_NAMES.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div className="af-form-group">
            <label>Days of Week</label>
            <div className="sched-days-row">
              {DAYS.map(d => (
                <button key={d} type="button" className={`sched-day-btn${form.days.includes(d) ? ' active' : ''}`}
                  onClick={() => toggle(d)}>{d}</button>
              ))}
            </div>
          </div>
          <div className="af-form-group">
            <label>Time</label>
            <input type="time" className="af-input" value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
          <div className="sched-cron-preview">
            <span className="sched-cron-label"><i className="bi bi-terminal" /> Cron Preview</span>
            <code className="sched-cron-val">{cron}</code>
          </div>
          <div className="af-modal-footer">
            <button className="af-btn-secondary" style={{ marginLeft: 0 }} onClick={onClose}>Cancel</button>
            <button className="af-btn-primary" onClick={() => onSave(form)}>
              <i className="bi bi-check-lg" /> Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SchedulePage({ addToast }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="af-page-fade">
      <div className="pg-header">
        <div>
          <h1 className="pg-title">Schedule</h1>
          <p className="pg-sub">Visual weekly automation planner</p>
        </div>
        <button className="af-btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg" /> Add Schedule
        </button>
      </div>

      {/* Weekly Grid */}
      <div className="af-card sched-grid-card" style={{ overflow: 'hidden' }}>
        <div className="sched-grid" style={{ borderRadius: 'var(--radius)' }}>
          {DAYS.map(day => (
            <div key={day} className="sched-col">
              <div className="sched-col-header">{day}</div>
              <div className="sched-col-body">
                {(weeklySchedule[day] || []).length === 0
                  ? <span className="sched-empty-day">—</span>
                  : (weeklySchedule[day] || []).map((chip, i) => <ScheduleChip key={i} chip={chip} />)
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sched-legend">
        <i className="bi bi-info-circle" />
        <span>Click any chip to view cron details and toggle active state</span>
      </div>

      {/* Upcoming Runs */}
      <div className="af-card">
        <div className="dash-section-header">
          <span><i className="bi bi-clock-history" style={{ color: 'var(--accent)', marginRight: 7 }} />Upcoming Runs</span>
          <span className="dash-section-sub">Next 5 scheduled</span>
        </div>
        <div className="sched-upcoming">
          {upcomingRuns.map((run, i) => (
            <div key={i} className="sched-upcoming-item">
              <div className="sched-upcoming-idx">{i + 1}</div>
              <div className="sched-upcoming-dot" style={{ background: run.color }} />
              <div className="sched-upcoming-info">
                <span className="sched-upcoming-name">{run.name}</span>
                <span className="sched-upcoming-when">
                  <i className="bi bi-calendar3" /> {run.day} at {run.time}
                </span>
              </div>
              <span className="af-status-badge af-status-sm"
                style={{ background: STATUS_META.Scheduled.bg, color: STATUS_META.Scheduled.color }}>
                <span className="af-pulse-dot" style={{ background: STATUS_META.Scheduled.color }} />
                Scheduled
              </span>
            </div>
          ))}
        </div>
      </div>

      <AddScheduleModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={form => { setShowModal(false); addToast && addToast(`Schedule for "${form.automation}" saved ✓`); }}
      />
    </div>
  );
}
