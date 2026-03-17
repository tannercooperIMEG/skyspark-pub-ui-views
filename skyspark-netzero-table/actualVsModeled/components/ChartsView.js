// components/ChartsView.js
// Renders the three bar-chart panels: Building, Solar, and Net Zero.
// Props: data — full demoData object

window.ActualVsModeled = window.ActualVsModeled || {};
window.ActualVsModeled.components = window.ActualVsModeled.components || {};

window.ActualVsModeled.components.ChartsView = function ChartsView(props) {
  var h        = React.createElement;
  var BarChart = window.ActualVsModeled.components.BarChart;
  var data     = props.data;

  return h('div', null,

    h('div', { className: 'avm-row two-col' },
      h(BarChart, { key: 'building', chartDef: data.buildingChart }),
      h(BarChart, { key: 'solar',    chartDef: data.solarChart    })
    ),

    h('div', { className: 'avm-row one-col' },
      h(BarChart, { key: 'netZero', chartDef: data.netZeroChart })
    )
  );
};
