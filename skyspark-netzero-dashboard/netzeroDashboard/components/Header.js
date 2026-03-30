// components/Header.js
window.netzeroDashboard = window.netzeroDashboard || {};
window.netzeroDashboard.components = window.netzeroDashboard.components || {};

window.netzeroDashboard.components.Header = {
  render: function (data, ctx) {
    var siteOpts = data.meta.sites.map(function (s) { return '<option>' + s + '</option>'; }).join('');
    var siteName = (ctx && ctx.siteName) ? ctx.siteName : 'Demo Site';
    var dateStr = '';
    if (ctx && ctx.datesStart && ctx.datesEnd) dateStr = ctx.datesStart + '\u2009\u2013\u2009' + ctx.datesEnd;
    else if (ctx && ctx.datesStart) dateStr = ctx.datesStart;

    return [
      '<div class="nz-title-bar">',
      '  <div class="nz-title-left">',
      '    <div class="nz-title-site" id="nzTitleSite">' + siteName + '<br><em>Building Energy \u2014 Actual vs. Modeled</em></div>',
      dateStr ? '    <div class="nz-title-dates">' + dateStr + '</div>' : '',
      '  </div>',
      '  <div class="nz-page-meta">',
      '    <select class="nz-meta-item">' + siteOpts + '</select>',
      '    <span class="nz-meta-item">' + data.meta.dateRange + '</span>',
      '    <span class="nz-meta-item">' + data.meta.units + '</span>',
      '  </div>',
      '</div>'
    ].join('\n');
  }
};
