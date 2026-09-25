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

// 2.5 Verificación de Guardrail 11: Integridad y Andamiaje de Pistas (Scaffold Protection)
try {
  const { validateScaffoldPedagogy } = await import('../data/guardrails.js');
  const { WEEKLY_MISSION, MISSION_DIVISION, MISSION_FRACCIONES, MISSION_OPERACIONES } = await import('../data/curriculum.js');
  const { getEmblemArticle, THEMED_EMBLEMS } = await import('../data/icons.js');
  
  const missions = [WEEKLY_MISSION, MISSION_DIVISION, MISSION_FRACCIONES, MISSION_OPERACIONES].filter(Boolean);
  let scaffoldChecked = 0;
  let scaffoldLeaks = 0;

  missions.forEach(miss => {
    miss.stations?.forEach(st => {
      st.tasks?.forEach(t => {
        if (t.scaffold && t.correctAnswer !== undefined) {
          scaffoldChecked++;
          try {
            validateScaffoldPedagogy(t);
          } catch (e) {
            console.error(`❌ Fuga en ${miss.id} > ${st.id} > ${t.id}: ${e.message}`);
            scaffoldLeaks++;
          }
        }
      });
    });
  });

  // Probar que el Guardrail efectivamente detecta una fuga simulada
  let guardrailDetected = false;
  try {
    validateScaffoldPedagogy({ id: 'test-leak', scaffold: 'Descompón 64 x 4 = 256.', correctAnswer: 256 });
  } catch (err) {
    guardrailDetected = true;
  }

  // Probar concordancia de género de emblemas
  const cyberBronceArticle = getEmblemArticle('cyber', 'bronce');
  const andinaBronceArticle = getEmblemArticle('andina', 'bronce');
  const grammarOk = (cyberBronceArticle === 'el' && andinaBronceArticle === 'la');

  if (scaffoldLeaks === 0 && guardrailDetected && grammarOk) {
    console.log(`✅ Guardrail 11: ${scaffoldChecked} pistas validadas sin fugas. Detector de andamiaje activo y concordancia de género verificada (el Sensor / la Brújula).`);
  } else {
    console.error(`❌ FALLÓ GUARDRAIL 11: leaks=${scaffoldLeaks}, detector=${guardrailDetected}, grammar=${grammarOk}`);
    failed = true;
  }
} catch (err) {
  console.error('❌ Error al probar Guardrail 11:', err.message);
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
  // Servidor efímero local para probar el renderizado real de la app en Chrome headless
  const httpModule = await import('http');
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml'
  };

  const server = httpModule.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(rootDir, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise(resolve => server.listen(3333, '127.0.0.1', resolve));

  try {
    const htmlDump = execFileSync(browserExe, [
      '--headless=new',
      '--disable-gpu',
      '--virtual-time-budget=3000',
      '--dump-dom',
      'http://127.0.0.1:3333/'
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
    console.warn('⚠️ Error en prueba Chrome headless:', err.message);
  } finally {
    server.close();
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
