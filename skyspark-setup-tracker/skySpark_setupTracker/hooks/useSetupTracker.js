/**
 * hooks/useSetupTracker.js
 * Central state hook — owns all projects/task state and action handlers.
 * Loads live project data from SkySpark on mount; falls back to sample data
 * when no SkySpark context is available (local dev / preview).
 */
(function () {
  window.ST = window.ST || {};
  window.ST.Hooks = window.ST.Hooks || {};

  const { useState, useCallback, useEffect } = window.React;
  const { sampleProjects, defaultTasks } = window.ST.Constants;

  window.ST.Hooks.useSetupTracker = function useSetupTracker(arg) {
    const [projects,       setProjects]       = useState([]);
    const [selProjId,      setSelProjId]      = useState(null);
    const [selTaskIdx,     setSelTaskIdx]      = useState(null);
    const [stageFilter,    setStageFilter]    = useState('all');
    const [isFullscreen,   setIsFullscreen]   = useState(true);   // default: fullscreen
    const [railVisible,    setRailVisible]    = useState(true);
    const [showNewProject, setShowNewProject] = useState(false);
    const [showNewTask,    setShowNewTask]    = useState(false);
    const [isLoading,      setIsLoading]      = useState(true);
    const [loadError,      setLoadError]      = useState(null);

    // ── Load projects on mount ──────────────────────────────────────────────
    useEffect(() => {
      const view = arg && arg.view;

      // Extract session credentials the same way as earlhamHWTable
      let attestKey, projectName;
      try {
        const session = view && view.session();
        attestKey   = session && session.attestKey();
        projectName = session && session.proj && session.proj().name();
      } catch (e) {}

      if (!attestKey || !projectName) {
        // No SkySpark session available — use sample data (local preview / dev)
        console.log('[skySpark_setupTracker] No SkySpark session — using sample data.');
        const samples = sampleProjects();
        setProjects(samples);
        setSelProjId(samples[0].id);
        setIsLoading(false);
        return;
      }

      console.log('[skySpark_setupTracker] Loading projects from SkySpark… project:', projectName);
      window.ST.Evals.loadProjects(attestKey, projectName)
        .then(function (parsed) {
          console.log('[skySpark_setupTracker] Loaded ' + parsed.length + ' projects.');
          setProjects(parsed);
          setSelProjId(parsed.length ? parsed[0].id : null);
          setIsLoading(false);
        })
        .catch(function (err) {
          console.error('[skySpark_setupTracker] Failed to load projects:', err);
          setLoadError(err.message || 'Failed to load projects.');
          // Fall back to sample data so the UI stays usable
          const samples = sampleProjects();
          setProjects(samples);
          setSelProjId(samples[0].id);
          setIsLoading(false);
        });
    }, []); // run once on mount

    const proj = projects.find(p => p.id === selProjId) || null;

    const selectProject = useCallback((id) => {
      setSelProjId(id);
      setSelTaskIdx(null);
      setStageFilter('all');
    }, []);

    const selectTask = useCallback((idx) => {
      setSelTaskIdx(prev => prev === idx ? null : idx);
    }, []);

    const toggleTask = useCallback((idx) => {
      setProjects(prev => prev.map(p => {
        if (p.id !== selProjId) return p;
        const tasks = [...p.tasks];
        tasks[idx] = { ...tasks[idx], status: tasks[idx].status === 'closed' ? 'open' : 'closed' };
        return { ...p, tasks };
      }));
    }, [selProjId]);

    const deleteProject = useCallback((id) => {
      setProjects(prev => {
        const next = prev.filter(p => p.id !== id);
        if (selProjId === id) setSelProjId(next.length ? next[0].id : null);
        return next;
      });
      setSelTaskIdx(null);
    }, [selProjId]);

    const deleteTask = useCallback((idx) => {
      setProjects(prev => prev.map(p => {
        if (p.id !== selProjId) return p;
        return { ...p, tasks: p.tasks.filter((_, i) => i !== idx) };
      }));
      setSelTaskIdx(prev => {
        if (prev === idx) return null;
        if (prev > idx) return prev - 1;
        return prev;
      });
    }, [selProjId]);

    const addProject = useCallback((data) => {
      const newProj = {
        ...data,
        id: 'local-' + Date.now(),   // local ID; won't conflict with SkySpark refs
        tasks: defaultTasks().map(t => ({ ...t, status: 'open', replies: [] }))
      };
      setProjects(prev => [newProj, ...prev]);
      setSelProjId(newProj.id);
      setSelTaskIdx(null);
      setShowNewProject(false);
    }, []);

    const addTask = useCallback((data) => {
      setProjects(prev => prev.map(p => {
        if (p.id !== selProjId) return p;
        return { ...p, tasks: [...p.tasks, { ...data, status: 'open', replies: [] }] };
      }));
      setShowNewTask(false);
    }, [selProjId]);

    const sendReply = useCallback((text, status) => {
      if (!text && !status) return;
      setProjects(prev => prev.map(p => {
        if (p.id !== selProjId) return p;
        const tasks = [...p.tasks];
        const task = { ...tasks[selTaskIdx], replies: [...tasks[selTaskIdx].replies] };
        if (status) {
          task.status = status;
          task.replies.push({ type: 'status', initials: 'JD', time: 'Just now', statusChange: status });
        }
        if (text) {
          task.replies.push({ author: 'J. Davis', initials: 'JD', time: 'Just now', text });
        }
        tasks[selTaskIdx] = task;
        return { ...p, tasks };
      }));
    }, [selProjId, selTaskIdx]);

    return {
      projects, proj, selProjId, selTaskIdx, stageFilter,
      isFullscreen, railVisible, showNewProject, showNewTask,
      isLoading, loadError,
      selectProject, selectTask, toggleTask,
      deleteProject, deleteTask, addProject, addTask, sendReply,
      setStageFilter, setIsFullscreen, setRailVisible,
      setShowNewProject, setShowNewTask
    };
  };
})();
