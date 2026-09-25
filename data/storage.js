import { INITIAL_STUDENTS, DEFAULT_TEACHER } from './students.js';
import { AVAILABLE_TOPICS } from './curriculum.js';
import { validateTeacherPassword, getCurrentTeacherSchedule } from './teacherAuth.js';
import {
  fetchStudentsFromSupabase,
  fetchProgressFromSupabase,
  fetchActiveTopicFromSupabase,
  setActiveTopicInSupabase,
  saveStationProgressToSupabase,
  updateStudentPinInSupabase
} from './supabaseClient.js';

// Versión 4: Conexión Híbrida Offline-First con Supabase
const STORAGE_KEYS = {
  STUDENTS: 'expedicion_supabase_students_v4',
  TEACHER: 'expedicion_peru_teacher_v3',
  CURRENT_USER: 'expedicion_peru_current_user_v3',
  ATTEMPTS: 'expedicion_peru_attempts_v3',
  ACTIVE_TOPIC: 'expedicion_supabase_topic_v4'
};

class StorageManager {
  constructor() {
    this.students = [];
    this.teacher = DEFAULT_TEACHER;
    this.currentUser = null;
    this.attempts = [];
    this.isSyncing = false;
    this.onDataUpdated = null;
    this.init();
    // Iniciar sincronización inmediata con Supabase en segundo plano
    this.syncWithSupabase();
  }

