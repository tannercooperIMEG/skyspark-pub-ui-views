// App.js
// Root React component for the Actual vs. Modeled view.
// Props:
//   data — resolved data object (from evals/loadData.js)
//   view — SkySpark view object (for future variable reads)

window.ActualVsModeled = window.ActualVsModeled || {};

window.ActualVsModeled.App = function App(props) {
  var h            = React.createElement;
  var components   = window.ActualVsModeled.components;
  var hooks        = window.ActualVsModeled.hooks;

  var Header      = components.Header;
  var KpiRow      = components.KpiRow;
  var ChartsView  = components.ChartsView;
  var TableView   = components.TableView;

  var toggleState = hooks.useViewToggle('table');
  var activeView  = toggleState.view;
  var toggle      = toggleState.toggle;

  return h('div', { id: 'actualVsModeled-root' },

    h(Header, {
      view:      activeView,
      toggle:    toggle,
      siteName:  props.data.siteName,
      dateRange: props.data.dateRange
    }),

    h('div', { className: 'avm-content' },

      h(KpiRow, { kpis: props.data.kpis }),

      activeView === 'charts'
        ? h(ChartsView, { data: props.data })
        : h(TableView,  { data: props.data })
    )
  );
};
