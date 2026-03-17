/**
 * components/NewProjectModal.js
 * Modal form for creating a new setup project.
 */
(function () {
  const h = window.React.createElement;
  const { useState } = window.React;
  window.ST.Components = window.ST.Components || {};

  const BLANK = { num: '', title: '', type: 'MBCx', conn: 'Niagara / Arcbeam', due: '', initiator: '' };

  window.ST.Components.NewProjectModal = function NewProjectModal({ isOpen, onClose, onConfirm }) {
    const [form, setForm] = useState({ ...BLANK });
    if (!isOpen) return null;

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const fallbackDue = () => new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0];

    function handleConfirm() {
      if (!form.title.trim()) return;
      onConfirm({ ...form, num: form.num.trim() || 'TBD', due: form.due || fallbackDue() });
      setForm({ ...BLANK });
    }

    return h('div', { className: 'st-modal-bg', onClick: e => e.target === e.currentTarget && onClose() },
      h('div', { className: 'st-modal' },
        h('div', { className: 'st-modal-top' },
          h('span', { className: 'st-modal-title' }, 'New Setup Project'),
          h('button', { className: 'st-modal-close', onClick: onClose }, '✕')
        ),
        h('div', { className: 'st-modal-body' },
          h('div', { className: 'st-form-row' },
            Field('Project Number', h('input', { className: 'st-form-ctrl', placeholder: 'e.g. 25-0421', value: form.num, onChange: e => set('num', e.target.value) })),
            Field('Project Type', h('select', { className: 'st-form-ctrl', value: form.type, onChange: e => set('type', e.target.value) },
              ['MBCx', 'WPPV-Cx', 'WPPV-Design', 'WPPV-RCx', 'UA', 'Other'].map(o => h('option', { key: o }, o))
            ))
          ),
          Field('Project Title', h('input', { className: 'st-form-ctrl', placeholder: 'e.g. Midtown Medical Center', value: form.title, onChange: e => set('title', e.target.value) })),
          h('div', { className: 'st-form-row' },
            Field('Connector Type', h('select', { className: 'st-form-ctrl', value: form.conn, onChange: e => set('conn', e.target.value) },
              ['Niagara / Arcbeam', 'BACnet', 'SQL Database', 'Multiple'].map(o => h('option', { key: o }, o))
            )),
            Field('Due Date', h('input', { className: 'st-form-ctrl', type: 'date', value: form.due, onChange: e => set('due', e.target.value) }))
          ),
          Field('Initiated By', h('input', { className: 'st-form-ctrl', placeholder: 'Engineer name', value: form.initiator, onChange: e => set('initiator', e.target.value) }))
        ),
        h('div', { className: 'st-modal-foot' },
          h('button', { className: 'st-btn-cancel', onClick: onClose }, 'Cancel'),
          h('button', { className: 'st-btn-confirm', onClick: handleConfirm }, 'Create Project')
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
