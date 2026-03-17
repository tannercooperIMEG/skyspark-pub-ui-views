/**
 * skySpark_setupTrackerEntry.js
 * Entry point — loaded by SkySpark view record.
 *
 * Registers the global handler SkySpark looks for, then lazily loads
 * the full UI module from the companion directory on first onUpdate call.
 */
(function () {
  console.log('[skySpark_setupTracker] Entry file loaded.');

  var _initialized = false;
  var _pubBase = null;

  function detectPubBase() {
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src.indexOf('skySpark_setupTrackerEntry') !== -1) {
        var src = scripts[i].src;
        return src.substring(0, src.lastIndexOf('/') + 1);
      }
    }
    return '/pub/ui/';
  }

  window.skySpark_setupTrackerHandler = {
    onUpdate: function (arg) {
      if (!_initialized) {
        _initialized = true;
        _pubBase = detectPubBase();
        var uiSrc = _pubBase + 'skySpark_setupTracker/skySpark_setupTrackerUI.js';
        console.log('[skySpark_setupTracker] Loading UI module from: ' + uiSrc);

        var script = document.createElement('script');
        script.src = uiSrc;
        script.onload = function () {
          if (window.ST && window.ST.init) {
            window.ST.init(arg, _pubBase + 'skySpark_setupTracker/');
          }
        };
        script.onerror = function () {
          console.error('[skySpark_setupTracker] Failed to load UI module.');
        };
        document.head.appendChild(script);
      } else {
        if (window.ST && window.ST.update) window.ST.update(arg);
      }
    }
  };
})();
