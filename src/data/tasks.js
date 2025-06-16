const tasks = [
  {
    id: 1,
    name: "Backup Database",
    status: "Scheduled",
    lastRunTime: "2025-06-11 02:00 PM",
    triggeredBy: "System",
    description: "Backup user data to cloud."
  },
  {
    id: 2,
    name: "Email Digest",
    status: "Completed",
    lastRunTime: "2025-06-12 09:00 AM",
    triggeredBy: "Scheduler",
    description: "Send daily digest emails."
  },
  {
    id: 3,
    name: "Generate Reports",
    status: "Failed",
    lastRunTime: "2025-06-12 08:00 AM",
    triggeredBy: "Admin",
    description: "Create usage reports for analytics."
  },
  {
    id: 4,
    name: "Sync CRM",
    status: "Running",
    lastRunTime: "2025-06-12 07:00 AM",
    triggeredBy: "System",
    description: "Sync with external CRM platform."
  }, {
    id: 5,
    name: "Good Morning message",
    status: "Scheduled",
    lastRunTime: "Not run yet",
    triggeredBy: "Scheduler",
    description: "Send daily good morning message to all .",
  }
];

export default tasks;