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
        console.error('[mbcxDashboard] AHU data failed:', err);
        contentEl.innerHTML = self._noData('Could not load AHU data: ' + (err && err.message ? err.message : String(err)));
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
    if (!canvas || !parsed.rows.length) return;

    var cols = parsed.cols;
    var rows = parsed.rows;

    // Identify the timestamp column and all numeric data columns
    var tsCol    = null;
    var dataCols = [];
    cols.forEach(function (col) {
      var sample = rows[0][col];
      if (!tsCol && (col === 'ts' || (typeof sample === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(sample)))) {
        tsCol = col;
      } else if (typeof sample === 'number') {
        dataCols.push(col);
      }
    });
    if (!dataCols.length) return;

    // Format X labels: ISO datetime → "Jan '25"
    var labelCol = tsCol || cols[0];
    var labels = rows.map(function (r) {
      var v = r[labelCol];
      if (typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}/)) {
        var d = new Date(v);
        return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }
      return String(v != null ? v : '');
    });

    // Build fleet-average series (values are fractions 0–1; multiply by 100 for %)
    var avgData = rows.map(function (r) {
      var sum = 0, n = 0;
      dataCols.forEach(function (c) { if (r[c] != null) { sum += r[c]; n++; } });
      return n > 0 ? +(sum / n * 100).toFixed(2) : null;
    });

    new C(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Fleet Avg Cooling Valve',
          data: avgData,
          borderColor: 'rgba(92,138,60,0.9)',
          backgroundColor: 'rgba(92,138,60,0.12)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1F2937',
            titleFont: { size: 11 }, bodyFont: { size: 12 }, padding: 9, cornerRadius: 5,
            callbacks: { label: function (c) { return c.parsed.y.toFixed(1) + '%'; } }
          }
        },
        scales: {
          x: { ticks: { font: { size: 10 }, color: '#9CA3AF', maxTicksLimit: 14 }, grid: { display: false }, border: { display: false } },
          y: { ticks: { font: { size: 10 }, color: '#9CA3AF', maxTicksLimit: 5, callback: function (v) { return v.toFixed(0) + '%'; } }, grid: { color: '#F3F4F6' }, border: { display: false } }
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
        if (typeof v === 'number') return '<td class="ahu-td ahu-td-num">' + v.toFixed(1) + '%</td>';
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
