// components/KpiRow.js
// Row of four KPI summary cards.
// Props: kpis — array from demoData.kpis

window.ActualVsModeled = window.ActualVsModeled || {};
window.ActualVsModeled.components = window.ActualVsModeled.components || {};

window.ActualVsModeled.components.KpiRow = function KpiRow(props) {
  var h    = React.createElement;
  var kpis = props.kpis;

  function renderNote(note) {
    if (!note) return null;
    if (note.type === 'neg') {
      var parts = note.text.split(' ');
      return h('div', { className: 'avm-kpi-note' },
        h('span', { className: 'neg' }, parts[0]),
        ' ' + parts.slice(1).join(' ')
      );
    }
    if (note.type === 'pos') {
      var parts = note.text.split(' ');
      return h('div', { className: 'avm-kpi-note' },
        h('span', { className: 'pos' }, parts[0]),
        ' ' + parts.slice(1).join(' ')
      );
    }
    return h('div', { className: 'avm-kpi-note' }, note.text);
  }

  var cards = kpis.map(function (kpi, i) {
    return h('div', { className: 'avm-kpi', key: i },
      h('div', { className: 'avm-kpi-label' }, kpi.label),
      h('div', { className: 'avm-kpi-val' },
        kpi.value,
        h('span', { className: 'avm-kpi-unit' }, kpi.unit)
      ),
      renderNote(kpi.note)
    );
  });

  return h('div', { className: 'avm-kpi-row' }, cards);
};
