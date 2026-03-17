/**
 * evals/loadProjects.js
 * Axon eval wrapper for the project summary grid.
 *
 * Server function:  view_MBCxSetup_summary(1)
 * Returns:          Haystack 3.0 grid of setup project records
 */
(function () {
  window.ST = window.ST || {};
  window.ST.Evals = window.ST.Evals || {};

  /**
   * Call view_MBCxSetup_summary(1) via the SkySpark REST eval endpoint.
   *
   * @param {string} attestKey   - from view.session().attestKey()
   * @param {string} projectName - from view.session().proj().name()
   * Returns a Promise that resolves with a parsed project array.
   */
  window.ST.Evals.loadProjects = function (attestKey, projectName) {
    return window.ST.Api.evalAxon('view_MBCxSetup_summary(1)', attestKey, projectName)
      .then(function (data) {
        var grid = window.ST.Api.unwrapGrid(data);
        if (grid.meta && grid.meta.err) {
          throw new Error(grid.meta.dis || 'SkySpark returned an error grid');
        }
        return window.ST.Evals.parseProjectGrid(grid);
      });
  };

  /**
   * Parse a Haystack 3.0 JSON grid (rows with _kind-annotated values)
   * into plain project objects the UI can consume.
   */
  window.ST.Evals.parseProjectGrid = function (grid) {
    const rows = (grid && Array.isArray(grid.rows)) ? grid.rows : [];
    const defaultTasks = window.ST.Constants.defaultTasks;

    return rows.map(function (row) {
      const id    = _parseRef(row.id);
      const pct   = _parseNum(row.percComplete);
      const dtDue = _parseNum(row.datesFromDueDate);
      const due   = _parseDate(row.dueDate);

      return {
        // Use the SkySpark ref val as the unique ID
        id:               id ? id.val : ('proj-' + Math.random().toString(36).slice(2)),
        skyRef:           id ? id.val : null,
        title:            id ? id.dis : (row.projectNumber || 'Unknown Project'),
        num:              row.projectNumber  || 'TBD',
        type:             row.projectType    || 'Other',
        conn:             row.connectorType  || '—',
        due:              due,
        percComplete:     pct   !== null ? Math.round(pct)   : 0,
        datesFromDueDate: dtDue !== null ? Math.round(dtDue) : 0,
        leadTechSetup:    row.leadTechnicalSetup || '—',
        initiatedBy:      row.initiatedBy        || '—',
        leadQC:           row.leadQC             || '—',
        skySparkProject:  row.skySparkProject     || '',
        imegTeam:         row.imegTeam            || '',
        // Tasks start from the default template; will be connected separately
        tasks: defaultTasks().map(t => ({ ...t, status: 'open', replies: [] }))
      };
    });
  };

  // ── Haystack value parsers ────────────────────────────────────────────────

  function _parseRef(v) {
    if (!v) return null;
    if (v._kind === 'ref') return { val: v.val, dis: v.dis || v.val };
    if (typeof v === 'object' && v.dis) return { val: v.id || v.val || '', dis: v.dis };
    return null;
  }

  function _parseNum(v) {
    if (v === null || v === undefined) return null;
    if (typeof v === 'number') return v;
    if (v && v._kind === 'number') return v.val;
    return null;
  }

  function _parseDate(v) {
    if (!v) return null;
    if (typeof v === 'string') return v;
    if (v._kind === 'date') return v.val;
    return null;
  }
})();