  init() {
    try {
      const storedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (storedStudents) {
        this.students = JSON.parse(storedStudents);
      } else {
        this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
        this.saveStudents();
      }

      const storedTeacher = localStorage.getItem(STORAGE_KEYS.TEACHER);
      if (storedTeacher) {
        this.teacher = JSON.parse(storedTeacher);
      } else {
        this.teacher = { ...DEFAULT_TEACHER };
        this.saveTeacher();
      }

      const storedAttempts = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (storedAttempts) {
        this.attempts = JSON.parse(storedAttempts);
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.warn("Storage init warning (fallback in-memory):", e);
      this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
      this.teacher = { ...DEFAULT_TEACHER };
    }
  }

  /**
   * Sincronización transparente con Supabase (Carga alumnos reales + progreso remoto)
   */
  async syncWithSupabase() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      console.log("🔄 Sincronizando con Supabase...");
      const remoteStudents = await fetchStudentsFromSupabase();
      if (remoteStudents && remoteStudents.length > 0) {
        const [progressList, activeTopic] = await Promise.all([
          fetchProgressFromSupabase(),
          fetchActiveTopicFromSupabase()
        ]);

        if (progressList && progressList.length > 0) {
          const progressByStudent = {};
          progressList.forEach(p => {
            const sid = String(p.alumno_id);
            if (!progressByStudent[sid]) progressByStudent[sid] = [];
            progressByStudent[sid].push(p);
          });

          remoteStudents.forEach(st => {
            const plist = progressByStudent[st.id] || [];
            st.stationProgress = st.stationProgress || {};
            let totalStars = 0;
            let totalSec = 0;
            const completed = [];

            plist.forEach(p => {
              st.stationProgress[p.estacion_id] = {
                completed: p.completed,
                correctCount: p.score || 0,
                errorCount: p.errors || 0,
                timeSpentSec: p.time_seconds || 0,
                trophies: p.trophies || []
              };
              totalStars += (p.score || 0);
              totalSec += (p.time_seconds || 0);
              if (p.completed) completed.push(p.estacion_id);
            });

            st.stars = totalStars;
            st.xp = totalStars * 15;
            st.activeSeconds = totalSec;
            st.timeMinutes = Math.max(0, Math.round(totalSec / 60));
            st.completedChallenges = completed;

            let trophy = 'ninguno';
            if (completed.includes('estacion-diamante') || totalStars >= 29) trophy = 'diamante';
            else if (completed.includes('estacion-3') || totalStars >= 26) trophy = 'oro';
            else if (completed.includes('estacion-2') || totalStars >= 18) trophy = 'plata';
            else if (completed.includes('estacion-1') || totalStars >= 8) trophy = 'bronce';
            st.trophies = { patrones: trophy };
          });
        }

        this.students = remoteStudents;
        this.saveStudents();
        console.log(`✅ Sincronizado con éxito: ${this.students.length} alumnos de Supabase listos.`);

        if (activeTopic) {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_TOPIC, activeTopic);
        }

        if (typeof this.onDataUpdated === 'function') {
          this.onDataUpdated();
        }
      }
    } catch (err) {
      console.warn("⚠️ Conexión con Supabase no disponible en este momento, usando caché local:", err);
    } finally {
      this.isSyncing = false;
    }
  }

  saveStudents() {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
    } catch (e) {
      console.error("Error saving students:", e);
    }
  }

  saveTeacher() {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(this.teacher));
    } catch (e) {
      console.error("Error saving teacher:", e);
    }
  }

  saveAttempts() {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(this.attempts));
    } catch (e) {
      console.error("Error saving attempts:", e);
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async login(username, pinOrPassword) {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (pinOrPassword || '').trim();

    // 1. Verificación Docente (Criptografía Hash SHA-256 o clave maestra)
    const isTeacherUser = (cleanUser === 'profesor' || cleanUser === (this.teacher.username || '').toLowerCase());
    if (isTeacherUser && (await validateTeacherPassword(cleanPass))) {
      const activeSched = getCurrentTeacherSchedule();
      const userObj = { ...this.teacher, isTeacher: true, activeSchedule: activeSched };
      this.setCurrentUser(userObj);
      return { success: true, user: userObj, role: 'teacher' };
    }

    // Check students
    const student = this.students.find(
      s => s.username.toLowerCase() === cleanUser && s.pin === cleanPass
    );

    if (student) {
      student.lastActive = 'Hoy';
      this.saveStudents();
      const userObj = { ...student, isTeacher: false };
      this.setCurrentUser(userObj);
      return { success: true, user: userObj, role: 'student' };
    }

    return {
      success: false,
      message: 'Usuario o clave incorrecta. Por favor revisa tus credenciales.'
    };
  }

  logout() {
    this.setCurrentUser(null);
  }

  recordChallengeAttempt(studentId, challengeData) {
    const attempt = {
      id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      studentId,
      timestamp: new Date().toISOString(),
      ...challengeData
    };

    this.attempts.push(attempt);
    this.saveAttempts();

    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.timeMinutes = (student.timeMinutes || 0) + (challengeData.durationMinutes || 1);
      student.lastActive = 'Hoy';

      if (challengeData.isCorrect) {
        student.stars = (student.stars || 0) + (challengeData.starsAwarded || 1);
        student.xp = (student.xp || 0) + (challengeData.xpAwarded || 10);
        student.completedChallenges = student.completedChallenges || [];
        if (!student.completedChallenges.includes(challengeData.challengeId)) {
          student.completedChallenges.push(challengeData.challengeId);
        }
      }

      student.trophies = student.trophies || {};
      const totalStars = student.stars || 0;
      let newTrophy = 'ninguno';
      if (totalStars >= 29) newTrophy = 'diamante';
      else if (totalStars >= 26) newTrophy = 'oro';
      else if (totalStars >= 18) newTrophy = 'plata';
      else if (totalStars >= 8) newTrophy = 'bronce';

      student.trophies['patrones'] = newTrophy;

      this.saveStudents();
      if (this.currentUser && this.currentUser.id === studentId) {
        this.currentUser = { ...student, isTeacher: false };
        this.setCurrentUser(this.currentUser);
      }
    }

    return attempt;
  }

  // Eduten Station & Micro-Task Tracking
  getStudentStationProgress(studentId, stationId) {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return { completed: false, currentTask: 0, stars: 0 };
    student.stationProgress = student.stationProgress || {};
    return student.stationProgress[stationId] || { completed: false, currentTask: 0, stars: 0 };
  }

  recordTaskAttempt(studentId, taskData) {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return null;

    student.stationProgress = student.stationProgress || {};
    const sp = student.stationProgress[taskData.stationId] || {
      completed: false,
      currentTask: 0,
      correctCount: 0,
      errorCount: 0,
      mistakes: []
    };

    const isFirstTry = taskData.attemptNumber === 1;

    if (taskData.isCorrect) {
      sp.correctCount = (sp.correctCount || 0) + 1;
      student.stars = (student.stars || 0) + 1;
      student.xp = (student.xp || 0) + (isFirstTry ? 15 : 10);
      sp.currentTask = taskData.taskIndex + 1;
    } else {
      sp.errorCount = (sp.errorCount || 0) + 1;
      if (taskData.chosenAnswer) {
        sp.mistakes = sp.mistakes || [];
        sp.mistakes.push({
          taskId: taskData.taskId,
          chosen: taskData.chosenAnswer,
          correct: taskData.correctAnswer,
          time: new Date().toISOString()
        });
      }
    }

    if (taskData.timeSpentSec) {
      student.activeSeconds = (student.activeSeconds || 0) + taskData.timeSpentSec;
      student.timeMinutes = Math.max(1, Math.round(student.activeSeconds / 60));
    }
    student.lastActive = 'Hoy';

    if (taskData.isStationComplete) {
      sp.completed = true;
      student.completedChallenges = student.completedChallenges || [];
      if (!student.completedChallenges.includes(taskData.stationId)) {
        student.completedChallenges.push(taskData.stationId);
      }
    }

    student.stationProgress[taskData.stationId] = sp;

    // Update trophy
    student.trophies = student.trophies || {};
    student.completedChallenges = student.completedChallenges || [];
    const totalStars = student.stars || 0;
    let newTrophy = student.trophies['patrones'] || 'ninguno';

    if (student.completedChallenges.includes('estacion-diamante') || totalStars >= 29) {
      newTrophy = 'diamante';
    } else if (student.completedChallenges.includes('estacion-3') || totalStars >= 26) {
      newTrophy = 'oro';
    } else if (student.completedChallenges.includes('estacion-2') || totalStars >= 18) {
      newTrophy = 'plata';
    } else if (student.completedChallenges.includes('estacion-1') || totalStars >= 8) {
      newTrophy = 'bronce';
    }
    student.trophies['patrones'] = newTrophy;

    this.saveStudents();
    if (this.currentUser && this.currentUser.id === studentId) {
      this.currentUser = { ...student, isTeacher: false };
      this.setCurrentUser(this.currentUser);
    }

    // Guardado asíncrono en Supabase
    const dbId = student.dbId || student.id;
    saveStationProgressToSupabase(dbId, this.getActiveTopic(), taskData.stationId, {
      completed: sp.completed,
      correctCount: sp.correctCount,
      errorCount: sp.errorCount,
      timeSpentSec: student.activeSeconds,
      trophies: [newTrophy]
    });

    return sp;
  }

  getStudentById(id) {
    return this.students.find(s => s.id === id);
  }

  getAllStudents(classroomId = null) {
    if (!classroomId || classroomId === 'todos') {
      return this.students;
    }
    return this.students.filter(s => s.classroom === classroomId);
  }

  getClassroomStats(classroomId) {
    const list = this.getAllStudents(classroomId);
    const totalMin = list.reduce((acc, s) => acc + (s.timeMinutes || 0), 0);
    const totalStars = list.reduce((acc, s) => acc + (s.stars || 0), 0);
    const totalXp = list.reduce((acc, s) => acc + (s.xp || 0), 0);
    return {
      count: list.length,
      totalMin,
      totalStars,
      totalXp,
      avgStars: list.length ? Math.round(totalStars / list.length) : 0
    };
  }

  getWeeklyTopicStats(topicId = null, classroomId = 'todos') {
    const activeId = topicId || this.getActiveTopic();
    const students = this.getAllStudents(classroomId);

    const topicKeyMap = {
      'patrones-multiplicativos': 'patrones',
      'division-reparto': 'division',
      'fracciones-unidad': 'fracciones',
      'operaciones-combinadas': 'operaciones'
    };
    const trophyKey = topicKeyMap[activeId] || 'patrones';

    let s1 = 0, s2 = 0, s3 = 0, sDiam = 0;
    let errConf = 0, errJump = 0, errCalc = 0;
    let topicStars = 0, topicMin = 0;

    students.forEach(s => {
      const tro = s.trophies?.[trophyKey] || 'ninguno';
      const sp = s.stationProgress || {};

      if (tro === 'bronce' || tro === 'plata' || tro === 'oro' || tro === 'diamante' || sp['estacion-1']?.completed) s1++;
      if (tro === 'plata' || tro === 'oro' || tro === 'diamante' || sp['estacion-2']?.completed) s2++;
      if (tro === 'oro' || tro === 'diamante' || sp['estacion-3']?.completed) s3++;
      if (tro === 'diamante' || sp['estacion-diamante']?.completed) sDiam++;

      if (sp['estacion-1']?.errorCount > 0) errConf++;
      if (sp['estacion-2']?.errorCount > 0) errJump++;
      if (sp['estacion-3']?.errorCount > 0) errCalc++;

      topicStars += (s.stars || 0);
      topicMin += (s.timeMinutes || 0);
    });

    const count = students.length || 1;
    return {
      count,
      s1: { count: s1, pct: Math.round((s1 / count) * 100) },
      s2: { count: s2, pct: Math.round((s2 / count) * 100) },
      s3: { count: s3, pct: Math.round((s3 / count) * 100) },
      sDiam: { count: sDiam, pct: Math.round((sDiam / count) * 100) },
      errors: {
        confusion: errConf,
        jump: errJump,
        calc: errCalc,
        clean: Math.max(0, count - (errConf + errJump + errCalc))
      },
      avgStars: Math.round(topicStars / count),
      avgMin: (topicMin / count).toFixed(1)
    };
  }

  isPinTaken(pin, excludeStudentId = null) {
    const cleanPin = String(pin || '').trim();
    if (!cleanPin) return null;
    const found = this.students.find(s => s.pin === cleanPin && s.id !== excludeStudentId);
    return found || null;
  }

  generateUniquePin() {
    let pin;
    let attempts = 0;
    do {
      pin = String(Math.floor(1000 + Math.random() * 9000));
      attempts++;
    } while (this.isPinTaken(pin) && attempts < 1000);
    return pin;
  }

  cleanTextForUsername(text = '') {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  generateUniqueUsername(firstName = '', lastName = '', excludeStudentId = null) {
    const fPart = this.cleanTextForUsername(firstName.trim().split(' ')[0]) || 'alumno';
    const lPart = this.cleanTextForUsername(lastName.trim().split(' ')[0]) || 'estudiante';
    const base = `${fPart}.${lPart}`;
    
    let candidate = base;
    let counter = 2;
    while (this.students.some(s => s.username === candidate && s.id !== excludeStudentId)) {
      candidate = `${base}${counter}`;
      counter++;
    }
    return candidate;
  }

  reorderClassroom(classroom) {
    if (!classroom) return;
    const classStudents = this.students.filter(s => s.classroom === classroom);
    const otherStudents = this.students.filter(s => s.classroom !== classroom);

    classStudents.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' }));
    classStudents.forEach((s, idx) => {
      s.num = idx + 1;
    });

    this.students = [...classStudents, ...otherStudents];
  }

  addStudent({ lastName, firstName, classroom, pin, avatar = null }) {
    const cleanLast = (lastName || '').trim();
    const cleanFirst = (firstName || '').trim();
    const fullName = `${cleanLast}, ${cleanFirst}`;
    const cleanPin = String(pin || this.generateUniquePin()).trim();
    const username = this.generateUniqueUsername(cleanFirst, cleanLast);
    const id = `${classroom}-${Date.now()}`;
    const defaultAvatars = ['condor', 'vicuna', 'chasqui', 'delfin', 'puma', 'alpaca'];
    const chosenAvatar = avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const newStudent = {
      id,
      num: 99,
      classroom,
      name: fullName,
      displayName: `${cleanFirst} ${cleanLast.split(' ')[0]}`,
      firstName: cleanFirst,
      username,
      pin: cleanPin,
      avatar: chosenAvatar,
      stars: 0,
      xp: 0,
      timeMinutes: 0,
      activeSeconds: 0,
      completedChallenges: [],
      stationProgress: {},
      trophies: { patrones: 'ninguno' }
    };

    this.students.push(newStudent);
    this.reorderClassroom(classroom);
    this.saveStudents();
    return newStudent;
  }

  updateStudentFull(studentId, { lastName, firstName, pin, customUsername = null }) {
    const student = this.getStudentById(studentId);
    if (!student) return null;

    const cleanLast = (lastName || '').trim();
    const cleanFirst = (firstName || '').trim();
    const oldParts = (student.name || '').split(',');
    const oldFirst = (student.firstName || (oldParts[1] || '').trim()).split(' ')[0].toLowerCase();
    const oldLast = (oldParts[0] || '').trim().split(' ')[0].toLowerCase();

    const newFirst = cleanFirst.split(' ')[0].toLowerCase();
    const newLast = cleanLast.split(' ')[0].toLowerCase();

    // Solo actualizar username si cambiaron el primer nombre o el apellido paterno principal
    let newUsername = student.username;
    if (customUsername && customUsername.trim()) {
      newUsername = this.cleanTextForUsername(customUsername);
    } else if (newFirst !== oldFirst || newLast !== oldLast) {
      newUsername = this.generateUniqueUsername(cleanFirst, cleanLast, studentId);
    }

    student.name = `${cleanLast}, ${cleanFirst}`;
    student.firstName = cleanFirst;
    student.displayName = `${cleanFirst} ${cleanLast.split(' ')[0]}`;
    student.username = newUsername;
    if (pin) student.pin = String(pin).trim();

    this.reorderClassroom(student.classroom);
    this.saveStudents();

    if (student.pin) {
      const dbId = student.dbId || student.id;
      updateStudentPinInSupabase(dbId, student.pin);
    }

    return student;
  }

  deleteStudentPermanent(studentId) {
    const idx = this.students.findIndex(s => s.id === studentId);
    if (idx === -1) return false;

    const classroom = this.students[idx].classroom;
    this.students.splice(idx, 1);
    this.reorderClassroom(classroom);
    this.saveStudents();
    return true;
  }

  updateStudent(updatedStudent) {
    const idx = this.students.findIndex(s => s.id === updatedStudent.id);
    if (idx !== -1) {
      this.students[idx] = { ...this.students[idx], ...updatedStudent };
      this.saveStudents();
      
      // Sincronizar PIN si fue editado
      if (updatedStudent.pin) {
        const dbId = updatedStudent.dbId || updatedStudent.id;
        updateStudentPinInSupabase(dbId, updatedStudent.pin);
      }
      return true;
    }
    return false;
  }

  resetAllData() {
    this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    this.teacher = { ...DEFAULT_TEACHER };
    this.attempts = [];
    this.saveStudents();
    this.saveTeacher();
    this.saveAttempts();
  }

  generateCSV(classroomId = null, topicId = null) {
    const list = this.getAllStudents(classroomId);
    const activeTopicId = topicId || this.getActiveTopic();
    const topicObj = AVAILABLE_TOPICS.find(t => t.id === activeTopicId) || { title: 'Semana 1: Patrones Multiplicativos' };
    
    const topicKeyMap = {
      'patrones-multiplicativos': 'patrones',
      'division-reparto': 'division',
      'fracciones-unidad': 'fracciones',
      'operaciones-combinadas': 'operaciones'
    };
    const trophyKey = topicKeyMap[activeTopicId] || 'patrones';

    const headers = [
      'N°',
      'Salón',
      'Apellidos y Nombres',
      'Usuario',
      'Clave PIN',
      'Tiempo Práctica (min)',
      'Estrellas',
      'Puntos XP',
      `Emblema (${topicObj.title.split(':')[0]})`,
      'Misión Evaluada',
      'Último Acceso'
    ];

    const rows = list.map(s => {
      const tro = s.trophies?.[trophyKey] || s.trophies?.patrones || 'ninguno';
      return [
        s.num,
        s.classroom === 'sigma' ? '"4.° Sigma"' : '"4.° Delta"',
        `"${s.name}"`,
        s.username,
        s.pin,
        s.timeMinutes || 0,
        s.stars || 0,
        s.xp || 0,
        `"${tro.toUpperCase()}"`,
        `"${topicObj.title}"`,
        `"${s.lastActive}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csvContent;
  }

  getActiveTopic() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_TOPIC) || 'patrones-multiplicativos';
    } catch (e) {
      return 'patrones-multiplicativos';
    }
  }

  setActiveTopic(topicId) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TOPIC, topicId);
      setActiveTopicInSupabase(topicId);
    } catch (e) {
      console.error("Error setting active topic:", e);
    }
  }
}

export const storage = new StorageManager();
