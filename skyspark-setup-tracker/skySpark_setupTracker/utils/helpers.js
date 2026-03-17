/**
 * utils/helpers.js
 * Pure utility functions — no React dependency.
 */
(function () {
  window.ST = window.ST || {};

  const _avMap = {};
  const _avClasses = ['av-1', 'av-2', 'av-3', 'av-4'];
  let _avIdx = 0;

  window.ST.Utils = {
    pct(p) {
      const closed = p.tasks.filter(t => t.status === 'closed').length;
      return p.tasks.length ? Math.round(closed / p.tasks.length * 100) : 0;
    },

    daysLeft(p) {
      return Math.ceil((new Date(p.due) - new Date()) / 86400000);
    },

    pillClass(type) {
      // Handles both compact keys (demo data) and full SkySpark strings
      const map = {
        'MBCx':          'st-pill-mbcx',
        'WPPV-Cx':       'st-pill-wppv',
        'WPPV - Cx':     'st-pill-wppv',
        'WPPV-Design':   'st-pill-wppv',
        'WPPV - Design': 'st-pill-wppv',
        'WPPV-RCx':      'st-pill-wppv',
        'WPPV - RCx':    'st-pill-wppv',
        'RCx':           'st-pill-rcx',
        'UA':            'st-pill-ua'
      };
      return map[type] || 'st-pill-other';
    },

    statusLabel(s) {
      return ({ open: 'Open', progress: 'In Progress', closed: 'Closed' })[s] || s;
    },

    statusClass(s) {
      return ({ open: 'sb-open', progress: 'sb-progress', closed: 'sb-closed' })[s] || 'sb-open';
    },

    currentStage(p) {
      for (const stage of ['Stage 01', 'Stage 02', 'Stage 03', 'Stage 04']) {
        if (p.tasks.filter(t => t.stage === stage).some(t => t.status !== 'closed')) return stage;
      }
      return 'Complete';
    },

    avClass(initials) {
      if (_avMap[initials] === undefined) _avMap[initials] = _avClasses[_avIdx++ % 4];
      return _avMap[initials];
    },

    dueLabel(p) {
      const dl = window.ST.Utils.daysLeft(p);
      if (dl < 0) return { text: Math.abs(dl) + 'd overdue', late: true };
      if (dl === 0) return { text: 'Due today', late: false };
      return { text: 'Due in ' + dl + 'd', late: false };
    }
  };
})();
