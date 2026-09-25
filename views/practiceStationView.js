// ==============================================================
// Expedición Matemática - Motor de Práctica Interactiva (Estaciones)
// Didáctica Finlandesa Eduten / ViLLE y Andina
// ==============================================================

import { ICONS } from '../data/icons.js';
import { storage } from '../data/storage.js';
import { escapeHtml } from '../data/guardrails.js';
import { prepareStationTasks } from '../engine/taskEngine.js';

export function renderPracticeStationView(app) {
  const station = app.selectedStation;
  const task = station.tasks[app.currentTaskIndex];
  const totalTasks = station.tasks.length;
  const currentNum = app.currentTaskIndex + 1;

  return `
    <!-- Barra Superior de Sesión Adaptativa -->
    <header class="eduten-session-bar">
      <div style="display: flex; align-items: center; gap: 14px;">
        <button id="exit-practice-btn" class="btn-dark" style="padding: 6px 14px; font-size: 12px;">
          ✕ Salir
        </button>
        <div style="font-weight: 800; color: var(--text-white); font-size: 15px; font-family: var(--font-title); display: flex; align-items: center; gap: 8px;">
          ${app.getEmblemSvg(station.trophy, 22)}
          <span>${station.name}</span>
        </div>
      </div>

      <!-- Indicador de Micro-Ejercicios (Dots) -->
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="eduten-dots-track">
          ${station.tasks.map((_, i) => {
            const statusClass = i < app.currentTaskIndex ? 'completed' : i === app.currentTaskIndex ? 'active' : '';
            return `<div class="eduten-dot ${statusClass}"></div>`;
          }).join('')}
        </div>
        <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono);">
          ${currentNum} / ${totalTasks}
        </span>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); font-weight: 700;">
          ⏱️ <span id="session-timer-display" style="color: var(--text-white);">00:00</span>
        </div>
        <div class="badge-tech" style="padding: 4px 10px; font-size: 12px;">
          ⭐ <span id="student-stars-badge">${app.user.stars || 0}</span>
        </div>
        ${app.renderSettingsMenu()}
      </div>
    </header>

    <main class="practice-station-main" style="max-width: 820px; margin: 30px auto; padding: 0 20px; flex: 1;">
      <div class="glass-panel practice-station-card" style="padding: 34px 30px; border-top: 4px solid var(--neon-green);">
        
        <div style="text-align: center; margin-bottom: 24px;">
          <span class="badge-tech" style="letter-spacing: 0.8px; font-size: 11px;">
            ⚡ ${station.instructions}
          </span>
        </div>

        <!-- Área de Trabajo Matemática Limpia (Según Estación) -->
        <div id="exercise-workspace">
          ${renderTaskWorkspace(app, station, task)}
        </div>

        <!-- Contenedor de Retroalimentación y Pistas No Punitivas -->
        <div id="task-feedback-container" style="display: none;"></div>

      </div>
    </main>

    <!-- Modal de Celebración de Trofeo (Al completar la estación) -->
    <div id="station-victory-modal" class="victory-overlay" style="display: none;"></div>
  `;
}

