// App.js — assembles all sections in the mbcx equip-section card pattern
window.netzeroDashboard = window.netzeroDashboard || {};

(function (NS) {

  // SVG icons for section headers
  var ICONS = {
    kpi:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    leaf:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L12 14"/><path d="M20.59 2.41a2 2 0 00-2.83 0L12 8.17l3.83 3.83 5.76-5.76a2 2 0 000-2.83z"/></svg>',
    chart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="2" width="4" height="19"/></svg>',
    table: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
    meter: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>'
  };

  function section(icon, bgColor, title, meta, bodyHtml) {
    return [
      '<div class="nz-section">',
      '  <div class="nz-section-hdr">',
      '    <div class="nz-section-hdr-left">',
      '      <div class="nz-section-icon" style="background:' + bgColor + '">' + icon + '</div>',
      '      <div>',
      '        <div class="nz-section-title">' + title + '</div>',
      meta ? '        <div class="nz-section-meta">' + meta + '</div>' : '',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="nz-section-body">',
      bodyHtml,
      '  </div>',
      '</div>'
    ].join('\n');
  }

  NS.App = {
    init: function (container, data, ctx) {
      var co = NS.components;

      var siteName = (ctx && ctx.siteName) ? ctx.siteName : 'Demo Site';
      var dateStr = '';
      if (ctx && ctx.datesStart && ctx.datesEnd) dateStr = ctx.datesStart + '\u2009\u2013\u2009' + ctx.datesEnd;
      else if (ctx && ctx.datesStart) dateStr = ctx.datesStart;

      container.innerHTML = [
        // Title bar
        '<div class="nz-title-bar">',
        '  <div class="nz-title-site" id="nzTitleSite">' + siteName + '</div>',
        dateStr ? '  <div class="nz-title-dates">' + dateStr + '</div>' : '',
        '</div>',

        // Page content
        '<div class="nz-page">',

        // Page title + meta
        '<div class="nz-page-titlebar">',
        '  <div>',
        '    <div class="nz-page-title">Building Energy \u2014 Actual vs. Modeled</div>',
        '    <div class="nz-page-subtitle">Year-to-date performance \u00b7 consumption vs. generation</div>',
        '  </div>',
        '  <div class="nz-page-meta">',
        co.Header.renderMeta(data),
        '  </div>',
        '</div>',

        // KPIs section
        section(ICONS.kpi, 'var(--nz-blue)', 'Performance Summary',
          'YTD key metrics \u00b7 5 indicators',
          co.KpiStrip.render(data)),

        // Equiv section
        section(ICONS.leaf, 'var(--nz-green)', 'Environmental Equivalency',
          'Carbon offset equivalents \u00b7 year-to-date',
          co.EquivStrip.render(data)),

        // Charts (side-by-side, each in its own section card)
        co.Charts.render(),

        // Detail tables section
        section(ICONS.table, '#6366F1', 'Actual vs. Modeled Detail',
          'Monthly comparison tables',
          co.DetailTables.render(data)),

        // Meter breakdown section
        section(ICONS.meter, 'var(--nz-amber)', 'Meter Breakdown',
          'Individual meter readings \u00b7 12-month view',
          co.MeterBreakdown.render(data)),

        // Footer
        co.Footer.render(),

        '</div>'
      ].join('\n');

      // Initialize Chart.js charts after DOM
      co.KpiStrip.initDonut(container, data);
      co.Charts.initCharts(container, data);
    }
  };

})(window.netzeroDashboard);
