/**
 * components/TasksPanel.js
 * Stage-filtered task list with check-to-complete, assignee, and reply count.
 */
(function () {
  const h = window.React.createElement;
  window.ST.Components = window.ST.Components || {};

  const STAGES = ['Stage 01', 'Stage 02', 'Stage 03', 'Stage 04'];
  const TABS   = [{ key: 'all', label: 'All' }, ...STAGES.map(s => ({ key: s, label: s.replace('Stage ', 'S') }))];

  window.ST.Components.TasksPanel = function TasksPanel({
    proj, stageFilter, selTaskIdx,
    onStageFilter, onSelectTask, onToggleTask, onDeleteTask, onNewTask
  }) {
    const visibleStages = stageFilter === 'all' ? STAGES : [stageFilter];
    const { STAGE_DOTS, STAGE_NAMES } = window.ST.Constants;

    return h('div', { className: 'st-tasks-panel' },
      // Tab bar
      h('div', { className: 'st-panel-head' },
        h('div', { className: 'st-stage-tabs' },
          TABS.map(t =>
            h('button', {
              key: t.key,
              className: 'st-s-tab' + (stageFilter === t.key ? ' on' : ''),
              onClick: () => onStageFilter(t.key)
            }, t.label)
          )
        ),
        h('button', { className: 'st-icon-btn', title: 'Add task', onClick: onNewTask }, '+')
      ),

      // Task list
      h('div', { className: 'st-task-scroller' },
        visibleStages.map(stage => {
          const tasks = proj.tasks.filter(t => t.stage === stage);
          const closedCount = tasks.filter(t => t.status === 'closed').length;
          const sp = tasks.length ? Math.round(closedCount / tasks.length * 100) : 0;
          const globalIdxOf = t => proj.tasks.indexOf(t);

          return h(window.React.Fragment, { key: stage },
            // Stage group header
            h('div', { className: 'st-stage-grp-head' },
              h('div', { className: 'st-sg-dot', style: { background: STAGE_DOTS[stage] } }),
              h('span', { className: 'st-sg-label' }, stage + ' — ' + STAGE_NAMES[stage]),
              h('span', { className: 'st-sg-tally' }, closedCount + '/' + tasks.length),
              h('span', { className: 'st-sg-pct' }, sp + '%')
            ),
            // Task rows
            ...tasks.map(task => {
              const gi = globalIdxOf(task);
              const done = task.status === 'closed';
              return h('div', {
                key: gi,
                className: 'st-task-row' + (gi === selTaskIdx ? ' sel' : ''),
                onClick: () => onSelectTask(gi)
              },
                h('div', {
                  className: 'st-check' + (done ? ' done' : ''),
                  onClick: e => { e.stopPropagation(); onToggleTask(gi); }
                }, done ? '✓' : ''),
                h('div', { className: 'st-task-body' },
                  h('div', { className: 'st-task-title' + (done ? ' done' : '') }, task.title),
                  h('div', { className: 'st-task-foot' },
                    h('span', { className: 'st-step-tag' }, stage + ' · ' + task.step),
                    h('span', { className: 'st-assignee' },
                      h('span', { className: 'st-a-dot' }, task.assignee.charAt(0)),
                      task.assignee
                    ),
                    task.replies.length
                      ? h('span', { className: 'st-reply-badge' }, '💬 ' + task.replies.length)
                      : null
                  )
                ),
                h('button', {
                  className: 'st-row-del',
                  onClick: e => { e.stopPropagation(); onDeleteTask(gi); }
                }, '✕')
              );
            })
          );
        })
      )
    );
  };
})();
