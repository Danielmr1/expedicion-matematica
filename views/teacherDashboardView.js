// ==============================================================
// Expedición Matemática - Panel de Monitoreo Docente
// Gráficos Eduten, Filtro de Salones, Métricas y Gestión Escolar
// ==============================================================

import { ICONS, CYBER_AVATARS } from '../data/icons.js';
import { storage } from '../data/storage.js';
import { CLASSROOMS } from '../data/students.js';
import { AVAILABLE_TOPICS } from '../data/curriculum.js';
import { escapeHtml } from '../data/guardrails.js';
import { renderStudentModalsHtml } from '../components/studentModals.js';

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

export function renderTeacherDashboard(app) {
  let filter = (app.selectedClassroomFilter === 'delta') ? 'delta' : 'sigma';
  app.selectedClassroomFilter = filter;
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
          ${app.renderSettingsMenu()}
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
          <button class="classroom-filter-btn" data-class="sigma" style="padding: 8px 18px; border-radius: 6px; border: none; font-weight: 800; font-size: 12px; cursor: pointer; font-family: var(--font-mono); text-transform: uppercase; background: ${filter === 'sigma' ? 'var(--color-sigma)' : 'transparent'}; color: ${filter === 'sigma' ? (app.currentTheme === 'andina' ? '#ffffff' : '#000000') : 'var(--text-muted)'};">
            4.° Sigma [${statsSigma.count}]
          </button>
          <button class="classroom-filter-btn" data-class="delta" style="padding: 8px 18px; border-radius: 6px; border: none; font-weight: 800; font-size: 12px; cursor: pointer; font-family: var(--font-mono); text-transform: uppercase; background: ${filter === 'delta' ? 'var(--color-delta)' : 'transparent'}; color: ${filter === 'delta' ? '#ffffff' : 'var(--text-muted)'};">
            4.° Delta [${statsDelta.count}]
          </button>
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
          <div style="font-size: 11px; color: var(--color-gold); margin-top: 4px; font-family: var(--font-mono); display: flex; align-items: center; gap: 4px;">${app.getEmblemSvg('oro', 14)} Cumplieron la semana</div>
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
                <option value="${t.id}" ${t.id === (app.selectedWorksheetTopicId || activeTopicId) ? 'selected' : ''}>
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
                  ${(AVAILABLE_TOPICS.find(t => t.id === (app.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).title.split(':')[0]}
                </span>
              </div>
              <div id="worksheet-topic-title" style="font-size: 15px; font-weight: 800; color: var(--text-white); margin-top: 2px; font-family: var(--font-title);">
                ${(AVAILABLE_TOPICS.find(t => t.id === (app.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).worksheetTitle}
              </div>
              <div id="worksheet-topic-desc" style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                ${(AVAILABLE_TOPICS.find(t => t.id === (app.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).description}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button id="simulate-student-btn" class="btn-dark" style="padding: 10px 16px; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; border-color: ${filter === 'sigma' ? 'var(--color-sigma)' : 'var(--color-delta)'}; color: var(--text-white); cursor: pointer;" title="Ingresar a la plataforma como Alumno Virtual de ${filter === 'sigma' ? '4.° Sigma' : '4.° Delta'} para probar la semana seleccionada">
              <span>🎒</span> Alumno Virtual (${filter === 'sigma' ? '4.° Sigma' : '4.° Delta'})
            </button>
            <button id="open-worksheet-modal-btn" class="btn-neon" style="padding: 10px 18px; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
              ${ICONS.printer(16, 'var(--text-black)')} Ver / Imprimir Ficha A4
            </button>
            <button id="download-topic-csv-btn" class="btn-dark" style="padding: 10px 16px; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; border-color: var(--color-delta); color: var(--text-white); cursor: pointer;" title="Descargar reporte en Excel/CSV de la semana seleccionada">
              ${ICONS.download(15, 'var(--color-delta)')} Exportar Excel (${(AVAILABLE_TOPICS.find(t => t.id === (app.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).title.split(':')[0]})
            </button>
          </div>
        </div>
      </div>

      <!-- Contenedor Dinámico de Gráficos y Analítica de la Semana -->
      <div id="weekly-analytics-container">
        ${renderWeeklyAnalyticsSection(app, app.selectedWorksheetTopicId || activeTopicId, filter)}
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
              <button id="toggle-view-semana" class="btn-dark" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 6px; border: 1.5px solid ${app.tableMetricMode === 'semana' ? 'var(--neon-green)' : 'transparent'}; background: ${app.tableMetricMode === 'semana' ? 'rgba(0,255,157,0.1)' : 'transparent'}; color: ${app.tableMetricMode === 'semana' ? 'var(--neon-green)' : 'var(--text-muted)'}; font-weight: 800; font-family: var(--font-mono);">
                📅 Semana ${(AVAILABLE_TOPICS.find(t => t.id === (app.selectedWorksheetTopicId || activeTopicId)) || currentTopicObj).weekNumber}
              </button>
              <button id="toggle-view-bimestre" class="btn-dark" style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 6px; border: 1.5px solid ${app.tableMetricMode === 'bimestre' ? 'var(--color-gold)' : 'transparent'}; background: ${app.tableMetricMode === 'bimestre' ? 'rgba(234,179,8,0.1)' : 'transparent'}; color: ${app.tableMetricMode === 'bimestre' ? 'var(--color-gold)' : 'var(--text-muted)'}; font-weight: 800; font-family: var(--font-mono);">
                🏆 Acumulado 3.° Bimestre
              </button>
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button id="open-add-student-modal-btn" class="btn-neon" style="padding: 7px 14px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
              <span>➕</span> Agregar Alumno a ${filter === 'sigma' ? '4.° Sigma' : '4.° Delta'}
            </button>
            <div style="display: flex; gap: 8px; align-items: center; background: var(--bg-surface-elevated); padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <label style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); font-weight: 700; text-transform: uppercase; cursor: pointer;" for="toggle-pins">Ver PINs:</label>
              <input type="checkbox" id="toggle-pins" style="cursor: pointer; width: 15px; height: 15px; accent-color: var(--neon-green);" />
            </div>
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
                <th>${app.tableMetricMode === 'semana' ? 'Tiempo (Semana)' : 'Tiempo (3.° Bimestre)'}</th>
                <th>${app.tableMetricMode === 'semana' ? 'Estrellas (Semana)' : 'Estrellas (3.° Bimestre)'}</th>
                <th>${app.tableMetricMode === 'semana' ? 'Trofeo Semanal' : 'Trofeo Mayor (3.° Bimestre)'}</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody id="students-table-body">
              ${renderStudentRows(app, students, false, app.tableMetricMode, app.selectedWorksheetTopicId || activeTopicId)}
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

        <!-- Salón seleccionado para las Tarjetas (Sin filtros, toma el salón activo) -->
        <div style="background: var(--bg-surface-elevated); padding: 12px 20px; border-bottom: 1.5px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 11px; font-weight: 800; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase;">Salón Seleccionado:</span>
            <span class="badge-tech ${filter === 'sigma' ? '' : 'badge-delta'}" style="font-size: 12.5px; padding: 4px 14px;">
              ${filter === 'sigma' ? '4.° Grado Sigma' : '4.° Grado Delta'}
            </span>
          </div>
          <div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">
            ⚡ <em>Generando únicamente las tarjetas de credenciales del salón seleccionado en pantalla.</em>
          </div>
        </div>

        <div id="cards-modal-preview" style="overflow-y: auto; padding: 20px; flex: 1; background: var(--bg-canvas);">
          ${app.renderCardsHtmlForPreview(filter)}
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
          ${app.renderWorksheetA4Html(app.selectedWorksheetTopicId || activeTopicId)}
        </div>
      </div>
    </div>

    <!-- Contenedor invisible en pantalla para impresión directa con window.print -->
    <div id="worksheet-print-area" style="display: none;">
      ${app.renderWorksheetA4Html(app.selectedWorksheetTopicId || activeTopicId)}
    </div>

    ${renderStudentModalsHtml(filter)}
  `;
}

export function renderWeeklyAnalyticsSection(app, topicId, filter) {
  const activeId = topicId || app.selectedWorksheetTopicId || storage.getActiveTopic();
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

export function renderStudentRows(app, students, showPins, mode = 'semana', topicId = null) {
  const activeId = topicId || app.selectedWorksheetTopicId || storage.getActiveTopic();
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
            <span 
              class="student-name-click" 
              data-id="${s.id}" 
              style="font-weight: 700; color: var(--text-white); font-family: var(--font-title); font-size: 13px; cursor: pointer; text-decoration: underline dotted var(--text-dim);" 
              title="Hacer clic para editar estudiante"
            >${escapeHtml(s.name)}</span>
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
            ${app.getEmblemSvg(chosenTro, 16)} <span>${app.getEmblemShort(chosenTro)}</span>
          </span>
        </td>
        <td>
          <button 
            class="edit-student-btn btn-dark" 
            data-id="${s.id}" 
            data-name="${escapeHtml(s.name)}" 
            data-pin="${escapeHtml(s.pin)}"
            style="padding: 4px 10px; font-size: 11px; font-family: var(--font-mono); display: inline-flex; align-items: center; gap: 4px;"
            title="Editar datos del estudiante"
          >
            ✏️ Editar
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

export function startVirtualSimulation(app, classroom) {
  app.simulatedTeacherSession = app.user || { username: 'profesor', role: 'teacher', isTeacher: true };
  app.isTeacherSimulating = true;
  app.simulatedTopicId = app.selectedWorksheetTopicId || storage.getActiveTopic();
  const isSigma = classroom === 'sigma';
  app.user = {
    id: isSigma ? 'virtual-sigma' : 'virtual-delta',
    num: 0,
    classroom: classroom,
    name: isSigma ? 'Alumno Virtual Sigma' : 'Alumna Virtual Delta',
    displayName: isSigma ? 'Alumno Sigma' : 'Alumna Delta',
    username: isSigma ? 'virtual.sigma' : 'virtual.delta',
    avatar: isSigma ? 'robot' : 'astronaut',
    stars: 0,
    xp: 0,
    timeMinutes: 0,
    completedChallenges: [],
    trophies: {}
  };
  app.currentView = 'STUDENT_HOME';
  app.render();
}

export function attachTeacherEvents(app) {
  app.attachThemeToggleEvent();
  document.getElementById('teacher-logout-btn')?.addEventListener('click', () => {
    storage.logout();
    app.user = null;
    app.currentView = 'LOGIN';
    app.render();
  });

  // Simulador de alumno virtual (ligado al salón y tema activo)
  document.getElementById('simulate-student-btn')?.addEventListener('click', () => {
    startVirtualSimulation(app, app.selectedClassroomFilter);
  });

  // Abrir modal de matriculación de nuevo alumno
  document.getElementById('open-add-student-modal-btn')?.addEventListener('click', () => {
    app.openAddStudentModal();
  });

  document.querySelectorAll('.classroom-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      app.selectedClassroomFilter = e.currentTarget.getAttribute('data-class');
      app.render();
    });
  });

  // Modo de métrica de tabla: Semana vs Acumulado 3.° Bimestre
  document.getElementById('toggle-view-semana')?.addEventListener('click', () => {
    app.tableMetricMode = 'semana';
    app.render();
  });

  document.getElementById('toggle-view-bimestre')?.addEventListener('click', () => {
    app.tableMetricMode = 'bimestre';
    app.render();
  });

  const togglePins = document.getElementById('toggle-pins');
  togglePins?.addEventListener('change', (e) => {
    const students = storage.getAllStudents(app.selectedClassroomFilter);
    const body = document.getElementById('students-table-body');
    if (body) {
      body.innerHTML = renderStudentRows(app, students, e.target.checked, app.tableMetricMode, app.selectedWorksheetTopicId || storage.getActiveTopic());
      app.attachStudentEditEvents();
    }
  });

  const searchInput = document.getElementById('search-student-input');
  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const currentList = storage.getAllStudents(app.selectedClassroomFilter);
    const filtered = currentList.filter(s => 
      s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q)
    );
    const body = document.getElementById('students-table-body');
    if (body) {
      body.innerHTML = renderStudentRows(app, filtered, togglePins?.checked, app.tableMetricMode, app.selectedWorksheetTopicId || storage.getActiveTopic());
      app.attachStudentEditEvents();
    }
  });

  const handleDownloadCsv = () => {
    const targetTopicId = app.selectedWorksheetTopicId || storage.getActiveTopic();
    const topicObj = AVAILABLE_TOPICS.find(t => t.id === targetTopicId) || AVAILABLE_TOPICS[0];
    const csv = storage.generateCSV(app.selectedClassroomFilter, targetTopicId);
    // Byte Order Mark (\uFEFF) para que Excel abra sin corromper tildes ni la letra ñ
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanWeek = topicObj.title.split(':')[0].replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `Reporte_${cleanWeek}_${app.selectedClassroomFilter.toUpperCase()}_4to_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById('download-header-csv-btn')?.addEventListener('click', handleDownloadCsv);
  document.getElementById('download-csv-btn')?.addEventListener('click', handleDownloadCsv);
  document.getElementById('download-topic-csv-btn')?.addEventListener('click', handleDownloadCsv);

  // Modal de Tarjetas de Credenciales (PIN) - Directo del salón seleccionado
  const cardsModalEl = document.getElementById('cards-modal');
  document.getElementById('print-cards-btn')?.addEventListener('click', () => {
    if (cardsModalEl) {
      const previewEl = document.getElementById('cards-modal-preview');
      if (previewEl) {
        previewEl.innerHTML = app.renderCardsHtmlForPreview(app.selectedClassroomFilter);
      }
      cardsModalEl.style.display = 'flex';
    }
  });

  document.getElementById('close-cards-modal-btn')?.addEventListener('click', () => {
    if (cardsModalEl) cardsModalEl.style.display = 'none';
  });

  document.getElementById('print-cards-now-btn')?.addEventListener('click', () => {
    app.printIsolatedCards(app.selectedClassroomFilter);
  });

  document.getElementById('open-cards-tab-btn')?.addEventListener('click', () => {
    const targetUrl = `tarjetas_credenciales_${app.selectedClassroomFilter}.html`;
    window.open(targetUrl, '_blank');
  });

  // Cambio interactivo de tema en el selector para la Ficha A4 y el CSV
  const selectTopicEl = document.getElementById('select-active-topic');
  selectTopicEl?.addEventListener('change', (e) => {
    const selectedId = e.target.value;
    app.selectedWorksheetTopicId = selectedId;
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
        modalContent.innerHTML = app.renderWorksheetA4Html(selectedId);
      }
      const printArea = document.getElementById('worksheet-print-area');
      if (printArea) {
        printArea.innerHTML = app.renderWorksheetA4Html(selectedId);
      }

      // Actualizar gráficos estadísticos y analítica de la semana
      const analyticsContainer = document.getElementById('weekly-analytics-container');
      if (analyticsContainer) {
        analyticsContainer.innerHTML = renderWeeklyAnalyticsSection(app, selectedId, app.selectedClassroomFilter);
      }

      // Actualizar botón de vista semanal con el número de semana
      const weekBtn = document.getElementById('toggle-view-semana');
      if (weekBtn) {
        weekBtn.textContent = `📅 Semana ${topicObj.weekNumber}`;
      }

      // Actualizar filas de la tabla para reflejar la semana seleccionada
      const students = storage.getAllStudents(app.selectedClassroomFilter);
      const body = document.getElementById('students-table-body');
      const togglePins = document.getElementById('toggle-pins');
      if (body) {
        body.innerHTML = renderStudentRows(app, students, togglePins?.checked, app.tableMetricMode, selectedId);
        app.attachStudentEditEvents();
      }
    }
  });

  // Modal de Ficha de Cuaderno A4
  const modalEl = document.getElementById('worksheet-modal');
  document.getElementById('open-worksheet-modal-btn')?.addEventListener('click', () => {
    const activeOrSelected = app.selectedWorksheetTopicId || storage.getActiveTopic();
    const modalContent = document.getElementById('worksheet-modal-render-target');
    if (modalContent) {
      modalContent.innerHTML = app.renderWorksheetA4Html(activeOrSelected);
    }
    if (modalEl) modalEl.style.display = 'flex';
  });

  document.getElementById('close-worksheet-modal-btn')?.addEventListener('click', () => {
    if (modalEl) modalEl.style.display = 'none';
  });

  document.getElementById('print-worksheet-now-btn')?.addEventListener('click', () => {
    app.printIsolatedWorksheet();
  });

  // Atajo de teclado Ctrl+P cuando el modal de ficha está abierto
  if (!app._printKeyBound) {
    app._printKeyBound = true;
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        const m = document.getElementById('worksheet-modal');
        if (m && m.style.display !== 'none') {
          e.preventDefault();
          app.printIsolatedWorksheet();
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
      app.selectedWorksheetTopicId = chosenTopic;
      storage.setActiveTopic(chosenTopic);
      const topicObj = AVAILABLE_TOPICS.find(t => t.id === chosenTopic);
      feedbackEl.innerHTML = `✔️ <strong>¡Misión Semanal Actualizada!</strong> Ahora el tema activo para todos los alumnos de 4.° Sigma y 4.° Delta es: <em>${topicObj?.title || chosenTopic}</em>.`;
      feedbackEl.style.display = 'block';
      setTimeout(() => {
        app.render();
      }, 1500);
    }
  });

  app.attachStudentEditEvents();
}
