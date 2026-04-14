// App.js — assembles all components and initializes Chart.js charts
window.mbcxDashboard = window.mbcxDashboard || {};

(function (NS) {
  var C = null; // Chart.js reference, set on init

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  // Shared Chart.js tooltip + axis config
  function baseOpts(yFmt, xLabels) {
    var tt = { backgroundColor:'#1F2937', titleFont:{size:11}, bodyFont:{size:12}, padding:9, cornerRadius:5 };
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tt },
      scales: {
        x: { labels: xLabels, ticks:{font:{size:10},color:'#9CA3AF'}, grid:{display:false}, border:{display:false} },
        y: { ticks:{font:{size:10},color:'#9CA3AF',maxTicksLimit:4,callback:yFmt}, grid:{color:'#F3F4F6'}, border:{display:false} }
      }
    };
  }

  function initCharts(container, data) {
    // Charts are only initialized when their canvas elements exist in the DOM.
    // Sections currently showing TODO placeholders will have no canvas elements.
    C = window.Chart;
    if (!C) { console.warn('[mbcxDashboard] Chart.js not loaded.'); return; }
    // No static charts to initialize — AHU chart is rendered dynamically via AHU.initLive().
  }

  function bindEvents(container, data) {
    // Event bindings are added per-section as sections are implemented.
    // CUP and AHU metric toggles will be wired here once those sections are built out.
  }

  // Expose components reference for use in bindEvents
  NS.Components = {
    Header:        window.mbcxDashboard.components.Header,
    HealthBanner:  window.mbcxDashboard.components.HealthBanner,
    BuildingMeters:window.mbcxDashboard.components.BuildingMeters,
    CUP:           window.mbcxDashboard.components.CUP,
    AHU:           window.mbcxDashboard.components.AHU,
    TerminalUnits: window.mbcxDashboard.components.TerminalUnits,
    Footer:        window.mbcxDashboard.components.Footer
  };

  NS.App = {
    init: function (container, data, ctx) {
      // Resolve component refs (modules loaded after App.js is parsed)
      NS.Components = {
        Header:        window.mbcxDashboard.components.Header,
        HealthBanner:  window.mbcxDashboard.components.HealthBanner,
        BuildingMeters:window.mbcxDashboard.components.BuildingMeters,
        CUP:           window.mbcxDashboard.components.CUP,
        AHU:           window.mbcxDashboard.components.AHU,
        TerminalUnits: window.mbcxDashboard.components.TerminalUnits,
        Footer:        window.mbcxDashboard.components.Footer
      };

      var co = NS.Components;
      var dateStr = '';
      if (ctx && ctx.datesStart && ctx.datesEnd) dateStr = ctx.datesStart + '\u2009\u2013\u2009' + ctx.datesEnd;
      else if (ctx && ctx.datesStart) dateStr = ctx.datesStart;

      container.innerHTML = [
        '<div class="dash-title-bar">',
        '  <div class="dash-title-site" id="mbcxDashTitleSite">' + (ctx && ctx.siteName ? ctx.siteName : 'Loading\u2026') + '</div>',
        dateStr ? '<div class="dash-title-dates">' + dateStr + '</div>' : '',
        '</div>',
        '<div class="page">',
        co.HealthBanner.render(data),
        co.BuildingMeters.render(data),
        co.CUP.render(data),
        co.AHU.render(data),
        co.TerminalUnits.render(),
        '</div>'
      ].join('\n');

      initCharts(container, data);
      bindEvents(container, data);

      // Kick off live AHU data fetch
      co.AHU.initLive(container, ctx || null);

      // Initialize Terminal Units charts (demo data)
      co.TerminalUnits.initLive(container, ctx || null);
    }
  };

})(window.mbcxDashboard);
