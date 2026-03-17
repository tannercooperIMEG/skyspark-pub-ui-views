# SkySpark Setup Tracker

A SkySpark Pub UI view for managing MBCx commissioning setup tasks across projects. Displays live project data from SkySpark alongside a four-stage task checklist that lets engineers track, comment on, and close setup work items.

---

## Features

- **Live project list** — pulls from `view_MBCxSetup_summary(1)` via the SkySpark REST eval API
- **Four-stage task checklist** — Installation & Config, Connector/Ingestion, Point Tagging & Import, Project QC
- **Stats strip** — open/closed task counts, days until due, and an animated % complete ring sourced from SkySpark
- **Reply/comment panel** — log notes and status changes per task
- **Fullscreen mode** — defaults to fullscreen on load, toggle in the header
- **Collapsible sidebar** — project rail can be hidden for more workspace
- **Graceful fallback** — uses sample data when no SkySpark session is present (local preview / dev)

---

## Architecture

```
skySpark_setupTrackerEntry.js       ← SkySpark jsHandler entry (deploy to pub/ui/ root)
skySpark_setupTracker-viewRecord.trio

skySpark_setupTracker/
├── skySpark_setupTrackerUI.js      ← Bootstraps React + loads all modules sequentially
├── skySpark_setupTrackerStyles.css
├── App.js                          ← Root React component
│
├── utils/
│   ├── helpers.js                  ← Pure utility functions (dates, labels, pill classes)
│   └── api.js                      ← SkySpark REST eval helper (evalAxon, unwrapGrid)
│
├── constants/
│   └── data.js                     ← Default task template + sample projects (fallback)
│
├── evals/
│   └── loadProjects.js             ← Calls view_MBCxSetup_summary(1), parses Haystack grid
│
├── hooks/
│   └── useSetupTracker.js          ← Central state: projects, tasks, UI state, data loading
│
└── components/
    ├── Chrome.js                   ← App header with fullscreen toggle
    ├── Rail.js                     ← Left sidebar — searchable project list with progress bars
    ├── ProjectHeader.js            ← Selected project title and metadata
    ├── StatsStrip.js               ← Stats bar with animated completion ring
    ├── TasksPanel.js               ← Stage-filtered task list
    ├── ReplyPanel.js               ← Comment/status update panel
    ├── NewProjectModal.js          ← New project form
    └── NewTaskModal.js             ← New task form
```

**No build step.** React 18 is loaded from the unpkg CDN. All modules use `window.ST.*` globals and plain `React.createElement` (no JSX).

---

## Deployment

1. Copy all files to the SkySpark server at `{var}/pub/ui/`:
   - `skySpark_setupTrackerEntry.js` → `{var}/pub/ui/` (root)
   - `skySpark_setupTracker/` directory → `{var}/pub/ui/skySpark_setupTracker/`

2. Import `skySpark_setupTracker-viewRecord.trio` into the target SkySpark project.

3. Navigate to the view — the project list will load automatically from `view_MBCxSetup_summary(1)`.

---

## SkySpark Data Contract

The view expects `view_MBCxSetup_summary(1)` to return a Haystack 3.0 grid with these columns:

| Column | Type | Description |
|---|---|---|
| `id` | Ref | Project ref; `.dis` used as title |
| `projectNumber` | Str | e.g. `"25-1234"` |
| `projectType` | Str | e.g. `"MBCx"`, `"WPPV - Cx"`, `"RCx"` |
| `connectorType` | Str | Connector/driver type |
| `dueDate` | Date | Project due date |
| `percComplete` | Number | 0–100, SkySpark-calculated % complete |
| `datesFromDueDate` | Number | Days until due (negative = overdue) |
| `leadTechnicalSetup` | Str | Lead tech name |
| `initiatedBy` | Str | Project initiator |
| `leadQC` | Str | QC lead name |
| `skySparkProject` | Str | SkySpark project name |
| `imegTeam` | Str | IMEG team |

---

## Branches

| Branch | Purpose |
|---|---|
| `main` | Stable, deployed code |
| `feature/skyspark-live-data` | Live SkySpark data connection (current development) |
| `refactor/react-architecture` | Initial React architecture refactor |