export function renderTaskWorkspace(app, station, task) {
  // 1. ESTACIÓN 1: DETECTOR DE LA REGLA
  if (station.type === 'rule-detector') {
    return `
      <div>
        <!-- Números de la Secuencia en Cajas Adaptativas -->
        <div class="sequence-box-container" style="display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; margin: 20px 0 30px 0;">
          ${task.sequence.map((num, i) => `
            <div class="sequence-box">
              ${num}
            </div>
            ${i < task.sequence.length - 1 ? `<span class="sequence-arrow">${ICONS.arrowRight(20, 'currentColor')}</span>` : ''}
          `).join('')}
        </div>

        <div style="text-align: center; font-size: 16px; font-weight: 700; color: var(--text-white); margin-bottom: 16px; font-family: var(--font-title);">
          ¿Qué regla hace crecer esta secuencia matemática?
        </div>

        <!-- Opciones de 1 Clic -->
        <div class="rule-options-grid">
          ${task.options.map(opt => `
            <button class="rule-option-btn" data-option="${opt}">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 2. ESTACIÓN 2: LA RECTA DE SALTOS (JUMP TRACK)
  if (station.type === 'jump-track') {
    return `
      <div>
        <div style="text-align: center; margin-bottom: 12px;">
          <span class="badge-tech badge-delta" style="font-size: 12px; padding: 4px 14px;">
            ${task.ruleLabel || `Regla del salto: ${task.rule.startsWith('×') ? 'Multiplicar por ' + task.rule.replace('×', '').trim() + ' (' + task.rule + ')' : task.rule}`}
          </span>
        </div>

        <div class="jump-track-wrapper">
          ${task.track.map((val, idx) => {
            const isTarget = idx === task.missingIndex;
            const isLast = idx === task.track.length - 1;

            return `
              <div class="jump-node-box ${isTarget ? 'jump-node-target' : ''}">
                ${isTarget ? `
                  <input 
                    type="number" 
                    id="jump-input" 
                    class="jump-target-input" 
                    placeholder="?" 
                    autofocus 
                    autocomplete="off" 
                  />
                ` : val}
              </div>
              ${!isLast ? `
                <div class="jump-arc-bridge">
                  <div class="jump-arc-label">${task.rule}</div>
                  <div class="jump-arc-symbol">↷</div>
                </div>
              ` : ''}
            `;
          }).join('')}
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <button 
            id="submit-jump-btn" 
            class="btn-neon"
            style="padding: 14px 36px; font-size: 15px;"
          >
            COMPROBAR RESPUESTA ${ICONS.arrowRight(16, 'var(--text-black)')}
          </button>
        </div>
      </div>
    `;
  }

  // 3. ESTACIÓN 3: LA MÁQUINA DE FUNCIONES
  if (station.type === 'function-machine') {
    return `
      <div class="machine-card-container">
        <div class="machine-rule-banner">
          ⚡ ${task.ruleDisplay}
        </div>
        <table class="machine-table">
          <thead>
            <tr>
              <th style="width: 50%;">ENTRADA (Número)</th>
              <th style="width: 50%;">SALIDA (Resultado)</th>
            </tr>
          </thead>
          <tbody>
            ${task.table.map(row => {
              const inIsTarget = row.in === '?';
              const outIsTarget = row.out === '?';

              return `
                <tr>
                  <td>
                    ${inIsTarget ? `
                      <input type="number" id="machine-input" class="machine-input-cell" placeholder="?" autofocus />
                    ` : row.in}
                  </td>
                  <td>
                    ${outIsTarget ? `
                      <input type="number" id="machine-input" class="machine-input-cell" placeholder="?" autofocus />
                    ` : row.out}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="text-align: center; margin-top: 18px; font-size: 14px; font-weight: 700; color: var(--neon-green); font-family: var(--font-mono);">
          👉 ${task.prompt}
        </div>

        <div style="text-align: center; margin-top: 22px; width: 100%;">
          <button 
            id="submit-machine-btn" 
            class="btn-neon"
            style="width: 100%; max-width: 320px; padding: 14px; font-size: 15px;"
          >
            COMPROBAR RESPUESTA ${ICONS.arrowRight(16, 'var(--text-black)')}
          </button>
        </div>
      </div>
    `;
  }

  // 4. RETO DIAMANTE (APLICADO)
  if (station.type === 'applied-problem') {
    return `
      <div style="max-width: 600px; margin: 0 auto;">
        <div class="glass-panel" style="border-left: 4px solid var(--color-delta); padding: 22px; margin-bottom: 22px; background: var(--bg-surface);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge-tech badge-delta" style="font-size: 11px;">
              📍 ${task.location} • ${task.title}
            </span>
          </div>
          <p style="font-size: 15px; color: var(--text-white); line-height: 1.6; margin: 12px 0;">
            ${task.story}
          </p>
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; color: var(--color-delta); font-family: var(--font-mono); margin-top: 10px;">
            📊 ${task.formulaTrack}
          </div>
          <p style="font-size: 15px; font-weight: 800; color: var(--text-white); margin-top: 14px; font-family: var(--font-title);">
            👉 ${task.question}
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 22px;">
          <label style="display: block; font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 10px; font-family: var(--font-mono); text-transform: uppercase;">
            Escribe tu respuesta final:
          </label>
          <input 
            type="number" 
            id="applied-input" 
            placeholder="?"
            style="padding: 12px 18px; border: 2px solid var(--neon-green); background: var(--bg-canvas); color: var(--neon-green); border-radius: 10px; font-size: 26px; width: 200px; text-align: center; font-weight: 900; font-family: var(--font-mono);"
            autofocus 
          />
        </div>

        <div style="text-align: center;">
          <button 
            id="submit-applied-btn" 
            class="btn-neon"
            style="padding: 14px 36px; font-size: 15px;"
          >
            COMPROBAR RESPUESTA ${ICONS.arrowRight(16, 'var(--text-black)')}
          </button>
        </div>
      </div>
    `;
  }

  return '';
}

export function attachPracticeStationEvents(app) {
  app.attachThemeToggleEvent();
  const station = app.selectedStation;
  const task = station.tasks[app.currentTaskIndex];

  document.getElementById('exit-practice-btn')?.addEventListener('click', () => {
    if (app.currentTaskIndex > 0) {
      showExitConfirmationModal(app);
    } else {
      app.currentView = 'STUDENT_HOME';
      app.render();
    }
  });

  // 1. ESTACIÓN 1: Clic en opciones de regla
  if (station.type === 'rule-detector') {
    document.querySelectorAll('.rule-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const chosen = e.currentTarget.getAttribute('data-option');
        evaluateRuleDetectorAnswer(app, chosen, task, e.currentTarget);
      });
    });
  }

  // 2. ESTACIÓN 2: Recta de saltos
  if (station.type === 'jump-track') {
    const inputEl = document.getElementById('jump-input');
    const submitBtn = document.getElementById('submit-jump-btn');

    const handleJump = () => {
      const val = parseInt(inputEl?.value);
      if (isNaN(val)) return;
      evaluateNumericAnswer(app, val, task.correctAnswer, task.scaffold);
    };

    submitBtn?.addEventListener('click', handleJump);
    inputEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleJump();
    });
  }

  // 3. ESTACIÓN 3: Máquina de funciones
  if (station.type === 'function-machine') {
    const inputEl = document.getElementById('machine-input');
    const submitBtn = document.getElementById('submit-machine-btn');

    const handleMachine = () => {
      const val = parseInt(inputEl?.value);
      if (isNaN(val)) return;
      evaluateNumericAnswer(app, val, task.correctAnswer, task.scaffold);
    };

    submitBtn?.addEventListener('click', handleMachine);
    inputEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleMachine();
    });
  }

  // 4. RETO DIAMANTE
  if (station.type === 'applied-problem') {
    const inputEl = document.getElementById('applied-input');
    const submitBtn = document.getElementById('submit-applied-btn');

    const handleApplied = () => {
      const val = parseInt(inputEl?.value);
      if (isNaN(val)) return;
      evaluateNumericAnswer(app, val, task.correctAnswer, task.scaffold);
    };

    submitBtn?.addEventListener('click', handleApplied);
    inputEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleApplied();
    });
  }
}

export function showFeedbackBox(feedbackBox, isCorrect, htmlContent) {
  if (!feedbackBox) return;
  feedbackBox.className = `scaffold-feedback-box ${isCorrect ? 'correct' : 'try-again'}`;
  feedbackBox.innerHTML = htmlContent;
  feedbackBox.style.display = 'flex';
  
  // Garantizar visibilidad inmediata en celulares sin requerir scroll manual
  requestAnimationFrame(() => {
    try {
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      feedbackBox.scrollIntoView(false);
    }
  });
}

export function evaluateRuleDetectorAnswer(app, chosen, task, clickedBtn) {
  app.currentAttemptCount++;
  const isCorrect = (chosen.trim() === task.correctOption.trim());
  const feedbackBox = document.getElementById('task-feedback-container');
  const durationSec = Math.max(2, Math.round((Date.now() - app.taskStartTime) / 1000));

  if (isCorrect) {
    app.playFeedbackTone('correct');
    clickedBtn.classList.add('selected-correct');
    showFeedbackBox(feedbackBox, true, `
      <div style="font-size: 24px;">🎉</div>
      <div>
        <div style="font-weight: 800; font-size: 15px;">¡Excelente! Regla Correcta</div>
        <div style="font-size: 13px; margin-top: 2px;">${task.reason}</div>
      </div>
    `);

    const isStationComplete = (app.currentTaskIndex === app.selectedStation.tasks.length - 1);
    storage.recordTaskAttempt(app.user.id, {
      stationId: app.selectedStation.id,
      taskId: task.id,
      taskIndex: app.currentTaskIndex,
      isCorrect: true,
      attemptNumber: app.currentAttemptCount,
      timeSpentSec: durationSec,
      isStationComplete
    });

    const starsBadge = document.getElementById('student-stars-badge');
    if (starsBadge) starsBadge.textContent = app.user.stars || 0;

    setTimeout(() => {
      advanceToNextTask(app);
    }, 1400);

  } else {
    app.playFeedbackTone('error');
    clickedBtn.classList.add('selected-wrong');
    const hint = task.commonMistakeHint?.[chosen] || 'Prueba multiplicando en lugar de sumar para ver si funciona con todos los términos.';
    
    showFeedbackBox(feedbackBox, false, `
      <div style="font-size: 24px;">💡</div>
      <div>
        <div style="font-weight: 800; font-size: 15px;">Pista de Razonamiento Finlandés:</div>
        <div style="font-size: 13px; margin-top: 2px;">${hint}</div>
      </div>
    `);

    storage.recordTaskAttempt(app.user.id, {
      stationId: app.selectedStation.id,
      taskId: task.id,
      taskIndex: app.currentTaskIndex,
      isCorrect: false,
      chosenAnswer: chosen,
      correctAnswer: task.correctOption,
      attemptNumber: app.currentAttemptCount,
      timeSpentSec: durationSec
    });
  }
}

export function evaluateNumericAnswer(app, enteredValue, correctAnswer, scaffoldHint) {
  app.currentAttemptCount++;
  const isCorrect = (enteredValue === correctAnswer);
  const feedbackBox = document.getElementById('task-feedback-container');
  const durationSec = Math.max(2, Math.round((Date.now() - app.taskStartTime) / 1000));

  if (isCorrect) {
    app.playFeedbackTone('correct');
    showFeedbackBox(feedbackBox, true, `
      <div style="font-size: 24px;">🎉</div>
      <div>
        <div style="font-weight: 800; font-size: 15px;">¡Correcto! +1 Estrella ⭐</div>
        <div style="font-size: 13px; margin-top: 2px;">${scaffoldHint}</div>
      </div>
    `);

    const isStationComplete = (app.currentTaskIndex === app.selectedStation.tasks.length - 1);
    storage.recordTaskAttempt(app.user.id, {
      stationId: app.selectedStation.id,
      taskId: app.selectedStation.tasks[app.currentTaskIndex].id,
      taskIndex: app.currentTaskIndex,
      isCorrect: true,
      attemptNumber: app.currentAttemptCount,
      timeSpentSec: durationSec,
      isStationComplete
    });

    const starsBadge = document.getElementById('student-stars-badge');
    if (starsBadge) starsBadge.textContent = app.user.stars || 0;

    setTimeout(() => {
      advanceToNextTask(app);
    }, 1400);

  } else {
    app.playFeedbackTone('error');
    showFeedbackBox(feedbackBox, false, `
      <div style="font-size: 24px;">💡</div>
      <div>
        <div style="font-weight: 800; font-size: 15px;">Pista de Apoyo (Descomposición):</div>
        <div style="font-size: 13px; margin-top: 2px;">${scaffoldHint}</div>
        <div style="font-size: 12px; margin-top: 4px; font-weight: 600;">Corrige tu número e inténtalo de nuevo.</div>
      </div>
    `);

    storage.recordTaskAttempt(app.user.id, {
      stationId: app.selectedStation.id,
      taskId: app.selectedStation.tasks[app.currentTaskIndex].id,
      taskIndex: app.currentTaskIndex,
      isCorrect: false,
      chosenAnswer: enteredValue,
      correctAnswer,
      attemptNumber: app.currentAttemptCount,
      timeSpentSec: durationSec
    });
  }
}

export function advanceToNextTask(app) {
  const station = app.selectedStation;
  if (app.currentTaskIndex < station.tasks.length - 1) {
    app.currentTaskIndex++;
    app.currentAttemptCount = 0;
    app.taskStartTime = Date.now();
    app.render();
  } else {
    showStationVictoryModal(app);
  }
}

export function showStationVictoryModal(app) {
  app.playFeedbackTone('celebration');
  const station = app.selectedStation;
  const modalEl = document.getElementById('station-victory-modal');
  if (!modalEl) return;

  modalEl.style.display = 'flex';
  modalEl.innerHTML = `
    <div class="victory-card">
      <div style="margin-bottom: 16px; filter: drop-shadow(0 0 16px var(--border-glow)); display: flex; justify-content: center;">
        ${app.getEmblemSvg(station.trophy, 72)}
      </div>
      <h2 style="font-size: 24px; color: var(--text-white); margin-bottom: 6px; font-family: var(--font-title);">
        ¡ESTACIÓN CONQUISTADA!
      </h2>
      <div style="font-size: 15px; font-weight: 800; color: var(--color-success); margin-bottom: 12px; font-family: var(--font-mono); text-transform: uppercase;">
        Has desbloqueado: ${app.getEmblemName(station.trophy)}
      </div>
      <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">
        Completaste los ${station.targetExercises} micro-ejercicios de <strong style="color: var(--text-white);">${station.shortTitle}</strong> con fluidez matemática.
      </p>

      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button 
          id="victory-next-btn"
          class="btn-neon"
          style="padding: 12px 24px; font-size: 14px;"
        >
          SIGUIENTE ESTACIÓN ${ICONS.arrowRight(16, 'var(--text-black)')}
        </button>
        <button 
          id="victory-home-btn"
          class="btn-dark"
          style="padding: 12px 20px; font-size: 13px;"
        >
          Volver a Mis Desafíos
        </button>
      </div>
    </div>
  `;

  document.getElementById('victory-next-btn')?.addEventListener('click', () => {
    const mission = app.getCurrentMission();
    const currentIdx = mission.stations.findIndex(s => s.id === station.id);
    if (currentIdx !== -1 && currentIdx < mission.stations.length - 1) {
      app.selectedStation = prepareStationTasks(mission.stations[currentIdx + 1]);
      app.currentTaskIndex = 0;
      app.currentAttemptCount = 0;
      app.taskStartTime = Date.now();
      app.render();
    } else {
      app.currentView = 'STUDENT_HOME';
      app.render();
    }
  });

  document.getElementById('victory-home-btn')?.addEventListener('click', () => {
    app.currentView = 'STUDENT_HOME';
    app.render();
  });
}

export function showExitConfirmationModal(app) {
  const existing = document.getElementById('pause-mission-modal');
  if (existing) existing.remove();

  const station = app.selectedStation;
  const completedSoFar = app.currentTaskIndex;
  const total = station.tasks.length;

  const modal = document.createElement('div');
  modal.id = 'pause-mission-modal';
  modal.className = 'worksheet-modal-overlay';
  modal.style.display = 'flex';
  modal.style.zIndex = '9999';

  modal.innerHTML = `
    <div class="worksheet-modal-content glass-panel" style="max-width: 440px; text-align: center; padding: 32px 28px;">
      <div style="font-size: 38px; margin-bottom: 12px;">⏸️</div>
      <h3 style="font-size: 20px; color: var(--text-white); font-family: var(--font-title); margin-bottom: 8px;">
        ¿Deseas pausar tu misión?
      </h3>
      <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.5; margin-bottom: 22px;">
        Llevas <strong style="color: var(--neon-green); font-family: var(--font-mono);">${completedSoFar} de ${total}</strong> micro-ejercicios en <strong>${escapeHtml(station.shortTitle || station.name)}</strong>. Tu avance está registrado y seguro.
      </p>
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button id="modal-resume-btn" class="btn-neon" style="padding: 10px 18px; font-size: 13px;">
          Continuar Misión 🚀
        </button>
        <button id="modal-exit-btn" class="btn-dark" style="padding: 10px 16px; font-size: 13px;">
          Pausar y Salir 🏠
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('modal-resume-btn')?.addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('modal-exit-btn')?.addEventListener('click', () => {
    modal.remove();
    app.currentView = 'STUDENT_HOME';
    app.render();
  });
}
