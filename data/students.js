// Base de datos de 65 estudiantes limpios (En Cero 0% para iniciar el Ciclo 1)
// Salón 4.° A (32 alumnos) y Salón 4.° B (33 alumnos)

export const SCHOOL_INFO = {
  name: "Colegio La Salle School",
  year: "2026",
  currentBimestre: 3,
  bimestres: [
    { id: 1, name: "1.° Bimestre", label: "Bimestre I", active: false },
    { id: 2, name: "2.° Bimestre", label: "Bimestre II", active: false },
    { id: 3, name: "3.° Bimestre", label: "Bimestre III", active: true },
    { id: 4, name: "4.° Bimestre", label: "Bimestre IV", active: false }
  ],
  grades: [
    { id: "3ro", name: "3.° Primaria", sections: ["A", "B"], active: false },
    { id: "4to", name: "4.° Primaria", sections: ["sigma", "delta"], active: true },
    { id: "5to", name: "5.° Primaria", sections: ["A", "B"], active: false },
    { id: "6to", name: "6.° Primaria", sections: ["A", "B"], active: false }
  ]
};

export const DEFAULT_TEACHER = {
  id: "teacher-01",
  role: "teacher",
  username: "profesor",
  name: "Prof. Daniel Mendoza",
  school: "Colegio La Salle School",
  grade: "4to",
  grades: ["4.° Grado Sigma", "4.° Grado Delta"],
  year: "2026"
};

export const CLASSROOMS = {
  "sigma": {
    id: "sigma",
    name: "4.° Grado Sigma",
    motto: "Pioneros del Saber 🌟",
    color: "#0284c7"
  },
  "delta": {
    id: "delta",
    name: "4.° Grado Delta",
    motto: "Guardianes de la Matemática 🚀",
    color: "#7c3aed"
  }
};

// Plantilla de contingencia anonimizada (Los datos reales se sincronizan en vivo desde Supabase)
const DEMO_AVATARS = ['condor', 'vicuna', 'chasqui', 'delfin', 'puma', 'alpaca'];

export const INITIAL_STUDENTS = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `alu-sig-${i + 1}`,
    num: i + 1,
    classroom: 'sigma',
    name: `Estudiante Sigma ${i + 1}`,
    displayName: `Estudiante S${i + 1}.`,
    firstName: `Estudiante`,
    username: `demo.sigma${i + 1}`,
    pin: `0000`,
    avatar: DEMO_AVATARS[i % DEMO_AVATARS.length],
    stars: 0,
    xp: 0,
    trophies: { patrones: 'ninguno' },
    lastActive: 'Sin actividad',
    timeMinutes: 0
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `alu-del-${i + 1}`,
    num: i + 1,
    classroom: 'delta',
    name: `Estudiante Delta ${i + 1}`,
    displayName: `Estudiante D${i + 1}.`,
    firstName: `Estudiante`,
    username: `demo.delta${i + 1}`,
    pin: `0000`,
    avatar: DEMO_AVATARS[i % DEMO_AVATARS.length],
    stars: 0,
    xp: 0,
    trophies: { patrones: 'ninguno' },
    lastActive: 'Sin actividad',
    timeMinutes: 0
  }))
];
