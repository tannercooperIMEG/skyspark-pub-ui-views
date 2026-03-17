// actualVsModeledEntry.js
// Deploy to: {var}/pub/ui/ ROOT on every SkySpark server
// SkySpark only auto-discovers JS at pub/ui/ root — subdirs are ignored.
// The UI module is loaded dynamically so it can live in a subdirectory on the cloud.
//
// View record (trio) jsHandler should point to: actualVsModeledHandler

(function () {
  var src = '/pub/ui/actualVsModeled/actualVsModeledUI.js';
  var script = document.createElement('script');
  script.src = src;
  script.async = false;
  script.onload = function () {
    console.log('[actualVsModeled] UI module loaded. window.actualVsModeled:', typeof window.actualVsModeled);
  };
  script.onerror = function () {
    console.error('[actualVsModeled] Failed to load UI module from:', src);
  };
  document.head.appendChild(script);
})();

var actualVsModeledHandler = {};
actualVsModeledHandler.onUpdate = function (arg) {
  var view = arg.view;
  var elem = arg.elem;
  view.removeAll();
  if (window.actualVsModeled && typeof window.actualVsModeled.onUpdate === 'function') {
    window.actualVsModeled.onUpdate(arg);
  } else {
    console.warn('[actualVsModeled] onUpdate called but window.actualVsModeled not ready yet.');
  }
};
