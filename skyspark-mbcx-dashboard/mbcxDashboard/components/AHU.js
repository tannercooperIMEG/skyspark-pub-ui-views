// components/AHU.js — Air Handling Units section
window.mbcxDashboard = window.mbcxDashboard || {};
window.mbcxDashboard.components = window.mbcxDashboard.components || {};

window.mbcxDashboard.components.AHU = {

  // Render the section shell (header + loading placeholder).
  // Call initLive(container, ctx) afterwards to populate with live data.
  render: function (d) {
    var ahu = d.ahu;
    return [
      '<div class="equip-section" id="mbcxAhuSection">',
      '  <div class="equip-header">',
      '    <div class="equip-header-left">',
      '      <div class="equip-icon" style="background:var(--imeg-green-lt);">',
      '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C8A3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>',
      '      </div>',
      '      <div><div class="equip-title">Air Handling Units</div><div class="equip-meta">' + ahu.unitCount + ' AHUs &nbsp;&middot;&nbsp; Cooling Valve Output</div></div>',
      '    </div>',
      '  </div>',
      '  <div id="mbcxAhuContent">',
      '    <div class="ahu-loading">Loading AHU data\u2026</div>',
      '  </div>',
      '</div>'
    ].join('\n');
  },

  // Called after render() — fetches live data and replaces the loading placeholder.
  // ctx: { attestKey, projectName, siteRef }
  initLive: function (container, ctx) {
    var self = this;
    var contentEl = container.querySelector('#mbcxAhuContent');
    if (!contentEl) return;

    if (!ctx || !ctx.attestKey || !ctx.siteRef) {
      contentEl.innerHTML = self._noData('No site configured.');
      return;
    }

    window.mbcxDashboard.evals.loadAhuData(ctx.attestKey, ctx.projectName, ctx.siteRef)
      .then(function (result) {
        self._renderLive(contentEl, result.plotGrid, result.tableGrid);
      })
      .catch(function (err) {
        console.warn('[mbcxDashboard] AHU data failed:', err);
        contentEl.innerHTML = self._noData('Could not load AHU data.');
      });
  },

  // Render chart + table from live grid data
  _renderLive: function (contentEl, plotGrid, tableGrid) {
    var HP  = window.mbcxDashboard.haystackParser;
    var C   = window.Chart;
    var parsed  = HP.parseGrid(plotGrid);
    var tParsed = HP.parseGrid(tableGrid);

    contentEl.innerHTML = [
      '<div class="ahu-chart-wrap">',
      '  <canvas id="mbcxAhuCoolingChart" height="220"></canvas>',
      '</div>',
      '<div class="ahu-table-wrap">',
      this._tableHTML(tParsed, tableGrid),
      '</div>'
    ].join('\n');

    if (C && parsed.rows.length > 0) {
      this._initChart(contentEl, parsed);
    }
  },

  _initChart: function (contentEl, parsed) {
    var C = window.Chart;
    var canvas = contentEl.querySelector('#mbcxAhuCoolingChart');
    if (!canvas) return;

    // Find a numeric column for values; skip 'id', 'dis', 'ref'-style cols
    var skipCols = { id: true, dis: true, ref: true, navName: true };
    var valCol   = null;
    var labelCol = null;

    parsed.cols.forEach(function (col) {
      if (!labelCol && (col === 'dis' || col === 'navName')) labelCol = col;
    });
    parsed.cols.forEach(function (col) {
      if (!valCol && !skipCols[col]) {
        var sample = parsed.rows[0] && parsed.rows[0][col];
        if (typeof sample === 'number') valCol = col;
      }
    });
    if (!valCol) {
      // fallback: first non-label col
      valCol = parsed.cols.filter(function (c) { return c !== labelCol; })[0];
    }
    if (!labelCol) labelCol = parsed.cols[0];

    var labels = parsed.rows.map(function (r) { return r[labelCol] || r[parsed.cols[0]]; });
    var values = parsed.rows.map(function (r) {
      var v = r[valCol];
      return (v !== null && v !== undefined) ? +v : null;
    });

    new C(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cooling Valve Output',
          data: values,
          backgroundColor: 'rgba(92,138,60,0.75)',
          barPercentage: 0.7,
          categoryPercentage: 0.85
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1F2937', titleFont: { size: 11 }, bodyFont: { size: 12 }, padding: 9, cornerRadius: 5 }
        },
        scales: {
          x: { ticks: { font: { size: 10 }, color: '#9CA3AF' }, grid: { display: false }, border: { display: false } },
          y: { ticks: { font: { size: 10 }, color: '#9CA3AF', maxTicksLimit: 5, callback: function (v) { return v + '%'; } }, grid: { color: '#F3F4F6' }, border: { display: false } }
        }
      }
    });
  },

  _tableHTML: function (tParsed, rawGrid) {
    var HP = window.mbcxDashboard.haystackParser;
    if (!tParsed.rows.length) return '<p class="ahu-no-rows">No data returned.</p>';

    var cols = tParsed.cols;
    var headers = cols.map(function (c) { return HP.colDis(rawGrid, c); });

    var rowsHtml = tParsed.rows.map(function (row) {
      var cells = cols.map(function (c) {
        var v = row[c];
        if (v === null || v === undefined) return '<td class="ahu-td">&mdash;</td>';
        if (typeof v === 'number') return '<td class="ahu-td ahu-td-num">' + v.toFixed(1) + '</td>';
        if (typeof v === 'object' && v.dis) return '<td class="ahu-td">' + _esc(v.dis) + '</td>';
        return '<td class="ahu-td">' + _esc(String(v)) + '</td>';
      }).join('');
      return '<tr>' + cells + '</tr>';
    }).join('');

    return [
      '<table class="ahu-table">',
      '<thead><tr>' + headers.map(function (h) { return '<th class="ahu-th">' + _esc(h) + '</th>'; }).join('') + '</tr></thead>',
      '<tbody>' + rowsHtml + '</tbody>',
      '</table>'
    ].join('');
  },

  _noData: function (msg) {
    return '<div class="ahu-no-data">' + msg + '</div>';
  }
};

function _esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
