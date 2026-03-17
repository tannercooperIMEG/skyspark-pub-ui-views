/**
 * components/StatsStrip.js
 * Stats bar — open items, closed, days until due, animated completion ring.
 */
(function () {
  const h = window.React.createElement;
  window.ST.Components = window.ST.Components || {};

  window.ST.Components.StatsStrip = function StatsStrip({ proj }) {
    const U = window.ST.Utils;
    const open   = proj.tasks.filter(t => t.status !== 'closed').length;
    const closed = proj.tasks.filter(t => t.status === 'closed').length;

    // Prefer server-provided values; fall back to local task calculations
    const pc = proj.percComplete !== undefined ? proj.percComplete : U.pct(proj);

    // datesFromDueDate: negative = past due, positive = days remaining
    const dl = proj.datesFromDueDate !== undefined ? proj.datesFromDueDate : U.daysLeft(proj);
    const dlLabel = dl < 0 ? Math.abs(dl) + 'd late' : (dl === 0 ? 'Today' : dl);
    const dlIcon  = dl < 0 ? '⚠' : '◷';
    const dlCls   = dl < 0 ? 'si-red' : 'si-slate';

    const stage  = U.currentStage(proj);
    const circ   = 113.1;
    const offset = circ - (pc / 100) * circ;

    return h('div', { className: 'st-stats-strip' },
      StatBlock('⚠', 'si-amber', open,   'Open Tasks'),
      StatBlock('✓', 'si-green', closed, 'Closed Tasks'),
      StatBlock(dlIcon, dlCls,   dlLabel, 'Days Until Due'),
      h('div', { className: 'st-stat-block' },
        h('div', { className: 'st-ring-stat' },
          h('div', { className: 'st-ring-wrap' },
            h('svg', { width: 42, height: 42, viewBox: '0 0 42 42' },
              h('circle', { fill: 'none', stroke: '#E4EAF0', strokeWidth: '3.5', cx: 21, cy: 21, r: 18 }),
              h('circle', {
                fill: 'none', stroke: '#6AAF35', strokeWidth: '3.5', strokeLinecap: 'round',
                cx: 21, cy: 21, r: 18,
                style: { strokeDasharray: circ, strokeDashoffset: offset, transition: 'stroke-dashoffset .5s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }
              })
            ),
            h('div', { className: 'st-ring-label' }, pc + '%')
          ),
          h('div', null,
            h('div', { className: 'st-stat-cap', style: { marginBottom: 2 } }, 'SkySpark %'),
            h('div', { style: { fontSize: 10.5, color: '#A8BACC' } },
              stage === 'Complete' ? 'Tasks complete' : 'Active: ' + stage
            )
          )
        )
      )
    );
  };

  function StatBlock(icon, iconCls, value, label) {
    return window.React.createElement('div', { className: 'st-stat-block' },
      window.React.createElement('div', { className: 'st-stat-icon ' + iconCls }, icon),
      window.React.createElement('div', null,
        window.React.createElement('div', { className: 'st-stat-val' }, value),
        window.React.createElement('div', { className: 'st-stat-cap' }, label)
      )
    );
  }
})();
