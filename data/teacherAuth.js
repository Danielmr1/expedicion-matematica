// =============================================================================
// SISTEMA DE SEGURIDAD DOCENTE: ROTACIÓN MENSUAL CON HASHING SHA-256 (2026)
// Colegio La Salle School • 4.° Grado de Primaria
// Criptografía unidireccional: Las contraseñas NO residen en texto plano en el código.
// Solo se comparan huellas matemáticas SHA-256 irreversibles.
// =============================================================================

// Hash SHA-256 de la clave maestra permanente ("Doc4Peru")
export const MASTER_EMERGENCY_HASH = "e6d1f4a074f53a5639ba27736f0e755af692d8c21a61d829254be9fa7e065f45";

// Calendario de Hashes SHA-256 por mes (2026)
// Las claves originales permanecen únicamente en el archivo privado del docente (claves_docente_2026.txt)
export const TEACHER_MONTHLY_SCHEDULE_2026 = [
  { month: 1, name: 'Enero', year: 2026, hash: 'c443ca297fe3477d550df81045b53d73df0daac36d67cbb23f9a9a697f3f5bfd', note: 'Vacaciones de verano' },
  { month: 2, name: 'Febrero', year: 2026, hash: '7cf947fa50b1e8f402a60951a80fe3ef2ba9088acd9657d46ca7827c5e279dd0', note: 'Planificación docente' },
  { month: 3, name: 'Marzo', year: 2026, hash: '5a78830a55d496f97e8b1af3df178481a9ae675213a4822eb68204dce9b454b0', note: 'Inicio Año Escolar 2026' },
  { month: 4, name: 'Abril', year: 2026, hash: '328a58c8bb32951b4ef1bcc5b15e0f700e5ccdd687ec55fa8196c4b1a8da58df', note: 'Ciclo Bimestre 1' },
  { month: 5, name: 'Mayo', year: 2026, hash: '264b4a6c2d706ae4525ba6ad827dcde43ed67cb91b3f8895a35ff475f3cef3c5', note: 'Ciclo Bimestre 1' },
  { month: 6, name: 'Junio', year: 2026, hash: '52fc27ed1a778144f93d648f134439df066ecf9b9c4ad1c91971e60433f64430', note: 'Ciclo Bimestre 2' },
  { month: 7, name: 'Julio', year: 2026, hash: '2d06dc79ae6cd6cf7f6cf446c365539c7687ef858a20b4138c1d18aadf39f715', note: 'Vacaciones de medio año' },
  { month: 8, name: 'Agosto', year: 2026, hash: 'd7d5e1416def49d9f079ee2718ce6f631deda68254a4d464dc279c43674d2c3c', note: 'Ciclo Bimestre 3' },
  { month: 9, name: 'Setiembre', year: 2026, hash: 'fb26f01d22a8506ad5ee396eb8549e79e7a0c4392b7d76645335800eb0962f44', note: 'Ciclo Bimestre 3 (Mes Actual)' },
  { month: 10, name: 'Octubre', year: 2026, hash: '0b792dce4394d1b304bd826df418d3d21359724ebc8fa26ddf60cf965cdc37ee', note: 'Ciclo Bimestre 4' },
  { month: 11, name: 'Noviembre', year: 2026, hash: 'a89f90e47b071d1bc68615dc29a80c79204046f8848b6d242d6439d2bdca3864', note: 'Ciclo Bimestre 4' },
  { month: 12, name: 'Diciembre', year: 2026, hash: 'ed0864a98bfcdd9e90c13291516208341a1bba8e8386754efc4be0270ea493b3', note: 'Clausura Año Escolar' }
];

/**
 * Función criptográfica estándar SHA-256 nativa (WebCrypto API)
 */
export async function computeSha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Obtiene la configuración del mes activo según la fecha dada (o actual)
 */
export function getCurrentTeacherSchedule(date = new Date()) {
  const m = date.getMonth() + 1; // 1 = Enero, 9 = Setiembre, 12 = Diciembre
  const found = TEACHER_MONTHLY_SCHEDULE_2026.find(item => item.month === m);
  return found || TEACHER_MONTHLY_SCHEDULE_2026[8]; // Fallback Setiembre
}

/**
 * Valida la clave ingresada mediante comparación segura de Hashes SHA-256.
 * Acepta:
 * 1. Clave del mes actual.
 * 2. Clave del mes anterior durante los primeros 5 días del mes (margen de cortesía).
 * 3. Clave maestra de emergencia ("Doc4Peru").
 */
export async function validateTeacherPassword(inputPass, date = new Date()) {
  if (!inputPass) return false;
  const trimmed = inputPass.trim();
  const inputHash = await computeSha256(trimmed);

  // 1. Clave maestra permanente
  if (inputHash === MASTER_EMERGENCY_HASH) return true;

  // 2. Clave del mes en curso
  const current = getCurrentTeacherSchedule(date);
  if (current && inputHash === current.hash) return true;

  // 3. Cortesía primeros 5 días: acepta también clave del mes anterior
  const dayOfMonth = date.getDate();
  if (dayOfMonth <= 5) {
    const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 15);
    const prev = getCurrentTeacherSchedule(prevMonthDate);
    if (prev && inputHash === prev.hash) return true;
  }

  return false;
}
