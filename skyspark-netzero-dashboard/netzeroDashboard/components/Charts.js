// components/Charts.js
window.netzeroDashboard = window.netzeroDashboard || {};
window.netzeroDashboard.components = window.netzeroDashboard.components || {};

window.netzeroDashboard.components.Charts = {

  _card: function (id, title) {
    return [
      '<div class="nz-chart-card">',
      '  <div class="nz-chart-header">',
      '    <div class="nz-chart-name">' + title + '</div>',
      '    <div class="nz-legend">',
      '      <span class="nz-legend-item"><span class="nz-legend-swatch" style="background:var(--nz-bar-ink)"></span>Actual</span>',
      '      <span class="nz-legend-item"><span class="nz-legend-swatch" style="background:var(--nz-bar-ghost)"></span>Model</span>',
      '    </div>',
      '  </div>',
      '  <div class="nz-chart-wrap"><canvas id="' + id + '"></canvas></div>',
      '</div>'
    ].join('\n');
  },

  render: function () {
    return [
      '<div class="nz-charts-grid">',
      this._card('nzBuildingChart', 'Building Consumption'),
      this._card('nzSolarChart', 'Solar Generation'),
      '</div>'
    ].join('\n');
  },

  _makeOpts: function () {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1F2937',
          titleFont: { size: 11 },
          bodyFont: { size: 12 },
          padding: 9,
          cornerRadius: 5,
          callbacks: {
            label: function (ctx) {
              return ' ' + ctx.dataset.label + ': ' + (ctx.parsed.y / 1000).toFixed(1) + 'k kWh';
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { font: { size: 10 }, color: '#9CA3AF' },
          grid: { display: false },
          border: { display: false }
        },
        y: {
          ticks: {
            font: { size: 10 }, color: '#9CA3AF',
            callback: function (v) { return (v / 1000).toFixed(0) + 'k'; },
            maxTicksLimit: 4
          },
          grid: { color: '#F3F4F6' },
          border: { display: false }
        }
      }
    };
  },

  initCharts: function (container, data) {
    var C = window.Chart;
    if (!C) return;
    var months = data.charts.months;
    var opts = this._makeOpts();

    var bEl = container.querySelector('#nzBuildingChart');
    if (bEl) {
      new C(bEl, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            { label: 'Actual', data: data.charts.building.actual, backgroundColor: '#2e3a4e', borderRadius: 2, barPercentage: 0.75, categoryPercentage: 0.8 },
            { label: 'Model',  data: data.charts.building.model,  backgroundColor: '#dde8f0', borderRadius: 2, barPercentage: 0.75, categoryPercentage: 0.8 }
          ]
        },
        options: opts
      });
    }

    var sEl = container.querySelector('#nzSolarChart');
    if (sEl) {
      new C(sEl, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            { label: 'Actual', data: data.charts.solar.actual, backgroundColor: '#2e3a4e', borderRadius: 2, barPercentage: 0.75, categoryPercentage: 0.8 },
            { label: 'Model',  data: data.charts.solar.model,  backgroundColor: '#dde8f0', borderRadius: 2, barPercentage: 0.75, categoryPercentage: 0.8 }
          ]
        },
        options: opts
      });
    }
  }
};
