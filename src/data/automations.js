/* ═══════════════════════════
   AutoFlow — Shared Data Store
═══════════════════════════ */

export const STATUS_META = {
  Scheduled: { color: 'var(--blue)',   bg: 'var(--blue-soft)',   icon: 'bi-calendar-check', label: 'Scheduled' },
  Running:   { color: 'var(--amber)',  bg: 'var(--amber-soft)',  icon: 'bi-arrow-repeat',   label: 'Running'   },
  Completed: { color: 'var(--green)',  bg: 'var(--green-soft)',  icon: 'bi-check-circle',   label: 'Completed' },
  Failed:    { color: 'var(--red)',    bg: 'var(--red-soft)',    icon: 'bi-x-circle',       label: 'Failed'    },
};

export const CATEGORY_COLORS = {
  Storage:       { bg: 'var(--purple-soft)', text: 'var(--purple)' },
  Communication: { bg: 'var(--teal-soft)',   text: 'var(--teal)'   },
  Analytics:     { bg: 'var(--amber-soft)',  text: 'var(--amber)'  },
  Integration:   { bg: 'var(--blue-soft)',   text: 'var(--blue)'   },
  Maintenance:   { bg: 'var(--green-soft)',  text: 'var(--green)'  },
  Default:       { bg: 'var(--bg-secondary)',text: 'var(--text-secondary)' },
};

/* ─── Automations ─── */
const automations = [
  {
    id: 1,
    name: 'Backup Database',
    description: 'Automated nightly backup of all user data, schemas, and configurations to secure cloud storage with versioning.',
    status: 'Scheduled',
    lastRun: '2025-06-11 02:00 PM',
    triggeredBy: 'System',
    nextRun: '2025-06-14 02:00 AM',
    progress: 0,
    duration: '4m 32s',
    category: 'Storage',
  },
  {
    id: 2,
    name: 'Email Digest',
    description: 'Compiles and sends a daily summary email digest to all subscribers with activity reports and key metrics.',
    status: 'Completed',
    lastRun: '2025-06-12 09:00 AM',
    triggeredBy: 'Scheduler',
    nextRun: '2025-06-13 09:00 AM',
    progress: 100,
    duration: '1m 08s',
    category: 'Communication',
  },
  {
    id: 3,
    name: 'Generate Reports',
    description: 'Creates comprehensive usage, performance and analytics reports for internal stakeholders and executive team.',
    status: 'Failed',
    lastRun: '2025-06-12 08:00 AM',
    triggeredBy: 'Admin',
    nextRun: 'Retry pending',
    progress: 0,
    duration: '—',
    category: 'Analytics',
  },
  {
    id: 4,
    name: 'Sync CRM',
    description: 'Bidirectional synchronisation with the external CRM platform, updating contacts, deals and activity logs.',
    status: 'Running',
    lastRun: '2025-06-12 07:00 AM',
    triggeredBy: 'System',
    nextRun: 'In progress',
    progress: 65,
    duration: 'Running…',
    category: 'Integration',
  },
  {
    id: 5,
    name: 'Good Morning Message',
    description: 'Sends a personalised good morning message to all team members every weekday at 8 AM to boost morale.',
    status: 'Scheduled',
    lastRun: 'Not run yet',
    triggeredBy: 'Scheduler',
    nextRun: '2025-06-13 08:00 AM',
    progress: 0,
    duration: '—',
    category: 'Communication',
  },
  {
    id: 6,
    name: 'Clean Temp Files',
    description: 'Scans and purges temporary files, cached data, and orphaned upload artefacts to free up disk space.',
    status: 'Completed',
    lastRun: '2025-06-13 01:00 AM',
    triggeredBy: 'System',
    nextRun: '2025-06-14 01:00 AM',
    progress: 100,
    duration: '0m 47s',
    category: 'Maintenance',
  },
];

export default automations;

