// evals/loadData.js
// Axon eval wrapper for the Actual vs. Modeled view.
// Currently returns static demo data; swap the body of this function
// to make live API calls once connected to a SkySpark project.

window.ActualVsModeled = window.ActualVsModeled || {};
window.ActualVsModeled.evals = window.ActualVsModeled.evals || {};

window.ActualVsModeled.evals.loadData = function loadData(view) {
  // ── Demo mode ──────────────────────────────────────────────────────────
  // Returns the static demoData constant immediately.
  // To switch to live data, replace the block below with the
  // evalAxon call commented out underneath it.
  return Promise.resolve(window.ActualVsModeled.constants.demoData);

  /* ── Live SkySpark example (uncomment and adapt when ready) ────────────
  var api          = window.ActualVsModeled.utils.api;
  var session      = view.session();
  var attestKey    = session.attestKey();
  var projectName  = session.proj().name();
  var siteRef      = api.tryReadVar(view, 'site') || api.tryReadVar(view.parent(), 'site');
  var dateRange    = api.tryReadVar(view, 'dateRange') || 'thisYear()';

  var axon = [
    '{',
    '  consumption: readAll(meter and consumption and siteRef==@' + siteRef + ')',
    '    .hisMath("sum", ' + dateRange + '),',
    '  generation:  readAll(meter and generation  and siteRef==@' + siteRef + ')',
    '    .hisMath("sum", ' + dateRange + ')',
    '}'
  ].join('\n');

  return api.evalAxon(projectName, attestKey, axon)
    .then(function (raw) {
      return api.unwrapGrid(raw);
    });
  ── end live example ── */
};
