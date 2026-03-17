/**
 * App.js
 * Root React component — composes all panels using state from useSetupTracker.
 */
(function () {
  const h = window.React.createElement;
  const { useSetupTracker } = window.ST.Hooks;
  const C = window.ST.Components;

  window.ST.App = function App({ arg }) {
    const s = useSetupTracker(arg);

    if (s.isLoading) {
      return h('div', { className: 'st-wrap' + (s.isFullscreen ? ' st-fullscreen' : '') },
        h(C.Chrome, { isFullscreen: s.isFullscreen, onToggleFullscreen: () => s.setIsFullscreen(f => !f) }),
        h('div', { className: 'st-loading-state' },
          h('div', { className: 'st-spinner' }),
          h('div', { className: 'st-loading-label' }, 'Loading projects from SkySpark…')
        )
      );
    }

    return h('div', { className: 'st-wrap' + (s.isFullscreen ? ' st-fullscreen' : '') },
      h(C.Chrome, {
        isFullscreen: s.isFullscreen,
        onToggleFullscreen: () => s.setIsFullscreen(f => !f)
      }),

      h('div', { className: 'st-workspace' },
        h(C.Rail, {
          projects:        s.projects,
          selProjId:       s.selProjId,
          visible:         s.railVisible,
          onSelectProject: s.selectProject,
          onDeleteProject: s.deleteProject,
          onNewProject:    () => s.setShowNewProject(true)
        }),

        h('div', { className: 'st-main' },
          s.proj && h(C.ProjectHeader, {
            proj:          s.proj,
            railVisible:   s.railVisible,
            onToggleRail:  () => s.setRailVisible(v => !v)
          }),

          s.proj && h(C.StatsStrip, { proj: s.proj }),

          h('div', { className: 'st-lower' },
            s.proj
              ? h(C.TasksPanel, {
                  proj:         s.proj,
                  stageFilter:  s.stageFilter,
                  selTaskIdx:   s.selTaskIdx,
                  onStageFilter: s.setStageFilter,
                  onSelectTask:  s.selectTask,
                  onToggleTask:  s.toggleTask,
                  onDeleteTask:  s.deleteTask,
                  onNewTask:     () => s.setShowNewTask(true)
                })
              : h('div', { className: 'st-empty' },
                  h('div', { className: 'st-empty-glyph' }, '◫'),
                  h('div', { className: 'st-empty-h' }, 'No project selected'),
                  h('div', { className: 'st-empty-p' }, 'Choose a project from the list.')
                ),

            h(C.ReplyPanel, {
              proj:         s.proj,
              selTaskIdx:   s.selTaskIdx,
              onSendReply:  s.sendReply
            })
          )
        )
      ),

      h(C.NewProjectModal, {
        isOpen:    s.showNewProject,
        onClose:   () => s.setShowNewProject(false),
        onConfirm: s.addProject
      }),
      h(C.NewTaskModal, {
        isOpen:    s.showNewTask,
        onClose:   () => s.setShowNewTask(false),
        onConfirm: s.addTask
      })
    );
  };
})();