/* ─── Activity Log ─── */
export const activityLog = [
  { id: 1, automationId: 6, timestamp: '2025-06-13 01:00 AM', ago: '2h ago',  name: 'Clean Temp Files',    status: 'Completed', triggeredBy: 'System',    duration: '0m 47s'  },
  { id: 2, automationId: 2, timestamp: '2025-06-12 09:00 AM', ago: '8h ago',  name: 'Email Digest',        status: 'Completed', triggeredBy: 'Scheduler', duration: '1m 08s'  },
  { id: 3, automationId: 3, timestamp: '2025-06-12 08:00 AM', ago: '9h ago',  name: 'Generate Reports',    status: 'Failed',    triggeredBy: 'Admin',     duration: '—'       },
  { id: 4, automationId: 4, timestamp: '2025-06-12 07:00 AM', ago: '10h ago', name: 'Sync CRM',            status: 'Running',   triggeredBy: 'System',    duration: 'Running…'},
  { id: 5, automationId: 1, timestamp: '2025-06-11 02:00 PM', ago: '1d ago',  name: 'Backup Database',     status: 'Completed', triggeredBy: 'System',    duration: '4m 32s'  },
  { id: 6, automationId: 2, timestamp: '2025-06-11 09:00 AM', ago: '1d ago',  name: 'Email Digest',        status: 'Completed', triggeredBy: 'Scheduler', duration: '1m 12s'  },
  { id: 7, automationId: 3, timestamp: '2025-06-10 08:00 AM', ago: '2d ago',  name: 'Generate Reports',    status: 'Completed', triggeredBy: 'Admin',     duration: '3m 55s'  },
  { id: 8, automationId: 6, timestamp: '2025-06-10 01:00 AM', ago: '2d ago',  name: 'Clean Temp Files',    status: 'Completed', triggeredBy: 'System',    duration: '0m 51s'  },
];

/* ─── Full Logs Table (15 entries) ─── */
export const logsData = [
  { id: 1,  name: 'Clean Temp Files',    status: 'Completed', triggeredBy: 'System',    startedAt: '2025-06-13 01:00 AM', duration: '0m 47s',  exitCode: 0    },
  { id: 2,  name: 'Email Digest',        status: 'Completed', triggeredBy: 'Scheduler', startedAt: '2025-06-13 09:00 AM', duration: '1m 08s',  exitCode: 0    },
  { id: 3,  name: 'Sync CRM',            status: 'Running',   triggeredBy: 'System',    startedAt: '2025-06-12 07:00 AM', duration: 'Running…',exitCode: null  },
  { id: 4,  name: 'Generate Reports',    status: 'Failed',    triggeredBy: 'Admin',     startedAt: '2025-06-12 08:00 AM', duration: '—',       exitCode: 1    },
  { id: 5,  name: 'Backup Database',     status: 'Completed', triggeredBy: 'System',    startedAt: '2025-06-12 02:00 AM', duration: '4m 15s',  exitCode: 0    },
  { id: 6,  name: 'Good Morning Message',status: 'Completed', triggeredBy: 'Scheduler', startedAt: '2025-06-12 08:00 AM', duration: '0m 12s',  exitCode: 0    },
  { id: 7,  name: 'Email Digest',        status: 'Failed',    triggeredBy: 'Scheduler', startedAt: '2025-06-11 09:00 AM', duration: '0m 30s',  exitCode: 1    },
  { id: 8,  name: 'Backup Database',     status: 'Completed', triggeredBy: 'System',    startedAt: '2025-06-11 02:00 AM', duration: '4m 32s',  exitCode: 0    },
  { id: 9,  name: 'Generate Reports',    status: 'Completed', triggeredBy: 'Admin',     startedAt: '2025-06-11 08:00 AM', duration: '3m 55s',  exitCode: 0    },
  { id: 10, name: 'Sync CRM',            status: 'Completed', triggeredBy: 'System',    startedAt: '2025-06-11 07:00 AM', duration: '8m 22s',  exitCode: 0    },
  { id: 11, name: 'Clean Temp Files',    status: 'Completed', triggeredBy: 'System',    startedAt: '2025-06-11 01:00 AM', duration: '0m 51s',  exitCode: 0    },
  { id: 12, name: 'Backup Database',     status: 'Failed',    triggeredBy: 'System',    startedAt: '2025-06-10 02:00 AM', duration: '1m 05s',  exitCode: 2    },
  { id: 13, name: 'Good Morning Message',status: 'Completed', triggeredBy: 'Scheduler', startedAt: '2025-06-10 08:00 AM', duration: '0m 09s',  exitCode: 0    },
  { id: 14, name: 'Email Digest',        status: 'Completed', triggeredBy: 'Scheduler', startedAt: '2025-06-10 09:00 AM', duration: '1m 22s',  exitCode: 0    },
  { id: 15, name: 'Generate Reports',    status: 'Completed', triggeredBy: 'Admin',     startedAt: '2025-06-09 08:00 AM', duration: '4m 08s',  exitCode: 0    },
];

