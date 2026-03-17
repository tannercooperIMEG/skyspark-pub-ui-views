/**
 * components/ProjectHeader.js
 * Project name, metadata tags, and rail toggle button.
 */
(function () {
  const h = window.React.createElement;
  window.ST.Components = window.ST.Components || {};

  window.ST.Components.ProjectHeader = function ProjectHeader({ proj, railVisible, onToggleRail }) {
    const U = window.ST.Utils;
    const pc = U.pct(proj);

    return h('div', { className: 'st-proj-header' },
      h('span', { className: 'st-proj-header-name' }, proj.title),
      h('div', { className: 'st-proj-header-tags' },
        h('span', { className: 'st-tag' }, proj.num),
        h('span', { className: 'st-tag' }, proj.type),
        h('span', { className: 'st-tag' }, proj.conn),
        h('span', { className: 'st-tag green' }, pc + '% complete')
      ),
      h('button', { className: 'st-rail-toggle', onClick: onToggleRail },
        (railVisible ? '◂ ' : '▸ ') + 'Projects'
      )
    );
  };
})();
