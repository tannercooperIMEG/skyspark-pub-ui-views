/**
 * components/ReplyPanel.js
 * Thread view + compose box for a selected task.
 */
(function () {
  const h = window.React.createElement;
  const { useState, useEffect, useRef } = window.React;
  window.ST.Components = window.ST.Components || {};

  window.ST.Components.ReplyPanel = function ReplyPanel({ proj, selTaskIdx, onSendReply }) {
    const [text,   setText]   = useState('');
    const [status, setStatus] = useState('');
    const U = window.ST.Utils;
    const threadRef = useRef(null);

    const task = (proj && selTaskIdx !== null) ? proj.tasks[selTaskIdx] : null;

    // Scroll thread to bottom when replies change
    useEffect(() => {
      if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }, [task && task.replies.length]);

    function handleSend() {
      onSendReply(text.trim(), status);
      setText('');
      setStatus('');
    }

    return h('div', { className: 'st-reply-panel' },
      // Header
      h('div', { className: 'st-reply-head' },
        h('div', { className: 'st-reply-task-name' }, task ? task.title : 'Select a task'),
        task && h('div', { className: 'st-reply-meta' },
          h('span', { className: 'st-status-badge ' + U.statusClass(task.status) }, U.statusLabel(task.status)),
          h('span', { className: 'st-step-ref' }, task.stage + ' · Step ' + task.step)
        )
      ),

      // Thread
      h('div', { className: 'st-thread', ref: threadRef },
        !task
          ? h('div', { className: 'st-empty', style: { marginTop: 16 } },
              h('div', { className: 'st-empty-glyph' }, '💬'),
              h('div', { className: 'st-empty-h' }, 'No task selected'),
              h('div', { className: 'st-empty-p' }, 'Select a task to view its thread.')
            )
          : task.replies.length === 0
            ? h('div', { className: 'st-empty', style: { marginTop: 16 } },
                h('div', { className: 'st-empty-glyph' }, '💬'),
                h('div', { className: 'st-empty-h' }, 'No replies yet'),
                h('div', { className: 'st-empty-p' }, 'Add a note to start the thread.')
              )
            : task.replies.map((r, i) =>
                r.type === 'status'
                  ? h('div', { key: i, className: 'st-se' },
                      h('div', { className: 'st-se-line' }),
                      h('div', { className: 'st-se-label' },
                        h('span', null, r.initials),
                        ' changed status to ',
                        h('span', { className: 'st-status-badge ' + window.ST.Utils.statusClass(r.statusChange), style: { fontSize: 9, padding: '1px 6px' } },
                          window.ST.Utils.statusLabel(r.statusChange)
                        ),
                        h('span', { style: { color: '#A8BACC' } }, ' ' + r.time)
                      ),
                      h('div', { className: 'st-se-line' })
                    )
                  : h('div', { key: i, className: 'st-reply-msg' },
                      h('div', { className: 'st-msg-avatar ' + window.ST.Utils.avClass(r.initials) }, r.initials),
                      h('div', null,
                        h('div', null,
                          h('span', { className: 'st-msg-author' }, r.author),
                          h('span', { className: 'st-msg-time' }, r.time)
                        ),
                        h('div', { className: 'st-msg-bubble' }, r.text)
                      )
                    )
              )
      ),

      // Compose
      h('div', { className: 'st-compose' },
        h('textarea', {
          placeholder: 'Add a reply or note…',
          value: text,
          onChange: e => setText(e.target.value),
          onKeyDown: e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } },
          rows: 2,
          disabled: !task
        }),
        h('div', { className: 'st-compose-foot' },
          h('select', {
            className: 'st-status-sel',
            value: status,
            onChange: e => setStatus(e.target.value),
            disabled: !task
          },
            h('option', { value: '' }, 'No status change'),
            h('option', { value: 'open' }, '→ Open'),
            h('option', { value: 'progress' }, '→ In Progress'),
            h('option', { value: 'closed' }, '→ Closed')
          ),
          h('button', {
            className: 'st-btn-send',
            onClick: handleSend,
            disabled: !task
          }, 'Send')
        )
      )
    );
  };
})();
