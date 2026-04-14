// components/TerminalUnits.js — VAV Terminal Units section
window.mbcxDashboard = window.mbcxDashboard || {};
window.mbcxDashboard.components = window.mbcxDashboard.components || {};

/* ── Fallback demo data (used when no site context is available) ── */
var TU_DEMO_VAVS = [
  { name:'VAV-L1-01', damper_pct:72,  zone_sp_f:70, zone_temp_f:74.5, reheat_valve_pct:0,  occ:1, airflow_cfm:450, airflow_sp_cfm:500, sat_f:57.0 },
  { name:'VAV-L1-02', damper_pct:45,  zone_sp_f:70, zone_temp_f:66.0, reheat_valve_pct:80, occ:1, airflow_cfm:320, airflow_sp_cfm:400, sat_f:95.0 },
  { name:'VAV-L1-03', damper_pct:95,  zone_sp_f:70, zone_temp_f:71.0, reheat_valve_pct:0,  occ:1, airflow_cfm:610, airflow_sp_cfm:600, sat_f:58.0 },
  { name:'VAV-L1-04', damper_pct:30,  zone_sp_f:70, zone_temp_f:74.0, reheat_valve_pct:5,  occ:1, airflow_cfm:280, airflow_sp_cfm:400, sat_f:54.0 },
  { name:'VAV-L1-05', damper_pct:10,  zone_sp_f:70, zone_temp_f:73.0, reheat_valve_pct:85, occ:1, airflow_cfm:500, airflow_sp_cfm:500, sat_f:61.0 },
  { name:'VAV-L1-06', damper_pct:88,  zone_sp_f:70, zone_temp_f:68.0, reheat_valve_pct:0,  occ:0, airflow_cfm:550, airflow_sp_cfm:600, sat_f:57.0 },
  { name:'VAV-L2-01', damper_pct:65,  zone_sp_f:72, zone_temp_f:72.0, reheat_valve_pct:0,  occ:1, airflow_cfm:700, airflow_sp_cfm:700, sat_f:55.0 },
  { name:'VAV-L2-02', damper_pct:20,  zone_sp_f:70, zone_temp_f:75.0, reheat_valve_pct:0,  occ:1, airflow_cfm:150, airflow_sp_cfm:400, sat_f:56.0 },
  { name:'VAV-L2-03', damper_pct:78,  zone_sp_f:70, zone_temp_f:70.5, reheat_valve_pct:0,  occ:1, airflow_cfm:480, airflow_sp_cfm:500, sat_f:56.0 },
  { name:'VAV-L2-04', damper_pct:55,  zone_sp_f:70, zone_temp_f:69.0, reheat_valve_pct:40, occ:1, airflow_cfm:420, airflow_sp_cfm:500, sat_f:88.0 },
  { name:'VAV-L2-05', damper_pct:100, zone_sp_f:70, zone_temp_f:73.0, reheat_valve_pct:0,  occ:1, airflow_cfm:900, airflow_sp_cfm:900, sat_f:57.0 },
  { name:'VAV-L2-06', damper_pct:0,   zone_sp_f:70, zone_temp_f:72.0, reheat_valve_pct:0,  occ:1, airflow_cfm:10,  airflow_sp_cfm:300, sat_f:55.0 },
];

/* ── Column display labels (live server names + demo names) ── */
var TU_COL_LABELS = {
  // Live server columns
  vav:              'VAV',
  areaserved:       'Area Served',
  zoneTempAvg:      'Zone Temp Avg',
  satAvg:           'SAT Avg',
  reheatValveAvg:   'Reheat Valve Avg',
  airflowAvg:       'Airflow Avg',
  airflowSpAvg:     'Airflow SP Avg',
  damperAvg:        'Damper Avg',
  occPct:           'Occ %',
  // Demo columns
  name:             'Name',
  damper_pct:       'Damper %',
  zone_sp_f:        'Zone SP \u00b0F',
  zone_temp_f:      'Zone Temp \u00b0F',
  reheat_valve_pct: 'Reheat Valve %',
  occ:              'Occ',
  airflow_cfm:      'Airflow CFM',
  airflow_sp_cfm:   'Airflow SP CFM',
  sat_f:            'SAT \u00b0F',
};

function _tuAvg(rows, key) {
  var vals = rows.map(function(r) { return r[key]; }).filter(function(v) {
    return v !== null && v !== undefined && !isNaN(+v);
  });
  return vals.length ? vals.reduce(function(s, v) { return s + (+v); }, 0) / vals.length : null;
}

/* Find the first column name that contains any of the given substrings (case-insensitive) */
function _findCol(cols, patterns) {
  for (var i = 0; i < patterns.length; i++) {
    for (var j = 0; j < cols.length; j++) {
      if (cols[j].toLowerCase().indexOf(patterns[i]) !== -1) return cols[j];
    }
  }
  return null;
}

