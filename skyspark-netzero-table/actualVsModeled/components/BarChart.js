// components/BarChart.js
// Reusable CSS bar chart panel used by ChartsView.
// Props:
//   chartDef — one of demoData.buildingChart / solarChart / netZeroChart
//     { title, legend, yTicks, months, bars, tableRows, tall? }

window.ActualVsModeled = window.ActualVsModeled || {};
window.ActualVsModeled.components = window.ActualVsModeled.components || {};

window.ActualVsModeled.components.BarChart = function BarChart(props) {
  var h   = React.createElement;
  var def = props.chartDef;

  // ── Legend ──
  var legendItems = def.legend.map(function (l, i) {
    return h('span', { key: i },
      h('i', { style: { background: l.color } }),
      ' ' + l.label
    );
  });

  // ── Y-axis ticks ──
  var yTicks = def.yTicks.map(function (t, i) {
    return h('span', { className: 'y-tick', key: i }, t);
  });

  // ── Grid lines ──
  var gridLines = def.yTicks.map(function (_, i) {
    return h('div', { className: 'grid-line', key: i });
  });

  // ── Bar groups ──
  var barGroups = def.months.map(function (month, gi) {
    var barPair = def.bars[gi].map(function (bar, bi) {
      return h('div', {
        key: bi,
        className: 'avm-bar ' + bar.colorClass,
        style: { height: bar.heightPct + '%' }
      }, h('div', { className: 'tip' }, bar.tip));
    });

    return h('div', { className: 'avm-bar-group', key: gi },
      h('div', { className: 'avm-bar-pair' }, barPair),
      h('span', { className: 'x-lbl' }, month)
    );
  });

  // ── Summary table ──
  var theadCells = [h('th', { key: -1 }, '')].concat(
    def.months.map(function (m, i) { return h('th', { key: i }, m); })
  );

  var tbodyRows = def.tableRows.map(function (row, ri) {
    var cells = row.cells.map(function (cell, ci) {
      if (typeof cell === 'object') {
        return h('td', { key: ci, className: cell.cls }, cell.text);
      }
      return h('td', { key: ci }, cell);
    });
    return h('tr', { key: ri },
      h('td', { key: -1 }, row.label),
      cells
    );
  });

  var chartClassName = 'avm-chart' + (def.tall ? ' tall' : '');

  return h('div', { className: 'avm-panel' },

    h('div', { className: 'avm-panel-head' },
      h('h2', null, def.title),
      h('div', { className: 'avm-legend' }, legendItems)
    ),

    h('div', { className: 'avm-panel-body' },

      h('div', { className: chartClassName },
        h('div', { className: 'y-axis' }, yTicks),
        h('div', { className: 'grid' }, gridLines),
        barGroups
      ),

      h('table', { className: 'avm-tbl' },
        h('thead', null, h('tr', null, theadCells)),
        h('tbody', null, tbodyRows)
      )
    )
  );
};
