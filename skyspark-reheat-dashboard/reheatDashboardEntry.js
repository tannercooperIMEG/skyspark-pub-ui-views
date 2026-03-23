// reheatDashboardEntry.js
// Deploy to: {var}/pub/ui/ ROOT on every server (local and cloud)
// SkySpark only auto-discovers JS at pub/ui/ root — subdirs are ignored.
// The handler is loaded dynamically so it can live in a subdirectory on the cloud.
//
// View record (trio) jsHandler should point to: reheatDashboardHandler

(function () {
  var src = '/pub/ui/reheatDashboard/reheatDashboardHandler.js';
  var script = document.createElement('script');
  script.src = src;
  script.async = false;
  script.onload = function () {
    console.log('[reheatDashboard] Handler loaded. window.reheatDashboardApp:', typeof window.reheatDashboardApp);
  };
  script.onerror = function () {
    console.error('[reheatDashboard] Failed to load handler from:', src);
  };
  document.head.appendChild(script);
})();

var reheatDashboardHandler = {};

reheatDashboardHandler.onUpdate = function (arg) {
  var view = arg.view;
  var elem = arg.elem;
  view.removeAll();
  if (window.reheatDashboardApp && typeof window.reheatDashboardApp.onUpdate === 'function') {
    window.reheatDashboardApp.onUpdate(arg);
  } else {
    console.warn('[reheatDashboard] onUpdate called but window.reheatDashboardApp not ready yet.');
  }
};
