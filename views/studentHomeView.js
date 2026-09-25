// ==============================================================
// Expedición Matemática - Vista de Inicio del Estudiante
// Misiones Semanales, Desbloqueo de Estaciones y Pasaporte de Emblemas
// ==============================================================

import { ICONS, CYBER_AVATARS } from '../data/icons.js';
import { storage } from '../data/storage.js';
import { CLASSROOMS } from '../data/students.js';
import { AVAILABLE_TOPICS } from '../data/curriculum.js';
import { escapeHtml } from '../data/guardrails.js';
import { prepareStationTasks } from '../engine/taskEngine.js';

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

export function renderStudentHomeView(app) {
  const student = app.user;
  const isSigma = student.classroom === 'sigma';
  const classBadgeClass = isSigma ? 'badge-tech' : 'badge-tech badge-delta';
  const classroomMeta = CLASSROOMS[student.classroom] || { name: '4.° Grado', motto: 'Exploradores' };
  const activeTopicId = app.isTeacherSimulating 
    ? (app.simulatedTopicId || app.selectedWorksheetTopicId || storage.getActiveTopic())
    : storage.getActiveTopic();
  const currentTopicObj = AVAILABLE_TOPICS.find(t => t.id === activeTopicId) || AVAILABLE_TOPICS[0];
  const mission = app.getCurrentMission();
  const completedChallenges = student.completedChallenges || [];

  // Progreso hacia la meta de oro
  const totalStars = student.stars || 0;
  const goldThreshold = 26;
  const progressPercent = Math.min(100, Math.round((totalStars / goldThreshold) * 100));

  return `
    <!-- Cabecera Superior Adaptativa -->
    <header class="student-header" style="background: var(--bg-header); border-bottom: 1px solid var(--border-subtle); padding: 12px 20px; position: sticky; top: 0; z-index: 100;">
      <div class="student-header-inner">
        
        <div class="student-profile-bar">
          ${renderCyberAvatar(student.avatar, 40)}
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 16px; font-weight: 800; color: var(--text-white); font-family: var(--font-title);">¡Hola, ${escapeHtml(student.firstName || student.displayName || student.name)}!</span>
              <span class="${classBadgeClass}">
                ${classroomMeta.name}
              </span>
            </div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px; display: flex; align-items: center; gap: 6px;">
              ${ICONS.clock(12, 'var(--neon-green)')} <span>${student.timeMinutes || 0} MIN PRACTICADOS</span>
            </div>
          </div>
        </div>

        <div class="student-nav-bar">
          <button id="open-student-guide-btn" class="btn-dark" style="padding: 7px 12px; font-size: 12px; border-color: var(--neon-green); color: var(--neon-green); display: inline-flex; align-items: center; gap: 6px; cursor: pointer;" title="Ver cómo explorar y alcanzar tu meta semanal">
            ${app.currentTheme === 'andina' ? ICONS.compass(16, 'var(--neon-green)') : ICONS.pixelLogo(16, 'var(--neon-green)')} ¿Cómo Explorar?
          </button>
          <button id="view-classroom-wall-btn" class="btn-dark" style="padding: 7px 12px; font-size: 12px;">
            ${ICONS.user(14, 'var(--neon-green)')} Mi Salón
          </button>
          <div class="badge-tech" style="padding: 6px 10px; font-size: 12px;">
            ${ICONS.star(14, 'var(--neon-green)')} <span>${student.stars || 0}</span>
          </div>
          <div class="badge-tech badge-delta" style="padding: 6px 10px; font-size: 12px;">
            ${ICONS.bolt(14, 'var(--color-delta)')} <span>${student.xp || 0}</span> XP
          </div>
        </div>

        <div class="student-menu-bar">
          ${app.renderSettingsMenu()}
        </div>

      </div>
    </header>

    <main style="max-width: 1050px; margin: 28px auto; padding: 0 20px; flex: 1;">
      
      <!-- Banner de Misión Semanal Adaptativa -->
      <div class="glass-panel" style="padding: 26px 28px; margin-bottom: 26px; border-left: 5px solid var(--neon-green); background: var(--bg-surface);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <span class="badge-tech" style="margin-bottom: 6px;">
              ⚡ ${currentTopicObj.bimestreName || '3.° BIMESTRE'} • SEMANA ${currentTopicObj.weekNumber}
            </span>
            <h2 style="font-size: 24px; color: var(--text-white); margin: 6px 0 6px 0;">
              ${currentTopicObj.title}
            </h2>
            <p style="font-size: 13px; color: var(--text-muted);">
              ${currentTopicObj.description} Supera las estaciones para ganar el <strong>Trofeo de Oro</strong> de la semana.
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono); font-weight: 700;">ENERGÍA A LA META</div>
            <div style="font-size: 26px; font-weight: 900; color: var(--neon-green); font-family: var(--font-mono);">${progressPercent}%</div>
          </div>
        </div>
        
        <!-- Barra de Progreso Neón / Andina -->
        <div class="eduten-bar" style="margin-top: 16px; height: 8px;">
          <div class="eduten-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
        <h3 style="font-size: 16px; color: var(--text-white); letter-spacing: -0.3px; display: flex; align-items: center; gap: 8px; font-family: var(--font-title); text-transform: uppercase;">
          ${app.currentTheme === 'andina' ? ICONS.ripple(20, 'var(--neon-green)') : ICONS.pixelLogo(18, 'var(--neon-green)')} Estaciones de Práctica Activa:
        </h3>
        <span style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">ZONA DE ENTRENAMIENTO</span>
      </div>

      <!-- Las Estaciones Progresivas -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 30px;">
        ${mission.stations.map((st, index) => {
          const isCompleted = completedChallenges.includes(st.id);
          
          // Lógica de desbloqueo estricta y progresiva
          let isUnlocked = false;
          if (index === 0) {
            isUnlocked = true;
          } else {
            const prevStation = mission.stations[index - 1];
            isUnlocked = completedChallenges.includes(prevStation.id) || (index === 1 && totalStars >= 8) || (index === 2 && totalStars >= 18) || (index === 3 && totalStars >= 26);
          }

          const borderCol = isCompleted ? 'var(--color-success)' : isUnlocked ? 'var(--color-delta)' : 'var(--border-subtle)';
          const opacity = isUnlocked ? '1' : '0.6';

          return `
            <div class="glass-panel interactive-card" style="padding: 22px 26px; border-left: 4px solid ${borderCol}; opacity: ${opacity}; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
              
              <div style="display: flex; align-items: center; gap: 18px;">
                <div style="width: 48px; height: 48px; border-radius: 10px; background: var(--bg-surface-elevated); border: 1.5px solid ${borderCol}; display: flex; align-items: center; justify-content: center;">
                  ${isCompleted ? ICONS.check(22, 'var(--color-success)') : isUnlocked ? ICONS.unlock(20, 'var(--color-delta)') : ICONS.lock(20, 'var(--text-dim)')}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                    <span style="font-size: 10px; font-weight: 800; color: ${isCompleted ? 'var(--color-success)' : isUnlocked ? 'var(--color-delta)' : 'var(--text-dim)'}; font-family: var(--font-mono); text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px;">
                      ${app.getEmblemSvg(st.trophy, 16)} ${st.name.split(':')[0]} • RECOMPENSA: ${app.getEmblemName(st.trophy).toUpperCase()}
                    </span>
                    ${isCompleted ? '<span class="badge-tech" style="font-size: 9px; padding: 1px 6px;">CONQUISTADO</span>' : ''}
                    ${st.isOptionalMastery ? `<span class="badge-tech badge-delta" style="font-size: 9px; padding: 1px 6px;">${app.getEmblemTierLabel('diamante').toUpperCase()}</span>` : ''}
                  </div>
                  <h4 style="font-size: 18px; color: var(--text-white); font-weight: 700; margin: 0;">${st.shortTitle}</h4>
                  <p style="font-size: 13px; color: var(--text-muted); margin-top: 3px;">
                    ${st.description} • <strong style="color:var(--text-white);">${st.targetExercises} micro-ejercicios</strong>
                  </p>
                </div>
              </div>

              <div>
                ${isCompleted ? `
                  <button 
                    class="start-station-btn btn-dark" 
                    data-station-id="${st.id}"
                    style="font-size: 13px;"
                  >
                    Repasar Estación 🔄
                  </button>
                ` : isUnlocked ? `
                  <button 
                    class="start-station-btn btn-neon" 
                    data-station-id="${st.id}"
                    style="font-size: 13px; padding: 11px 20px;"
                  >
                    INICIAR ESTACIÓN ${ICONS.arrowRight(16, 'var(--text-black)')}
                  </button>
                ` : `
                  <button 
                    disabled
                    class="btn-dark"
                    style="opacity: 0.45; cursor: not-allowed; font-size: 12px;"
                  >
                    ${ICONS.lock(14, 'var(--text-dim)')} BLOQUEADO
                  </button>
                `}
              </div>

            </div>
          `;
        }).join('')}
      </div>

      <!-- Pasaporte de Emblemas Adaptativo -->
      <div class="glass-panel" style="padding: 22px 26px; border: 1px solid var(--border-subtle);">
        <h4 style="font-size: 14px; color: var(--text-white); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; font-family: var(--font-title); text-transform: uppercase;">
          ${app.getEmblemSvg(student.stars >= 26 ? 'oro' : student.stars >= 18 ? 'plata' : student.stars >= 8 ? 'bronce' : 'ninguno', 20)} Pasaporte de Emblemas Semanal:
        </h4>
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap;">
          <div style="width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15)); flex-shrink: 0;">
            ${app.getEmblemSvg(student.stars >= 29 ? 'diamante' : student.stars >= 26 ? 'oro' : student.stars >= 18 ? 'plata' : student.stars >= 8 ? 'bronce' : 'ninguno', 52)}
          </div>
          <div>
            <div style="font-size: 16px; font-weight: 800; color: var(--text-white); font-family: var(--font-title);">${currentTopicObj.title}</div>
            <div class="trophy-badge trophy-${student.stars >= 29 ? 'diamante' : student.stars >= 26 ? 'oro' : student.stars >= 18 ? 'plata' : student.stars >= 8 ? 'bronce' : 'ninguno'}" style="margin-top: 6px; display: inline-flex; align-items: center; gap: 6px;">
              ${app.getEmblemSvg(student.stars >= 29 ? 'diamante' : student.stars >= 26 ? 'oro' : student.stars >= 18 ? 'plata' : student.stars >= 8 ? 'bronce' : 'ninguno', 16)}
              <span>Rango actual: ${app.getEmblemName(student.stars >= 29 ? 'diamante' : student.stars >= 26 ? 'oro' : student.stars >= 18 ? 'plata' : student.stars >= 8 ? 'bronce' : 'ninguno')}</span>
            </div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px; font-family: var(--font-sans);">
              ${(student.stars || 0) >= 29 
                ? `¡Felicitaciones! Has conquistado la ${app.getEmblemName('diamante')}` 
                : (student.stars || 0) >= 26 
                ? `Logro supremo: ${app.getEmblemName('oro')} (Meta Oficial 100%)` 
                : (student.stars || 0) >= 18 
                ? `Has obtenido el ${app.getEmblemName('plata')}` 
                : (student.stars || 0) >= 8 
                ? `Has obtenido la ${app.getEmblemName('bronce')}` 
                : `Supera la Estación 1 para obtener tu primer emblema (${app.getEmblemShort('bronce')})`}
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Guía del Explorador (Indicaciones Temáticas Adaptativas) -->
      <div id="student-guide-modal" class="modal-backdrop" style="display: none; align-items: center; justify-content: center; z-index: 100; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); padding: 16px;">
        <div class="glass-panel animate-pop" style="max-width: 620px; width: 100%; max-height: 90vh; overflow-y: auto; background: var(--bg-surface); border: 2px solid var(--neon-green); border-radius: 14px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.7);">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1.5px solid var(--border-subtle); padding-bottom: 14px; margin-bottom: 18px;">
            <div>
              <span class="badge-tech" style="font-size: 10px; margin-bottom: 6px;">COLEGIO LA SALLE SCHOOL • 4.° PRIMARIA</span>
              <h3 style="font-size: 20px; color: var(--text-white); margin: 4px 0 0 0; font-family: var(--font-title); font-weight: 800; display: flex; align-items: center; gap: 8px;">
                ${app.currentTheme === 'andina' ? ICONS.compass(22, 'var(--neon-green)') : ICONS.pixelLogo(20, 'var(--neon-green)')} Guía de la Misión Semanal
              </h3>
            </div>
            <button id="close-student-guide-btn" class="btn-dark" style="padding: 6px 12px; font-size: 14px; cursor: pointer;">✕</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; font-family: var(--font-sans);">
            
            <!-- Paso 1: Meta Semanal de Oro -->
            <div style="display: flex; gap: 14px; align-items: flex-start; background: var(--bg-surface-elevated); padding: 14px; border-radius: 10px; border-left: 4px solid var(--color-gold);">
              <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${app.getEmblemSvg('oro', 36)}
              </div>
              <div>
                <h5 style="margin: 0; color: var(--color-gold); font-size: 14px; font-weight: 800; font-family: var(--font-title);">
                  1. Tu Meta Oficial de la Semana: ${app.getEmblemName('oro')}
                </h5>
                <p style="margin: 4px 0 0 0; font-size: 12.5px; color: var(--text-muted); line-height: 1.4;">
                  Avanza por las 3 estaciones de práctica: <strong>${app.getEmblemName('bronce')} (Estación 1)</strong>, <strong>${app.getEmblemName('plata')} (Estación 2)</strong> y conquista el <strong>${app.getEmblemName('oro')} (Estación 3)</strong>. Al conseguir el Oro, habrás cumplido tu meta semanal.
                </p>
              </div>
            </div>

            <!-- Paso 2: Sin penalizaciones -->
            <div style="display: flex; gap: 14px; align-items: flex-start; background: var(--bg-surface-elevated); padding: 14px; border-radius: 10px; border-left: 4px solid var(--neon-green);">
              <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${ICONS.shieldCheck(30, 'var(--neon-green)')}
              </div>
              <div>
                <h5 style="margin: 0; color: var(--neon-green); font-size: 14px; font-weight: 800; font-family: var(--font-title);">2. ¡Aquí nunca pierdes vidas!</h5>
                <p style="margin: 4px 0 0 0; font-size: 12.5px; color: var(--text-muted); line-height: 1.4;">
                  Si una respuesta no es correcta, la plataforma te dará una pista didáctica para ayudarte a razonar. Puedes volver a intentarlo las veces que necesites sin temor al error.
                </p>
              </div>
            </div>

            <!-- Paso 3: Tiempo sugerido -->
            <div style="display: flex; gap: 14px; align-items: flex-start; background: var(--bg-surface-elevated); padding: 12px 14px; border-radius: 10px; border-left: 4px solid var(--color-delta);">
              <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${ICONS.clock(30, 'var(--color-delta)')}
              </div>
              <div>
                <h5 style="margin: 0; color: #93c5fd; font-size: 14px; font-weight: 800; font-family: var(--font-title);">3. Tiempo Sugerido: 15 a 20 Minutos</h5>
                <p style="margin: 4px 0 0 0; font-size: 12.5px; color: var(--text-muted); line-height: 1.4;">
                  No tienes que hacer todo en un solo día. Dos sesiones cortas de 10 minutos a la semana son ideales para entrenar tu fluidez matemática.
                </p>
              </div>
            </div>

            <!-- Paso 4: Reto Diamante -->
            <div style="display: flex; gap: 14px; align-items: flex-start; background: var(--bg-surface-elevated); padding: 14px; border-radius: 10px; border-left: 4px solid #60a5fa;">
              <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${app.getEmblemSvg('diamante', 36)}
              </div>
              <div>
                <h5 style="margin: 0; color: #93c5fd; font-size: 14px; font-weight: 800; font-family: var(--font-title);">
                  4. Desafío Maestro: ${app.getEmblemName('diamante')}
                </h5>
                <p style="margin: 4px 0 0 0; font-size: 12.5px; color: var(--text-muted); line-height: 1.4;">
                  El Reto Diamante es un desafío voluntario con problemas matemáticos aplicados a la vida real en el Perú. Puedes resolverlo para demostrar tu máximo ingenio una vez alcanzada tu meta de Oro.
                </p>
              </div>
            </div>

          </div>

          <div style="margin-top: 20px; text-align: center;">
            <button id="close-student-guide-btn-bottom" class="btn-neon" style="width: 100%; padding: 12px; font-size: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
              ¡ENTENDIDO, A EXPLORAR! ${ICONS.arrowRight(16, 'var(--text-black)')}
            </button>
          </div>

        </div>
      </div>

    </main>
  `;
}

