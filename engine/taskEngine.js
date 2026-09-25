// ==============================================================
// Expedición Matemática - Motor Pedagógico de Tareas y Preguntas
// engine/taskEngine.js
// Responsable de barajado aleatorio, preparación y validación de retos
// ==============================================================

import { validateAndAssertTaskOptions, validateScaffoldPedagogy } from '../data/guardrails.js';

/**
 * Algoritmo Fisher-Yates (Knuth) para barajar arrays de forma equitativa y sin sesgo
 * Retorna una NUEVA copia del array para no mutar el origen de datos.
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
export function shuffleArray(array) {
  if (!Array.isArray(array) || array.length <= 1) {
    return Array.isArray(array) ? [...array] : [];
  }

  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Prepara una tarea individual para su despliegue ante el estudiante:
 * - Clona la estructura de la tarea
 * - Valida que la pista de apoyo no regale la respuesta (Guardrail 11)
 * - Baraja aleatoriamente sus alternativas si existen (previniendo sesgo posicional)
 * - Valida la integridad curricular (la respuesta correcta debe seguir presente)
 * @param {Object} rawTask
 * @returns {Object}
 */
export function prepareTask(rawTask) {
  if (!rawTask || typeof rawTask !== 'object') {
    return rawTask;
  }

  const task = { ...rawTask };

  // Guardrail 11: Validar que la pista pedagógica no filtre la solución numérica
  validateScaffoldPedagogy(task);

  // Si la pregunta tiene alternativas múltiples, barajarlas aleatoriamente
  if (Array.isArray(rawTask.options)) {
    task.options = shuffleArray(rawTask.options);
    validateAndAssertTaskOptions(task);
  }

  return task;
}

/**
 * Prepara una estación completa con todas sus tareas listas y barajadas para la sesión:
 * @param {Object} station
 * @returns {Object}
 */
export function prepareStationTasks(station) {
  if (!station || typeof station !== 'object') {
    return station;
  }

  const prepared = { ...station };
  if (Array.isArray(station.tasks)) {
    prepared.tasks = station.tasks.map(task => prepareTask(task));
  }
  return prepared;
}