/* ─── Expanded Log Lines per entry ─── */
export const logLines = {
  1:  ['[01:00:01] INFO  → Scan started on /tmp, /var/cache', '[01:00:12] INFO  → Found 2,341 files (1.8 GB)', '[01:00:47] SUCCESS → Deleted 2,341 files, freed 1.8 GB'],
  2:  ['[09:00:00] INFO  → Fetching 1,204 subscribers', '[09:00:45] INFO  → Rendering HTML template v2.3', '[09:01:08] SUCCESS → 1,204 emails delivered (bounce: 0.4%)'],
  3:  ['[07:00:01] INFO  → Authenticating with CRM API (OAuth2)', '[07:01:05] INFO  → Processing 842 contact updates…', '[07:07:00] INFO  → Progress: 65% — still syncing activities'],
  4:  ['[08:00:02] INFO  → Connecting to analytics DB…', '[08:02:44] ERROR → Query timeout after 90 seconds', '[08:02:45] FATAL → Job terminated with exit code 1'],
  5:  ['[02:00:02] INFO  → Connecting to database cluster (latency 12ms)', '[02:03:18] INFO  → Uploading to s3://backups/2025-06-12/', '[02:04:15] SUCCESS → 2.3 GB uploaded successfully'],
  6:  ['[08:00:00] INFO  → Fetching recipient list (87 team members)', '[08:00:06] INFO  → Sending personalised messages via SMTP', '[08:00:12] SUCCESS → 87 messages delivered'],
  7:  ['[09:00:00] INFO  → Fetching 1,198 subscribers', '[09:00:28] ERROR → SMTP relay timeout: connection refused', '[09:00:30] FATAL → Digest failed — exit code 1'],
  8:  ['[02:00:01] INFO  → Backup job initiated by System', '[02:03:10] INFO  → Compressing dump file (gzip level 9)', '[02:04:32] SUCCESS → 2.3 GB uploaded to s3'],
  9:  ['[08:00:00] INFO  → Querying usage metrics (Q2 2025)', '[08:02:10] INFO  → Rendering PDF report (42 pages)', '[08:03:55] SUCCESS → Report saved to /reports/2025-06-11.pdf'],
  10: ['[07:00:01] INFO  → OAuth2 token acquired', '[07:04:15] INFO  → Uploading 312 local changes to CRM', '[08:22:00] SUCCESS → Sync complete — 1,154 records updated'],
  11: ['[01:00:01] INFO  → Scanning temp directories', '[01:00:35] INFO  → Deleting 1,987 files older than 7 days', '[01:00:51] SUCCESS → Freed 1.4 GB disk space'],
  12: ['[02:00:01] INFO  → Connecting to database cluster…', '[02:00:58] ERROR → SSL handshake failed: certificate expired', '[02:01:05] FATAL → Backup aborted — exit code 2'],
  13: ['[08:00:00] INFO  → Composing messages for 87 recipients', '[08:00:05] INFO  → Sending via SendGrid API', '[08:00:09] SUCCESS → All messages delivered'],
  14: ['[09:00:00] INFO  → Fetching 1,201 subscribers', '[09:01:10] INFO  → Template compiled, sending batch…', '[09:01:22] SUCCESS → 1,201 emails delivered'],
  15: ['[08:00:00] INFO  → Querying metrics for Q1 2025', '[08:03:50] INFO  → PDF generation complete (38 pages)', '[08:04:08] SUCCESS → Report emailed to admin@example.com'],
};

