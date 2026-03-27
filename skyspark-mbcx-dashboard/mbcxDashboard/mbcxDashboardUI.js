// mbcxDashboardUI.js
// Bootstrap module — loads CSS, reads SkySpark session, fetches data, renders app.
window.mbcxDashboard = window.mbcxDashboard || {};

(function (NS) {
  var CSS_ID   = 'mbcxDashboardCSS';
  var CSS_PATH = '/pub/ui/mbcxDashboard/mbcxDashboardStyles.css';
  var _fetchGen = 0;

  function loadStyles() {
    if (document.getElementById(CSS_ID)) return;
    var link  = document.createElement('link');
    link.id   = CSS_ID;
    link.rel  = 'stylesheet';
    link.href = CSS_PATH + '?_v=' + Date.now();
    document.head.appendChild(link);
  }

  function renderError(container, msg) {
    container.innerHTML =
      '<div style="padding:1rem;color:#b91c1c;background:#fef2f2;border-radius:6px;margin:1rem;font-size:0.85rem">' +
      'Error: ' + msg + '</div>';
  }

  NS.onUpdate = function (arg) {
    var view = arg.view;
    var elem = arg.elem;
    view.removeAll();
    loadStyles();

    elem.style.width  = '100%';
    elem.style.height = '100%';
    elem.style.overflow = 'auto';

    var container = document.createElement('div');
    container.id = 'mbcxDashboard';
    elem.appendChild(container);

    // Attempt SkySpark session
    var attestKey = null, projectName = null, siteRef = null;
    try {
      var session = view.session();
      attestKey   = session.attestKey();
      projectName = session.proj().name();
    } catch (e) {
      console.warn('[mbcxDashboard] No SkySpark session — using demo data.');
    }

    // Read site view variable (Ref)
    if (attestKey) {
      try {
        var siteVal = view.var('site');
        if (siteVal) {
          // Haystack Ref may be an object with .id or .val, or a plain string
          siteRef = (typeof siteVal === 'object')
            ? (siteVal.id || siteVal.val || null)
            : String(siteVal);
        }
      } catch (e) {
        console.warn('[mbcxDashboard] Could not read site var:', e);
      }
    }

    var ctx = { attestKey: attestKey, projectName: projectName, siteRef: siteRef };

    if (attestKey && projectName) {
      var gen = ++_fetchGen;
      container.innerHTML = '<div style="padding:2rem;color:#888">Loading\u2026</div>';
      NS.evals.loadData(attestKey, projectName)
        .then(function (data) {
          if (gen !== _fetchGen) return;
          container.innerHTML = '';
          NS.App.init(container, data, ctx);
        })
        .catch(function (err) {
          if (gen !== _fetchGen) return;
          console.warn('[mbcxDashboard] Live data failed, falling back to demo:', err);
          NS.App.init(container, NS.demoData, ctx);
        });
    } else {
      NS.App.init(container, NS.demoData, ctx);
    }
  };

  window.mbcxDashboardApp = NS;
  console.log('[mbcxDashboard] UI module ready.');
})(window.mbcxDashboard);
