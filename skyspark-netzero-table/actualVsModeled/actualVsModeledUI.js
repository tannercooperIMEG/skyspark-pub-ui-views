// actualVsModeledUI.js
// Main UI module for the Actual vs. Modeled view.
// Loaded dynamically by actualVsModeledEntry.js.
// Responsibilities:
//   1. Inject the stylesheet
//   2. Load React + ReactDOM from CDN
//   3. Load all app modules sequentially
//   4. Render the React app on each onUpdate call
//   5. Expose window.actualVsModeled for entry-file delegation

(function () {

  var BASE = '/pub/ui/actualVsModeled/';

  var MODULES = [
    'constants/demoData.js',
    'utils/api.js',
    'evals/loadData.js',
    'hooks/useViewToggle.js',
    'components/Header.js',
    'components/KpiRow.js',
    'components/BarChart.js',
    'components/ChartsView.js',
    'components/TableView.js',
    'App.js'
  ];

  var REACT_CDN    = 'https://unpkg.com/react@18/umd/react.production.min.js';
  var REACT_DOM_CDN = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
  var CSS_HREF     = BASE + 'actualVsModeledStyles.css';
  var CSS_ID       = 'actualVsModeled-styles';

  // ── CSS ──────────────────────────────────────────────────────────────────

  function injectCSS() {
    if (document.getElementById(CSS_ID)) return;
    var link = document.createElement('link');
    link.id   = CSS_ID;
    link.rel  = 'stylesheet';
    link.href = CSS_HREF;
    document.head.appendChild(link);
  }

  // ── Sequential script loader ─────────────────────────────────────────────

  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload  = function () { cb(null); };
    s.onerror = function () {
      console.error('[actualVsModeled] Failed to load:', src);
      cb(new Error('load failed: ' + src));
    };
    document.head.appendChild(s);
  }

  function loadSequential(srcs, cb) {
    var i = 0;
    function next(err) {
      if (err || i >= srcs.length) { cb(err || null); return; }
      loadScript(srcs[i++], next);
    }
    next(null);
  }

  // ── Bootstrap ────────────────────────────────────────────────────────────

  var _loaded  = false;
  var _loading = false;
  var _pending = [];

  function bootstrap(cb) {
    if (_loaded)  { cb(); return; }
    _pending.push(cb);
    if (_loading) return;
    _loading = true;

    injectCSS();

    var vendorSrcs = [REACT_CDN, REACT_DOM_CDN];
    var appSrcs    = MODULES.map(function (m) { return BASE + m; });

    loadSequential(vendorSrcs, function (err) {
      if (err) { _pending.forEach(function (fn) { fn(err); }); _pending = []; return; }
      loadSequential(appSrcs, function (err2) {
        _loaded  = true;
        _loading = false;
        var cbs  = _pending.slice();
        _pending = [];
        cbs.forEach(function (fn) { fn(err2 || null); });
      });
    });
  }

  // ── React root management ────────────────────────────────────────────────
  // Store root on the elem so repeated onUpdate calls cleanly re-render.

  function getOrCreateRoot(container) {
    if (!container._avmReactRoot) {
      container._avmReactRoot = ReactDOM.createRoot(container);
    }
    return container._avmReactRoot;
  }

  // ── Handler ──────────────────────────────────────────────────────────────

  var actualVsModeledHandler = {};

  actualVsModeledHandler.onUpdate = function (arg) {
    var view = arg.view;
    var elem = arg.elem;

    bootstrap(function (err) {
      if (err) {
        elem.innerHTML = '<div style="padding:20px;color:#e74c3c">Failed to load Actual vs. Modeled view: ' + err.message + '</div>';
        return;
      }

      var App      = window.ActualVsModeled.App;
      var loadData = window.ActualVsModeled.evals.loadData;

      loadData(view).then(function (data) {
        var root      = getOrCreateRoot(elem);
        var appProps  = { data: data, view: view };
        root.render(React.createElement(App, appProps));
        console.log('[actualVsModeled] React app rendered.');
      }).catch(function (e) {
        console.error('[actualVsModeled] Data load error:', e);
        elem.innerHTML = '<div style="padding:20px;color:#e74c3c">Error loading data: ' + e.message + '</div>';
      });
    });
  };

  // Expose under the app global that the entry file delegates to
  window.actualVsModeled = actualVsModeledHandler;
  console.log('[actualVsModeled] UI module ready. window.actualVsModeled exposed.');

})();
