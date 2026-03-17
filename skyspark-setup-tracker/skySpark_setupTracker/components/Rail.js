/**
 * components/Rail.js
 * Left sidebar — searchable project list with progress bars.
 */
(function () {
  const h = window.React.createElement;
  const { useState } = window.React;
  const U = window.ST.Utils;
  window.ST.Components = window.ST.Components || {};

  window.ST.Components.Rail = function Rail({ projects, selProjId, visible, onSelectProject, onDeleteProject, onNewProject }) {
    const [query, setQuery] = useState('');

    const filtered = query
      ? projects.filter(p => (p.title + p.num + p.type).toLowerCase().includes(query.toLowerCase()))
      : projects;

    return h('aside', { className: 'st-rail' + (visible ? '' : ' hidden') },
      h('div', { className: 'st-rail-head' },
        h('span', { className: 'st-section-label' }, 'Projects'),
        h('button', { className: 'st-btn-new', onClick: onNewProject }, '+ New')
      ),
      h('div', { className: 'st-rail-search' },
        h('div', { className: 'st-search-wrap' },
          h('span', { className: 'st-search-icon' }, '⌕'),
          h('input', {
            type: 'text', placeholder: 'Search projects…',
            value: query, onChange: e => setQuery(e.target.value)
          })
        )
      ),
      h('div', { className: 'st-proj-list' },
        filtered.map(p => h(ProjectCard, {
          key: p.id, p, active: p.id === selProjId,
          onSelect: () => onSelectProject(p.id),
          onDelete: () => { if (confirm('Delete this project and all its tasks?')) onDeleteProject(p.id); }
        }))
      )
    );
  };

  function ProjectCard({ p, active, onSelect, onDelete }) {
    // Use server-provided percComplete when available; fall back to task-derived %
    const pc  = p.percComplete !== undefined ? p.percComplete : window.ST.Utils.pct(p);
    const due = window.ST.Utils.dueLabel(p);

    return h('div', { className: 'st-proj-card' + (active ? ' active' : ''), onClick: onSelect },
      h('div', { className: 'st-proj-card-top' },
        h('div', { className: 'st-proj-title' }, p.title),
        h('span', { className: 'st-type-pill ' + window.ST.Utils.pillClass(p.type) }, p.type)
      ),
      h('div', { className: 'st-proj-sub' },
        h('span', { className: 'st-proj-num' }, p.num),
        h('span', { className: 'st-proj-due' + (due.late ? ' late' : '') }, due.text)
      ),
      h('div', { className: 'st-proj-bar' },
        h('div', { className: 'st-proj-bar-fill', style: { width: pc + '%' } })
      ),
      h('button', {
        className: 'st-proj-del',
        onClick: e => { e.stopPropagation(); onDelete(); }
      }, '✕')
    );
  }
})();
