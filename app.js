import { storage } from './data/storage.js';
import { WEEKLY_CYCLE, WEEKLY_MISSION, TROPHY_THRESHOLDS, AVAILABLE_TOPICS, getWeeklyMission } from './data/curriculum.js';
import { CLASSROOMS } from './data/students.js';
import { ICONS, CYBER_AVATARS, getThemedEmblem } from './data/icons.js';
import { validateFullCurriculum, escapeHtml, sanitizePin } from './data/guardrails.js';
import { playFeedbackTone } from './audio/soundEffects.js';
import { 
  renderSingleCardHtml, 
  renderCardsHtmlForPreview, 
  renderCardsHtmlForPrint, 
  printIsolatedCards 
} from './components/accessCards.js';
import { 
  renderWorksheetA4Html, 
  printIsolatedWorksheet 
} from './components/worksheetA4.js';
import { 
  renderStudentModalsHtml, 
  openEditStudentModal, 
  openAddStudentModal, 
  openDeleteConfirmModal, 
  attachStudentEditEvents 
} from './components/studentModals.js';
import { renderLoginView, attachLoginEvents } from './views/loginView.js';
import { renderStudentHomeView, attachStudentHomeEvents } from './views/studentHomeView.js';
import { renderClassroomWallView, attachClassroomWallEvents } from './views/classroomWallView.js';
import { renderPracticeStationView, attachPracticeStationEvents } from './views/practiceStationView.js';
import { renderTeacherDashboard, attachTeacherEvents, renderWeeklyAnalyticsSection, renderStudentRows } from './views/teacherDashboardView.js';

// Iconos y trofeos
const AVATAR_ICONS = {
  chasqui: '🏃‍♂️',
  condor: '🦅',
  vicuna: '🦙',
  delfin: '🐬',
  puma: '🐆'
};

function renderCyberAvatar(key, size = 36) {
  if (CYBER_AVATARS[key]) {
    return CYBER_AVATARS[key].svg(size);
  }
  return AVATAR_ICONS[key] || '🎒';
}