/* ─── Weekly Schedule Grid ─── */
export const weeklySchedule = {
  Mon: [
    { name: 'Backup Database',  color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', cron: '0 2 * * 1', lastRun: '2025-06-09 02:00 AM', nextRun: '2025-06-16 02:00 AM', active: true  },
    { name: 'Email Digest',     color: '#10b981', bg: 'rgba(16,185,129,0.15)', cron: '0 9 * * 1', lastRun: '2025-06-09 09:00 AM', nextRun: '2025-06-16 09:00 AM', active: true  },
  ],
  Tue: [
    { name: 'Sync CRM',         color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', cron: '0 7 * * 2', lastRun: '2025-06-10 07:00 AM', nextRun: '2025-06-17 07:00 AM', active: true  },
  ],
  Wed: [
    { name: 'Backup Database',  color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', cron: '0 2 * * 3', lastRun: '2025-06-11 02:00 AM', nextRun: '2025-06-18 02:00 AM', active: true  },
    { name: 'Generate Reports', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', cron: '0 8 * * 3', lastRun: '2025-06-11 08:00 AM', nextRun: '2025-06-18 08:00 AM', active: false },
  ],
  Thu: [
    { name: 'Email Digest',          color: '#10b981', bg: 'rgba(16,185,129,0.15)', cron: '0 9 * * 4', lastRun: '2025-06-12 09:00 AM', nextRun: '2025-06-19 09:00 AM', active: true  },
    { name: 'Good Morning Message',  color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',  cron: '0 8 * * 4', lastRun: '2025-06-12 08:00 AM', nextRun: '2025-06-19 08:00 AM', active: true  },
  ],
  Fri: [
    { name: 'Backup Database',  color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', cron: '0 2 * * 5', lastRun: '2025-06-13 02:00 AM', nextRun: '2025-06-20 02:00 AM', active: true  },
    { name: 'Clean Temp Files', color: '#64748b', bg: 'rgba(100,116,139,0.15)', cron: '0 1 * * 5', lastRun: '2025-06-13 01:00 AM', nextRun: '2025-06-20 01:00 AM', active: true  },
  ],
  Sat: [
    { name: 'Generate Reports', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', cron: '0 8 * * 6', lastRun: '2025-06-07 08:00 AM', nextRun: '2025-06-21 08:00 AM', active: true  },
  ],
  Sun: [
    { name: 'Good Morning Message', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', cron: '0 8 * * 0', lastRun: '2025-06-08 08:00 AM', nextRun: '2025-06-22 08:00 AM', active: true },
  ],
};

/* ─── Upcoming Runs ─── */
export const upcomingRuns = [
  { name: 'Good Morning Message', day: 'Sunday',   time: '8:00 AM',  status: 'Scheduled', color: '#06b6d4' },
  { name: 'Clean Temp Files',     day: 'Monday',   time: '1:00 AM',  status: 'Scheduled', color: '#64748b' },
  { name: 'Backup Database',      day: 'Monday',   time: '2:00 AM',  status: 'Scheduled', color: '#3b82f6' },
  { name: 'Email Digest',         day: 'Monday',   time: '9:00 AM',  status: 'Scheduled', color: '#10b981' },
  { name: 'Sync CRM',             day: 'Tuesday',  time: '7:00 AM',  status: 'Scheduled', color: '#f59e0b' },
];

/* ─── Weekly Chart ─── */
export const weeklyChartData = [
  { day: 'Mon', runs: 4 },
  { day: 'Tue', runs: 2 },
  { day: 'Wed', runs: 6 },
  { day: 'Thu', runs: 3 },
  { day: 'Fri', runs: 5 },
  { day: 'Sat', runs: 1 },
  { day: 'Sun', runs: 2 },
];

/* ─── Fake Logs (for View Logs modal in Automations) ─── */
export const fakeLogs = {
  1: ['[2025-06-11 02:00:01] INFO  → Backup job initiated by System','[2025-06-11 02:00:05] INFO  → Connection established (latency: 12ms)','[2025-06-11 02:01:10] INFO  → Dumping schema: public (42 tables)','[2025-06-11 02:03:18] INFO  → Uploading to s3://backups/2025-06-11/','[2025-06-11 02:04:32] SUCCESS → Backup completed — 2.3 GB uploaded'],
  2: ['[2025-06-12 09:00:00] INFO  → Email Digest job started by Scheduler','[2025-06-12 09:00:01] INFO  → Fetching subscriber list (1,204 recipients)','[2025-06-12 09:00:45] INFO  → Sending via SMTP relay...','[2025-06-12 09:01:08] SUCCESS → 1,204 emails delivered successfully'],
  3: ['[2025-06-12 08:00:00] INFO  → Generate Reports job started by Admin','[2025-06-12 08:01:22] WARNING → Slow query detected (>60s), retrying...','[2025-06-12 08:02:44] ERROR → Query timeout after 90 seconds','[2025-06-12 08:02:45] FATAL → Job terminated with exit code 1'],
  4: ['[2025-06-12 07:00:00] INFO  → Sync CRM job initiated by System','[2025-06-12 07:00:03] INFO  → Token acquired, scope: read/write','[2025-06-12 07:01:05] INFO  → Processing 842 contact updates','[2025-06-12 07:07:00] INFO  → Progress: 65% complete — syncing activities'],
  5: ['[2025-06-13 08:00:00] INFO  → Good Morning Message job not yet executed','[2025-06-13 08:00:00] INFO  → Scheduled for next run: 2025-06-13 08:00 AM'],
  6: ['[2025-06-13 01:00:00] INFO  → Clean Temp Files job started by System','[2025-06-13 01:00:12] INFO  → Found 2,341 temp files (1.8 GB)','[2025-06-13 01:00:47] SUCCESS → Deleted 2,341 files, freed 1.8 GB'],
};
