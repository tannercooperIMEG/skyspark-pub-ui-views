/**
 * utils/api.js
 * SkySpark REST API helpers — fetch-based Axon eval.
 */
(function () {
  window.ST = window.ST || {};

  window.ST.Api = {
    /**
     * Execute an Axon expression via the SkySpark eval endpoint.
     *
     * @param {string} axonExpr    - Axon expression to evaluate
     * @param {string} attestKey   - Session attest key from view.session().attestKey()
     * @param {string} projectName - Project name from view.session().proj().name()
     * @returns {Promise<Object>}  - Parsed JSON response (Haystack grid)
     */
    evalAxon: function (axonExpr, attestKey, projectName) {
      var body = 'ver: "3.0"\nexpr\n"' + axonExpr.replace(/"/g, '\\"') + '"';
      return fetch('/api/' + projectName + '/eval', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/zinc',
          'Accept':       'application/json',
          'Attest-Key':   attestKey
        },
        body: body
      }).then(function (r) { return r.json(); });
    },

    /**
     * Unwrap a single-row/single-col wrapper grid that SkySpark sometimes returns.
     */
    unwrapGrid: function (data) {
      if (
        data.rows && data.rows.length === 1 &&
        data.cols && data.cols.length === 1 &&
        data.cols[0].name === 'val'
      ) {
        var inner = data.rows[0].val;
        if (inner && inner.rows && inner.cols) return inner;
      }
      return data;
    }
  };
})();