class ExpedicionApp {
  constructor() {
    // 🛡️ Ejecutar Guardrails de Validación Curricular al inicio
    try {
      validateFullCurriculum(AVAILABLE_TOPICS);
    } catch (err) {
      console.error('🛡️ [GUARDRAIL ERROR AL ARRANQUE]:', err);
    }

    this.currentView = 'LOGIN'; // LOGIN | STUDENT_HOME | CLASSROOM_WALL | PRACTICE_STATION | TEACHER_DASHBOARD
    this.user = null;
    this.selectedStation = null;
    this.currentTaskIndex = 0;
    this.currentAttemptCount = 0;
    this.taskStartTime = null;
    this.sessionTimerInterval = null;
    this.selectedClassroomFilter = 'sigma'; // 'sigma' | 'delta' (Nunca todos)
    this.selectedWorksheetTopicId = storage.getActiveTopic();
    this.simulatedTopicId = null;
    this.tableMetricMode = 'semana'; // 'semana' | 'bimestre'
    this.isTeacherSimulating = false;
    this.simulatedTeacherSession = null;
    const savedTheme = localStorage.getItem('expedicion_active_theme');
    this.currentTheme = (savedTheme === 'cyber' && localStorage.getItem('expedicion_user_picked_cyber')) ? 'cyber' : 'andina';
    this.applyTheme(this.currentTheme);

    this.isMuted = localStorage.getItem('expedicion_sound_muted') === 'true';
    this.audioCtx = null;

    this.init();
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('expedicion_active_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }
  }

  getCurrentMission() {
    const activeTopicId = this.isTeacherSimulating 
      ? (this.simulatedTopicId || this.selectedWorksheetTopicId || storage.getActiveTopic())
      : storage.getActiveTopic();
    return getWeeklyMission(activeTopicId);
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'cyber' ? 'andina' : 'cyber';
    this.applyTheme(nextTheme);
    this.render();
  }

  getThemeDisplayName() {
    return this.currentTheme === 'andina' ? 'Expedición' : 'Ciber-Nave';
  }

  getEmblemSvg(tier, size = 32) {
    const emblem = getThemedEmblem(this.currentTheme, tier);
    return emblem.svg(size);
  }

  getEmblemName(tier) {
    const emblem = getThemedEmblem(this.currentTheme, tier);
    return emblem.name;
  }

  getEmblemShort(tier) {
    const emblem = getThemedEmblem(this.currentTheme, tier);
    return emblem.short;
  }

  getEmblemTierLabel(tier) {
    const emblem = getThemedEmblem(this.currentTheme, tier);
    return emblem.tierLabel || tier;
  }

  getEmblemArticle(tier) {
    const emblem = getThemedEmblem(this.currentTheme, tier);
    return emblem.article || 'el';
  }

  renderThemeToggleBtn() {
    const isExpedicion = this.currentTheme === 'andina';
    const icon = isExpedicion 
      ? ICONS.ripple(18, 'currentColor') 
      : ICONS.bolt(16, 'var(--neon-green)');
    const name = isExpedicion ? 'Expedición' : 'Ciber-Nave';

    return `
      <button 
        id="theme-toggle-btn" 
        class="btn-dark" 
        style="padding: 6px 14px; font-size: 12px; display: inline-flex; align-items: center; gap: 7px; cursor: pointer;"
        title="Cambiar tema visual (Clic para alternar)"
      >
        ${icon}
        <span style="font-weight: 700;">${name}</span>
      </button>
    `;
  }

  attachThemeToggleEvent() {
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      this.toggleTheme();
    });
    this.attachSoundToggleEvent();
    this.attachSettingsMenuEvents();
  }

  renderSettingsMenu() {
    const isAndina = this.currentTheme === 'andina';
    return `
      <div class="settings-menu-container" style="position: relative; display: inline-block;">
        <button 
          id="settings-menu-btn" 
          class="btn-dark" 
          style="padding: 7px 11px; font-size: 15px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 8px;" 
          title="Ajustes y Configuración"
          aria-label="Configuración"
        >
          ${ICONS.dotsVertical(18, 'var(--neon-green)')}
        </button>
        <div 
          id="settings-dropdown-menu" 
          class="glass-panel" 
          style="display: none; position: absolute; right: 0; top: calc(100% + 8px); width: 220px; z-index: 1000; padding: 6px; box-shadow: 0 14px 35px rgba(0,0,0,0.6); border: 1.5px solid var(--border-subtle); background: var(--bg-surface);"
        >
          <!-- 1. Cambiar Tema -->
          <button id="menu-theme-btn" class="settings-menu-item" style="width: 100%; text-align: left; background: transparent; border: none; padding: 9px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; color: var(--text-white); font-family: var(--font-body); font-size: 12.5px;">
            <span style="display: flex; align-items: center; gap: 8px;">
              ${isAndina ? ICONS.ripple(16, 'var(--neon-green)') : ICONS.bolt(16, 'var(--neon-green)')}
              <span>Tema Visual</span>
            </span>
            <span style="font-size: 10.5px; font-family: var(--font-mono); color: var(--text-muted); font-weight: 700;">
              ${isAndina ? 'Expedición' : 'Ciber'}
            </span>
          </button>

          <!-- 2. Sonido -->
          <button id="menu-sound-btn" class="settings-menu-item" style="width: 100%; text-align: left; background: transparent; border: none; padding: 9px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; color: var(--text-white); font-family: var(--font-body); font-size: 12.5px;">
            <span style="display: flex; align-items: center; gap: 8px;">
              ${this.isMuted ? ICONS.volumeMute(16, 'var(--text-dim)') : ICONS.volume(16, 'var(--neon-green)')}
              <span>Efectos de Sonido</span>
            </span>
            <span style="font-size: 10.5px; font-family: var(--font-mono); color: ${this.isMuted ? 'var(--text-dim)' : 'var(--neon-green)'}; font-weight: 800;">
              ${this.isMuted ? 'MUTE' : 'ON'}
            </span>
          </button>

          <div style="height: 1px; background: var(--border-subtle); margin: 5px 4px;"></div>

          <!-- 3. Cerrar Sesión -->
          <button id="menu-logout-btn" class="settings-menu-item" style="width: 100%; text-align: left; background: transparent; border: none; padding: 9px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; color: #f87171; font-family: var(--font-body); font-size: 12.5px; font-weight: 700;">
            ${ICONS.logout(15, '#f87171')}
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    `;
  }

  attachSettingsMenuEvents() {
    const btn = document.getElementById('settings-menu-btn');
    const menu = document.getElementById('settings-dropdown-menu');

    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menu) {
        const isHidden = menu.style.display === 'none' || !menu.style.display;
        if (isHidden) {
          menu.style.display = 'block';
          // Prevenir desbordamientos laterales en pantallas pequeñas
          const rect = menu.getBoundingClientRect();
          if (rect.left < 8) {
            menu.style.left = '0';
            menu.style.right = 'auto';
          } else if (rect.right > window.innerWidth - 8) {
            menu.style.right = '0';
            menu.style.left = 'auto';
          }
        } else {
          menu.style.display = 'none';
        }
      }
    });

    document.getElementById('menu-theme-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleTheme();
    });

    document.getElementById('menu-sound-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isMuted = !this.isMuted;
      localStorage.setItem('expedicion_sound_muted', String(this.isMuted));
      if (!this.isMuted) this.playFeedbackTone('correct');
      this.render();
    });

    document.getElementById('menu-logout-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.currentView === 'PRACTICE_STATION') {
        this.showExitConfirmationModal();
      } else {
        storage.logout();
        this.user = null;
        this.currentView = 'LOGIN';
        this.render();
      }
    });

    // Cerrar menú al hacer clic en cualquier parte exterior
    document.addEventListener('click', (e) => {
      if (menu && menu.style.display === 'block' && !menu.contains(e.target) && e.target !== btn && !btn?.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  }

  renderSoundToggleBtn() {
    const isMuted = this.isMuted;
    return `
      <button 
        id="sound-toggle-btn" 
        class="btn-dark" 
        style="padding: 6px 12px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;"
        title="${isMuted ? 'Activar Sonido (Actualmente Silenciado)' : 'Silenciar Sonido (Modo Aula de Cómputo)'}"
      >
        ${isMuted ? ICONS.volumeMute(16, 'var(--text-dim)') : ICONS.volume(16, 'var(--neon-green)')}
        <span style="font-weight: 700; font-family: var(--font-mono); font-size: 11px;">${isMuted ? 'MUTE' : 'AUDIO'}</span>
      </button>
    `;
  }

  attachSoundToggleEvent() {
    document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      localStorage.setItem('expedicion_sound_muted', String(this.isMuted));
      if (!this.isMuted) {
        this.playFeedbackTone('correct');
      }
      this.render();
    });
  }

  playFeedbackTone(type = 'correct') {
    playFeedbackTone(type, this.isMuted);
  }

  init() {
    const activeUser = storage.getCurrentUser();
    this.currentView = activeUser ? (activeUser.isTeacher ? 'TEACHER_DASHBOARD' : 'STUDENT_HOME') : 'LOGIN';
    if (activeUser) this.user = activeUser;

    // Reactividad: Si Supabase termina de cargar o sincronizar datos en segundo plano
    storage.onDataUpdated = () => {
      if (this.user && !this.user.isTeacher) {
        const fresh = storage.getStudentById(this.user.id);
        if (fresh) this.user = fresh;
      }
      this.render();
    };

    this.setupSessionActivityTracker();
    this.render();
  }

  setupSessionActivityTracker() {
    let lastTouch = 0;
    const updateActivity = () => {
      const now = Date.now();
      if (now - lastTouch > 30000) {
        lastTouch = now;
        storage.touchSession();
      }
    };

    window.addEventListener('click', updateActivity, { passive: true });
    window.addEventListener('keydown', updateActivity, { passive: true });
    window.addEventListener('touchstart', updateActivity, { passive: true });

    // Monitor de expiración de sesión por inactividad en segundo plano (cada 60s)
    setInterval(() => {
      if (this.user && !storage.getCurrentUser()) {
        console.log("🔒 Sesión escolar expirada por inactividad. Redirigiendo al inicio de sesión.");
        this.user = null;
        this.currentView = 'LOGIN';
        this.render();
      }
    }, 60000);
  }

  render() {
    const root = document.getElementById('app');
    if (!root) return;

    if (this.sessionTimerInterval) {
      clearInterval(this.sessionTimerInterval);
      this.sessionTimerInterval = null;
    }

    let simulationBannerHtml = '';
    if (this.isTeacherSimulating && this.currentView !== 'TEACHER_DASHBOARD' && this.currentView !== 'LOGIN') {
      const activeTopicId = this.simulatedTopicId || this.selectedWorksheetTopicId || storage.getActiveTopic();
      const topicObj = AVAILABLE_TOPICS.find(t => t.id === activeTopicId) || AVAILABLE_TOPICS[0];

      simulationBannerHtml = `
        <div style="background: linear-gradient(90deg, #091e3a 0%, #1e293b 100%); border-bottom: 2px solid var(--neon-green); padding: 9px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 99999; box-shadow: 0 4px 16px rgba(0,0,0,0.5); flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 18px;">🎒</span>
            <div>
              <span style="font-size: 11.5px; font-weight: 800; color: var(--neon-green); font-family: var(--font-mono); letter-spacing: 0.5px;">MODO SIMULADOR DOCENTE:</span>
              <span style="font-size: 12px; color: #ffffff; font-family: var(--font-body); margin-left: 6px;">Viendo como <strong>${this.user.name}</strong> • <strong>${topicObj.title.split(':')[0]}</strong> (${this.user.classroom === 'sigma' ? '4.° Sigma' : '4.° Delta'})</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button id="reset-simulation-btn" class="btn-dark" style="padding: 6px 14px; font-size: 12px; font-weight: 700; border-color: var(--neon-green); color: var(--neon-green); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Reiniciar el avance del alumno virtual desde cero">
              🔄 Reiniciar simulador
            </button>
            <button id="exit-simulation-btn" class="btn-neon" style="padding: 6px 16px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              ⬅️ Volver al Panel Docente
            </button>
          </div>
        </div>
      `;
    }

    switch (this.currentView) {
      case 'LOGIN':
        root.innerHTML = this.renderLoginView();
        this.attachLoginEvents();
        break;
      case 'STUDENT_HOME':
        root.innerHTML = simulationBannerHtml + this.renderStudentHomeView();
        this.attachStudentHomeEvents();
        break;
      case 'CLASSROOM_WALL':
        root.innerHTML = simulationBannerHtml + this.renderClassroomWallView();
        this.attachClassroomWallEvents();
        break;
      case 'PRACTICE_STATION':
        root.innerHTML = simulationBannerHtml + this.renderPracticeStationView();
        this.attachPracticeStationEvents();
        this.startSessionTimer();
        break;
      case 'TEACHER_DASHBOARD':
        root.innerHTML = this.renderTeacherDashboard();
        this.attachTeacherEvents();
        break;
    }

    if (this.isTeacherSimulating) {
      document.getElementById('reset-simulation-btn')?.addEventListener('click', () => {
        if (this.isTeacherSimulating && this.user) {
          storage.resetVirtualStudent(this.user.id);
          this.user.stars = 0;
          this.user.xp = 0;
          this.user.timeMinutes = 0;
          this.user.completedChallenges = [];
          this.user.stationProgress = {};
          this.user.trophies = { patrones: 'ninguno' };
          if (this.currentView === 'PRACTICE_STATION') {
            this.currentView = 'STUDENT_HOME';
            this.selectedStation = null;
            this.currentTaskIndex = 0;
            this.currentAttemptCount = 0;
          }
          this.playFeedbackTone('correct');
          this.render();
        }
      });

      document.getElementById('exit-simulation-btn')?.addEventListener('click', () => {
        this.isTeacherSimulating = false;
        this.user = this.simulatedTeacherSession || { username: 'profesor', role: 'teacher', isTeacher: true };
        this.currentView = 'TEACHER_DASHBOARD';
        this.render();
      });
    }
  }

  // ==========================================
  // VISTAS MODULARIZADAS (ES MODULES)
  // ==========================================
  renderLoginView() {
    return renderLoginView(this);
  }

  attachLoginEvents() {
    attachLoginEvents(this);
  }

  renderStudentHomeView() {
    return renderStudentHomeView(this);
  }

  attachStudentHomeEvents() {
    attachStudentHomeEvents(this);
  }

  renderClassroomWallView() {
    return renderClassroomWallView(this);
  }

  attachClassroomWallEvents() {
    attachClassroomWallEvents(this);
  }

  renderPracticeStationView() {
    return renderPracticeStationView(this);
  }

  attachPracticeStationEvents() {
    attachPracticeStationEvents(this);
  }

  startSessionTimer() {
    if (this.sessionTimerInterval) clearInterval(this.sessionTimerInterval);
    this.sessionTimerInterval = setInterval(() => {
      this.sessionSeconds++;
      const mins = Math.floor(this.sessionSeconds / 60);
      const secs = this.sessionSeconds % 60;
      const display = document.getElementById('session-timer-display');
      if (display) {
        display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  renderTeacherDashboard() {
    return renderTeacherDashboard(this);
  }

  attachTeacherEvents() {
    attachTeacherEvents(this);
  }

  renderWeeklyAnalyticsSection(topicId, filter) {
    return renderWeeklyAnalyticsSection(this, topicId, filter);
  }

  renderStudentRows(students, showPins, mode, topicId) {
    return renderStudentRows(this, students, showPins, mode, topicId);
  }

  printIsolatedCards(filter = 'todos') {
    printIsolatedCards(filter);
  }

  renderCardsHtmlForPreview(filter = 'todos') {
    return renderCardsHtmlForPreview(filter);
  }

  renderSingleCardHtml(s) {
    return renderSingleCardHtml(s);
  }

  renderCardsHtmlForPrint(filter = 'todos') {
    return renderCardsHtmlForPrint(filter);
  }

  printIsolatedWorksheet() {
    const activeOrSelected = this.selectedWorksheetTopicId || storage.getActiveTopic();
    printIsolatedWorksheet(activeOrSelected);
  }

  renderWorksheetA4Html(topicId = null) {
    const activeId = topicId || this.selectedWorksheetTopicId || storage.getActiveTopic();
    return renderWorksheetA4Html(activeId);
  }

  openEditStudentModal(studentId) {
    openEditStudentModal(this, studentId);
  }

  openAddStudentModal() {
    openAddStudentModal(this);
  }

  openDeleteConfirmModal(studentId) {
    openDeleteConfirmModal(this, studentId);
  }

  attachStudentEditEvents() {
    attachStudentEditEvents(this);
  }
}

function initExpedicion() {
  if (!window.expedicionAppInstance) {
    try {
      window.expedicionAppInstance = new ExpedicionApp();
    } catch (e) {
      console.error('Error al inicializar ExpedicionApp:', e);
      const root = document.getElementById('app');
      if (root) {
        root.innerHTML = `
          <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid #ef4444; border-radius: 12px; padding: 24px; max-width: 480px; text-align: center; color: white; font-family: sans-serif;">
              <h2 style="color: #f87171; margin-bottom: 12px;">⚠️ Aviso de Actualización</h2>
              <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 18px;">Se ha detectado una nueva versión de la plataforma. Presiona el botón para cargarla.</p>
              <button onclick="localStorage.clear(); location.reload();" style="background: #00ff9d; color: black; font-weight: 800; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                🔄 Actualizar Plataforma
              </button>
            </div>
          </div>
        `;
      }
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExpedicion);
} else {
  initExpedicion();
}
