// components/Header.js
// Toolbar: title, date navigation, and Charts / Table view toggle.

window.ActualVsModeled = window.ActualVsModeled || {};
window.ActualVsModeled.components = window.ActualVsModeled.components || {};

window.ActualVsModeled.components.Header = function Header(props) {
  var view      = props.view;       // 'charts' | 'table'
  var toggle    = props.toggle;     // function(mode)
  var siteName  = props.siteName;   // e.g. 'East Campus Building'
  var dateRange = props.dateRange;  // e.g. 'Jan 2026 – Mar 2026'

  var h = React.createElement;

  var subtitle = [siteName, dateRange].filter(Boolean).join('\u2002\u00b7\u2002');

  return h('div', { className: 'avm-toolbar' },

    h('div', { className: 'avm-toolbar-left' },
      h('div', { className: 'avm-toolbar-title' }, 'Actual vs. Modeled'),
      subtitle ? h('div', { className: 'avm-toolbar-subtitle' }, subtitle) : null
    ),

    h('div', { className: 'avm-toolbar-right' },

      h('div', { className: 'avm-view-toggle' },
        h('button', {
          className: view === 'charts' ? 'active' : '',
          onClick: function () { toggle('charts'); }
        }, 'Charts'),
        h('button', {
          className: view === 'table' ? 'active' : '',
          onClick: function () { toggle('table'); }
        }, 'Table')
      )
    )
  );
};
