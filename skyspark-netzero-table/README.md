# Actual vs. Modeled — SkySpark Pub UI View

A SkySpark pub UI view that compares actual building energy consumption and solar generation against modeled predictions, with a net-zero performance summary.

## Features

- **KPI cards** — YTD building consumption, solar generation, net-zero gap, and solar offset ratio
- **Charts view** — CSS bar charts for Building, Solar, and Net Zero with hover tooltips
- **Table view** — Full 12-month raw data tables for consumption, generation, and net building performance
- **View toggle** — Switch between Charts and Table in the toolbar

## File Structure

```
pub/ui/
├── actualVsModeledEntry.js          # Entry point — deploy to pub/ui/ ROOT on every server
└── actualVsModeled/
    ├── actualVsModeledUI.js         # Loader: injects CSS, loads React + app modules
    ├── actualVsModeledStyles.css    # All styles, scoped to #actualVsModeled-root
    ├── App.js                       # Root React component
    ├── components/
    │   ├── Header.js                # Toolbar with date nav and view toggle
    │   ├── KpiRow.js                # Four KPI summary cards
    │   ├── BarChart.js              # Reusable CSS bar chart panel
    │   ├── ChartsView.js            # Building + Solar + Net Zero chart panels
    │   └── TableView.js             # Consumption, Generation, Net Performance tables
    ├── constants/
    │   └── demoData.js              # Static demo data (all chart and table values)
    ├── evals/
    │   └── loadData.js              # Axon eval wrapper (returns demo data; swap for live)
    ├── hooks/
    │   └── useViewToggle.js         # React hook for Charts / Table toggle state
    └── utils/
        └── api.js                   # Haystack API helpers (evalAxon, unwrapGrid, etc.)
```

## Deployment

### Two-server pattern

| Location | Files needed |
|---|---|
| Every SkySpark server `{var}/pub/ui/` | `actualVsModeledEntry.js` only |
| Cloud server `{var}/pub/ui/` | `actualVsModeledEntry.js` + full `actualVsModeled/` directory |

### Steps

1. Copy `actualVsModeledEntry.js` to `{var}/pub/ui/` on every SkySpark server (check one doesn't already exist first — no restart required).
2. Copy the full `actualVsModeled/` directory to `{var}/pub/ui/` on the cloud server.
3. Create a view record (trio) in SkySpark:

```trio
dis: "Actual vs. Modeled"
view
jsHandler: { var defVal:"actualVsModeledHandler" }
```

> **Note**: SkySpark only auto-discovers JS files at the pub/ui/ root. The entry file must always live there. The `actualVsModeled/` subdirectory is safe because it is loaded dynamically by the entry file.

## Connecting to Live Data

All data currently comes from `constants/demoData.js`. To connect to a live SkySpark project:

1. Open `evals/loadData.js`
2. Remove the `return Promise.resolve(...)` demo line
3. Uncomment and adapt the Axon eval block
4. Update `App.js` and the relevant components to consume the live data shape

The `utils/api.js` module provides `evalAxon`, `unwrapGrid`, and `extractValue` helpers ready to use.

## Architecture Notes

- **No bundler** — vanilla JavaScript using the `window.ActualVsModeled` global namespace pattern
- **React 18** loaded from CDN (`unpkg.com`) by `actualVsModeledUI.js`
- **CSS scoping** — all rules are prefixed with `#actualVsModeled-root` to avoid collisions
- **Handler naming** — entry file exposes `actualVsModeledHandler` (the `jsHandler` target); the cloud module exposes itself as `window.actualVsModeled` to avoid overwriting the entry stub
