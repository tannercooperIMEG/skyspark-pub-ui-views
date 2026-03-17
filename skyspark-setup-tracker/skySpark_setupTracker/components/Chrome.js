/**
 * components/Chrome.js
 * Top navigation bar — IMEG wordmark, module label, fullscreen toggle, user avatar.
 */
(function () {
  const h = window.React.createElement;
  window.ST.Components = window.ST.Components || {};

  window.ST.Components.Chrome = function Chrome({ isFullscreen, onToggleFullscreen }) {
    return h('header', { className: 'st-chrome' },
      h('div', { className: 'st-wordmark' },
        h('div', { className: 'st-wordmark-sym' }, h('span', null, 'IM')),
        h('span', { className: 'st-wordmark-text' }, 'IMEG')
      ),
      h('div', { className: 'st-chrome-sep' }),
      h('span', { className: 'st-chrome-mod' }, 'Setup Manager'),
      h('div', { className: 'st-chrome-right' },
        h('button', {
          className: 'st-fullscreen-btn',
          onClick: onToggleFullscreen,
          title: isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'
        }, isFullscreen ? '⤡  Exit Full Screen' : '⤢  Full Screen'),
        h('div', { className: 'st-avatar-wrap' },
          h('div', { className: 'st-avatar' }, 'JD'),
          h('span', { className: 'st-user-name' }, 'J. Davis')
        )
      )
    );
  };
})();
