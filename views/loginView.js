// ==============================================================
// Expedición Matemática - Vista de Login (Estudiantes & Docentes)
// ==============================================================

import { ICONS } from '../data/icons.js';
import { storage } from '../data/storage.js';
import { escapeHtml } from '../data/guardrails.js';

export function renderLoginView(app) {
  return `
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative;">
      <!-- Selector flotante de tema y sonido -->
      <div style="position: absolute; top: 20px; right: 24px; display: flex; align-items: center; gap: 8px;">
        ${app.renderThemeToggleBtn()}
        ${app.renderSoundToggleBtn()}
      </div>

      <div class="glass-panel animate-pop" style="max-width: 480px; width: 100%; padding: 42px 36px; text-align: center; border: 1px solid var(--border-subtle); box-shadow: var(--card-shadow);">
        
        <!-- Logo y Título -->
        <div style="margin-bottom: 12px; display: inline-block;">
          ${app.currentTheme === 'andina' ? ICONS.ripple(48, 'var(--neon-green)') : ICONS.pixelLogo(48, 'var(--neon-green)')}
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

export function attachLoginEvents(app) {
  app.attachThemeToggleEvent();
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  const userInput = document.getElementById('login-username');
  const passInput = document.getElementById('login-password');
  const submitBtn = form?.querySelector('button[type="submit"]');

  // Función auxiliar para chequear si hay un bloqueo activo
  const checkLockout = () => {
    const lockoutUntil = parseInt(localStorage.getItem('expedicion_login_lockout_until') || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSec = Math.ceil((lockoutUntil - now) / 1000);
      if (userInput) userInput.disabled = true;
      if (passInput) passInput.disabled = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
      }
      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.innerHTML = `
          <div style="font-weight: 800; margin-bottom: 3px;">⏳ PAUSA DE SEGURIDAD</div>
          <div>Demasiados intentos incorrectos. Espera <strong id="lockout-countdown" style="font-size: 15px; color: var(--neon-green);">${remainingSec}s</strong> o revisa tu Tarjeta de Credenciales con tu profesor.</div>
        `;
      }

      if (app._lockoutInterval) clearInterval(app._lockoutInterval);
      app._lockoutInterval = setInterval(() => {
        const currentRemaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        const countEl = document.getElementById('lockout-countdown');
        if (currentRemaining > 0) {
          if (countEl) countEl.textContent = `${currentRemaining}s`;
        } else {
          clearInterval(app._lockoutInterval);
          app._lockoutInterval = null;
          localStorage.removeItem('expedicion_login_lockout_until');
          if (userInput) userInput.disabled = false;
          if (passInput) passInput.disabled = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
          }
          if (errorEl) {
            errorEl.style.display = 'none';
          }
        }
      }, 1000);
      return true;
    }
    return false;
  };

  // Verificar si ya existe un bloqueo activo al cargar la pantalla
  checkLockout();

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (checkLockout()) return;

    const u = userInput?.value;
    const p = passInput?.value;

    const res = await storage.login(u, p);
    if (res.success) {
      // Éxito: Limpiar contador de fallos y pausas
      localStorage.removeItem('expedicion_login_fails');
      localStorage.removeItem('expedicion_login_lockout_until');
      if (app._lockoutInterval) clearInterval(app._lockoutInterval);

      app.user = res.user;
      app.currentView = res.role === 'teacher' ? 'TEACHER_DASHBOARD' : 'STUDENT_HOME';
      app.render();
    } else {
      app.playFeedbackTone('error');
      let fails = parseInt(localStorage.getItem('expedicion_login_fails') || '0', 10) + 1;
      localStorage.setItem('expedicion_login_fails', String(fails));

      if (fails >= 4) {
        // Activar pausa de seguridad progresiva: 30s al 4to fallo, 60s al 5to, 120s al 6to+
        const cooldownSec = fails === 4 ? 30 : fails === 5 ? 60 : 120;
        const lockoutUntil = Date.now() + (cooldownSec * 1000);
        localStorage.setItem('expedicion_login_lockout_until', String(lockoutUntil));
        checkLockout();
      } else {
        const remainingAttempts = 4 - fails;
        if (errorEl) {
          errorEl.innerHTML = `
            <div>${escapeHtml(res.message)}</div>
            <div style="font-size: 11px; margin-top: 4px; color: #fca5a5;">
              ⚠️ Te quedan <strong>${remainingAttempts} intento${remainingAttempts === 1 ? '' : 's'}</strong> antes de una pausa de seguridad.
            </div>
          `;
          errorEl.style.display = 'block';
        }
      }
    }
  });
}
