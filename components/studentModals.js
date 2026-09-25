// ==============================================================
// Expedición Matemática - Modales de Gestión de Estudiantes
// Edición, Adición y Eliminación Permanente de Alumnos
// ==============================================================

import { storage } from '../data/storage.js';
import { escapeHtml } from '../data/guardrails.js';

let pendingDeleteStudentId = null;

export function renderStudentModalsHtml(classroomFilter = 'sigma') {
  return `
    <!-- Modal: Editar Estudiante -->
    <div id="edit-student-modal" class="worksheet-modal-overlay" style="display: none; z-index: 10000;">
      <div class="worksheet-modal-content glass-panel animate-pop" style="max-width: 520px; padding: 26px 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">✏️</span>
            <div>
              <h3 style="font-size: 17px; color: var(--text-white); font-family: var(--font-title); margin: 0;">Editar Estudiante</h3>
              <div id="edit-student-classroom-badge" style="font-size: 11px; color: var(--neon-green); font-family: var(--font-mono); margin-top: 2px;">4.° Grado</div>
            </div>
          </div>
          <button type="button" id="close-edit-modal-btn" class="btn-dark" style="padding: 6px 12px; font-size: 12px; cursor: pointer;">✕</button>
        </div>

        <form id="edit-student-form" style="display: flex; flex-direction: column; gap: 14px;">
          <input type="hidden" id="edit-student-id" />

          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 6px;">
              Apellidos (Paterno y Materno):
            </label>
            <input type="text" id="edit-student-lastname" required style="width: 100%; padding: 9px 12px; font-size: 13.5px;" />
          </div>

          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 6px;">
              Nombres:
            </label>
            <input type="text" id="edit-student-firstname" required style="width: 100%; padding: 9px 12px; font-size: 13.5px;" />
          </div>

          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 6px;">
              Nombre de Usuario:
            </label>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="text" id="edit-student-username" style="flex: 1; padding: 9px 12px; font-size: 13px; font-family: var(--font-mono); background: var(--bg-surface-elevated);" />
              <button type="button" id="edit-reset-username-btn" class="btn-dark" style="padding: 9px 12px; font-size: 11px; white-space: nowrap;" title="Regenerar usuario según nombres">
                🔄 Auto
              </button>
            </div>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 4px; font-family: var(--font-mono);">
              💡 Se actualiza automáticamente si cambias el 1.er nombre o el apellido paterno.
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 6px;">
              Clave PIN (4 dígitos numéricos únicos):
            </label>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="text" id="edit-student-pin" maxlength="4" required style="width: 120px; padding: 9px 12px; font-size: 16px; font-family: var(--font-mono); letter-spacing: 2px; text-align: center;" />
              <button type="button" id="edit-generate-pin-btn" class="btn-dark" style="padding: 9px 12px; font-size: 11px; white-space: nowrap;">
                🎲 Generar PIN
              </button>
            </div>
            <div id="edit-pin-status" style="font-size: 11.5px; margin-top: 5px; font-family: var(--font-mono);"></div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 10px;">
            <button type="button" id="open-delete-modal-btn" style="background: rgba(239, 68, 68, 0.12); border: 1.5px solid #ef4444; color: #f87171; padding: 9px 14px; font-size: 12px; border-radius: 8px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              🗑️ Eliminar Alumno
            </button>
            <div style="display: flex; gap: 8px;">
              <button type="button" id="cancel-edit-btn" class="btn-dark" style="padding: 9px 14px; font-size: 12px;">
                Cancelar
              </button>
              <button type="submit" id="save-student-edit-btn" class="btn-neon" style="padding: 9px 18px; font-size: 12.5px;">
                💾 Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Agregar Alumno al Salón -->
    <div id="add-student-modal" class="worksheet-modal-overlay" style="display: none; z-index: 10000;">
      <div class="worksheet-modal-content glass-panel animate-pop" style="max-width: 520px; padding: 26px 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">➕</span>
            <div>
              <h3 style="font-size: 17px; color: var(--text-white); font-family: var(--font-title); margin: 0;">Matricular Nuevo Alumno</h3>
              <div id="add-student-classroom-badge" style="font-size: 11px; color: var(--neon-green); font-family: var(--font-mono); margin-top: 2px;">
                Salón: ${classroomFilter === 'sigma' ? '4.° Sigma' : '4.° Delta'}
              </div>
            </div>
          </div>
          <button type="button" id="close-add-modal-btn" class="btn-dark" style="padding: 6px 12px; font-size: 12px; cursor: pointer;">✕</button>
        </div>

        <form id="add-student-form" style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 6px;">
              Apellidos (Paterno y Materno):
            </label>
            <input type="text" id="add-student-lastname" placeholder="ej: Mendoza Salas" required style="width: 100%; padding: 9px 12px; font-size: 13.5px;" />
          </div>

          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 6px;">
              Nombres:
            </label>
            <input type="text" id="add-student-firstname" placeholder="ej: Joaquín Mateo" required style="width: 100%; padding: 9px 12px; font-size: 13.5px;" />
          </div>

          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 6px;">
              Usuario Asignado (Automático):
            </label>
            <div id="add-student-username-preview" style="padding: 9px 12px; font-size: 13px; font-family: var(--font-mono); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; color: var(--neon-green); font-weight: 700;">
              (Escribe apellidos y nombres)
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 6px;">
              Clave PIN (4 dígitos numéricos únicos):
            </label>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="text" id="add-student-pin" maxlength="4" required style="width: 120px; padding: 9px 12px; font-size: 16px; font-family: var(--font-mono); letter-spacing: 2px; text-align: center;" />
              <button type="button" id="add-generate-pin-btn" class="btn-dark" style="padding: 9px 12px; font-size: 11px; white-space: nowrap;">
                🎲 Generar PIN
              </button>
            </div>
            <div id="add-pin-status" style="font-size: 11.5px; margin-top: 5px; font-family: var(--font-mono);"></div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
            <button type="button" id="cancel-add-btn" class="btn-dark" style="padding: 9px 14px; font-size: 12px;">
              Cancelar
            </button>
            <button type="submit" id="confirm-add-student-btn" class="btn-neon" style="padding: 9px 18px; font-size: 12.5px;">
              ➕ Matricular y Guardar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Confirmar Eliminación Permanente -->
    <div id="delete-confirm-modal" class="worksheet-modal-overlay" style="display: none; z-index: 10002;">
      <div class="worksheet-modal-content glass-panel animate-pop" style="max-width: 460px; padding: 28px 24px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 12px;">⚠️</div>
        <h3 style="font-size: 18px; color: #f87171; font-family: var(--font-title); margin: 0 0 8px 0;">
          ¿Eliminar Alumno Permanentemente?
        </h3>
        <p style="font-size: 13.5px; color: var(--text-white); margin-bottom: 12px;">
          Estás a punto de retirar a <strong id="delete-student-name" style="color: var(--neon-green); font-size: 14.5px;"></strong> del registro escolar.
        </p>
        <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; font-size: 12px; color: var(--text-muted); line-height: 1.5; text-align: left; margin-bottom: 20px;">
          <div style="font-weight: 800; color: #f87171; margin-bottom: 4px;">Impacto en el sistema:</div>
          • Sus puntos y estrellas se descontarán de las estadísticas del aula.<br/>
          • El orden alfabético y los números (N° 01, 02...) se reasignarán automáticamente.<br/>
          • Esta acción es <strong>permanente e irreversible</strong>.
        </div>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button type="button" id="cancel-delete-btn" class="btn-dark" style="padding: 9px 16px; font-size: 12.5px;">
            Cancelar
          </button>
          <button type="button" id="confirm-delete-btn" style="background: #ef4444; color: white; border: none; padding: 9px 18px; border-radius: 8px; font-weight: 800; font-size: 12.5px; cursor: pointer;">
            ⚠️ Sí, Eliminar Permanentemente
          </button>
        </div>
      </div>
    </div>
  `;
}

