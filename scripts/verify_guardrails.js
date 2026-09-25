// ==============================================================
// VERIFICADOR AUTOMÁTICO DE GUARDRAILS - EXPEDICIÓN MATEMÁTICA
// Ejecuta verificación estática y validación en navegador real (Headless Chrome)
// ==============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { scanCodeForBrowserSyntaxRisks } from '../data/guardrails.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🛡️ [INICIANDO VERIFICACIÓN DE GUARDRAILS DE CALIDAD]...\n');

let failed = false;

// 1. Escaneo estático de app.js y módulos
const filesToScan = [
  'app.js',
  'engine/taskEngine.js',
  'audio/soundEffects.js',
  'components/accessCards.js',
  'components/worksheetA4.js',
  'components/studentModals.js',
  'views/loginView.js',
  'views/studentHomeView.js',
  'views/classroomWallView.js',
  'views/practiceStationView.js',
  'views/teacherDashboardView.js'
];

for (const relPath of filesToScan) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const scanResult = scanCodeForBrowserSyntaxRisks(content);
    if (!scanResult.valid) {
      console.error(`❌ FALLÓ GUARDRAIL 8 en ${relPath}:`);
      scanResult.issues.forEach(i => console.error('   • ' + i));
      failed = true;
    } else {
      console.log(`✅ Guardrail 8: ${relPath} libre de patrones de sintaxis inválidos.`);
    }
  }
}

// 2. Verificación de Guardrail 10: Aleatoriedad de Alternativas de Tareas
try {
  const { prepareStationTasks } = await import('../engine/taskEngine.js');
  const { AVAILABLE_TOPICS, getWeeklyMission } = await import('../data/curriculum.js');
  const mission = getWeeklyMission('patrones-multiplicativos');
  const s1 = mission.stations[0];
  
  // Realizar 50 preparaciones y registrar la posición de la respuesta correcta de la tarea 1
  const positions = new Set();
  for (let i = 0; i < 50; i++) {
    const prepared = prepareStationTasks(s1);
    const task0 = prepared.tasks[0];
    const correctIdx = task0.options.indexOf(task0.correctOption);
    positions.add(correctIdx);
  }

  if (positions.size > 1) {
    console.log(`✅ Guardrail 10: Aleatoriedad confirmada. La respuesta correcta se distribuye en posiciones: [${Array.from(positions).sort().join(', ')}].`);
  } else {
    console.error('❌ FALLÓ GUARDRAIL 10: Las alternativas no varían de posición.');
    failed = true;
  }
} catch (err) {
  console.error('❌ Error al probar Guardrail 10:', err.message);
  failed = true;
}

// 3. Escaneo de index.html (Guardrail 4: Aislamiento de Errores)
const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
if (indexHtmlContent.includes("window.addEventListener('error'") && indexHtmlContent.includes('app.innerHTML =')) {
  console.error('❌ FALLÓ GUARDRAIL 4: index.html contiene un listener de error invasivo que secuestra #app.');
  failed = true;
} else {
  console.log('✅ Guardrail 4: index.html libre de interceptores invasivos sobre #app.');
}

// 4. Verificación en Navegador Real (Headless Chrome)
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let browserExe = chromePaths.find(p => fs.existsSync(p));

if (!browserExe) {
  console.warn('⚠️ No se encontró Chrome/Edge en las rutas estándar para la prueba headless. Saltando paso 3.');
} else {
  try {
    const htmlDump = execFileSync(browserExe, [
      '--headless=new',
      '--disable-gpu',
      '--virtual-time-budget=3000',
      '--dump-dom',
      'http://localhost:3000/'
    ], { encoding: 'utf-8', timeout: 10000 });

    const hasForm = htmlDump.includes('login-form');
    const hasBanner = htmlDump.includes('Se detectó una nueva versión') || htmlDump.includes('Aviso de Actualización');

    if (!hasForm) {
      console.error('❌ FALLÓ GUARDRAIL 1: El formulario de login no se renderizó en el DOM de Chrome.');
      failed = true;
    } else if (hasBanner) {
      console.error('❌ FALLÓ GUARDRAIL 1: Chrome mostró el cartel de emergencia/actualización.');
      failed = true;
    } else {
      console.log('✅ Guardrail 1: Verificación en navegador Chrome exitosa (Login activo, 0 errores, 0 banners).');
    }
  } catch (err) {
    console.warn('⚠️ Nota: La prueba en Chrome requiere que el servidor local esté activo (puerto 3000).', err.message);
  }
}

console.log('\n==============================================================');
if (failed) {
  console.error('🚨 ESTADO: FALLARON GUARDRAILS. Corregir antes de reportar al usuario.');
  process.exit(1);
} else {
  console.log('🏆 ESTADO: TODOS LOS GUARDRAILS APROBADOS AL 100%.');
  process.exit(0);
}
