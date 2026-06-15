import React, { useState, useMemo } from 'react';
import { activityLog, fakeLogs, STATUS_META } from '../data/automations';

const PER_PAGE = 8;

const logsData = activityLog.map((e, i) => ({
  ...e,
  idx: i + 1,
  timestamp: e.timestamp || e.time || '—',
  duration: e.duration || `${Math.floor(Math.random() * 120 + 5)}s`,
  exit: e.status === 'Failed' ? 1 : e.status === 'Running' ? null : 0,
}));

/* ─── Inline Terminal Row ─── */
function TerminalRow({ logEntry }) {
  const lines = fakeLogs[logEntry.automationId] || [
    { type: 'info',    msg: '[2026-06-15 08:00:01] Starting automation run...' },
    { type: 'success', msg: '[2026-06-15 08:00:02] Connecting to services...'  },
    { type: 'success', msg: '[2026-06-15 08:00:04] Process completed.'          },
  ];
  return (
    <tr className="logs-expanded-row">
      <td className="logs-expanded-cell" colSpan={8}>
        <div className="logs-mini-terminal">
          {lines.map((l, i) => (
            <div key={i} className={`af-log-line af-log-${l.type}`}>
              <span className="af-line-num">{i + 1}</span>
              <span>{l.msg}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}

export default function LogsPage({ addToast }) {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom]       = useState('');
  const [dateTo, setDateTo]           = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage]               = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filtered = useMemo(() => {
    return logsData.filter(e => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'All' && e.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleExport = () => {
    const rows = [['#','Name','Status','Triggered By','Time','Duration','Exit Code']];
    filtered.forEach(e => rows.push([e.idx, e.name, e.status, e.triggeredBy, e.timestamp, e.duration, e.exit ?? '—']));
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'autoflow_logs.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast && addToast('Logs exported as CSV ✓');
  };

  return (
    <div className="af-page-fade">
      <div className="pg-header">
        <div>
          <h1 className="pg-title">Activity Logs</h1>
          <p className="pg-sub">Full history of all automation runs</p>
        </div>
        <button className="af-btn-secondary" style={{ marginLeft: 0 }} onClick={handleExport}>
          <i className="bi bi-download" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="logs-filters">
        <div className="af-search-wrap" style={{ flex: 1, minWidth: 160 }}>
          <i className="bi bi-search af-search-icon" />
          <input className="af-search" style={{ width: '100%' }} placeholder="Search by name…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="af-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          {['All','Scheduled','Running','Completed','Failed'].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="logs-date-range">
          <label className="bi bi-calendar3" />
          <input type="date" className="af-input logs-date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="logs-date-sep">→</span>
          <input type="date" className="af-input logs-date-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="af-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0
          ? (
            <div className="logs-empty">
              <i className="bi bi-terminal logs-empty-icon" />
              <h3>No logs found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="logs-table-wrap">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th style={{ width: 48 }}>#</th>
                    <th>Automation</th>
                    <th>Status</th>
                    <th>Triggered By</th>
                    <th>Timestamp</th>
                    <th>Duration</th>
                    <th style={{ width: 72 }}>Exit</th>
                    <th style={{ width: 36 }} />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((e, ri) => {
                    const meta = STATUS_META[e.status] || STATUS_META.Scheduled;
                    const isExpanded = expandedRow === e.idx;
                    return (
                      <React.Fragment key={e.idx}>
                        <tr
                          className={`logs-row${isExpanded ? ' logs-row-active' : ''}${ri % 2 === 0 ? ' logs-row-even' : ' logs-row-odd'}`}
                          onClick={() => setExpandedRow(isExpanded ? null : e.idx)}
                        >
                          <td><span className="logs-idx">{e.idx}</span></td>
                          <td>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <i className="bi bi-lightning-charge" style={{ color: 'var(--accent)', fontSize: 13 }} />
                              <span className="logs-name">{e.name}</span>
                            </span>
                          </td>
                          <td>
                            <span className="af-status-badge af-status-sm" style={{ background: meta.bg, color: meta.color }}>
                              <span className={`af-pulse-dot${e.status === 'Running' ? ' running' : ''}`} style={{ background: meta.color }} />
                              {e.status}
                            </span>
                          </td>
                          <td><span className="logs-by">{e.triggeredBy}</span></td>
                          <td><span className="logs-time">{e.timestamp}</span></td>
                          <td>
                            <span className="logs-dur" style={{
                              color: parseInt(e.duration) < 30 ? 'var(--green)' :
                                     parseInt(e.duration) > 90 ? 'var(--amber)' : 'var(--text-muted)'
                            }}>
                              {e.duration}
                            </span>
                          </td>
                          <td>
                            {e.exit === null
                              ? <span className="logs-exit logs-exit-null">—</span>
                              : <span className={`logs-exit ${e.exit === 0 ? 'logs-exit-ok' : 'logs-exit-err'}`}>
                                  {e.exit}
                                </span>
                            }
                          </td>
                          <td>
                            <i className={`bi bi-chevron-down logs-chevron${isExpanded ? ' logs-row-active' : ''}`}
                               style={{ transform: isExpanded ? 'rotate(180deg)' : '' }} />
                          </td>
                        </tr>
                        {isExpanded && <TerminalRow logEntry={e} />}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }

        {/* Pagination */}
        {filtered.length > PER_PAGE && (
          <div className="logs-pagination" style={{ padding: '16px 22px', borderTop: '1px solid var(--border)' }}>
            <div className="logs-pag-info">
              Showing <strong>{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong>
            </div>
            <div className="logs-pag-btns">
              <button className="logs-pag-btn" disabled={page===1} onClick={() => setPage(p => p-1)}>
                <i className="bi bi-chevron-left" /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i+1)
                .filter(p => Math.abs(p - page) <= 2)
                .map(p => (
                  <button key={p} className={`logs-pag-btn logs-pag-num${p===page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))
              }
              <button className="logs-pag-btn" disabled={page===totalPages} onClick={() => setPage(p => p+1)}>
                Next <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