export function openEditStudentModal(app, studentId) {
  const student = storage.getStudentById(studentId);
  if (!student) return;

  const modalEl = document.getElementById('edit-student-modal');
  if (!modalEl) return;

  const parts = (student.name || '').split(',');
  const lastName = (parts[0] || '').trim();
  const firstName = student.firstName || (parts[1] || '').trim();

  const idInput = document.getElementById('edit-student-id');
  const lastInput = document.getElementById('edit-student-lastname');
  const firstInput = document.getElementById('edit-student-firstname');
  const userInput = document.getElementById('edit-student-username');
  const pinInput = document.getElementById('edit-student-pin');
  const badgeEl = document.getElementById('edit-student-classroom-badge');
  const statusEl = document.getElementById('edit-pin-status');
  const saveBtn = document.getElementById('save-student-edit-btn');
  const form = document.getElementById('edit-student-form');

  if (idInput) idInput.value = student.id;
  if (lastInput) lastInput.value = lastName;
  if (firstInput) firstInput.value = firstName;
  if (userInput) userInput.value = student.username;
  if (pinInput) pinInput.value = student.pin;
  if (badgeEl) {
    badgeEl.textContent = `Salón: ${student.classroom === 'sigma' ? '4.° Grado Sigma' : '4.° Grado Delta'} • Alumno N° ${String(student.num).padStart(2, '0')}`;
  }

  const validateEditPin = () => {
    const clean = (pinInput?.value || '').replace(/[^0-9]/g, '');
    if (pinInput) pinInput.value = clean.slice(0, 4);
    if (clean.length < 4) {
      if (statusEl) statusEl.innerHTML = '<span style="color:#f87171;">⚠️ El PIN debe tener 4 dígitos numéricos.</span>';
      if (saveBtn) saveBtn.disabled = true;
      return false;
    }
    const takenBy = storage.isPinTaken(clean, student.id);
    if (takenBy) {
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:#f87171;">❌ Este PIN ya pertenece a <strong>${escapeHtml(takenBy.name)}</strong> (${takenBy.classroom === 'sigma' ? '4.° Sigma' : '4.° Delta'}). Debe ser único.</span>`;
      }
      if (saveBtn) saveBtn.disabled = true;
      return false;
    }
    if (statusEl) {
      statusEl.innerHTML = '<span style="color:var(--neon-green);">✔️ PIN único y disponible para este alumno.</span>';
    }
    if (saveBtn) saveBtn.disabled = false;
    return true;
  };

  if (pinInput) pinInput.oninput = validateEditPin;
  validateEditPin();

  const genPinBtn = document.getElementById('edit-generate-pin-btn');
  if (genPinBtn) {
    genPinBtn.onclick = () => {
      if (pinInput) {
        pinInput.value = storage.generateUniquePin();
        validateEditPin();
      }
    };
  }

  const resetUserBtn = document.getElementById('edit-reset-username-btn');
  if (resetUserBtn) {
    resetUserBtn.onclick = () => {
      const f = firstInput?.value || '';
      const l = lastInput?.value || '';
      if (userInput) {
        userInput.value = storage.generateUniqueUsername(f, l, student.id);
      }
    };
  }

  const onNameChange = () => {
    const f = firstInput?.value || '';
    const l = lastInput?.value || '';
    if (userInput && f.trim() && l.trim()) {
      userInput.value = storage.generateUniqueUsername(f, l, student.id);
    }
  };
  if (lastInput) lastInput.oninput = onNameChange;
  if (firstInput) firstInput.oninput = onNameChange;

  const openDeleteBtn = document.getElementById('open-delete-modal-btn');
  if (openDeleteBtn) {
    openDeleteBtn.onclick = () => {
      openDeleteConfirmModal(app, student.id);
    };
  }

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      if (!validateEditPin()) return;

      const newLast = lastInput?.value || '';
      const newFirst = firstInput?.value || '';
      const newPin = pinInput?.value || '';
      const customUser = userInput?.value || '';

      storage.updateStudentFull(student.id, {
        lastName: newLast,
        firstName: newFirst,
        pin: newPin,
        customUsername: customUser
      });

      modalEl.style.display = 'none';
      app.render();
    };
  }

  modalEl.style.display = 'flex';
}

