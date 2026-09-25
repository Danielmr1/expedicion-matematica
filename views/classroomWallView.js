// ==============================================================
// Expedición Matemática - Vista del Muro de Compañeros de Salón
// Muro Social, Meta Comunitaria de Salón y Emblemas
// ==============================================================

import { ICONS, CYBER_AVATARS } from '../data/icons.js';
import { storage } from '../data/storage.js';
import { CLASSROOMS } from '../data/students.js';
import { escapeHtml } from '../data/guardrails.js';

const AVATAR_ICONS = {
  chasqui: '🏃‍♂️',
  condor: '🦅',
  vicuna: '🦙',
  delfin: '🐬',
  puma: '🐆'
};

function renderCyberAvatar(key, size = 36) {
  if (CYBER_AVATARS && CYBER_AVATARS[key]) {
    return CYBER_AVATARS[key].svg(size);
  }
  return AVATAR_ICONS[key] || '🎒';
}

export function renderClassroomWallView(app) {
  const student = app.user;
  const classroomId = student.classroom || 'sigma';
  const isSigma = classroomId === 'sigma';
  const classroomMeta = CLASSROOMS[classroomId] || { name: '4.° Grado', motto: 'Exploradores' };
  const classmates = storage.getAllStudents(classroomId);
  const stats = storage.getClassroomStats(classroomId);
  const accentCol = isSigma ? 'var(--color-sigma)' : 'var(--color-delta)';

  return `
    <!-- Cabecera Superior Adaptativa -->
    <header style="background: var(--bg-header); border-bottom: 1px solid var(--border-subtle); padding: 14px 24px; position: sticky; top: 0; z-index: 10;">
      <div style="max-width: 1050px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <button id="back-from-wall-btn" class="btn-dark" style="font-size: 13px; padding: 8px 16px;">
          ← Volver a Mis Desafíos
        </button>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 800; color: var(--text-white); font-size: 16px; font-family: var(--font-title);">Salón: ${classroomMeta.name}</span>
            <span class="${isSigma ? 'badge-tech' : 'badge-tech badge-delta'}">${classroomMeta.motto}</span>
          </div>
          ${app.renderSettingsMenu()}
        </div>
      </div>
    </header>

    <main style="max-width: 1050px; margin: 28px auto; padding: 0 20px; flex: 1;">
      
      <!-- Tarjeta de Desafío Grupal Adaptativa -->
      <div class="glass-panel" style="padding: 24px 28px; margin-bottom: 26px; border-left: 5px solid ${accentCol};">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <span class="${isSigma ? 'badge-tech' : 'badge-tech badge-delta'}" style="margin-bottom: 6px;">
              ⚡ META COLECTIVA DE SALÓN
            </span>
            <h2 style="font-size: 22px; color: var(--text-white); margin: 6px 0 6px 0;">
              ¡Juntos acumulamos <span style="color: ${accentCol}; font-family: var(--font-mono);">${stats.totalStars}</span> estrellas!
            </h2>
            <p style="font-size: 13px; color: var(--text-muted);">
              Cada ejercicio que resuelves suma energía comunitaria para <strong>${classroomMeta.name}</strong>.
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono); font-weight: 700;">EXPLORADORES ACTIVOS</div>
            <div style="font-size: 24px; font-weight: 900; color: var(--text-white); font-family: var(--font-mono);">${classmates.length} Alumnos</div>
            <div style="font-size: 12px; color: ${accentCol}; font-family: var(--font-mono); margin-top: 2px;">⏱️ ${stats.totalMin} min practicados</div>
          </div>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <h3 style="font-size: 16px; color: var(--text-white); display: flex; align-items: center; gap: 8px; font-family: var(--font-title); text-transform: uppercase;">
          ${ICONS.user(18, accentCol)} Tus Compañeros de ${classroomMeta.name}:
        </h3>
        <span style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">SINCRONIZADO EN TIEMPO REAL</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 14px;">
        ${classmates.map(c => {
          const isMe = c.id === student.id;
          const pTro = c.trophies?.patrones || 'ninguno';

          return `
            <div class="glass-panel" style="padding: 16px 18px; border: 1px solid ${isMe ? accentCol : 'var(--border-subtle)'};">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                ${renderCyberAvatar(c.avatar, 38)}
                <div style="min-width: 0; flex: 1;">
                  <div style="font-weight: 700; font-size: 14px; color: var(--text-white); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--font-title);">
                    ${escapeHtml(c.displayName || c.name)} ${isMe ? `<span style="color: ${accentCol}; font-size: 11px; font-family: var(--font-mono);">(Tú)</span>` : ''}
                  </div>
                  <div style="font-size: 11px; color: var(--neon-green); font-family: var(--font-mono); font-weight: 700; margin-top: 2px;">
                    ⭐ ${c.stars || 0} estrellas
                  </div>
                </div>
              </div>
              <div style="display: flex; gap: 6px; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 8px; margin-top: 4px;">
                <span class="trophy-badge trophy-${pTro}" style="display: inline-flex; align-items: center; gap: 5px;">
                  ${app.getEmblemSvg(pTro, 16)} <span>${app.getEmblemShort(pTro)}</span>
                </span>
                <span style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">
                  ⏱️ ${c.timeMinutes || 0}m
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </main>
  `;
}

export function attachClassroomWallEvents(app) {
  app.attachThemeToggleEvent();
  document.getElementById('back-from-wall-btn')?.addEventListener('click', () => {
    app.currentView = 'STUDENT_HOME';
    app.render();
  });
}
