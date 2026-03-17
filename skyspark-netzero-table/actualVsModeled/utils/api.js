// utils/api.js
// Low-level SkySpark Haystack API utilities.
// All functions receive session credentials via the view object.

window.ActualVsModeled = window.ActualVsModeled || {};
window.ActualVsModeled.utils = window.ActualVsModeled.utils || {};

window.ActualVsModeled.utils.api = (function () {

  // POST an Axon expression to the eval endpoint and return parsed JSON.
  function evalAxon(projectName, attestKey, axonExpr) {
    var body = 'ver: "3.0"\nexpr\n"' + axonExpr.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    return fetch('/api/' + projectName + '/eval', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/zinc',
        'Accept':       'application/json',
        'Attest-Key':   attestKey
      },
      body: body
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' from eval endpoint');
      return r.json();
    });
  }

  // Unwrap the single-row { val: <inner grid> } envelope that SkySpark
  // often wraps eval results in.
  function unwrapGrid(data) {
    if (
      data && data.rows && data.rows.length === 1 &&
      data.cols && data.cols.length === 1 &&
      data.cols[0].name === 'val'
    ) {
      var inner = data.rows[0].val;
      if (inner && inner.rows && inner.cols) return inner;
    }
    return data;
  }

  // Extract a plain JS value from a Haystack-typed JSON object.
  function extractValue(val) {
    if (val === null || val === undefined) return null;
    if (val._kind === 'number')   return val.val;
    if (val._kind === 'dateTime') return val.val;   // ISO string
    if (val._kind === 'ref')      return val.val;
    if (val.val !== undefined)    return val.val;
    return val;
  }

  // Read a SkySpark view variable safely; returns null if not set.
  function tryReadVar(view, varName) {
    try {
      var val = view.get(varName);
      if (val != null) return val.toStr ? val.toStr() : String(val);
    } catch (e) { /* not set */ }
    return null;
  }

  return {
    evalAxon:     evalAxon,
    unwrapGrid:   unwrapGrid,
    extractValue: extractValue,
    tryReadVar:   tryReadVar
  };

})();