export function openAddStudentModal(app) {
  const modalEl = document.getElementById('add-student-modal');
  if (!modalEl) return;

  const classroom = app.selectedClassroomFilter || 'sigma';
  const badgeEl = document.getElementById('add-student-classroom-badge');
  const lastInput = document.getElementById('add-student-lastname');
  const firstInput = document.getElementById('add-student-firstname');
  const previewEl = document.getElementById('add-student-username-preview');
  const pinInput = document.getElementById('add-student-pin');
  const statusEl = document.getElementById('add-pin-status');
  const addBtn = document.getElementById('confirm-add-student-btn');
  const form = document.getElementById('add-student-form');

  if (badgeEl) {
    badgeEl.textContent = `Salón Destino: ${classroom === 'sigma' ? '4.° Grado Sigma' : '4.° Grado Delta'}`;
  }
  if (lastInput) lastInput.value = '';
  if (firstInput) firstInput.value = '';
  if (previewEl) previewEl.textContent = '(Escribe apellidos y nombres)';
  if (pinInput) pinInput.value = storage.generateUniquePin();

  const validateAddPin = () => {
    const clean = (pinInput?.value || '').replace(/[^0-9]/g, '');
    if (pinInput) pinInput.value = clean.slice(0, 4);
    if (clean.length < 4) {
      if (statusEl) statusEl.innerHTML = '<span style="color:#f87171;">⚠️ El PIN debe tener 4 dígitos numéricos.</span>';
      if (addBtn) addBtn.disabled = true;
      return false;
    }
    const takenBy = storage.isPinTaken(clean);
    if (takenBy) {
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:#f87171;">❌ Este PIN ya pertenece a <strong>${escapeHtml(takenBy.name)}</strong> (${takenBy.classroom === 'sigma' ? '4.° Sigma' : '4.° Delta'}).</span>`;
      }
      if (addBtn) addBtn.disabled = true;
      return false;
    }
    if (statusEl) {
      statusEl.innerHTML = '<span style="color:var(--neon-green);">✔️ PIN único generado y disponible.</span>';
    }
    if (addBtn) addBtn.disabled = false;
    return true;
  };

  if (pinInput) pinInput.oninput = validateAddPin;
  validateAddPin();

  const genAddPinBtn = document.getElementById('add-generate-pin-btn');
  if (genAddPinBtn) {
    genAddPinBtn.onclick = () => {
      if (pinInput) {
        pinInput.value = storage.generateUniquePin();
        validateAddPin();
      }
    };
  }

  const updateAddUsernamePreview = () => {
    const l = lastInput?.value || '';
    const f = firstInput?.value || '';
    if (l.trim() && f.trim()) {
      const generated = storage.generateUniqueUsername(f, l);
      if (previewEl) previewEl.textContent = generated;
    } else {
      if (previewEl) previewEl.textContent = '(Escribe apellidos y nombres)';
    }
  };

  if (lastInput) lastInput.oninput = updateAddUsernamePreview;
  if (firstInput) firstInput.oninput = updateAddUsernamePreview;

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      if (!validateAddPin()) return;

      const lastName = lastInput?.value || '';
      const firstName = firstInput?.value || '';
      const pin = pinInput?.value || '';

      storage.addStudent({
        lastName,
        firstName,
        classroom,
        pin
      });

      modalEl.style.display = 'none';
      app.render();
    };
  }

  modalEl.style.display = 'flex';
}