window.mbcxDashboard.components.TerminalUnits = {

  render: function (d) {
    return [
      '<div class="equip-section equip-section--collapsible" id="mbcxTerminalUnitsSection" style="border-left-color:#C2410C;">',
      '  <div class="equip-header equip-header--clickable" onclick="this.closest(\'.equip-section\').classList.toggle(\'equip-section--open\');">',
      '    <div class="equip-header-left">',
      '      <div class="equip-icon" style="background:var(--orange-lt);">',
      '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>',
      '      </div>',
      '      <div><div class="equip-title">Terminal Units</div><div class="equip-meta" id="tuMeta">&mdash; VAVs</div></div>',
      '    </div>',
      '    <div class="equip-collapse-btn" title="Expand / Collapse">',
      '      <svg class="equip-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
      '    </div>',
      '  </div>',
      '  <div class="equip-body">',

      /* Fleet KPI strip */
      '    <div class="tu-kpi-strip">',
      '      <div class="tu-kpi"><div class="tu-kpi-label">Total VAVs</div><div class="tu-kpi-val" id="tuKpiTotal">&mdash;</div><div class="tu-kpi-unit">units</div></div>',
      '      <div class="tu-kpi"><div class="tu-kpi-label">Avg Zone Temp</div><div class="tu-kpi-val" id="tuKpiZone">&mdash;</div><div class="tu-kpi-unit">&deg;F</div></div>',
      '      <div class="tu-kpi"><div class="tu-kpi-label">Avg Supply Air Temp</div><div class="tu-kpi-val" id="tuKpiDat">&mdash;</div><div class="tu-kpi-unit">&deg;F</div></div>',
      '      <div class="tu-kpi"><div class="tu-kpi-label">Avg Reheat Valve</div><div class="tu-kpi-val" id="tuKpiReheat">&mdash;</div><div class="tu-kpi-unit">%</div></div>',
      '    </div>',

      /* View toggle */
      '    <div class="toggle-bar" style="margin-bottom:16px;">',
      '      <button class="toggle-btn active" id="tuBtnTable">VAV Table</button>',
      '      <button class="toggle-btn" id="tuBtnScatter">VAV Reheat Scatter</button>',
      '    </div>',

      /* Table view */
      '    <div id="tuTableView" style="overflow-x:auto;">',
      '      <div class="tu-loading">Loading VAV data\u2026</div>',
      '    </div>',

      /* Scatter view */
      '    <div id="tuScatterView" style="display:none;">',
      '      <div style="position:relative;height:360px;"><canvas id="tuScatterCanvas"></canvas></div>',
      '    </div>',

      '  </div>',
      '</div>'
    ].join('\n');
  },

  initLive: function (container, ctx) {
    var self = this;
    var header = container.querySelector('#mbcxTerminalUnitsSection .equip-header--clickable');
    if (!header) return;

    var populated = false;
    header.addEventListener('click', function () {
      if (populated) return;
      populated = true;
      setTimeout(function () {
        if (ctx && ctx.attestKey && ctx.siteRef) {
          self._fetchLive(container, ctx);
        } else {
          var demoCols = Object.keys(TU_DEMO_VAVS[0]);
          self._populate(container, TU_DEMO_VAVS, demoCols);
        }
      }, 50);
    });
  },

  _fetchLive: function (container, ctx) {
    var self = this;
    var API = window.mbcxDashboard.api;
    var HP  = window.mbcxDashboard.haystackParser;

    var dateArg = (ctx.datesStart && ctx.datesEnd)
      ? ctx.datesStart + '..' + ctx.datesEnd
      : 'today()';
    var expr = 'view_pub_mbcxDashboard_VAVs_table(' + ctx.siteRef + ', ' + dateArg + ')';

    API.evalAxon(ctx.attestKey, ctx.projectName, expr)
      .then(function (grid) {
        var parsed = HP.parseGrid(grid);
        self._populate(container, parsed.rows, parsed.cols);
      })
      .catch(function (err) {
        console.error('[TU] VAV table fetch failed:', err);
        // Fall back to demo data on error
        var demoCols = Object.keys(TU_DEMO_VAVS[0]);
        self._populate(container, TU_DEMO_VAVS, demoCols);
      });
  },

  _populate: function (container, rows, cols) {
    var self = this;

    /* KPIs */
    var zoneCol   = _findCol(cols, ['zonetemp', 'zone_temp']);
    var satCol    = _findCol(cols, ['satavg', 'sat_f', 'supplyairtemp', 'sat']);
    var reheatCol = _findCol(cols, ['reheat']);
    var set = function (id, val) { var el = container.querySelector('#' + id); if (el) el.textContent = val; };
    set('tuKpiTotal',  rows.length);
    set('tuKpiZone',   zoneCol   ? (_tuAvg(rows, zoneCol)   !== null ? _tuAvg(rows, zoneCol).toFixed(1)   : '\u2014') : '\u2014');
    set('tuKpiDat',    satCol    ? (_tuAvg(rows, satCol)    !== null ? _tuAvg(rows, satCol).toFixed(1)    : '\u2014') : '\u2014');
    set('tuKpiReheat', reheatCol ? (_tuAvg(rows, reheatCol) !== null ? _tuAvg(rows, reheatCol).toFixed(1) : '\u2014') : '\u2014');
    set('tuMeta', rows.length + ' VAVs');

    /* Table */
    this._buildTable(container, rows, cols);

    /* Toggle wiring */
    var btnTable    = container.querySelector('#tuBtnTable');
    var btnScatter  = container.querySelector('#tuBtnScatter');
    var tableView   = container.querySelector('#tuTableView');
    var scatterView = container.querySelector('#tuScatterView');
    var scatterInited = false;

    btnTable.addEventListener('click', function () {
      btnTable.classList.add('active');
      btnScatter.classList.remove('active');
      tableView.style.display = '';
      scatterView.style.display = 'none';
    });

    btnScatter.addEventListener('click', function () {
      btnScatter.classList.add('active');
      btnTable.classList.remove('active');
      tableView.style.display = 'none';
      scatterView.style.display = '';
      if (!scatterInited) {
        scatterInited = true;
        setTimeout(function () {
          self._initScatter(container.querySelector('#tuScatterCanvas'), rows, cols);
        }, 30);
      }
    });
  },

  _buildTable: function (container, rows, cols) {
    var tableView = container.querySelector('#tuTableView');
    if (!tableView) return;

    if (!rows.length) {
      tableView.innerHTML = '<div class="tu-loading">No VAV data returned.</div>';
      return;
    }

    var thead = '<thead><tr>' + cols.map(function (k) {
      return '<th class="tu-th">' + (TU_COL_LABELS[k] || k) + '</th>';
    }).join('') + '</tr></thead>';

    var tbody = '<tbody>' + rows.map(function (row) {
      return '<tr>' + cols.map(function (k, i) {
        var val = row[k];
        if (k === 'occ') val = val === 1 ? 'Occ' : val === 0 ? 'Unocc' : val;
        // Format Ref objects (from haystackParser) to their display string
        if (val && typeof val === 'object' && val.dis) val = val.dis;
        var cls = i === 0 ? 'tu-td tu-td-name' : 'tu-td tu-td-num';
        return '<td class="' + cls + '">' + (val !== null && val !== undefined ? val : '\u2014') + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';

    tableView.innerHTML = '<table class="tu-table">' + thead + tbody + '</table>';
  },

  _initScatter: function (canvas, rows, cols) {
    if (!canvas || !window.Chart) return;

    var xCol    = _findCol(cols, ['zonetemp', 'zone_temp']);
    var yCol    = _findCol(cols, ['reheat']);
    var sizeCol = _findCol(cols, ['airflow', 'cfm']);

    if (!xCol || !yCol) {
      var wrap = canvas.parentElement;
      if (wrap) wrap.innerHTML = '<div class="tu-loading">Reheat scatter requires zone temp and reheat valve columns.</div>';
      return;
    }

    var points = rows.map(function (r) {
      var rv  = +(r[yCol]) || 0;
      var bg  = rv >= 60 ? 'rgba(155,35,53,0.80)'
              : rv >= 20 ? 'rgba(217,119,6,0.75)'
              :            'rgba(74,111,165,0.60)';
      var rad = sizeCol ? Math.max(5, Math.min(18, (+r[sizeCol] || 0) / 60)) : 7;
      var nameCol = _findCol(cols, ['vav', 'name']);
      return { x: +(r[xCol]) || 0, y: rv, r: rad, name: nameCol ? r[nameCol] : '', bg: bg };
    });

    new window.Chart(canvas, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'VAVs',
          data: points.map(function (p) { return { x: p.x, y: p.y, r: p.r }; }),
          backgroundColor: points.map(function (p) { return p.bg; }),
          borderColor:     points.map(function (p) { return p.bg.replace(/[\d.]+\)$/, '1)'); }),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1F2937',
            titleFont: { size: 12, weight: '600' },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: function (items) { return points[items[0].dataIndex].name || 'VAV'; },
              label: function (item) {
                var lines = [
                  'Zone Temp: ' + item.raw.x + '\u00b0F',
                  'Reheat Valve: ' + item.raw.y + '%'
                ];
                if (sizeCol) lines.push('Airflow: ' + (rows[item.dataIndex][sizeCol] || '\u2014') + ' CFM');
                return lines;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Zone Temp (\u00b0F)', font: { size: 11 }, color: '#9CA3AF' },
            ticks: { font: { size: 10 }, color: '#9CA3AF' },
            grid: { color: '#F3F4F6' }
          },
          y: {
            min: 0, max: 100,
            title: { display: true, text: 'Reheat Valve (%)', font: { size: 11 }, color: '#9CA3AF' },
            ticks: { font: { size: 10 }, color: '#9CA3AF', callback: function (v) { return v + '%'; } },
            grid: { color: '#F3F4F6' }
          }
        }
      }
    });
  }
};
