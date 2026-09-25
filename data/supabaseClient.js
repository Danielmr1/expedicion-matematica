// Supabase REST Client ultra-ligero (Zero-dependencies, 100% nativo vía fetch)
export const SUPABASE_CONFIG = {
  url: "https://bpffczohkcpoxyhzvdru.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZmZjem9oa2Nwb3h5aHp2ZHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NTIyNTQsImV4cCI6MjEwMjIyODI1NH0.H9jTZ_oeU5KRXdDOe1ZWwv1sxfL2hN4LdPO64pkYPBA"
};

const AVATARS = ['condor', 'vicuna', 'chasqui', 'delfin', 'puma', 'alpaca'];

function getHeaders() {
  return {
    "apikey": SUPABASE_CONFIG.anonKey,
    "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`,
    "Content-Type": "application/json"
  };
}

/**
 * Carga todos los alumnos reales desde Supabase junto con su salón y credencial (PIN)
 */
export async function fetchStudentsFromSupabase() {
  const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/alumnos?select=id,salon_id,nombres,apellidos,salones(id,nombre),eduten_credenciales(username,pin)&order=salon_id,apellidos,nombres`;
  
  const res = await fetch(endpoint, {
    headers: getHeaders()
  });

  if (!res.ok) {
    throw new Error(`Error Supabase al cargar alumnos: ${res.statusText}`);
  }

  const rows = await res.json();

  let sigmaCount = 0;
  let deltaCount = 0;

  return rows.map((r) => {
    const isSigma = r.salon_id === 1;
    const num = isSigma ? ++sigmaCount : ++deltaCount;
    const cred = Array.isArray(r.eduten_credenciales) ? r.eduten_credenciales[0] : r.eduten_credenciales;

    const cleanNombres = (r.nombres || '').trim();
    const cleanApellidos = (r.apellidos || '').trim();
    const primerNombre = cleanNombres.split(' ')[0] || cleanNombres;
    const primerApellidoInicial = cleanApellidos ? cleanApellidos.charAt(0).toUpperCase() + '.' : '';
    const safeDisplayName = `${primerNombre} ${primerApellidoInicial}`.trim();

    return {
      id: String(r.id),
      dbId: r.id,
      num: num,
      classroom: isSigma ? 'sigma' : 'delta',
      classroomName: isSigma ? '4.° Sigma' : '4.° Delta',
      name: `${cleanApellidos}, ${cleanNombres}`.trim(),
      displayName: safeDisplayName,
      firstName: primerNombre,
      nombres: cleanNombres,
      apellidos: cleanApellidos,
      username: cred?.username || '',
      pin: cred?.pin || '',
      avatar: AVATARS[num % AVATARS.length],
      stars: 0,
      xp: 0,
      trophies: { patrones: "ninguno" },
      stationProgress: {},
      completedChallenges: [],
      activeSeconds: 0,
      timeMinutes: 0,
      lastActive: 'Sin actividad'
    };
  });
}

/**
 * Carga el progreso acumulado de todos los estudiantes desde eduten_progreso
 */
export async function fetchProgressFromSupabase() {
  const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/eduten_progreso?select=*`;
  const res = await fetch(endpoint, { headers: getHeaders() });
  if (!res.ok) {
    console.warn("No se pudo cargar progreso de Supabase:", res.statusText);
    return [];
  }
  return await res.json();
}

/**
 * Carga el tema activo semanal configurado por el profesor
 */
export async function fetchActiveTopicFromSupabase() {
  const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/eduten_configuracion?clave=eq.tema_activo`;
  const res = await fetch(endpoint, { headers: getHeaders() });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0]?.valor || null;
}

/**
 * Guarda o actualiza el tema activo en Supabase
 */
export async function setActiveTopicInSupabase(topicId) {
  const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/eduten_configuracion?on_conflict=clave`;
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        clave: "tema_activo",
        valor: topicId,
        updated_at: new Date().toISOString()
      })
    });
  } catch (err) {
    console.error("Error al sincronizar tema activo en Supabase:", err);
  }
}

/**
 * Guarda o actualiza el progreso de una estación para un alumno en Supabase
 */
export async function saveStationProgressToSupabase(studentDbId, topicId, stationId, progressData) {
  const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/eduten_progreso?on_conflict=alumno_id,tema_id,estacion_id`;
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        alumno_id: Number(studentDbId),
        tema_id: topicId || "patrones-multiplicativos",
        estacion_id: stationId,
        score: progressData.correctCount || 0,
        completed: Boolean(progressData.completed),
        attempts: (progressData.correctCount || 0) + (progressData.errorCount || 0),
        errors: progressData.errorCount || 0,
        time_seconds: progressData.timeSpentSec || 0,
        trophies: progressData.trophies || [],
        updated_at: new Date().toISOString()
      })
    });
  } catch (err) {
    console.error("Error al sincronizar progreso con Supabase:", err);
  }
}

/**
 * Actualiza el PIN de un alumno en Supabase
 */
export async function updateStudentPinInSupabase(studentDbId, newPin) {
  const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/eduten_credenciales?alumno_id=eq.${studentDbId}`;
  try {
    await fetch(endpoint, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        pin: String(newPin).trim()
      })
    });
  } catch (err) {
    console.error("Error al actualizar PIN en Supabase:", err);
  }
}
