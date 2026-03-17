/**
 * skySpark_setupTrackerUI.js
 * UI bootstrap — loads React, CSS, and all modules, then mounts the app.
 */
(function () {
  console.log('[skySpark_setupTracker] UI module executing.');

  window.ST = window.ST || {};

  var _arg = null;
  var _basePath = null;
  var _reactRoot = null;

  window.ST.update = function (arg) {
    _arg = arg;
    if (window.ST._render) window.ST._render();
  };

  window.ST.init = function (arg, basePath) {
    _arg = arg;
    _basePath = basePath;

    // Inject CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = basePath + 'skySpark_setupTrackerStyles.css';
    document.head.appendChild(link);

    // Sequential load order matters — React first, then everything else
    var scripts = [
      'https://unpkg.com/react@18/umd/react.production.min.js',
      'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
      basePath + 'utils/helpers.js',
      basePath + 'utils/api.js',            // REST eval helper — must load before evals
      basePath + 'constants/data.js',
      basePath + 'evals/loadProjects.js',   // must load before hook
      basePath + 'hooks/useSetupTracker.js',
      basePath + 'components/Chrome.js',
      basePath + 'components/Rail.js',
      basePath + 'components/ProjectHeader.js',
      basePath + 'components/StatsStrip.js',
      basePath + 'components/TasksPanel.js',
      basePath + 'components/ReplyPanel.js',
      basePath + 'components/NewProjectModal.js',
      basePath + 'components/NewTaskModal.js',
      basePath + 'App.js'
    ];

    function loadNext(idx) {
      if (idx >= scripts.length) {
        mountApp();
        return;
      }
      var s = document.createElement('script');
      s.src = scripts[idx];
      s.onload = function () { loadNext(idx + 1); };
      s.onerror = function () {
        console.error('[skySpark_setupTracker] Failed to load: ' + scripts[idx]);
        loadNext(idx + 1);
      };
      document.head.appendChild(s);
    }

    loadNext(0);
  };

  function mountApp() {
    var elem = _arg.elem;
    if (!elem) return;

    var root = document.createElement('div');
    root.style.cssText = 'height:100%;width:100%;';
    elem.appendChild(root);

    _reactRoot = window.ReactDOM.createRoot(root);

    window.ST._render = function () {
      _reactRoot.render(
        window.React.createElement(window.ST.App, { arg: _arg })
      );
    };

    window.ST._render();
    console.log('[skySpark_setupTracker] App mounted. window.ST exposed.');
  }
})();
