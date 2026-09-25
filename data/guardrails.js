// ==============================================================
// GUARDRAILS DEL PROGRAMA - EXPEDICIÓN MATEMÁTICA
// Reglas e Invariantes que el código DEBE cumplir siempre
// Metodología: Finlandia (Eduten/ViLLE) + Santillana + MINEDU
// ==============================================================

export const REQUIRED_DIFFICULTY_KEYS = ['confusion', 'jump', 'calc', 'clean'];
export const REQUIRED_STATION_KEYS = ['s1', 's2', 's3', 'sDiam'];

export class CurriculumGuardrailError extends Error {
  constructor(message, topicId) {
    super(`[GUARDRAIL ERROR - Tema "${topicId || 'desconocido'}"]: ${message}`);
    this.name = 'CurriculumGuardrailError';
    this.topicId = topicId;
  }
}

export class GradeIsolationError extends Error {
  constructor(message) {
    super(`[GUARDRAIL ERROR - Aislamiento de Grado]: ${message}`);
    this.name = 'GradeIsolationError';
  }
}

/**
 * Guardrail 1: Validación e Inmunización de cada Tema Curricular
 * Verifica que cada tema contenga los metadatos, estaciones y dificultades obligatorias.
 * Si falta algún dato no crítico, auto-repara con valores por defecto seguros para evitar pantallas blancas.
 */
export function sanitizeAndValidateTopic(topic) {
  if (!topic || typeof topic !== 'object') {
    throw new CurriculumGuardrailError('El objeto del tema no es válido o está vacío.');
  }

  const id = topic.id || 'tema-sin-id';

  // 1. Identidad obligatoria
  if (!topic.title || typeof topic.title !== 'string') {
    throw new CurriculumGuardrailError('El tema debe tener un "title" válido.', id);
  }
  if (!topic.weekNumber || typeof topic.weekNumber !== 'number') {
    console.warn(`[Guardrail Warning]: Tema "${id}" no tiene "weekNumber" numérico. Asignando 1.`);
    topic.weekNumber = 1;
  }
  if (!topic.bimestre) {
    topic.bimestre = 3;
    topic.bimestreName = "3.° Bimestre";
  }

  // 2. Título de ficha de cuaderno A4
  if (!topic.worksheetTitle) {
    topic.worksheetTitle = `${topic.bimestreName} • ${topic.title}`;
  }

  // 3. Estaciones obligatorias (4 estaciones)
  if (!topic.stationNames || typeof topic.stationNames !== 'object') {
    console.warn(`[Guardrail Warning]: Tema "${id}" no define "stationNames". Inyectando plantilla estándar.`);
    topic.stationNames = {
      s1: 'Estación 1: Detección Conceptual',
      s2: 'Estación 2: Práctica Procedimental',
      s3: 'Estación 3: Consolidación (Oro)',
      sDiam: 'Reto Diamante: Problemas Aplicados'
    };
  } else {
    for (const key of REQUIRED_STATION_KEYS) {
      if (!topic.stationNames[key]) {
        console.warn(`[Guardrail Warning]: Tema "${id}" carece de nombre para estación "${key}". Auto-reparando.`);
        topic.stationNames[key] = `Estación ${key.toUpperCase()}`;
      }
    }
  }

  // 4. Dificultades diagnósticas obligatorias (4 categorías Turku/Eduten)
  if (!Array.isArray(topic.difficulties) || topic.difficulties.length !== 4) {
    console.warn(`[Guardrail Warning]: Tema "${id}" no tiene exactamente 4 dificultades. Auto-reparando con plantilla estándar.`);
    topic.difficulties = [
      { id: "confusion", label: "Confusión Conceptual Inicial", color: "#ef4444" },
      { id: "jump", label: "Falla en Procedimiento Intermedio", color: "#f59e0b" },
      { id: "calc", label: "Dificultad en Cálculo o Reversibilidad", color: "#3b82f6" },
      { id: "clean", label: "Dominio Fluido sin tropiezos", color: "var(--neon-green)" }
    ];
  } else {
    // Validar claves canónicas
    const presentKeys = topic.difficulties.map(d => d.id);
    for (const reqKey of REQUIRED_DIFFICULTY_KEYS) {
      if (!presentKeys.includes(reqKey)) {
        throw new CurriculumGuardrailError(`Falta la dificultad requerida "${reqKey}" en difficulties.`, id);
      }
    }
  }

  return topic;
}

/**
 * Guardrail 2: Validador del Curriculum Completo al arrancar el programa
 */
export function validateFullCurriculum(topics = []) {
  if (!Array.isArray(topics) || topics.length === 0) {
    throw new CurriculumGuardrailError('El listado de temas AVAILABLE_TOPICS está vacío.');
  }

  const validatedTopics = topics.map(t => sanitizeAndValidateTopic(t));
  console.log(`🛡️ [GUARDRAILS ACTIVO]: ${validatedTopics.length} temas curriculares validados y protegidos contra fallos.`);
  return validatedTopics;
}

/**
 * Guardrail 3: Aislamiento estricto de Grado (Intra-Grade Rule)
 * Prohíbe cualquier operación de comparación o mezcla entre salones de grados distintos.
 */
export function assertGradeIsolation(gradeA, gradeB) {
  if (gradeA && gradeB && gradeA !== gradeB) {
    throw new GradeIsolationError(`Violación de aislamiento pedagógico: No está permitido comparar o agregar grado "${gradeA}" con grado "${gradeB}".`);
  }
  return true;
}

/**
 * Guardrail 4: Integridad de datos de Alumnos
 * Garantiza que ningún alumno tenga campos indefinidos que puedan romper la interfaz.
 */
export function sanitizeStudentRecord(s) {
  if (!s || typeof s !== 'object') return null;
  return {
    id: s.id || `stu-${Math.random().toString(36).substr(2, 6)}`,
    num: typeof s.num === 'number' ? s.num : 0,
    name: s.name || 'Estudiante Sin Nombre',
    displayName: s.displayName || s.name || 'Estudiante',
    username: s.username || `user.${s.num || 0}`,
    pin: s.pin ? String(s.pin) : '1234',
    classroom: s.classroom === 'delta' ? 'delta' : 'sigma',
    avatar: s.avatar || 'robot',
    stars: typeof s.stars === 'number' ? s.stars : 0,
    timeMinutes: typeof s.timeMinutes === 'number' ? s.timeMinutes : 0,
    trophies: typeof s.trophies === 'object' && s.trophies !== null ? s.trophies : { patrones: 'ninguno' },
    stationProgress: typeof s.stationProgress === 'object' && s.stationProgress !== null ? s.stationProgress : {}
  };
}

/**
 * Guardrail 5: Sanitizador Anti-XSS (Cross-Site Scripting)
 * Neutraliza caracteres potencialmente ejecutables antes de insertarlos en el DOM.
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Guardrail 6: Sanitizador y Validador de PIN
 * Asegura que el PIN solo contenga dígitos numéricos seguros de 4 dígitos.
 */
export function sanitizePin(pin) {
  if (!pin) return '1234';
  const clean = String(pin).replace(/[^0-9]/g, '');
  return clean.length >= 4 ? clean.slice(0, 4) : clean.padStart(4, '0');
}

