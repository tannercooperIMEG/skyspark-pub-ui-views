// App.js — assembles all components, injects HTML, initializes Chart.js charts
window.netzeroDashboard = window.netzeroDashboard || {};

(function (NS) {

  NS.App = {
    init: function (container, data, ctx) {
      var co = NS.components;

      container.innerHTML = [
        '<div class="nz-page">',

        // ── Header with site title ──
        co.Header.render(data, ctx),

        // ── KPIs card ──
        '<div class="nz-card">',
        co.KpiStrip.render(data),
        '</div>',

        // ── Environmental equivalency card ──
        '<div class="nz-card">',
        co.EquivStrip.render(data),
        '</div>',

        // ── Charts (side-by-side, each in its own card) ──
        co.Charts.render(),

        // ── Detail tables card ──
        '<div class="nz-card">',
        co.DetailTables.render(data),
        '</div>',

        // ── Meter breakdown card ──
        '<div class="nz-card">',
        co.MeterBreakdown.render(data),
        '</div>',

        // ── Footer ──
        co.Footer.render(),

        '</div>'
      ].join('\n');

      // Initialize Chart.js charts after DOM is populated
      co.KpiStrip.initDonut(container, data);
      co.Charts.initCharts(container, data);
    }
  };

})(window.netzeroDashboard);