export function attachStudentHomeEvents(app) {
  app.attachThemeToggleEvent();

  const guideModal = document.getElementById('student-guide-modal');
  document.getElementById('open-student-guide-btn')?.addEventListener('click', () => {
    if (guideModal) guideModal.style.display = 'flex';
  });
  document.getElementById('close-student-guide-btn')?.addEventListener('click', () => {
    if (guideModal) guideModal.style.display = 'none';
  });
  document.getElementById('close-student-guide-btn-bottom')?.addEventListener('click', () => {
    if (guideModal) guideModal.style.display = 'none';
  });
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    if (app.isTeacherSimulating) {
      app.isTeacherSimulating = false;
      app.user = app.simulatedTeacherSession || { username: 'profesor', role: 'teacher', isTeacher: true };
      app.currentView = 'TEACHER_DASHBOARD';
      app.render();
      return;
    }
    storage.logout();
    app.user = null;
    app.currentView = 'LOGIN';
    app.render();
  });

  document.getElementById('view-classroom-wall-btn')?.addEventListener('click', () => {
    app.currentView = 'CLASSROOM_WALL';
    app.render();
  });

  document.querySelectorAll('.start-station-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const stationId = e.currentTarget.getAttribute('data-station-id');
      const mission = app.getCurrentMission();
      const rawStation = mission.stations.find(s => s.id === stationId);
      if (rawStation) {
        app.selectedStation = prepareStationTasks(rawStation);
        app.currentTaskIndex = 0;
        app.currentAttemptCount = 0;
        app.taskStartTime = Date.now();
        app.sessionSeconds = 0;
        app.currentView = 'PRACTICE_STATION';
        app.render();
      }
    });
  });
}
