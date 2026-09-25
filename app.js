import { storage } from './data/storage.js';
import { WEEKLY_CYCLE, WEEKLY_MISSION, TROPHY_THRESHOLDS, AVAILABLE_TOPICS } from './data/curriculum.js';
import { CLASSROOMS } from './data/students.js';
import { ICONS, CYBER_AVATARS, getThemedEmblem } from './data/icons.js';
import { validateFullCurriculum, escapeHtml, sanitizePin } from './data/guardrails.js';

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
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
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
    if (this.isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      if (type === 'correct') {
        // Pentatonic Chime: E5 (659Hz) -> A5 (880Hz)
        const osc1 = this.audioCtx.createOscillator();
        const gain1 = this.audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now);
        gain1.gain.setValueAtTime(0.07, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc1.connect(gain1);
        gain1.connect(this.audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.18);

        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.10);
        gain2.gain.setValueAtTime(0.08, now + 0.10);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        osc2.start(now + 0.10);
        osc2.stop(now + 0.35);
      } else if (type === 'error') {
        // Gentle wooden clack (220Hz -> 180Hz)
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.18);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'celebration') {
        // Ascending victory arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const startTime = now + (idx * 0.11);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.07, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.30);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.30);
        });
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
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

    this.render();
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
      simulationBannerHtml = `
        <div style="background: linear-gradient(90deg, #091e3a 0%, #1e293b 100%); border-bottom: 2px solid var(--neon-green); padding: 9px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 99999; box-shadow: 0 4px 16px rgba(0,0,0,0.5); flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 18px;">🎒</span>
            <div>
              <span style="font-size: 11.5px; font-weight: 800; color: var(--neon-green); font-family: var(--font-mono); letter-spacing: 0.5px;">MODO SIMULADOR DOCENTE:</span>
              <span style="font-size: 12px; color: #ffffff; font-family: var(--font-body); margin-left: 6px;">Viendo y probando como <strong>${this.user.name}</strong> (${this.user.classroom === 'sigma' ? '4.° Sigma' : '4.° Delta'})</span>
            </div>
          </div>
          <button id="exit-simulation-btn" class="btn-neon" style="padding: 6px 16px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            ⬅️ Volver al Panel Docente
          </button>
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
      document.getElementById('exit-simulation-btn')?.addEventListener('click', () => {
        this.isTeacherSimulating = false;
        this.user = this.simulatedTeacherSession || { username: 'profesor', role: 'teacher', isTeacher: true };
        this.currentView = 'TEACHER_DASHBOARD';
        this.render();
      });
    }
  }

  // ==========================================
  // 1. PANTALLA DE LOGIN
  // ==========================================
  // 1. PANTALLA DE LOGIN (CYBER-TECH SATRIX STYLE)
  // ==========================================
  renderLoginView() {
    return `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative;">
        <!-- Selector flotante de tema y sonido -->
        <div style="position: absolute; top: 20px; right: 24px; display: flex; align-items: center; gap: 8px;">
          ${this.renderThemeToggleBtn()}
          ${this.renderSoundToggleBtn()}
        </div>

        <div class="glass-panel animate-pop" style="max-width: 480px; width: 100%; padding: 42px 36px; text-align: center; border: 1px solid var(--border-subtle); box-shadow: var(--card-shadow);">
          
          <!-- Logo y Título -->
          <div style="margin-bottom: 12px; display: inline-block;">
            ${this.currentTheme === 'andina' ? ICONS.ripple(48, 'var(--neon-green)') : ICONS.pixelLogo(48, 'var(--neon-green)')}
          </div>
          <h1 style="color: var(--text-white); font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px;">
            EXPEDICIÓN MATEMÁTICA
          </h1>
          <div style="font-family: var(--font-title); font-size: 13.5px; font-weight: 800; color: var(--neon-green); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 2px;">
            COLEGIO LA SALLE SCHOOL
          </div>
          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); font-weight: 700; margin-bottom: 24px; letter-spacing: 1px;">
            2026
          </div>

          <form id="login-form" style="text-align: left; display: flex; flex-direction: column; gap: 18px;">
            <div>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 8px;">
                ${ICONS.user(15, 'var(--neon-green)')} Usuario:
              </label>
              <input 
                type="text" 
                id="login-username" 
                placeholder="ej: mateo.castillo o tu usuario"
                required
                autocomplete="username"
                style="width: 100%;"
              />
            </div>

            <div>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 8px;">
                ${ICONS.lock(15, 'var(--neon-green)')} Clave de Acceso:
              </label>
              <input 
                type="password" 
                id="login-password" 
                placeholder="••••••••"
                required
                autocomplete="current-password"
                style="width: 100%; font-family: var(--font-mono); letter-spacing: 3px; font-size: 16px;"
              />
            </div>

            <div id="login-error" style="display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; padding: 10px; border-radius: 8px; font-size: 13px; text-align: center; font-family: var(--font-mono);"></div>

            <button 
              type="submit" 
              class="btn-neon"
              style="width: 100%; padding: 15px; font-size: 15px; margin-top: 6px;"
            >
              INGRESAR A LA PLATAFORMA ${ICONS.arrowRight(18, 'var(--text-black)')}
            </button>
          </form>

        </div>
      </div>
    `;
  }

  attachLoginEvents() {
    this.attachThemeToggleEvent();
    const form = document.getElementById('login-form');
    const errorEl = document.getElementById('login-error');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = document.getElementById('login-username').value;
      const p = document.getElementById('login-password').value;

      const res = await storage.login(u, p);
      if (res.success) {
        this.user = res.user;
        this.currentView = res.role === 'teacher' ? 'TEACHER_DASHBOARD' : 'STUDENT_HOME';
        this.render();
      } else {
        errorEl.textContent = res.message;
        errorEl.style.display = 'block';
      }
    });
  }

  // ==========================================
  // 2. INICIO DEL ESTUDIANTE (MISIÓN SEMANAL Y ESTACIONES)
  // ==========================================
  renderStudentHomeView() {
    const student = this.user;
    const isSigma = student.classroom === 'sigma';
    const classBadgeClass = isSigma ? 'badge-tech' : 'badge-tech badge-delta';
    const classroomMeta = CLASSROOMS[student.classroom] || { name: '4.° Grado', motto: 'Exploradores' };
    const mission = WEEKLY_MISSION;
    const completedChallenges = student.completedChallenges || [];

    // Progreso hacia la meta de oro
    const totalStars = student.stars || 0;
    const goldThreshold = 26;
    const progressPercent = Math.min(100, Math.round((totalStars / goldThreshold) * 100));

    return `
      <!-- Cabecera Superior Adaptativa -->
      <header style="background: var(--bg-header); border-bottom: 1px solid var(--border-subtle); padding: 14px 24px; position: sticky; top: 0; z-index: 10;">
        <div style="max-width: 1050px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          
          <div style="display: flex; align-items: center; gap: 14px;">
            ${renderCyberAvatar(student.avatar, 42)}
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 17px; font-weight: 800; color: var(--text-white); font-family: var(--font-title);">¡Hola, ${escapeHtml(student.firstName || student.displayName || student.name)}!</span>
                <span class="${classBadgeClass}">
                  ${classroomMeta.name}
                </span>
              </div>
              <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px; display: flex; align-items: center; gap: 6px;">
                ${ICONS.clock(12, 'var(--neon-green)')} <span>${student.timeMinutes || 0} MIN PRACTICADOS</span>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <button id="open-student-guide-btn" class="btn-dark" style="padding: 7px 12px; font-size: 12px; border-color: var(--neon-green); color: var(--neon-green); display: inline-flex; align-items: center; gap: 6px; cursor: pointer;" title="Ver cómo explorar y alcanzar tu meta semanal">
              ${this.currentTheme === 'andina' ? ICONS.compass(16, 'var(--neon-green)') : ICONS.pixelLogo(16, 'var(--neon-green)')} ¿Cómo Explorar?
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
            ${this.renderSettingsMenu()}
          </div>

        </div>
      </header>

      <main style="max-width: 1050px; margin: 28px auto; padding: 0 20px; flex: 1;">
        
        <!-- Banner de Misión Semanal Adaptativa -->
        <div class="glass-panel" style="padding: 26px 28px; margin-bottom: 26px; border-left: 5px solid var(--neon-green); background: var(--bg-surface);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <span class="badge-tech" style="margin-bottom: 6px;">
                ⚡ 3.° BIMESTRE
              </span>
              <h2 style="font-size: 24px; color: var(--text-white); margin: 6px 0 6px 0;">
                Semana 1: Patrones Multiplicativos
              </h2>
              <p style="font-size: 13px; color: var(--text-muted);">
                Supera las estaciones de cálculo para ganar el <strong>Trofeo de Oro</strong> de la semana.
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
            ${this.currentTheme === 'andina' ? ICONS.ripple(20, 'var(--neon-green)') : ICONS.pixelLogo(18, 'var(--neon-green)')} Estaciones de Práctica Activa:
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
                        ${this.getEmblemSvg(st.trophy, 16)} ${st.name.split(':')[0]} • RECOMPENSA: ${this.getEmblemName(st.trophy).toUpperCase()}
                      </span>
                      ${isCompleted ? '<span class="badge-tech" style="font-size: 9px; padding: 1px 6px;">CONQUISTADO</span>' : ''}
                      ${st.isOptionalMastery ? `<span class="badge-tech badge-delta" style="font-size: 9px; padding: 1px 6px;">${this.getEmblemTierLabel('diamante').toUpperCase()}</span>` : ''}
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
                      ${ICONS.lock(14, 'var(--text-dim)')} ENCRIPTADO
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
            ${this.getEmblemSvg(student.trophies?.patrones || 'oro', 20)} Pasaporte de Emblemas Semanal:
          </h4>
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap;">
            <div style="width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15)); flex-shrink: 0;">
              ${this.getEmblemSvg(student.trophies?.patrones || 'ninguno', 52)}
            </div>
            <div>
              <div style="font-size: 16px; font-weight: 800; color: var(--text-white); font-family: var(--font-title);">Semana 1: Patrones Multiplicativos</div>
              <div class="trophy-badge trophy-${student.trophies?.patrones || 'ninguno'}" style="margin-top: 6px; display: inline-flex; align-items: center; gap: 6px;">
                ${this.getEmblemSvg(student.trophies?.patrones || 'ninguno', 16)}
                <span>Rango actual: ${this.getEmblemName(student.trophies?.patrones || 'ninguno')}</span>
              </div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px; font-family: var(--font-sans);">
                ${(student.stars || 0) >= 29 
                  ? `¡Felicitaciones! Has conquistado la ${this.getEmblemName('diamante')}` 
                  : (student.stars || 0) >= 26 
                  ? `Logro supremo: ${this.getEmblemName('oro')} (Meta Oficial 100%)` 
                  : (student.stars || 0) >= 18 
                  ? `Has obtenido el ${this.getEmblemName('plata')}` 
                  : (student.stars || 0) >= 8 
                  ? `Has obtenido la ${this.getEmblemName('bronce')}` 
                  : `Supera la Estación 1 para obtener tu primer emblema (${this.getEmblemShort('bronce')})`}
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
                  ${this.currentTheme === 'andina' ? ICONS.compass(22, 'var(--neon-green)') : ICONS.pixelLogo(20, 'var(--neon-green)')} Guía de la Misión Semanal
                </h3>
              </div>
              <button id="close-student-guide-btn" class="btn-dark" style="padding: 6px 12px; font-size: 14px; cursor: pointer;">✕</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px; font-family: var(--font-sans);">
              
              <!-- Paso 1: Meta Semanal de Oro -->
              <div style="display: flex; gap: 14px; align-items: flex-start; background: var(--bg-surface-elevated); padding: 14px; border-radius: 10px; border-left: 4px solid var(--color-gold);">
                <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${this.getEmblemSvg('oro', 36)}
                </div>
                <div>
                  <h5 style="margin: 0; color: var(--color-gold); font-size: 14px; font-weight: 800; font-family: var(--font-title);">
                    1. Tu Meta Oficial de la Semana: ${this.getEmblemName('oro')}
                  </h5>
                  <p style="margin: 4px 0 0 0; font-size: 12.5px; color: var(--text-muted); line-height: 1.4;">
                    Avanza por las 3 estaciones de práctica: <strong>${this.getEmblemName('bronce')} (Estación 1)</strong>, <strong>${this.getEmblemName('plata')} (Estación 2)</strong> y conquista el <strong>${this.getEmblemName('oro')} (Estación 3)</strong>. Al conseguir el Oro, habrás cumplido tu meta semanal.
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
                  ${this.getEmblemSvg('diamante', 36)}
                </div>
                <div>
                  <h5 style="margin: 0; color: #93c5fd; font-size: 14px; font-weight: 800; font-family: var(--font-title);">
                    4. Desafío Maestro: ${this.getEmblemName('diamante')}
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

  attachStudentHomeEvents() {
    this.attachThemeToggleEvent();

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
      if (this.isTeacherSimulating) {
        this.isTeacherSimulating = false;
        this.user = this.simulatedTeacherSession || { username: 'profesor', role: 'teacher', isTeacher: true };
        this.currentView = 'TEACHER_DASHBOARD';
        this.render();
        return;
      }
      storage.logout();
      this.user = null;
      this.currentView = 'LOGIN';
      this.render();
    });

    document.getElementById('view-classroom-wall-btn')?.addEventListener('click', () => {
      this.currentView = 'CLASSROOM_WALL';
      this.render();
    });

    document.querySelectorAll('.start-station-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stationId = e.currentTarget.getAttribute('data-station-id');
        this.selectedStation = WEEKLY_MISSION.stations.find(s => s.id === stationId);
        if (this.selectedStation) {
          this.currentTaskIndex = 0;
          this.currentAttemptCount = 0;
          this.taskStartTime = Date.now();
          this.sessionSeconds = 0;
          this.currentView = 'PRACTICE_STATION';
          this.render();
        }
      });
    });
  }

  // ==========================================
  // 3. MURO DE COMPAÑEROS DE SALÓN
  // ==========================================
  renderClassroomWallView() {
    const student = this.user;
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
            ${this.renderSettingsMenu()}
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
                    ${this.getEmblemSvg(pTro, 16)} <span>${this.getEmblemShort(pTro)}</span>
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

  attachClassroomWallEvents() {
    this.attachThemeToggleEvent();
    document.getElementById('back-from-wall-btn')?.addEventListener('click', () => {
      this.currentView = 'STUDENT_HOME';
      this.render();
    });
  }

  // ==========================================
  // 4. MOTOR DE PRÁCTICA EDUTEN / VILLE
  // ==========================================
  renderPracticeStationView() {
    const station = this.selectedStation;
    const task = station.tasks[this.currentTaskIndex];
    const totalTasks = station.tasks.length;
    const currentNum = this.currentTaskIndex + 1;

    return `
      <!-- Barra Superior de Sesión Adaptativa -->
      <header class="eduten-session-bar">
        <div style="display: flex; align-items: center; gap: 14px;">
          <button id="exit-practice-btn" class="btn-dark" style="padding: 6px 14px; font-size: 12px;">
            ✕ Salir
          </button>
          <div style="font-weight: 800; color: var(--text-white); font-size: 15px; font-family: var(--font-title); display: flex; align-items: center; gap: 8px;">
            ${this.getEmblemSvg(station.trophy, 22)}
            <span>${station.name}</span>
          </div>
        </div>

        <!-- Indicador de Micro-Ejercicios (Dots) -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="eduten-dots-track">
            ${station.tasks.map((_, i) => {
              const statusClass = i < this.currentTaskIndex ? 'completed' : i === this.currentTaskIndex ? 'active' : '';
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
            ⭐ <span id="student-stars-badge">${this.user.stars || 0}</span>
          </div>
          ${this.renderSettingsMenu()}
        </div>
      </header>

      <main style="max-width: 820px; margin: 30px auto; padding: 0 20px; flex: 1;">
        <div class="glass-panel" style="padding: 34px 30px; border-top: 4px solid var(--neon-green);">
          
          <div style="text-align: center; margin-bottom: 24px;">
            <span class="badge-tech" style="letter-spacing: 0.8px; font-size: 11px;">
              ⚡ ${station.instructions}
            </span>
          </div>

          <!-- Área de Trabajo Matemática Limpia (Según Estación) -->
          <div id="exercise-workspace">
            ${this.renderTaskWorkspace(station, task)}
          </div>

          <!-- Contenedor de Retroalimentación y Pistas No Punitivas -->
          <div id="task-feedback-container" style="display: none;"></div>

        </div>
      </main>

      <!-- Modal de Celebración de Trofeo (Al completar la estación) -->
      <div id="station-victory-modal" class="victory-overlay" style="display: none;"></div>
    `;
  }

  renderTaskWorkspace(station, task) {
    // 1. ESTACIÓN 1: DETECTOR DE LA REGLA
    if (station.type === 'rule-detector') {
      return `
        <div>
          <!-- Números de la Secuencia en Cajas Adaptativas -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; margin: 20px 0 30px 0;">
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
              Regla del salto: Multiplicar por ${task.rule.replace('×', '').trim()} (${task.rule})
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

  attachPracticeStationEvents() {
    this.attachThemeToggleEvent();
    const station = this.selectedStation;
    const task = station.tasks[this.currentTaskIndex];

    document.getElementById('exit-practice-btn')?.addEventListener('click', () => {
      if (this.currentTaskIndex > 0) {
        this.showExitConfirmationModal();
      } else {
        this.currentView = 'STUDENT_HOME';
        this.render();
      }
    });

    // 1. ESTACIÓN 1: Clic en opciones de regla
    if (station.type === 'rule-detector') {
      document.querySelectorAll('.rule-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const chosen = e.currentTarget.getAttribute('data-option');
          this.evaluateRuleDetectorAnswer(chosen, task, e.currentTarget);
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
        this.evaluateNumericAnswer(val, task.correctAnswer, task.scaffold);
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
        this.evaluateNumericAnswer(val, task.correctAnswer, task.scaffold);
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
        this.evaluateNumericAnswer(val, task.correctAnswer, task.scaffold);
      };

      submitBtn?.addEventListener('click', handleApplied);
      inputEl?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleApplied();
      });
    }
  }

  evaluateRuleDetectorAnswer(chosen, task, clickedBtn) {
    this.currentAttemptCount++;
    const isCorrect = (chosen.trim() === task.correctOption.trim());
    const feedbackBox = document.getElementById('task-feedback-container');

    const durationSec = Math.max(2, Math.round((Date.now() - this.taskStartTime) / 1000));

    if (isCorrect) {
      this.playFeedbackTone('correct');
      clickedBtn.classList.add('selected-correct');
      if (feedbackBox) {
        feedbackBox.className = 'scaffold-feedback-box correct';
        feedbackBox.innerHTML = `
          <div style="font-size: 24px;">🎉</div>
          <div>
            <div style="font-weight: 800; font-size: 15px;">¡Excelente! Regla Correcta</div>
            <div style="font-size: 13px; margin-top: 2px;">${task.reason}</div>
          </div>
        `;
        feedbackBox.style.display = 'flex';
      }

      // Guardar intento en Storage
      const isStationComplete = (this.currentTaskIndex === this.selectedStation.tasks.length - 1);
      storage.recordTaskAttempt(this.user.id, {
        stationId: this.selectedStation.id,
        taskId: task.id,
        taskIndex: this.currentTaskIndex,
        isCorrect: true,
        attemptNumber: this.currentAttemptCount,
        timeSpentSec: durationSec,
        isStationComplete
      });

      // Actualizar estrellas visibles
      const starsBadge = document.getElementById('student-stars-badge');
      if (starsBadge) starsBadge.textContent = this.user.stars || 0;

      // Avanzar automáticamente tras 1.2 segundos (fluidez Eduten)
      setTimeout(() => {
        this.advanceToNextTask();
      }, 1200);

    } else {
      this.playFeedbackTone('error');
      clickedBtn.classList.add('selected-wrong');
      const hint = task.commonMistakeHint?.[chosen] || 'Prueba multiplicando en lugar de sumar para ver si funciona con todos los términos.';
      
      if (feedbackBox) {
        feedbackBox.className = 'scaffold-feedback-box try-again';
        feedbackBox.innerHTML = `
          <div style="font-size: 24px;">💡</div>
          <div>
            <div style="font-weight: 800; font-size: 15px;">Pista de Razonamiento Finlandés:</div>
            <div style="font-size: 13px; margin-top: 2px;">${hint}</div>
          </div>
        `;
        feedbackBox.style.display = 'flex';
      }

      storage.recordTaskAttempt(this.user.id, {
        stationId: this.selectedStation.id,
        taskId: task.id,
        taskIndex: this.currentTaskIndex,
        isCorrect: false,
        chosenAnswer: chosen,
        correctAnswer: task.correctOption,
        attemptNumber: this.currentAttemptCount,
        timeSpentSec: durationSec
      });
    }
  }

  evaluateNumericAnswer(enteredValue, correctAnswer, scaffoldHint) {
    this.currentAttemptCount++;
    const isCorrect = (enteredValue === correctAnswer);
    const feedbackBox = document.getElementById('task-feedback-container');
    const durationSec = Math.max(2, Math.round((Date.now() - this.taskStartTime) / 1000));

    if (isCorrect) {
      this.playFeedbackTone('correct');
      if (feedbackBox) {
        feedbackBox.className = 'scaffold-feedback-box correct';
        feedbackBox.innerHTML = `
          <div style="font-size: 24px;">🎉</div>
          <div>
            <div style="font-weight: 800; font-size: 15px;">¡Correcto! +1 Estrella ⭐</div>
            <div style="font-size: 13px; margin-top: 2px;">${scaffoldHint}</div>
          </div>
        `;
        feedbackBox.style.display = 'flex';
      }

      const isStationComplete = (this.currentTaskIndex === this.selectedStation.tasks.length - 1);
      storage.recordTaskAttempt(this.user.id, {
        stationId: this.selectedStation.id,
        taskId: this.selectedStation.tasks[this.currentTaskIndex].id,
        taskIndex: this.currentTaskIndex,
        isCorrect: true,
        attemptNumber: this.currentAttemptCount,
        timeSpentSec: durationSec,
        isStationComplete
      });

      const starsBadge = document.getElementById('student-stars-badge');
      if (starsBadge) starsBadge.textContent = this.user.stars || 0;

      setTimeout(() => {
        this.advanceToNextTask();
      }, 1200);

    } else {
      this.playFeedbackTone('error');
      if (feedbackBox) {
        feedbackBox.className = 'scaffold-feedback-box try-again';
        feedbackBox.innerHTML = `
          <div style="font-size: 24px;">💡</div>
          <div>
            <div style="font-weight: 800; font-size: 15px;">Pista de Apoyo (Descomposición):</div>
            <div style="font-size: 13px; margin-top: 2px;">${scaffoldHint}</div>
            <div style="font-size: 12px; margin-top: 4px; font-weight: 600;">Corrige tu número e inténtalo de nuevo.</div>
          </div>
        `;
        feedbackBox.style.display = 'flex';
      }

      storage.recordTaskAttempt(this.user.id, {
        stationId: this.selectedStation.id,
        taskId: this.selectedStation.tasks[this.currentTaskIndex].id,
        taskIndex: this.currentTaskIndex,
        isCorrect: false,
        chosenAnswer: enteredValue,
        correctAnswer,
        attemptNumber: this.currentAttemptCount,
        timeSpentSec: durationSec
      });
    }
  }

  advanceToNextTask() {
    const station = this.selectedStation;
    if (this.currentTaskIndex < station.tasks.length - 1) {
      this.currentTaskIndex++;
      this.currentAttemptCount = 0;
      this.taskStartTime = Date.now();
      this.render();
    } else {
      // Estación superada por completo ➔ Mostrar Modal de Trofeo
      this.showStationVictoryModal();
    }
  }

  showStationVictoryModal() {
    this.playFeedbackTone('celebration');
    const station = this.selectedStation;
    const modalEl = document.getElementById('station-victory-modal');
    if (!modalEl) return;

    modalEl.style.display = 'flex';
    modalEl.innerHTML = `
      <div class="victory-card">
        <div style="margin-bottom: 16px; filter: drop-shadow(0 0 16px var(--border-glow)); display: flex; justify-content: center;">
          ${this.getEmblemSvg(station.trophy, 72)}
        </div>
        <h2 style="font-size: 24px; color: var(--text-white); margin-bottom: 6px; font-family: var(--font-title);">
          ¡ESTACIÓN CONQUISTADA!
        </h2>
        <div style="font-size: 15px; font-weight: 800; color: var(--color-success); margin-bottom: 12px; font-family: var(--font-mono); text-transform: uppercase;">
          Has desbloqueado: ${this.getEmblemName(station.trophy)}
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
      // Encontrar la siguiente estación
      const currentIdx = WEEKLY_MISSION.stations.findIndex(s => s.id === station.id);
      if (currentIdx !== -1 && currentIdx < WEEKLY_MISSION.stations.length - 1) {
        this.selectedStation = WEEKLY_MISSION.stations[currentIdx + 1];
        this.currentTaskIndex = 0;
        this.currentAttemptCount = 0;
        this.taskStartTime = Date.now();
        this.render();
      } else {
        this.currentView = 'STUDENT_HOME';
        this.render();
      }
    });

    document.getElementById('victory-home-btn')?.addEventListener('click', () => {
      this.currentView = 'STUDENT_HOME';
      this.render();
    });
  }

  showExitConfirmationModal() {
    const existing = document.getElementById('pause-mission-modal');
    if (existing) existing.remove();

    const station = this.selectedStation;
    const completedSoFar = this.currentTaskIndex;
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
      this.currentView = 'STUDENT_HOME';
      this.render();
    });
  }

  startSessionTimer() {
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

  // ==========================================
  // 5. PANEL DOCENTE (65 ESTUDIANTES)
  // ==========================================
  renderTeacherDashboard() {
    let filter = (this.selectedClassroomFilter === 'delta') ? 'delta' : 'sigma';
    this.selectedClassroomFilter = filter;
    const students = storage.getAllStudents(filter);
    const statsSigma = storage.getClassroomStats('sigma');
    const statsDelta = storage.getClassroomStats('delta');
    const currentStats = filter === 'sigma' ? statsSigma : statsDelta;
    const activeTopicId = storage.getActiveTopic();
    const currentTopicObj = AVAILABLE_TOPICS.find(t => t.id === activeTopicId) || AVAILABLE_TOPICS[0];

    // Conteo de trofeos
    const trophyCounts = { bronce: 0, plata: 0, oro: 0, diamante: 0, ninguno: 0 };
    students.forEach(s => {
      const tr = s.trophies?.patrones || 'ninguno';
      trophyCounts[tr] = (trophyCounts[tr] || 0) + 1;
    });

    return `
      <!-- Cabecera Superior del Profesor Adaptativa -->
      <header style="background: var(--bg-header); border-bottom: 1px solid var(--border-subtle); padding: 14px 24px; position: sticky; top: 0; z-index: 10;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: var(--bg-surface-elevated); border: 1.5px solid var(--neon-green); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px var(--neon-green-glow);">
              ${ICONS.pixelLogo(24, 'var(--neon-green)')}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h2 style="font-size: 18px; color: var(--text-white); margin: 0; font-family: var(--font-title); font-weight: 800;">Panel de Monitoreo Docente</h2>
                <span class="badge-tech" style="font-size: 9px; padding: 2px 7px;">
                  <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--neon-green); box-shadow:0 0 6px var(--neon-green);"></span> SUPABASE CONECTADO
                </span>
              </div>
              <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px;">
                3.° Bimestre • ${currentTopicObj.title} • ${filter === 'sigma' ? '4.° Sigma' : '4.° Delta'} (${students.length} Alumnos)
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button id="print-cards-btn" class="btn-neon" style="padding: 9px 16px; font-size: 13px;">
              ${ICONS.printer(16, 'var(--text-black)')} Tarjetas de Acceso
            </button>
            ${this.renderSettingsMenu()}
          </div>

        </div>
      </header>

      <main style="max-width: 1200px; margin: 26px auto; padding: 0 20px; flex: 1;">
        
        <!-- Barra de Jerarquía Escolar Escalable (Colegio La Salle School) -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; padding: 10px 16px; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 10px;">
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span style="font-size: 13px; font-weight: 800; color: var(--text-white); font-family: var(--font-title); display: flex; align-items: center; gap: 6px;">
              🏛️ COLEGIO LA SALLE SCHOOL
            </span>
            <span class="badge-tech" style="font-size: 10px; border-color: var(--neon-green); color: var(--neon-green);">
              GRADO: 4.° PRIMARIA
            </span>
            <span class="badge-tech" style="font-size: 10px;">
              PERÍODO: 3.° BIMESTRE 2026
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">
            <span>🏫 Modelo Escalable:</span> <span style="color: var(--color-gold); font-weight: 700;">Listo para 1.° a 6.°</span>
          </div>
        </div>

        <!-- Pestañas de Salón y Simulador de Alumnos Virtuales -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 22px;">
          <!-- Filtro de Aula Adaptativo (Mismo Grado: 4.° - Solo Salones Independientes) -->
          <div style="display: flex; gap: 8px; background: var(--bg-surface-elevated); padding: 6px; border-radius: 10px; border: 1.5px solid var(--border-subtle); width: fit-content; flex-wrap: wrap;">
            <button class="classroom-filter-btn" data-class="sigma" style="padding: 8px 18px; border-radius: 6px; border: none; font-weight: 800; font-size: 12px; cursor: pointer; font-family: var(--font-mono); text-transform: uppercase; background: ${filter === 'sigma' ? 'var(--color-sigma)' : 'transparent'}; color: ${filter === 'sigma' ? (this.currentTheme === 'andina' ? '#ffffff' : '#000000') : 'var(--text-muted)'};">
              4.° Sigma [${statsSigma.count}]
            </button>
            <button class="classroom-filter-btn" data-class="delta" style="padding: 8px 18px; border-radius: 6px; border: none; font-weight: 800; font-size: 12px; cursor: pointer; font-family: var(--font-mono); text-transform: uppercase; background: ${filter === 'delta' ? 'var(--color-delta)' : 'transparent'}; color: ${filter === 'delta' ? '#ffffff' : 'var(--text-muted)'};">
              4.° Delta [${statsDelta.count}]
            </button>
          </div>

          <!-- Accesos de Prueba Alumno Virtual (Simulador para el Docente del Salón Seleccionado) -->
          <div style="display: flex; align-items: center; gap: 8px; background: var(--bg-surface-elevated); padding: 6px 12px; border-radius: 10px; border: 1.5px dashed var(--border-subtle); flex-wrap: wrap;">
            <span style="font-size: 11px; font-weight: 800; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; display: flex; align-items: center; gap: 5px;">
              <span>🧪</span> Modo Prueba Alumno:
            </span>
            ${filter === 'sigma' ? `
              <button id="simulate-student-sigma-btn" class="btn-dark" style="padding: 7px 14px; font-size: 12px; border-color: var(--color-sigma); color: var(--color-sigma); display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 700;" title="Ingresar a la plataforma como Alumno de prueba en 4.° Sigma">
                <span>🎒</span> Alumno Virtual Sigma
              </button>
            ` : `
              <button id="simulate-student-delta-btn" class="btn-dark" style="padding: 7px 14px; font-size: 12px; border-color: var(--color-delta); color: var(--color-delta); display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 700;" title="Ingresar a la plataforma como Alumna de prueba en 4.° Delta">
                <span>🎒</span> Alumna Virtual Delta
              </button>
            `}
          </div>
        </div>

        <!-- Tarjetas de Métricas Globales Adaptativas -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 22px;">
          <div class="glass-panel" style="padding: 20px; border-left: 4px solid var(--neon-green); background: var(--bg-surface);">
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); font-weight: 700; text-transform: uppercase;">Alumnos en este Grupo</div>
            <div style="font-size: 28px; font-weight: 900; color: var(--text-white); margin-top: 4px; font-family: var(--font-mono);">${currentStats.count} <span style="font-size: 14px; color: var(--text-dim);">ALUMNOS</span></div>
            <div style="font-size: 11px; color: var(--neon-green); margin-top: 4px; font-family: var(--font-mono);">${filter === 'todos' ? 'Sigma + Delta' : CLASSROOMS[filter]?.name}</div>
          </div>
          <div class="glass-panel" style="padding: 20px; border-left: 4px solid var(--color-delta); background: var(--bg-surface);">
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); font-weight: 700; text-transform: uppercase;">Tiempo Total de Práctica</div>
            <div style="font-size: 28px; font-weight: 900; color: var(--color-delta); margin-top: 4px; font-family: var(--font-mono);">${currentStats.totalMin} <span style="font-size: 14px; color: var(--text-dim);">MIN</span></div>
            <div style="font-size: 11px; color: var(--color-delta); margin-top: 4px; font-family: var(--font-mono);">Meta: 15-20 min / alumno</div>
          </div>
          <div class="glass-panel" style="padding: 20px; border-left: 4px solid var(--color-gold); background: var(--bg-surface);">
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); font-weight: 700; text-transform: uppercase;">Meta de Oro Alcanzada</div>
            <div style="font-size: 28px; font-weight: 900; color: var(--color-gold); margin-top: 4px; font-family: var(--font-mono);">${trophyCounts.oro + trophyCounts.diamante} <span style="font-size: 14px; color: var(--text-dim);">NIÑOS</span></div>
            <div style="font-size: 11px; color: var(--color-gold); margin-top: 4px; font-family: var(--font-mono); display: flex; align-items: center; gap: 4px;">${this.getEmblemSvg('oro', 14)} Cumplieron la semana</div>
          </div>
          <div class="glass-panel" style="padding: 20px; border-left: 4px solid var(--color-sigma); background: var(--bg-surface);">
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); font-weight: 700; text-transform: uppercase;">Estrellas Acumuladas</div>
            <div style="font-size: 28px; font-weight: 900; color: var(--color-sigma); margin-top: 4px; font-family: var(--font-mono);">${currentStats.totalStars} <span style="font-size: 16px;">⭐</span></div>
            <div style="font-size: 11px; color: var(--color-sigma); margin-top: 4px; font-family: var(--font-mono);">Promedio: ${currentStats.avgStars} / alumno</div>
          </div>
        </div>

        <!-- Alerta Pedagógica Eduten Adaptativa -->
        <div class="glass-panel" style="padding: 18px 22px; margin-bottom: 22px; background: rgba(183, 143, 92, 0.08); border-left: 4px solid var(--color-gold);">
          <div style="font-weight: 800; font-size: 13px; color: var(--color-gold); margin-bottom: 4px; font-family: var(--font-mono); display: flex; align-items: center; gap: 8px;">
            <span>⚡</span> DIAGNÓSTICO PEDAGÓGICO EDUTEN (UNIVERSIDAD DE TURKU):
          </div>
          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 0;">
            El sistema detecta automáticamente qué alumnos confunden patrones aditivos (+n) con multiplicativos (×n) en la <strong>Estación 1</strong>. En la tabla inferior puedes identificar a los estudiantes que requieren apoyo guiado antes de pasar a la resolución en pizarra.
          </p>
        </div>

        <!-- Gestor de Misión Activa para el Aula -->
        <div class="glass-panel" style="padding: 20px 24px; margin-bottom: 22px; border-left: 4px solid var(--neon-green); background: var(--bg-surface);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <span class="badge-tech" style="font-size: 10px;">
                ⚙️ CONTROL PEDAGÓGICO DE CICLO
              </span>
              <h3 style="font-size: 17px; color: var(--text-white); margin-top: 6px; font-family: var(--font-title);">
                Misión Semanal Activa para los Alumnos
              </h3>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
                Define el contenido de entrenamiento para 4.° Sigma y 4.° Delta en sus casas o laboratorio.
              </p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <select id="select-active-topic" style="padding: 10px 14px; font-size: 13px; font-weight: 700; cursor: pointer; min-width: 250px;">
                ${AVAILABLE_TOPICS.map(t => `
                  <option value="${t.id}" ${t.id === (this.selectedWorksheetTopicId || activeTopicId) ? 'selected' : ''}>
                    ${t.title} ${t.id === activeTopicId ? '★ (Activo)' : ''}
                  </option>
                `).join('')}
              </select>
              <button id="save-active-topic-btn" class="btn-neon" style="padding: 10px 18px; font-size: 13px;">
                ACTIVAR TEMA ${ICONS.check(14, 'var(--text-black)')}
              </button>
            </div>
          </div>
          <div id="topic-change-feedback" style="display: none; margin-top: 12px; background: rgba(104, 111, 73, 0.12); border: 1px solid var(--color-success); color: var(--color-success); padding: 8px 14px; border-radius: 8px; font-size: 12px; font-family: var(--font-mono); font-weight: 700;"></div>

          <!-- Ficha A4 contextual ligada a la semana (Debajo de Semana 1,...) -->
          <div id="worksheet-weekly-card" style="margin-top: 18px; padding-top: 16px; border-top: 1.5px dashed var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 14px; min-width: 260px; flex: 1;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(36, 70, 99, 0.1); border: 1.5px solid var(--color-delta); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${ICONS.fileText(24, 'var(--color-delta)')}
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 10.5px; font-weight: 800; color: var(--color-delta); font-family: var(--font-mono); text-transform: uppercase;">
                    FICHA DE TRABAJO A4 IMPRIMIBLE
                  </span>
                  <span id="worksheet-topic-badge" class="badge-tech" style="font-size: 9px; padding: 1px 7px;">
                    ${(AVAILABLE_TOPICS.find(t => t.id === (this.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).title.split(':')[0]}
                  </span>
                </div>
                <div id="worksheet-topic-title" style="font-size: 15px; font-weight: 800; color: var(--text-white); margin-top: 2px; font-family: var(--font-title);">
                  ${(AVAILABLE_TOPICS.find(t => t.id === (this.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).worksheetTitle}
                </div>
                <div id="worksheet-topic-desc" style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                  ${(AVAILABLE_TOPICS.find(t => t.id === (this.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).description}
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <button id="open-worksheet-modal-btn" class="btn-neon" style="padding: 10px 18px; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                ${ICONS.printer(16, 'var(--text-black)')} Ver / Imprimir Ficha A4
              </button>
              <button id="download-topic-csv-btn" class="btn-dark" style="padding: 10px 16px; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; border-color: var(--color-delta); color: var(--text-white); cursor: pointer;" title="Descargar reporte en Excel/CSV de la semana seleccionada">
                ${ICONS.download(15, 'var(--color-delta)')} Exportar Excel (${(AVAILABLE_TOPICS.find(t => t.id === (this.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).title.split(':')[0]})
              </button>
            </div>
          </div>
        </div>

        <!-- Contenedor Dinámico de Gráficos y Analítica de la Semana -->
        <div id="weekly-analytics-container">
          ${this.renderWeeklyAnalyticsSection(this.selectedWorksheetTopicId || activeTopicId, filter)}
        </div>

        <!-- Buscador y Tabla Adaptativa -->
        <div class="glass-panel" style="padding: 20px; background: var(--bg-surface);">
          <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: space-between; margin-bottom: 18px;">
            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; flex: 1;">
              <div style="position: relative; flex: 1; max-width: 320px; min-width: 220px;">
                <input 
                  type="text" 
                  id="search-student-input" 
                  placeholder="Buscar alumno por nombre o usuario..."
                  style="padding: 10px 14px; font-size: 13px; width: 100%;"
                />
              </div>

              <!-- Selector de Modo de Calificación: Semana vs Acumulado 3.° Bimestre -->
              <div style="display: flex; gap: 6px; background: var(--bg-surface-elevated); padding: 4px 6px; border-radius: 8px; border: 1.5px solid var(--border-subtle); align-items: center;">
                <span style="font-size: 10.5px; font-weight: 800; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-right: 2px;">
                  VISTA:
                </span>
                <button id="toggle-view-semana" class="btn-dark" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 6px; border: 1.5px solid ${this.tableMetricMode === 'semana' ? 'var(--neon-green)' : 'transparent'}; background: ${this.tableMetricMode === 'semana' ? 'rgba(0,255,157,0.1)' : 'transparent'}; color: ${this.tableMetricMode === 'semana' ? 'var(--neon-green)' : 'var(--text-muted)'}; font-weight: 800; font-family: var(--font-mono);">
                  📅 Semana ${(AVAILABLE_TOPICS.find(t => t.id === (this.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).weekNumber}
                </button>
                <button id="toggle-view-bimestre" class="btn-dark" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 6px; border: 1.5px solid ${this.tableMetricMode === 'bimestre' ? 'var(--color-gold)' : 'transparent'}; background: ${this.tableMetricMode === 'bimestre' ? 'rgba(234,179,8,0.1)' : 'transparent'}; color: ${this.tableMetricMode === 'bimestre' ? 'var(--color-gold)' : 'var(--text-muted)'}; font-weight: 800; font-family: var(--font-mono);">
                  🏆 Acumulado 3.° Bimestre
                </button>
              </div>
            </div>

            <div style="display: flex; gap: 10px; align-items: center;">
              <label style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); font-weight: 700; text-transform: uppercase;">Mostrar contraseñas:</label>
              <input type="checkbox" id="toggle-pins" style="cursor: pointer; width: 16px; height: 16px; accent-color: var(--neon-green);" />
            </div>
          </div>

          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 40px;">N°</th>
                  <th>Salón</th>
                  <th>Alumno</th>
                  <th>Usuario</th>
                  <th>Clave / PIN</th>
                  <th>${this.tableMetricMode === 'semana' ? 'Tiempo (Semana)' : 'Tiempo (3.° Bimestre)'}</th>
                  <th>${this.tableMetricMode === 'semana' ? 'Estrellas (Semana)' : 'Estrellas (3.° Bimestre)'}</th>
                  <th>${this.tableMetricMode === 'semana' ? 'Trofeo Semanal' : 'Trofeo Mayor (3.° Bimestre)'}</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody id="students-table-body">
                ${this.renderStudentRows(students, false, this.tableMetricMode, this.selectedWorksheetTopicId || activeTopicId)}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <!-- Modal de Previsualización de Tarjetas de Credenciales (PIN) -->
      <div id="cards-modal" class="worksheet-modal-overlay" style="display: none;">
        <div class="worksheet-modal-content" style="max-width: 980px;">
          <div class="worksheet-modal-bar">
            <div>
              <div style="font-weight: 800; font-size: 16px; color: var(--text-white); font-family: var(--font-title); display: flex; align-items: center; gap: 8px;">
                ${ICONS.printer(18, 'var(--neon-green)')} Tarjetas de Credenciales con PIN (A4 Recortables)
              </div>
              <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px;">
                8 tarjetas por hoja • Con líneas de tijera ✂️ para recortar y pegar en el cuaderno
              </div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <button id="print-cards-now-btn" class="btn-neon" style="padding: 9px 18px; font-size: 13px;">
                ${ICONS.printer(15, 'var(--text-black)')} IMPRIMIR / PDF
              </button>
              <button id="open-cards-tab-btn" class="btn-dark" style="padding: 9px 13px; font-size: 12px;">
                Abrir Pestaña
              </button>
              <button id="close-cards-modal-btn" class="btn-dark" style="padding: 9px 13px; font-size: 12px;">
                ✕ Cerrar
              </button>
            </div>
          </div>

          <!-- Selector de Salón dentro del Modal de Tarjetas -->
          <div style="background: var(--bg-surface-elevated); padding: 12px 20px; border-bottom: 1.5px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase;">Filtrar:</span>
              <button class="cards-filter-btn" data-class="todos" style="padding: 6px 14px; border-radius: 6px; border: 1.5px solid var(--neon-green); font-weight: 800; font-size: 12px; cursor: pointer; font-family: var(--font-mono); background: var(--neon-green); color: var(--text-black);">
                TODOS 4.° (59)
              </button>
              <button class="cards-filter-btn" data-class="sigma" style="padding: 6px 14px; border-radius: 6px; border: 1.5px solid var(--border-subtle); font-weight: 800; font-size: 12px; cursor: pointer; font-family: var(--font-mono); background: var(--bg-surface); color: var(--text-muted);">
                4.° SIGMA (30)
              </button>
              <button class="cards-filter-btn" data-class="delta" style="padding: 6px 14px; border-radius: 6px; border: 1.5px solid var(--border-subtle); font-weight: 800; font-size: 12px; cursor: pointer; font-family: var(--font-mono); background: var(--bg-surface); color: var(--text-muted);">
                4.° DELTA (29)
              </button>
            </div>
            <div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">
              ⚡ <em>Sigma y Delta nunca se mezclan en la misma hoja A4.</em>
            </div>
          </div>

          <div id="cards-modal-preview" style="overflow-y: auto; padding: 20px; flex: 1; background: var(--bg-canvas);">
            ${this.renderCardsHtmlForPreview('todos')}
          </div>
        </div>
      </div>

      <!-- Modal de Previsualización de Ficha A4 -->
      <div id="worksheet-modal" class="worksheet-modal-overlay" style="display: none;">
        <div class="worksheet-modal-content">
          <div class="worksheet-modal-bar">
            <div>
              <div style="font-weight: 800; font-size: 16px; color: var(--text-white); font-family: var(--font-title); display: flex; align-items: center; gap: 8px;">
                ${ICONS.fileText(18, 'var(--neon-green)')} Ficha de Cuaderno para Fotocopiar (Formato A4)
              </div>
              <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px;">
                100% fotocopiable en escala de grises • Lista para recortar y pegar en el cuaderno
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <button id="print-worksheet-now-btn" class="btn-neon" style="padding: 10px 20px; font-size: 13px;">
                ${ICONS.printer(15, 'var(--text-black)')} IMPRIMIR / PDF (1 HOJA)
              </button>
              <button id="close-worksheet-modal-btn" class="btn-dark" style="padding: 9px 14px; font-size: 12px;">
                ✕ Cerrar
              </button>
            </div>
          </div>
          <div style="overflow-y: auto; padding: 24px; flex: 1; background: var(--bg-canvas);" id="worksheet-modal-render-target">
            ${this.renderWorksheetA4Html(this.selectedWorksheetTopicId || activeTopicId)}
          </div>
        </div>
      </div>

      <!-- Contenedor invisible en pantalla para impresión directa con window.print -->
      <div id="worksheet-print-area" style="display: none;">
        ${this.renderWorksheetA4Html(this.selectedWorksheetTopicId || activeTopicId)}
      </div>
    `;
  }

  // ==============================================================
  // 6. ANALÍTICA Y GRÁFICOS ESTADÍSTICOS SEMANALES (3.° BIMESTRE)
  // ==============================================================
  renderWeeklyAnalyticsSection(topicId, filter) {
    const activeId = topicId || this.selectedWorksheetTopicId || storage.getActiveTopic();
    const stats = storage.getWeeklyTopicStats(activeId, filter);
    const topic = AVAILABLE_TOPICS.find(t => t.id === activeId) || AVAILABLE_TOPICS[0];
    const sNames = topic.stationNames || {
      s1: 'Estación 1: Detección Conceptual',
      s2: 'Estación 2: Recta de Saltos',
      s3: 'Estación 3: Máquina de Funciones (Oro)',
      sDiam: 'Reto Diamante: Problemas Aplicados'
    };
    const difficulties = topic.difficulties || [
      { id: "confusion", label: "Confusión Conceptual Inicial", color: "#ef4444" },
      { id: "jump", label: "Falla en Procedimiento Intermedio", color: "#f59e0b" },
      { id: "calc", label: "Dificultad en Cálculo o Reversibilidad", color: "#3b82f6" },
      { id: "clean", label: "Dominio Fluido sin tropiezos", color: "var(--neon-green)" }
    ];

    return `
      <div class="glass-panel animate-pop" style="padding: 22px 24px; margin-bottom: 22px; background: var(--bg-surface); border-left: 4px solid var(--color-delta);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 18px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge-tech" style="font-size: 10px; background: rgba(36, 70, 99, 0.2); color: var(--color-delta); border-color: var(--color-delta);">
                📊 ANALÍTICA FORMATIVA SEMANAL
              </span>
              <span class="badge-tech" style="font-size: 9px;">3.° BIMESTRE 2026</span>
              <span class="badge-tech" style="font-size: 9px; border-color: var(--neon-green); color: var(--neon-green);">GRADO: 4.° PRIMARIA</span>
            </div>
            <h3 style="font-size: 17px; color: var(--text-white); margin-top: 5px; font-family: var(--font-title); font-weight: 800;">
              Diagnóstico y Métricas: ${topic.title}
            </h3>
            <p style="font-size: 12.5px; color: var(--text-muted); margin-top: 2px;">
              Supervisión de aprendizaje para <strong>${filter === 'todos' ? '4.° Sigma y Delta (59 Alumnos)' : filter === 'sigma' ? '4.° Sigma (30 Alumnos)' : '4.° Delta (29 Alumnos)'}</strong>.
            </p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <div class="badge-tech" style="padding: 6px 12px; font-size: 11.5px; border-color: var(--neon-green); color: var(--neon-green);">
              ⭐ Promedio: ${stats.avgStars} Estrellas
            </div>
            <div class="badge-tech badge-delta" style="padding: 6px 12px; font-size: 11.5px;">
              ⏱️ Promedio: ${stats.avgMin} min
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
          
          <!-- 1. Embudo de Dominio por Estaciones -->
          <div style="background: var(--bg-surface-elevated); border: 1.5px solid var(--border-subtle); border-radius: 10px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 800; color: var(--text-white); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
              <span>📈 1. Tasa de Superación por Estación</span>
              <span style="font-size: 10.5px; color: var(--text-muted); font-weight: normal;">(Meta: Oro 100%)</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px;">
                  <span style="color: var(--text-muted); font-family: var(--font-mono);">${sNames.s1}</span>
                  <span style="color: var(--neon-green); font-weight: 800; font-family: var(--font-mono);">${stats.s1.pct}% (${stats.s1.count}/${stats.count})</span>
                </div>
                <div class="eduten-bar" style="height: 7px;"><div class="eduten-bar-fill" style="width: ${stats.s1.pct}%; background: var(--neon-green);"></div></div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px;">
                  <span style="color: var(--text-muted); font-family: var(--font-mono);">${sNames.s2}</span>
                  <span style="color: var(--color-delta); font-weight: 800; font-family: var(--font-mono);">${stats.s2.pct}% (${stats.s2.count}/${stats.count})</span>
                </div>
                <div class="eduten-bar" style="height: 7px;"><div class="eduten-bar-fill" style="width: ${stats.s2.pct}%; background: var(--color-delta);"></div></div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px;">
                  <span style="color: var(--text-white); font-weight: 700; font-family: var(--font-mono);">${sNames.s3}</span>
                  <span style="color: var(--color-gold); font-weight: 900; font-family: var(--font-mono);">${stats.s3.pct}% (${stats.s3.count}/${stats.count})</span>
                </div>
                <div class="eduten-bar" style="height: 8px;"><div class="eduten-bar-fill" style="width: ${stats.s3.pct}%; background: var(--color-gold);"></div></div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px;">
                  <span style="color: var(--text-muted); font-family: var(--font-mono);">${sNames.sDiam}</span>
                  <span style="color: #60a5fa; font-weight: 800; font-family: var(--font-mono);">${stats.sDiam.pct}% (${stats.sDiam.count}/${stats.count})</span>
                </div>
                <div class="eduten-bar" style="height: 7px;"><div class="eduten-bar-fill" style="width: ${stats.sDiam.pct}%; background: #60a5fa;"></div></div>
              </div>
            </div>
          </div>

          <!-- 2. Diagnóstico de Obstáculos y Errores Específicos del Tema -->
          <div style="background: var(--bg-surface-elevated); border: 1.5px solid var(--border-subtle); border-radius: 10px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 800; color: var(--text-white); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 12px;">
              🎯 2. Dificultades Específicas de la Semana
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${difficulties.map(diff => {
                const count = stats.errors[diff.id] ?? 0;
                const bgRgba = diff.id === 'clean' 
                  ? 'rgba(16, 185, 129, 0.08)' 
                  : diff.id === 'confusion' 
                    ? 'rgba(239, 68, 68, 0.08)' 
                    : diff.id === 'jump' 
                      ? 'rgba(245, 158, 11, 0.08)' 
                      : 'rgba(59, 130, 246, 0.08)';
                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 6px; background: ${bgRgba}; border-left: 3px solid ${diff.color};">
                    <span style="font-size: 11.5px; color: var(--text-white);">${diff.label}</span>
                    <span style="font-size: 11.5px; font-weight: 800; color: ${diff.color}; font-family: var(--font-mono);">${count} Alumnos</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  }

  renderStudentRows(students, showPins, mode = this.tableMetricMode, topicId = null) {
    const activeId = topicId || this.selectedWorksheetTopicId || storage.getActiveTopic();
    const topicKeyMap = {
      'patrones-multiplicativos': 'patrones',
      'division-reparto': 'division',
      'fracciones-unidad': 'fracciones',
      'operaciones-combinadas': 'operaciones'
    };
    const trophyKey = topicKeyMap[activeId] || 'patrones';

    return students.map(s => {
      const pinDisplay = showPins ? `<span style="font-family: var(--font-mono); font-weight: 800; color: var(--neon-green); letter-spacing: 1px;">${s.pin}</span>` : '<span style="font-family: var(--font-mono); color: var(--text-dim);">••••</span>';
      const weeklyTro = s.trophies?.[trophyKey] || 'ninguno';
      const maxTro = s.trophies?.patrones || 'ninguno';
      const chosenTro = (mode === 'semana') ? weeklyTro : maxTro;
      const classLabel = s.classroom === 'sigma' ? '<span class="badge-tech" style="font-size: 10px;">4.° SIGMA</span>' : '<span class="badge-tech badge-delta" style="font-size: 10px;">4.° DELTA</span>';

      return `
        <tr>
          <td style="font-weight: 800; color: var(--text-dim); font-family: var(--font-mono); font-size: 12px;">${s.num.toString().padStart(2, '0')}</td>
          <td>${classLabel}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              ${renderCyberAvatar(s.avatar, 28)}
              <span style="font-weight: 700; color: var(--text-white); font-family: var(--font-title); font-size: 13px;">${escapeHtml(s.name)}</span>
            </div>
          </td>
          <td><span style="font-family: var(--font-mono); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 2px 7px; border-radius: 4px; font-size: 11px; color: var(--text-muted);">${escapeHtml(s.username)}</span></td>
          <td>${pinDisplay}</td>
          <td>
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-white);">${s.timeMinutes || 0}</span> 
            <span style="font-size: 10.5px; color: var(--text-dim);">${mode === 'semana' ? 'min' : 'min (3B)'}</span>
          </td>
          <td>
            <span style="color: var(--color-gold); font-weight: 800; font-family: var(--font-mono);">${s.stars || 0}</span> 
            <span style="color: var(--color-gold); font-size: 11px;">⭐</span>
            <span style="font-size: 9px; color: ${mode === 'semana' ? 'var(--neon-green)' : 'var(--color-gold)'}; font-family: var(--font-mono);">${mode === 'semana' ? 'sem' : '3B'}</span>
          </td>
          <td>
            <span class="trophy-badge trophy-${chosenTro}" style="display: inline-flex; align-items: center; gap: 5px;">
              ${this.getEmblemSvg(chosenTro, 16)} <span>${this.getEmblemShort(chosenTro)}</span>
            </span>
          </td>
          <td>
            <button 
              class="edit-pin-btn btn-dark" 
              data-id="${s.id}" 
              data-name="${escapeHtml(s.name)}" 
              data-pin="${escapeHtml(s.pin)}"
              style="padding: 4px 10px; font-size: 11px; font-family: var(--font-mono);"
              title="Cambiar clave"
            >
              ${ICONS.lock(12, 'var(--neon-green)')} PIN
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  startVirtualSimulation(classroom) {
    this.simulatedTeacherSession = this.user || { username: 'profesor', role: 'teacher', isTeacher: true };
    this.isTeacherSimulating = true;
    const isSigma = classroom === 'sigma';
    this.user = {
      id: isSigma ? 'virtual-sigma' : 'virtual-delta',
      num: 0,
      classroom: classroom,
      name: isSigma ? 'Alumno Virtual Sigma' : 'Alumna Virtual Delta',
      displayName: isSigma ? 'Alumno Sigma' : 'Alumna Delta',
      username: isSigma ? 'virtual.sigma' : 'virtual.delta',
      avatar: isSigma ? 'robot' : 'astronaut',
      stars: 12,
      xp: 240,
      timeMinutes: 8,
      completedChallenges: ['estacion-1'],
      trophies: { patrones: isSigma ? 'bronce' : 'plata' }
    };
    this.currentView = 'STUDENT_HOME';
    this.render();
  }

  attachTeacherEvents() {
    this.attachThemeToggleEvent();
    document.getElementById('teacher-logout-btn')?.addEventListener('click', () => {
      storage.logout();
      this.user = null;
      this.currentView = 'LOGIN';
      this.render();
    });

    // Simulador de alumnos virtuales para el docente
    document.getElementById('simulate-student-sigma-btn')?.addEventListener('click', () => {
      this.startVirtualSimulation('sigma');
    });

    document.getElementById('simulate-student-delta-btn')?.addEventListener('click', () => {
      this.startVirtualSimulation('delta');
    });

    document.querySelectorAll('.classroom-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedClassroomFilter = e.currentTarget.getAttribute('data-class');
        this.render();
      });
    });

    // Modo de métrica de tabla: Semana vs Acumulado 3.° Bimestre
    document.getElementById('toggle-view-semana')?.addEventListener('click', () => {
      this.tableMetricMode = 'semana';
      this.render();
    });

    document.getElementById('toggle-view-bimestre')?.addEventListener('click', () => {
      this.tableMetricMode = 'bimestre';
      this.render();
    });

    const togglePins = document.getElementById('toggle-pins');
    togglePins?.addEventListener('change', (e) => {
      const students = storage.getAllStudents(this.selectedClassroomFilter);
      const body = document.getElementById('students-table-body');
      if (body) {
        body.innerHTML = this.renderStudentRows(students, e.target.checked, this.tableMetricMode, this.selectedWorksheetTopicId || storage.getActiveTopic());
        this.attachStudentEditEvents();
      }
    });

    const searchInput = document.getElementById('search-student-input');
    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const currentList = storage.getAllStudents(this.selectedClassroomFilter);
      const filtered = currentList.filter(s => 
        s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q)
      );
      const body = document.getElementById('students-table-body');
      if (body) {
        body.innerHTML = this.renderStudentRows(filtered, togglePins?.checked, this.tableMetricMode, this.selectedWorksheetTopicId || storage.getActiveTopic());
        this.attachStudentEditEvents();
      }
    });

    const handleDownloadCsv = () => {
      const targetTopicId = this.selectedWorksheetTopicId || storage.getActiveTopic();
      const topicObj = AVAILABLE_TOPICS.find(t => t.id === targetTopicId) || AVAILABLE_TOPICS[0];
      const csv = storage.generateCSV(this.selectedClassroomFilter, targetTopicId);
      // Byte Order Mark (\uFEFF) para que Excel abra sin corromper tildes ni la letra ñ
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanWeek = topicObj.title.split(':')[0].replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `Reporte_${cleanWeek}_${this.selectedClassroomFilter.toUpperCase()}_4to_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    document.getElementById('download-header-csv-btn')?.addEventListener('click', handleDownloadCsv);
    document.getElementById('download-csv-btn')?.addEventListener('click', handleDownloadCsv);
    document.getElementById('download-topic-csv-btn')?.addEventListener('click', handleDownloadCsv);

    // Modal de Tarjetas de Credenciales (PIN)
    this._currentCardsFilter = 'todos';
    const cardsModalEl = document.getElementById('cards-modal');
    document.getElementById('print-cards-btn')?.addEventListener('click', () => {
      if (cardsModalEl) cardsModalEl.style.display = 'flex';
    });

    document.getElementById('close-cards-modal-btn')?.addEventListener('click', () => {
      if (cardsModalEl) cardsModalEl.style.display = 'none';
    });

    document.querySelectorAll('.cards-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cls = e.target.getAttribute('data-class');
        this._currentCardsFilter = cls;
        document.querySelectorAll('.cards-filter-btn').forEach(b => {
          const isSelected = b.getAttribute('data-class') === cls;
          b.style.background = isSelected ? 'var(--neon-green)' : 'var(--bg-surface)';
          b.style.color = isSelected ? 'var(--text-black)' : 'var(--text-muted)';
          b.style.borderColor = isSelected ? 'var(--neon-green)' : 'var(--border-subtle)';
        });
        const previewEl = document.getElementById('cards-modal-preview');
        if (previewEl) {
          previewEl.innerHTML = this.renderCardsHtmlForPreview(cls);
        }
      });
    });

    document.getElementById('print-cards-now-btn')?.addEventListener('click', () => {
      this.printIsolatedCards(this._currentCardsFilter || 'todos');
    });

    document.getElementById('open-cards-tab-btn')?.addEventListener('click', () => {
      const targetUrl = `tarjetas_credenciales_${this._currentCardsFilter || 'todos'}.html`;
      window.open(targetUrl, '_blank');
    });

    // Cambio interactivo de tema en el selector para la Ficha A4 y el CSV
    const selectTopicEl = document.getElementById('select-active-topic');
    selectTopicEl?.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      this.selectedWorksheetTopicId = selectedId;
      const topicObj = AVAILABLE_TOPICS.find(t => t.id === selectedId);
      if (topicObj) {
        const badgeEl = document.getElementById('worksheet-topic-badge');
        const titleEl = document.getElementById('worksheet-topic-title');
        const descEl = document.getElementById('worksheet-topic-desc');
        if (badgeEl) badgeEl.textContent = topicObj.title.split(':')[0];
        if (titleEl) titleEl.textContent = topicObj.worksheetTitle;
        if (descEl) descEl.textContent = topicObj.description;

        const topicCsvBtn = document.getElementById('download-topic-csv-btn');
        if (topicCsvBtn) {
          topicCsvBtn.innerHTML = `${ICONS.download(15, 'var(--color-delta)')} Exportar Excel (${topicObj.title.split(':')[0]})`;
        }

        // Actualizar el contenido en el modal de ficha
        const modalContent = document.getElementById('worksheet-modal-render-target');
        if (modalContent) {
          modalContent.innerHTML = this.renderWorksheetA4Html(selectedId);
        }
        const printArea = document.getElementById('worksheet-print-area');
        if (printArea) {
          printArea.innerHTML = this.renderWorksheetA4Html(selectedId);
        }

        // Actualizar gráficos estadísticos y analítica de la semana
        const analyticsContainer = document.getElementById('weekly-analytics-container');
        if (analyticsContainer) {
          analyticsContainer.innerHTML = this.renderWeeklyAnalyticsSection(selectedId, this.selectedClassroomFilter);
        }

        // Actualizar botón de vista semanal con el número de semana
        const weekBtn = document.getElementById('toggle-view-semana');
        if (weekBtn) {
          weekBtn.textContent = `📅 Semana ${topicObj.weekNumber}`;
        }

        // Actualizar filas de la tabla para reflejar la semana seleccionada
        const students = storage.getAllStudents(this.selectedClassroomFilter);
        const body = document.getElementById('students-table-body');
        const togglePins = document.getElementById('toggle-pins');
        if (body) {
          body.innerHTML = this.renderStudentRows(students, togglePins?.checked, this.tableMetricMode, selectedId);
          this.attachStudentEditEvents();
        }
      }
    });

    // Modal de Ficha de Cuaderno A4
    const modalEl = document.getElementById('worksheet-modal');
    document.getElementById('open-worksheet-modal-btn')?.addEventListener('click', () => {
      const activeOrSelected = this.selectedWorksheetTopicId || storage.getActiveTopic();
      const modalContent = document.getElementById('worksheet-modal-render-target');
      if (modalContent) {
        modalContent.innerHTML = this.renderWorksheetA4Html(activeOrSelected);
      }
      if (modalEl) modalEl.style.display = 'flex';
    });

    document.getElementById('close-worksheet-modal-btn')?.addEventListener('click', () => {
      if (modalEl) modalEl.style.display = 'none';
    });

    document.getElementById('print-worksheet-now-btn')?.addEventListener('click', () => {
      this.printIsolatedWorksheet();
    });

    // Atajo de teclado Ctrl+P cuando el modal de ficha está abierto
    if (!this._printKeyBound) {
      this._printKeyBound = true;
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
          const m = document.getElementById('worksheet-modal');
          if (m && m.style.display !== 'none') {
            e.preventDefault();
            this.printIsolatedWorksheet();
          }
        }
      });
    }

    // Guardar y activar tema
    document.getElementById('save-active-topic-btn')?.addEventListener('click', () => {
      const selectEl = document.getElementById('select-active-topic');
      const feedbackEl = document.getElementById('topic-change-feedback');
      if (selectEl && feedbackEl) {
        const chosenTopic = selectEl.value;
        this.selectedWorksheetTopicId = chosenTopic;
        storage.setActiveTopic(chosenTopic);
        const topicObj = AVAILABLE_TOPICS.find(t => t.id === chosenTopic);
        feedbackEl.innerHTML = `✔️ <strong>¡Misión Semanal Actualizada!</strong> Ahora el tema activo para todos los alumnos de 4.° Sigma y 4.° Delta es: <em>${topicObj?.title || chosenTopic}</em>.`;
        feedbackEl.style.display = 'block';
        setTimeout(() => {
          this.render();
        }, 1500);
      }
    });

    this.attachStudentEditEvents();
  }

  printIsolatedCards(filter = 'todos') {
    let iframe = document.getElementById('cards-print-frame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'cards-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }
    const htmlContent = this.renderCardsHtmlForPrint(filter);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 300);
  }

  renderCardsHtmlForPreview(filter = 'todos') {
    const allStudents = storage.getAllStudents(filter);
    return `
      <div class="cards-preview-grid">
        ${allStudents.map(s => this.renderSingleCardHtml(s)).join('')}
      </div>
    `;
  }

  renderSingleCardHtml(s) {
    const isSigma = s.classroom === 'sigma';
    const tagBg = isSigma ? '#f5f3ff' : '#f0fdf4';
    const tagColor = isSigma ? '#6d28d9' : '#15803d';
    const tagBorder = isSigma ? '#ddd6fe' : '#bbf7d0';
    const accent = isSigma ? '#7c3aed' : '#059669';

    return `
      <div class="card-box">
        <div class="card-cut-corner">${ICONS.scissors(14, '#94a3b8')}</div>
        <div class="card-header">
          <div class="card-brand">
            ${ICONS.pixelLogo(18, accent)}
            <div>
              <div class="brand-title">EXPEDICIÓN MATEMÁTICA</div>
              <div class="brand-sub">4.° de Primaria</div>
            </div>
          </div>
          <div class="card-badge" style="background:${tagBg}; color:${tagColor}; border:1px solid ${tagBorder}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 800;">
            ${isSigma ? '4.° SIGMA' : '4.° DELTA'}
          </div>
        </div>

        <div class="card-body">
          <div class="avatar-badge" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
            ${renderCyberAvatar(s.avatar, 32)}
          </div>
          <div class="student-meta">
            <div class="student-num" style="font-family: 'JetBrains Mono', monospace;">ALUMNO N° ${String(s.num).padStart(2, '0')}</div>
            <div class="student-name">${s.name || s.displayName}</div>
          </div>
        </div>

        <div class="creds-box">
          <div class="cred-row">
            <span class="cred-label">USUARIO:</span>
            <span class="cred-value" style="font-family: 'JetBrains Mono', monospace;">${s.username}</span>
          </div>
          <div class="cred-row cred-pin-row">
            <span class="cred-label">CLAVE PIN:</span>
            <span class="cred-pin" style="color:${accent}; font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 900; letter-spacing: 2px;">${s.pin}</span>
          </div>
        </div>
      </div>
    `;
  }

  renderCardsHtmlForPrint(filter = 'todos') {
    const allStudents = storage.getAllStudents();
    function chunk(arr, size) {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    }

    let pages = [];
    if (filter === 'sigma') {
      const list = allStudents.filter(s => s.classroom === 'sigma');
      pages = chunk(list, 8);
    } else if (filter === 'delta') {
      const list = allStudents.filter(s => s.classroom === 'delta');
      pages = chunk(list, 8);
    } else {
      const sigma = allStudents.filter(s => s.classroom === 'sigma');
      const delta = allStudents.filter(s => s.classroom === 'delta');
      pages = [...chunk(sigma, 8), ...chunk(delta, 8)];
    }

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Tarjetas de Credenciales • Expedición Matemática</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: white;
      color: #1e293b;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 190mm;
      height: 280mm;
      margin: 0 auto;
      background: white;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 5mm;
      page-break-after: always;
      box-sizing: border-box;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    .card-box {
      border: 1.5px dashed #94a3b8;
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      background: white;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .card-cut-corner {
      position: absolute;
      top: 3px;
      right: 4px;
      font-size: 11px;
      opacity: 0.6;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 5px;
      margin-bottom: 4px;
    }
    .card-brand {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .brand-icon {
      font-size: 16px;
    }
    .brand-title {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #0f172a;
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
      font-weight: 600;
    }
    .card-badge {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 12px;
      white-space: nowrap;
    }
    .card-body {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 4px 0;
    }
    .avatar-badge {
      font-size: 26px;
      width: 42px;
      height: 42px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .student-meta {
      flex: 1;
      min-width: 0;
    }
    .student-num {
      font-size: 9px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .student-name {
      font-size: 12.5px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .creds-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 10px;
      margin: 4px 0;
    }
    .cred-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      line-height: 1.4;
    }
    .cred-label {
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.3px;
    }
    .cred-value {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }
    .cred-pin-row {
      margin-top: 3px;
      padding-top: 3px;
      border-top: 1px dashed #cbd5e1;
    }
    .cred-pin {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 2.5px;
    }
    .card-footer {
      font-size: 8px;
      color: #64748b;
      text-align: center;
      font-weight: 500;
      margin-top: 3px;
      line-height: 1.2;
    }
  </style>
</head>
<body>
  ${pages.map(page => `
    <div class="page">
      ${page.map(s => this.renderSingleCardHtml(s)).join('')}
    </div>
  `).join('')}
</body>
</html>`;
  }

  printIsolatedWorksheet() {
    const activeOrSelected = this.selectedWorksheetTopicId || storage.getActiveTopic();
    const topic = AVAILABLE_TOPICS.find(t => t.id === activeOrSelected) || AVAILABLE_TOPICS[0];
    let iframe = document.getElementById('worksheet-print-frame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'worksheet-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }
    const htmlContent = this.renderWorksheetA4Html(activeOrSelected);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${topic.worksheetTitle}</title>
        <style>
          @page { 
            size: A4 portrait; 
            margin: 10mm 12mm 10mm 12mm; 
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { 
            background: white; 
            color: #111; 
            font-family: Arial, Helvetica, sans-serif; 
            line-height: 1.3; 
            margin: 0; 
            padding: 0;
            width: 100%;
          }
          .worksheet-a4 { 
            width: 100%; 
            max-width: 100%; 
            padding: 0; 
            margin: 0; 
            page-break-after: avoid;
            break-after: avoid;
          }
          .worksheet-header { 
            border-bottom: 2px solid #000; 
            padding-bottom: 4px; 
            margin-bottom: 8px; 
            text-align: center; 
          }
          .worksheet-title { 
            font-size: 15px; 
            font-weight: 800; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
          }
          .worksheet-section { 
            border: 1.5px solid #222; 
            border-radius: 5px; 
            padding: 8px 12px; 
            margin-bottom: 8px; 
            page-break-inside: avoid; 
            break-inside: avoid;
          }
          .ws-sec-title { 
            font-size: 11px; 
            font-weight: 800; 
            text-transform: uppercase; 
            margin-bottom: 5px; 
            border-bottom: 1px solid #777; 
            padding-bottom: 2px; 
          }
          .ws-box { 
            display: inline-block; 
            min-width: 48px; 
            height: 32px; 
            border: 1.5px solid #000; 
            border-radius: 4px; 
            text-align: center; 
            line-height: 30px; 
            font-size: 13.5px; 
            font-weight: 700; 
            margin: 0 3px; 
          }
          .ws-box-empty { 
            min-width: 60px; 
            border: 2px dashed #000; 
            background: #fafafa; 
          }
          .ws-jump-arc { 
            display: inline-flex; 
            flex-direction: column; 
            align-items: center; 
            font-size: 10px; 
            font-weight: 800; 
            vertical-align: middle; 
            margin: 0 3px; 
            line-height: 1.1;
          }
          .ws-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 5px; 
          }
          .ws-table th, .ws-table td { 
            border: 1.5px solid #000; 
            padding: 5px 8px; 
            text-align: center; 
            font-size: 12px; 
          }
          .ws-table th { 
            background: #f3f4f6; 
            font-weight: 800; 
          }
          .ws-problem-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr 1fr; 
            gap: 8px; 
            margin-top: 6px; 
          }
          .ws-problem-col { 
            border: 1.5px solid #444; 
            border-radius: 4px; 
            padding: 6px 8px; 
            min-height: 90px; 
            font-size: 11.5px; 
          }
          .ws-problem-col-title { 
            font-weight: 800; 
            font-size: 10.5px; 
            text-transform: uppercase; 
            border-bottom: 1px dashed #777; 
            padding-bottom: 2px; 
            margin-bottom: 4px; 
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 250);
  }

  renderWorksheetA4Html(topicId = null) {
    const activeId = topicId || this.selectedWorksheetTopicId || storage.getActiveTopic();
    const topic = AVAILABLE_TOPICS.find(t => t.id === activeId) || AVAILABLE_TOPICS[0];

    const studentHeader = `
      <div class="worksheet-header">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #111; padding-bottom: 4px; margin-bottom: 6px;">
          <div style="font-size: 11px; font-weight: 800; font-family: Arial, sans-serif; text-transform: uppercase;">
            COLEGIO LA SALLE SCHOOL • 4.° PRIMARIA • 3.° BIMESTRE • ${topic.title.toUpperCase()}
          </div>
          <div style="font-size: 10px; color: #333; font-family: Arial, sans-serif;">
            Sección: <strong>4.° [ &nbsp; ] Sigma &nbsp;&nbsp; [ &nbsp; ] Delta</strong> &nbsp;&nbsp;&nbsp;&nbsp; Fecha: ___/___/2026
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 11px;">
          <div>Estudiante: ____________________________________________________________________</div>
          <div>N.° Orden: [ &nbsp;&nbsp;&nbsp; ]</div>
        </div>
        <h1 class="worksheet-title">${topic.worksheetTitle}</h1>
      </div>
    `;

    const footer = `
      <div style="border-top: 1.5px dashed #555; margin-top: 8px; padding-top: 4px; display: flex; justify-content: space-between; font-size: 10px; color: #444;">
        <span>✂️ Recorta por la línea punteada y pega esta ficha en tu cuaderno de matemática.</span>
        <span>${topic.title} • Didáctica Santillana & Eduten</span>
      </div>
    `;

    let bodyContent = '';
    if (activeId === 'division-reparto') {
      bodyContent = this.renderWorksheetWeek2Content();
    } else if (activeId === 'fracciones-unidad') {
      bodyContent = this.renderWorksheetWeek3Content();
    } else if (activeId === 'operaciones-combinadas') {
      bodyContent = this.renderWorksheetWeek4Content();
    } else {
      bodyContent = this.renderWorksheetWeek1Content();
    }

    return `
      <div class="worksheet-a4">
        ${studentHeader}
        ${bodyContent}
        ${footer}
      </div>
    `;
  }

  // ==============================================================
  // CONTENIDO FICHA SEMANA 1: PATRONES MULTIPLICATIVOS
  // ==============================================================
  renderWorksheetWeek1Content() {
    return `
      <!-- 1. Analiza y Compara -->
      <div class="worksheet-section">
        <div class="ws-sec-title">1. ANALIZA Y COMPARA: ¿SUMA O MULTIPLICACIÓN?</div>
        <p style="font-size: 12.5px; margin-bottom: 6px;">
          Observa con atención la siguiente secuencia numérica:
        </p>
        <div style="text-align: center; margin: 6px 0 8px 0;">
          <span class="ws-box">3</span> ➔ 
          <span class="ws-box">6</span> ➔ 
          <span class="ws-box">12</span> ➔ 
          <span class="ws-box">24</span>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • Si sumamos: 3 + 3 = 6. ¿Pero 6 + 3 da 12? &nbsp;&nbsp;&nbsp;&nbsp; 
          <strong>[ &nbsp;&nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] NO</strong>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • Explica por qué no funciona la suma: ___________________________________________________________
        </div>
        <div style="font-size: 12px;">
          • La regla constante que <strong>SÍ</strong> se cumple para toda la secuencia es: &nbsp;&nbsp;
          <strong>[ &nbsp;&nbsp; × 2 &nbsp;&nbsp; ]</strong>
        </div>
      </div>

      <!-- 2. Recta de Regularidad -->
      <div class="worksheet-section">
        <div class="ws-sec-title">2. COMPLETA LA RECTA DE REGULARIDAD</div>
        <p style="font-size: 12.5px; margin-bottom: 6px;">
          Descubre la regla constante y completa los casilleros que faltan:
        </p>
        
        <div style="margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 4px;">
          <span style="font-weight: 700; font-size: 12.5px; margin-right: 6px;">a)</span>
          <span class="ws-box">4</span>
          <div class="ws-jump-arc"><span>× 3</span><span>↷</span></div>
          <span class="ws-box">12</span>
          <div class="ws-jump-arc"><span>× 3</span><span>↷</span></div>
          <span class="ws-box">36</span>
          <div class="ws-jump-arc"><span>× 3</span><span>↷</span></div>
          <span class="ws-box ws-box-empty"></span>
        </div>

        <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <span style="font-weight: 700; font-size: 12.5px; margin-right: 6px;">b)</span>
          <span class="ws-box">5</span>
          <div class="ws-jump-arc"><span>× 4</span><span>↷</span></div>
          <span class="ws-box ws-box-empty"></span>
          <div class="ws-jump-arc"><span>× 4</span><span>↷</span></div>
          <span class="ws-box">80</span>
          <div class="ws-jump-arc"><span>× 4</span><span>↷</span></div>
          <span class="ws-box ws-box-empty"></span>
        </div>
      </div>

      <!-- 3. Descomposición Mental -->
      <div class="worksheet-section">
        <div class="ws-sec-title">3. ESTRATEGIA DE CÁLCULO MENTAL: DESCOMPOSICIÓN</div>
        <p style="font-size: 12px; margin-bottom: 5px;">
          Para multiplicar números de dos cifras mentalmente, descomponemos en decenas y unidades:
        </p>
        <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 5px 10px; margin-bottom: 6px; font-size: 11.5px;">
          <strong>Ejemplo guiado:</strong> &nbsp;&nbsp; 45 × 3 = (40 × 3) + (5 × 3) = 120 + 15 = <strong>135</strong>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • <strong>64 × 4</strong> = ( _____ × 4 ) + ( _____ × 4 ) = ___________ + ___________ = <strong>___________</strong>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • <strong>54 × 3</strong> = ( _____ × 3 ) + ( _____ × 3 ) = ___________ + ___________ = <strong>___________</strong>
        </div>
        <div style="font-size: 12px;">
          • <strong>36 × 4</strong> = ( _____ × 4 ) + ( _____ × 4 ) = ___________ + ___________ = <strong>___________</strong>
        </div>
      </div>

      <!-- 4. Tabla de Entrada y Salida -->
      <div class="worksheet-section">
        <div class="ws-sec-title">4. TABLA DE ENTRADA Y SALIDA (MÁQUINA MATEMÁTICA)</div>
        <p style="font-size: 12px; margin-bottom: 4px;">
          Aplica la regla fija para completar la tabla. ¡Atento a la última fila inversa!
        </p>
        <div style="font-weight: 800; font-size: 11.5px; text-align: center; margin: 3px 0 5px 0;">
          [ REGLA FIJA: ENTRADA × 5 ]
        </div>
        <table class="ws-table">
          <thead>
            <tr>
              <th style="width: 50%;">📥 ENTRADA ( Número )</th>
              <th style="width: 50%;">📤 SALIDA ( Entrada × 5 )</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3</td>
              <td>15</td>
            </tr>
            <tr>
              <td>6</td>
              <td><strong>____________________</strong></td>
            </tr>
            <tr>
              <td>8</td>
              <td><strong>____________________</strong></td>
            </tr>
            <tr>
              <td><strong>____________________</strong> (Inverso)</td>
              <td>50</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 5. Situación Problemática -->
      <div class="worksheet-section">
        <div class="ws-sec-title">5. SITUACIÓN PROBLEMÁTICA</div>
        <p style="font-size: 12px; line-height: 1.4; margin-bottom: 5px;">
          En un taller de artesanía, cada fila de una alfombra duplica (×2) el número de figuras respecto a la fila anterior. Si la Fila 1 tiene 8 figuras: <strong>¿cuántas figuras tendrá la Fila 4?</strong>
        </p>
        <div class="ws-problem-grid">
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">DATOS</div>
            <div style="margin-top: 5px;">Fila 1 = 8 figuras</div>
            <div style="margin-top: 6px;">Fila 2 = _________</div>
            <div style="margin-top: 6px;">Fila 3 = _________</div>
            <div style="margin-top: 6px;">Fila 4 = _________</div>
          </div>
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">OPERACIÓN / CÁLCULO</div>
            <div style="color: #666; font-size: 10.5px; margin-bottom: 4px;">(Aplica la regla constante ×2):</div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          </div>
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">RESPUESTA COMPLETA</div>
            <div style="margin-top: 28px; font-weight: 700; font-size: 11.5px; line-height: 1.4;">
              Rpta: En la Fila 4 tendrá ______________ figuras.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==============================================================
  // CONTENIDO FICHA SEMANA 2: DIVISIÓN Y REPARTO EQUITATIVO
  // ==============================================================
  renderWorksheetWeek2Content() {
    return `
      <!-- 1. Reparto Equitativo y Residuo -->
      <div class="worksheet-section">
        <div class="ws-sec-title">1. REPARTO EQUITATIVO Y RESIDUO (REPARTO CONCRETO)</div>
        <p style="font-size: 12px; margin-bottom: 6px;">
          En el laboratorio de cómputo se deben repartir <strong>45 audífonos</strong> entre <strong>6 mesas de trabajo</strong> en partes iguales:
        </p>
        <div style="text-align: center; margin: 6px 0 8px 0; font-family: monospace; font-size: 14px;">
          45 &nbsp; ÷ &nbsp; 6 &nbsp; = &nbsp; <span class="ws-box">7</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
          ¿Cuántos sobran? &nbsp; Residuo: <span class="ws-box">3</span>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • ¿Se puede entregar un audífono más a cada mesa con los que sobraron? &nbsp;&nbsp;
          <strong>[ &nbsp;&nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] NO</strong>
        </div>
        <div style="font-size: 12px;">
          • Justifica matemáticamente: El residuo (3) siempre debe ser <strong>menor</strong> que el divisor (6): ___________________
        </div>
      </div>

      <!-- 2. Comprobación Matemática -->
      <div class="worksheet-section">
        <div class="ws-sec-title">2. COMPROBACIÓN MATEMÁTICA: DIVIDENDO = (DIVISOR × COCIENTE) + RESIDUO</div>
        <p style="font-size: 12px; margin-bottom: 6px;">
          Aplica el algoritmo de comprobación para verificar cada división:
        </p>
        <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 4px 10px; margin-bottom: 6px; font-size: 11.5px;">
          <strong>Modelo:</strong> 68 ÷ 7 = 9 (residuo 5) &nbsp;➔&nbsp; Comprobación: ( 7 × 9 ) + 5 = 63 + 5 = <strong>68</strong> [ CORRECTO ]
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • <strong>76 ÷ 8 = 9 (residuo 4)</strong> &nbsp;➔&nbsp; ( _____ × _____ ) + _____ = _________ + _________ = <strong>_________</strong>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • <strong>89 ÷ 9 = 9 (residuo 8)</strong> &nbsp;➔&nbsp; ( _____ × _____ ) + _____ = _________ + _________ = <strong>_________</strong>
        </div>
        <div style="font-size: 12px;">
          • <strong>54 ÷ 5 = 10 (residuo 4)</strong> &nbsp;➔&nbsp; ( _____ × _____ ) + _____ = _________ + _________ = <strong>_________</strong>
        </div>
      </div>

      <!-- 3. Cálculo Mental: Mitades y Tercias -->
      <div class="worksheet-section">
        <div class="ws-sec-title">3. ESTRATEGIA DE CÁLCULO MENTAL: MITADES Y TERCERAS PARTES</div>
        <p style="font-size: 12px; margin-bottom: 5px;">
          Descompón el número en múltiplos exactos de 10 para calcular mentalmente:
        </p>
        <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 4px 10px; margin-bottom: 6px; font-size: 11.5px;">
          <strong>Ejemplo:</strong> Mitad de 74 = Mitad de ( 60 + 14 ) = 30 + 7 = <strong>37</strong>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • <strong>Mitad de 96</strong> = Mitad de ( 80 + 16 ) = _________ + _________ = <strong>_________</strong>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • <strong>Mitad de 58</strong> = Mitad de ( 40 + 18 ) = _________ + _________ = <strong>_________</strong>
        </div>
        <div style="font-size: 12px;">
          • <strong>Tercia de 75</strong> = Tercia de ( 60 + 15 ) = _________ + _________ = <strong>_________</strong>
        </div>
      </div>

      <!-- 4. Clasificación de Divisiones -->
      <div class="worksheet-section">
        <div class="ws-sec-title">4. CLASIFICACIÓN: DIVISIONES EXACTAS E INEXACTAS</div>
        <p style="font-size: 12px; margin-bottom: 4px;">
          Resuelve mentalmente y completa la tabla indicando si es exacta (residuo 0) o inexacta:
        </p>
        <table class="ws-table">
          <thead>
            <tr>
              <th style="width: 25%;">División</th>
              <th style="width: 25%;">Cociente</th>
              <th style="width: 25%;">Residuo</th>
              <th style="width: 25%;">¿Es división exacta?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>42 ÷ 6</td>
              <td>7</td>
              <td>0</td>
              <td><strong>SÍ (Residuo cero)</strong></td>
            </tr>
            <tr>
              <td>49 ÷ 6</td>
              <td>_________</td>
              <td>_________</td>
              <td>[ &nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] NO</td>
            </tr>
            <tr>
              <td>64 ÷ 8</td>
              <td>_________</td>
              <td>_________</td>
              <td>[ &nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] NO</td>
            </tr>
            <tr>
              <td>75 ÷ 8</td>
              <td>_________</td>
              <td>_________</td>
              <td>[ &nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] NO</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 5. Situación Problemática -->
      <div class="worksheet-section">
        <div class="ws-sec-title">5. SITUACIÓN PROBLEMÁTICA DEL PERÚ</div>
        <p style="font-size: 12px; line-height: 1.4; margin-bottom: 5px;">
          En una cooperativa cafetalera de Chanchamayo (Junín), se cosecharon <strong>94 kilogramos</strong> de café especial. Si se deben envasar en bolsas de <strong>8 kilogramos</strong> cada una: <strong>¿Cuántas bolsas completas se podrán llenar y cuántos kilogramos sobrarán?</strong>
        </p>
        <div class="ws-problem-grid">
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">DATOS</div>
            <div style="margin-top: 5px;">• Total café = 94 kg</div>
            <div style="margin-top: 6px;">• Peso por bolsa = 8 kg</div>
            <div style="margin-top: 6px;">• Bolsas = ?</div>
            <div style="margin-top: 6px;">• Sobrante = ?</div>
          </div>
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">ALGORITMO Y COMPROBACIÓN</div>
            <div style="color: #666; font-size: 10.5px; margin-bottom: 4px;">Divide 94 ÷ 8:</div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
            <div style="color: #666; font-size: 10.5px; margin-top: 2px;">Comprobación (8 × c) + r:</div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          </div>
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">RESPUESTA COMPLETA</div>
            <div style="margin-top: 22px; font-weight: 700; font-size: 11.5px; line-height: 1.4;">
              Rpta: Se llenarán ________ bolsas completas y sobrarán ________ kg de café.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==============================================================
  // CONTENIDO FICHA SEMANA 3: FRACCIONES Y PARTES DE LA UNIDAD
  // ==============================================================
  renderWorksheetWeek3Content() {
    return `
      <!-- 1. Representación Gráfica -->
      <div class="worksheet-section">
        <div class="ws-sec-title">1. REPRESENTACIÓN GRÁFICA Y CONCEPTUAL</div>
        <p style="font-size: 12px; margin-bottom: 6px;">
          Escribe la fracción que representa la parte sombreada e identifica sus términos:
        </p>
        <div style="display: flex; justify-content: space-around; align-items: center; margin: 8px 0; font-size: 12px; flex-wrap: wrap; gap: 8px;">
          <div style="border: 1px solid #333; padding: 6px 12px; border-radius: 4px; text-align: center;">
            <div style="display: flex; gap: 2px; margin-bottom: 4px;">
              <span style="display:inline-block; width:16px; height:18px; background:#444; border:1px solid #000;"></span>
              <span style="display:inline-block; width:16px; height:18px; background:#444; border:1px solid #000;"></span>
              <span style="display:inline-block; width:16px; height:18px; background:#444; border:1px solid #000;"></span>
              <span style="display:inline-block; width:16px; height:18px; background:#444; border:1px solid #000;"></span>
              <span style="display:inline-block; width:16px; height:18px; background:#fff; border:1px solid #000;"></span>
              <span style="display:inline-block; width:16px; height:18px; background:#fff; border:1px solid #000;"></span>
            </div>
            <strong>[ 4 / 6 ]</strong> &nbsp; (Numerador: 4, Denominador: 6)
          </div>

          <div style="border: 1px solid #333; padding: 6px 12px; border-radius: 4px; text-align: center;">
            <div style="display: flex; gap: 2px; margin-bottom: 4px;">
              <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
              <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
              <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
              <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
              <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
              <span style="display:inline-block; width:14px; height:18px; background:#fff; border:1px solid #000;"></span>
              <span style="display:inline-block; width:14px; height:18px; background:#fff; border:1px solid #000;"></span>
              <span style="display:inline-block; width:14px; height:18px; background:#fff; border:1px solid #000;"></span>
            </div>
            <strong>[ ___ / ___ ]</strong> &nbsp; (Num: ____, Den: ____)
          </div>
        </div>
        <div style="font-size: 12px;">
          • El <strong>denominador</strong> indica las partes totales en que se divide la unidad, y el <strong>numerador</strong> indica las partes que se toman.
        </div>
      </div>

      <!-- 2. Fracciones Equivalentes -->
      <div class="worksheet-section">
        <div class="ws-sec-title">2. FRACCIONES EQUIVALENTES (AMPLIFICACIÓN)</div>
        <p style="font-size: 12px; margin-bottom: 5px;">
          Multiplica el numerador y el denominador por el mismo número para obtener fracciones equivalentes:
        </p>
        <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 4px 10px; margin-bottom: 6px; font-size: 11.5px;">
          <strong>Modelo:</strong> 1/2 × 2/2 = <strong>2/4</strong> &nbsp;&nbsp;&nbsp;&nbsp; 1/2 × 3/3 = <strong>3/6</strong> &nbsp;&nbsp;&nbsp;&nbsp; 1/2 × 4/4 = <strong>4/8</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
          <span>• <strong>2/3</strong> × 2/2 = <strong>_____ / _____</strong></span>
          <span>• <strong>3/5</strong> × 2/2 = <strong>_____ / _____</strong></span>
          <span>• <strong>4/7</strong> × 2/2 = <strong>_____ / _____</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px;">
          <span>• <strong>2/3</strong> × 3/3 = <strong>_____ / _____</strong></span>
          <span>• <strong>3/5</strong> × 3/3 = <strong>_____ / _____</strong></span>
          <span>• <strong>1/4</strong> × 4/4 = <strong>_____ / _____</strong></span>
        </div>
      </div>

      <!-- 3. Comparación de Fracciones -->
      <div class="worksheet-section">
        <div class="ws-sec-title">3. COMPARACIÓN DE FRACCIONES (> , < , =)</div>
        <p style="font-size: 12px; margin-bottom: 6px;">
          Compara las fracciones colocando el signo correcto:
        </p>
        <div style="display: flex; justify-content: space-around; font-size: 12.5px; margin-bottom: 6px;">
          <span>a) 5/8 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 3/8</span>
          <span>b) 4/10 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 7/10</span>
          <span>c) 2/4 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 1/2</span>
        </div>
        <div style="display: flex; justify-content: space-around; font-size: 12.5px;">
          <span>d) 3/6 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 5/6</span>
          <span>e) 8/8 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 1 entero</span>
          <span>f) 6/9 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 2/3</span>
        </div>
      </div>

      <!-- 4. Tabla de Lectura y Fracciones -->
      <div class="worksheet-section">
        <div class="ws-sec-title">4. TABLA DE LECTURA Y RELACIÓN CON LA MITAD (1/2)</div>
        <p style="font-size: 12px; margin-bottom: 4px;">
          Completa cómo se lee cada fracción y si es menor, igual o mayor que la mitad (1/2):
        </p>
        <table class="ws-table">
          <thead>
            <tr>
              <th style="width: 20%;">Fracción</th>
              <th style="width: 45%;">Cómo se lee</th>
              <th style="width: 35%;">¿Menor, igual o mayor que 1/2?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3/4</td>
              <td>Tres cuartos</td>
              <td>Mayor que 1/2 (la mitad de 4 es 2)</td>
            </tr>
            <tr>
              <td>2/5</td>
              <td>__________________________________</td>
              <td>______________________________</td>
            </tr>
            <tr>
              <td>5/10</td>
              <td>__________________________________</td>
              <td>______________________________</td>
            </tr>
            <tr>
              <td>7/8</td>
              <td>__________________________________</td>
              <td>______________________________</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 5. Situación Problemática -->
      <div class="worksheet-section">
        <div class="ws-sec-title">5. SITUACIÓN PROBLEMÁTICA DEL PERÚ</div>
        <p style="font-size: 12px; line-height: 1.4; margin-bottom: 5px;">
          En una panadería tradicional de Oropesa (Cusco), dos familias compran panes chuta del mismo tamaño. La familia Quispe consume <strong>3/8</strong> de su pan y la familia Mamani consume <strong>5/8</strong> de su pan: <strong>¿Qué familia consumió más pan y qué fracción de pan le sobró a la familia Mamani?</strong>
        </p>
        <div class="ws-problem-grid">
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">DATOS</div>
            <div style="margin-top: 5px;">• Familia Quispe: 3/8</div>
            <div style="margin-top: 6px;">• Familia Mamani: 5/8</div>
            <div style="margin-top: 6px;">• ¿Quién comió más?</div>
            <div style="margin-top: 6px;">• ¿Cuánto sobró?</div>
          </div>
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">GRÁFICO Y COMPARACIÓN</div>
            <div style="color: #666; font-size: 10.5px; margin-bottom: 4px;">Compara 5/8 con 3/8:</div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
            <div style="color: #666; font-size: 10.5px; margin-top: 2px;">Resta a la unidad (8/8 - 5/8):</div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          </div>
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">RESPUESTA COMPLETA</div>
            <div style="margin-top: 18px; font-weight: 700; font-size: 11px; line-height: 1.4;">
              Rpta 1: Consumió más pan la familia ____________.<br>
              Rpta 2: A la familia Mamani le sobraron ________ de pan.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==============================================================
  // CONTENIDO FICHA SEMANA 4: OPERACIONES COMBINADAS
  // ==============================================================
  renderWorksheetWeek4Content() {
    return `
      <!-- 1. Regla de Oro de la Jerarquía -->
      <div class="worksheet-section">
        <div class="ws-sec-title">1. REGLA DE ORO DE LA JERARQUÍA OPERATORIA</div>
        <p style="font-size: 12px; margin-bottom: 6px;">
          Recuerda el orden estricto: <strong>1.° Paréntesis ( )</strong> &nbsp;➔&nbsp; <strong>2.° Multiplicación (×) y División (÷)</strong> &nbsp;➔&nbsp; <strong>3.° Suma (+) y Resta (-)</strong> de izquierda a derecha.
        </p>
        <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 5px 10px; margin-bottom: 6px; font-size: 11.5px;">
          a) 20 + 5 × 4 = 20 + 20 = <strong>40</strong> &nbsp;&nbsp;&nbsp;&nbsp; (Primero multiplicamos 5 × 4)<br>
          b) ( 20 + 5 ) × 4 = 25 × 4 = <strong>100</strong> &nbsp;&nbsp;&nbsp;&nbsp; (Primero resolvemos el paréntesis)
        </div>
        <div style="font-size: 12px;">
          • ¿Por qué dan resultados distintos si tienen los mismos números? _________________________________________
        </div>
      </div>

      <!-- 2. Resuelve Paso a Paso -->
      <div class="worksheet-section">
        <div class="ws-sec-title">2. RESUELVE PASO A PASO RESPETANDO LA JERARQUÍA</div>
        <p style="font-size: 12px; margin-bottom: 6px;">
          Desarrolla las operaciones intermedias en orden correcto:
        </p>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • <strong>45 - 5 × 6 + 10</strong> = 45 - _________ + 10 = _________ + 10 = <strong>_________</strong>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • <strong>( 32 ÷ 4 ) + ( 7 × 6 )</strong> = _________ + _________ = <strong>_________</strong>
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          • <strong>80 - ( 18 + 22 ) ÷ 2</strong> = 80 - _________ ÷ 2 = 80 - _________ = <strong>_________</strong>
        </div>
        <div style="font-size: 12px;">
          • <strong>90 - 3 × ( 15 + 5 )</strong> = 90 - 3 × _________ = 90 - _________ = <strong>_________</strong>
        </div>
      </div>

      <!-- 3. Enigma Matemático -->
      <div class="worksheet-section">
        <div class="ws-sec-title">3. ENIGMA MATEMÁTICO: COLOCA LOS PARÉNTESIS ( )</div>
        <p style="font-size: 12px; margin-bottom: 6px;">
          Coloca los paréntesis ( ) en el lugar exacto para que la igualdad sea verdadera:
        </p>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span>a) 8 + 2 × 6 = 60 &nbsp;➔&nbsp; ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ) × 6 = 60</span>
          <span>b) 36 - 12 ÷ 4 = 6 &nbsp;➔&nbsp; ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ) ÷ 4 = 6</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px;">
          <span>c) 5 × 9 - 4 = 25 &nbsp;➔&nbsp; 5 × ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ) = 25</span>
          <span>d) 40 ÷ 5 + 3 = 5 &nbsp;➔&nbsp; 40 ÷ ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ) = 5</span>
        </div>
      </div>

      <!-- 4. Tabla de Análisis Operatorio -->
      <div class="worksheet-section">
        <div class="ws-sec-title">4. TABLA DE ANÁLISIS: ¿QUÉ SE RESUELVE PRIMERO?</div>
        <p style="font-size: 12px; margin-bottom: 4px;">
          Identifica qué operación se debe efectuar en primer lugar y halla el resultado final:
        </p>
        <table class="ws-table">
          <thead>
            <tr>
              <th style="width: 30%;">Expresión</th>
              <th style="width: 45%;">Primera operación obligatoria</th>
              <th style="width: 25%;">Resultado Final</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>24 + 16 ÷ 4</td>
              <td>División: 16 ÷ 4 = 4</td>
              <td><strong>28</strong></td>
            </tr>
            <tr>
              <td>( 24 + 16 ) ÷ 4</td>
              <td>__________________________________</td>
              <td><strong>_________</strong></td>
            </tr>
            <tr>
              <td>50 - 8 × 5</td>
              <td>__________________________________</td>
              <td><strong>_________</strong></td>
            </tr>
            <tr>
              <td>( 50 - 8 ) × 2</td>
              <td>__________________________________</td>
              <td><strong>_________</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 5. Situación Problemática -->
      <div class="worksheet-section">
        <div class="ws-sec-title">5. SITUACIÓN PROBLEMÁTICA DEL PERÚ</div>
        <p style="font-size: 12px; line-height: 1.4; margin-bottom: 5px;">
          En el Mercado Mayorista de Frutas de Lima, don Carlos compra <strong>4 cajas de mandarinas con 30 unidades</strong> cada una. Si regala <strong>20 mandarinas</strong> a sus sobrinos y reparte el resto en bolsas de <strong>5 unidades</strong>: <strong>¿Cuántas bolsas podrá vender en total? Escribe una sola operación combinada con paréntesis:</strong>
        </p>
        <div class="ws-problem-grid">
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">DATOS</div>
            <div style="margin-top: 5px;">• 4 cajas de 30 mandarinas</div>
            <div style="margin-top: 6px;">• Regala 20</div>
            <div style="margin-top: 6px;">• Bolsas de 5 mandarinas</div>
            <div style="margin-top: 6px;">• Total bolsas = ?</div>
          </div>
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">OPERACIÓN COMBINADA ÚNICA</div>
            <div style="color: #666; font-size: 10.5px; margin-bottom: 4px;">Escribe la fórmula con ( ):</div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px; font-weight:700; font-size:11px;">[ ( 4 × 30 ) - 20 ] ÷ 5 =</div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
            <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          </div>
          <div class="ws-problem-col">
            <div class="ws-problem-col-title">RESPUESTA COMPLETA</div>
            <div style="margin-top: 24px; font-weight: 700; font-size: 11.5px; line-height: 1.4;">
              Rpta: Don Carlos podrá vender un total de _________ bolsas de mandarinas.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachStudentEditEvents() {
    document.querySelectorAll('.edit-pin-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const name = e.currentTarget.getAttribute('data-name');
        const currentPin = e.currentTarget.getAttribute('data-pin');

        const rawPin = prompt(`Cambiar PIN para ${name} (Actual: ${currentPin}):`, currentPin);
        if (rawPin && rawPin.trim() !== '') {
          const newPin = sanitizePin(rawPin.trim());
          const student = storage.getStudentById(id);
          if (student) {
            student.pin = newPin;
            storage.updateStudent(student);
            alert(`PIN actualizado exitosamente a: ${newPin}`);
            this.render();
          }
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new ExpedicionApp();
});
