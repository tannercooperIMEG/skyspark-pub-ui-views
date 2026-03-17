// components/TableView.js
// Renders the three raw data tables: Consumption, Generation, Net Performance.
// Props: data — full demoData object

window.ActualVsModeled = window.ActualVsModeled || {};
window.ActualVsModeled.components = window.ActualVsModeled.components || {};

window.ActualVsModeled.components.TableView = function TableView(props) {
  var h    = React.createElement;
  var data = props.data;

  var MONTHS = data.consumption.months;

  // ── Colgroup (label col + 12 month cols + totals col) ──
  function makeColgroup() {
    var cols = [h('col', { key: 'lbl', className: 'col-label' })];
    MONTHS.forEach(function (_, i) {
      cols.push(h('col', { key: 'mo' + i, className: 'col-month' }));
    });
    cols.push(h('col', { key: 'tot', className: 'col-total' }));
    return h('colgroup', null, cols);
  }

  // ── Consumption table ──
  var consumptionHead = [h('th', { key: 'lbl' }, 'Meter Types')]
    .concat(MONTHS.map(function (m, i) { return h('th', { key: i }, m); }))
    .concat([h('th', { key: 'tot' }, 'Totals')]);

  var consumptionRows = data.consumption.rows.map(function (row, ri) {
    var cells = row.cells.map(function (c, ci) { return h('td', { key: ci }, c); });
    return h('tr', { key: ri },
      h('td', { key: 'lbl' }, row.label),
      cells,
      h('td', { key: 'tot' }, row.total)
    );
  });

  var consumptionTotalCells = data.consumption.total.cells.map(function (c, ci) {
    return h('td', { key: ci }, c);
  });
  var consumptionTotalRow = h('tr', { key: 'total', className: 'row-total' },
    h('td', { key: 'lbl' }, data.consumption.total.label),
    consumptionTotalCells,
    h('td', { key: 'tot' }, data.consumption.total.total)
  );

  // ── Generation table ──
  var generationRows = data.generation.rows.map(function (row, ri) {
    var cells = row.cells.map(function (c, ci) { return h('td', { key: ci }, c); });
    return h('tr', { key: ri },
      h('td', { key: 'lbl' }, row.label),
      cells,
      h('td', { key: 'tot' }, row.total)
    );
  });

  var generationTotalCells = data.generation.total.cells.map(function (c, ci) {
    return h('td', { key: ci }, c);
  });
  var generationTotalRow = h('tr', { key: 'total', className: 'row-total' },
    h('td', { key: 'lbl' }, data.generation.total.label),
    generationTotalCells,
    h('td', { key: 'tot' }, data.generation.total.total)
  );

  // ── Net Building Performance table ──
  var netCells = data.netPerformance.cells.map(function (cell, ci) {
    return h('td', { key: ci, className: cell.cls }, cell.text);
  });
  var netRow = h('tr', { key: 'net', className: 'row-net' },
    h('td', { key: 'lbl' }, data.netPerformance.label),
    netCells
  );

  return h('div', null,

    // Consumption
    h('div', { className: 'avm-panel', style: { marginBottom: '16px' } },
      h('div', { className: 'avm-panel-body avm-raw-scroll', style: { padding: 0 } },
        h('table', { className: 'avm-raw-tbl' },
          makeColgroup(),
          h('thead', null, h('tr', null, consumptionHead)),
          h('tbody', null, consumptionRows, consumptionTotalRow)
        )
      )
    ),

    // Generation
    h('div', { className: 'avm-panel', style: { marginBottom: '16px' } },
      h('div', { className: 'avm-panel-body avm-raw-scroll', style: { padding: 0 } },
        h('table', { className: 'avm-raw-tbl' },
          makeColgroup(),
          h('tbody', null, generationRows, generationTotalRow)
        )
      )
    ),

    // Net Building Performance
    h('div', { className: 'avm-panel' },
      h('div', { className: 'avm-panel-body avm-raw-scroll', style: { padding: 0 } },
        h('table', { className: 'avm-raw-tbl' },
          makeColgroup(),
          h('tbody', null, netRow)
        )
      )
    )
  );
};
