// components/TerminalUnits.js — VAV Terminal Units section
window.mbcxDashboard = window.mbcxDashboard || {};
window.mbcxDashboard.components = window.mbcxDashboard.components || {};

/* ── Demo VAV data (replace with live eval when ready) ── */
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

var TU_COL_LABELS = {
  name:             'Name',
  damper_pct:       'Damper %',
  zone_sp_f:        'Zone SP °F',
  zone_temp_f:      'Zone Temp °F',
  reheat_valve_pct: 'Reheat Valve %',
  occ:              'Occ',
  airflow_cfm:      'Airflow CFM',
  airflow_sp_cfm:   'Airflow SP CFM',
  sat_f:            'SAT °F',
};

function _tuAvg(rows, key) {
  var vals = rows.map(function(r) { return r[key]; }).filter(function(v) {
    return v !== null && v !== undefined && !isNaN(v);
  });
  return vals.length ? vals.reduce(function(s, v) { return s + v; }, 0) / vals.length : null;
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
      '      <div class="tu-kpi">',
      '        <div class="tu-kpi-label">Total VAVs</div>',
      '        <div class="tu-kpi-val" id="tuKpiTotal">&mdash;</div>',
      '        <div class="tu-kpi-unit">units</div>',
      '      </div>',
      '      <div class="tu-kpi">',
      '        <div class="tu-kpi-label">Avg Zone Temp</div>',
      '        <div class="tu-kpi-val" id="tuKpiZone">&mdash;</div>',
      '        <div class="tu-kpi-unit">&deg;F</div>',
      '      </div>',
      '      <div class="tu-kpi">',
      '        <div class="tu-kpi-label">Avg Supply Air Temp</div>',
      '        <div class="tu-kpi-val" id="tuKpiDat">&mdash;</div>',
      '        <div class="tu-kpi-unit">&deg;F</div>',
      '      </div>',
      '      <div class="tu-kpi">',
      '        <div class="tu-kpi-label">Avg Reheat Valve</div>',
      '        <div class="tu-kpi-val" id="tuKpiReheat">&mdash;</div>',
      '        <div class="tu-kpi-unit">%</div>',
      '      </div>',
      '    </div>',

      /* View toggle */
      '    <div class="toggle-bar" style="margin-bottom:16px;">',
      '      <button class="toggle-btn active" id="tuBtnTable">VAV Table</button>',
      '      <button class="toggle-btn" id="tuBtnScatter">VAV Reheat Scatter</button>',
      '    </div>',

      /* Table view */
      '    <div id="tuTableView" style="overflow-x:auto;">',
      '      <table class="tu-table">',
      '        <thead id="tuThead"></thead>',
      '        <tbody id="tuTbody"></tbody>',
      '      </table>',
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
        self._populate(container, TU_DEMO_VAVS);
      }, 50);
    });
  },

  _populate: function (container, data) {
    /* KPIs */
    var zoneAvg   = _tuAvg(data, 'zone_temp_f');
    var datAvg    = _tuAvg(data, 'sat_f');
    var reheatAvg = _tuAvg(data, 'reheat_valve_pct');

    var set = function(id, val) { var el = container.querySelector('#' + id); if (el) el.textContent = val; };
    set('tuKpiTotal',  data.length);
    set('tuKpiZone',   zoneAvg   !== null ? zoneAvg.toFixed(1)   : '—');
    set('tuKpiDat',    datAvg    !== null ? datAvg.toFixed(1)    : '—');
    set('tuKpiReheat', reheatAvg !== null ? reheatAvg.toFixed(1) : '—');
    set('tuMeta',      data.length + ' VAVs');

    /* Table */
    this._buildTable(container, data);

    /* Toggle wiring */
    var self = this;
    var btnTable   = container.querySelector('#tuBtnTable');
    var btnScatter = container.querySelector('#tuBtnScatter');
    var tableView  = container.querySelector('#tuTableView');
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
          self._initScatter(container.querySelector('#tuScatterCanvas'), data);
        }, 30);
      }
    });
  },

  _buildTable: function (container, data) {
    if (!data.length) return;
    var keys  = Object.keys(data[0]);
    var thead = container.querySelector('#tuThead');
    var tbody = container.querySelector('#tuTbody');
    if (!thead || !tbody) return;

    thead.innerHTML = '<tr>' + keys.map(function (k) {
      return '<th class="tu-th">' + (TU_COL_LABELS[k] || k) + '</th>';
    }).join('') + '</tr>';

    tbody.innerHTML = data.map(function (row) {
      return '<tr>' + keys.map(function (k, i) {
        var val = row[k];
        if (k === 'occ') val = val === 1 ? 'Occ' : val === 0 ? 'Unocc' : val;
        var cls = i === 0 ? 'tu-td tu-td-name' : 'tu-td tu-td-num';
        return '<td class="' + cls + '">' + (val !== null && val !== undefined ? val : '—') + '</td>';
      }).join('') + '</tr>';
    }).join('');
  },

  _initScatter: function (canvas, data) {
    if (!canvas || !window.Chart) return;

    var points = data.map(function (r) {
      var rv = r.reheat_valve_pct;
      var bg = rv >= 60 ? 'rgba(155,35,53,0.80)'
             : rv >= 20 ? 'rgba(217,119,6,0.75)'
             :            'rgba(74,111,165,0.60)';
      return {
        x: r.zone_temp_f,
        y: rv,
        r: Math.max(5, Math.min(18, r.airflow_cfm / 60)),
        name: r.name,
        bg: bg
      };
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
              title: function (items) { return points[items[0].dataIndex].name; },
              label: function (item) {
                return [
                  'Zone Temp: ' + item.raw.x + '\u00b0F',
                  'Reheat Valve: ' + item.raw.y + '%',
                  'Airflow: ' + TU_DEMO_VAVS[item.dataIndex].airflow_cfm + ' CFM'
                ];
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
            ticks: { font: { size: 10 }, color: '#9CA3AF', callback: function(v) { return v + '%'; } },
            grid: { color: '#F3F4F6' }
          }
        }
      }
    });
  }
};