export function openDeleteConfirmModal(app, studentId) {
  const student = storage.getStudentById(studentId);
  if (!student) return;

  pendingDeleteStudentId = studentId;
  const modalEl = document.getElementById('delete-confirm-modal');
  const nameEl = document.getElementById('delete-student-name');
  if (nameEl) nameEl.textContent = student.name;

  const confirmDelBtn = document.getElementById('confirm-delete-btn');
  if (confirmDelBtn) {
    confirmDelBtn.onclick = () => {
      if (pendingDeleteStudentId) {
        storage.deleteStudentPermanent(pendingDeleteStudentId);
        pendingDeleteStudentId = null;
      }
      if (modalEl) modalEl.style.display = 'none';
      const editModal = document.getElementById('edit-student-modal');
      if (editModal) editModal.style.display = 'none';
      app.render();
    };
  }

  const cancelDelBtn = document.getElementById('cancel-delete-btn');
  if (cancelDelBtn) {
    cancelDelBtn.onclick = () => {
      if (modalEl) modalEl.style.display = 'none';
    };
  }

  if (modalEl) modalEl.style.display = 'flex';
}

export function attachStudentEditEvents(app) {
  // Click en el nombre del estudiante para editar
  document.querySelectorAll('.student-name-click').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openEditStudentModal(app, id);
    });
  });

  // Click en el botón ✏️ Editar
  document.querySelectorAll('.edit-student-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openEditStudentModal(app, id);
    });
  });

  // Modal de edición: botones de cerrar y cancelar
  document.getElementById('close-edit-modal-btn')?.addEventListener('click', () => {
    const m = document.getElementById('edit-student-modal');
    if (m) m.style.display = 'none';
  });
  document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
    const m = document.getElementById('edit-student-modal');
    if (m) m.style.display = 'none';
  });

  // Modal de agregar: botones de cerrar y cancelar
  document.getElementById('close-add-modal-btn')?.addEventListener('click', () => {
    const m = document.getElementById('add-student-modal');
    if (m) m.style.display = 'none';
  });
  document.getElementById('cancel-add-btn')?.addEventListener('click', () => {
    const m = document.getElementById('add-student-modal');
    if (m) m.style.display = 'none';
  });
}
