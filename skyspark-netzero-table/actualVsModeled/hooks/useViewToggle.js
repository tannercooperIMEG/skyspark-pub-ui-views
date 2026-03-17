// hooks/useViewToggle.js
// Custom React hook for the Charts / Table view toggle.

window.ActualVsModeled = window.ActualVsModeled || {};
window.ActualVsModeled.hooks = window.ActualVsModeled.hooks || {};

window.ActualVsModeled.hooks.useViewToggle = function useViewToggle(initialView) {
  var state   = React.useState(initialView || 'table');
  var view    = state[0];
  var setView = state[1];

  var toggle = React.useCallback(function (mode) {
    setView(mode);
  }, []);

  return { view: view, toggle: toggle };
};
