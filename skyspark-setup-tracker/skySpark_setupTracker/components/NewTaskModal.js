/**
 * components/NewTaskModal.js
 * Modal form for adding a custom task to the selected project.
 */
(function () {
  const h = window.React.createElement;
  const { useState } = window.React;
  window.ST.Components = window.ST.Components || {};

  const BLANK = { stage: 'Stage 01', step: '', title: '', assignee: '' };

  window.ST.Components.NewTaskModal = function NewTaskModal({ isOpen, onClose, onConfirm }) {
    const [form, setForm] = useState({ ...BLANK });
    if (!isOpen) return null;

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    function handleConfirm() {
      if (!form.title.trim()) return;
      onConfirm({ ...form, step: form.step.trim() || '—', assignee: form.assignee.trim() || '—' });
      setForm({ ...BLANK });
    }

    return h('div', { className: 'st-modal-bg', onClick: e => e.target === e.currentTarget && onClose() },
      h('div', { className: 'st-modal' },
        h('div', { className: 'st-modal-top' },
          h('span', { className: 'st-modal-title' }, 'Add Task'),
          h('button', { className: 'st-modal-close', onClick: onClose }, '✕')
        ),
        h('div', { className: 'st-modal-body' },
          h('div', { className: 'st-form-row' },
            Field('Stage', h('select', { className: 'st-form-ctrl', value: form.stage, onChange: e => set('stage', e.target.value) },
              ['Stage 01', 'Stage 02', 'Stage 03', 'Stage 04'].map(s => h('option', { key: s }, s))
            )),
            Field('Step', h('input', { className: 'st-form-ctrl', placeholder: 'e.g. 04', value: form.step, onChange: e => set('step', e.target.value) }))
          ),
          Field('Description', h('input', { className: 'st-form-ctrl', placeholder: 'Task description…', value: form.title, onChange: e => set('title', e.target.value) })),
          Field('Assignee', h('input', { className: 'st-form-ctrl', placeholder: 'Engineer initials or name', value: form.assignee, onChange: e => set('assignee', e.target.value) }))
        ),
        h('div', { className: 'st-modal-foot' },
          h('button', { className: 'st-btn-cancel', onClick: onClose }, 'Cancel'),
          h('button', { className: 'st-btn-confirm', onClick: handleConfirm }, 'Add Task')
        )
      )
    );
  };

  function Field(label, control) {
    return window.React.createElement('div', { className: 'st-form-field' },
      window.React.createElement('label', { className: 'st-form-label' }, label),
      control
    );
  }
})();
