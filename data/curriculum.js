// Curriculum de Aritmética 4.° Grado - Metodología Eduten / ViLLE (Universidad de Turku, Finlandia)
// Misión Semanal: Patrones Multiplicativos (3 Estaciones Progresivas + 1 Reto Diamante Opcional)

export const WEEKLY_CYCLE = {
  bimestre: 3,
  bimestreName: "3.° Bimestre",
  currentWeek: 1,
  cycleName: "3.° Bimestre • Semana 1: Patrones Multiplicativos",
  startDay: "Jueves",
  durationDays: 7,
  activeTopicId: "patrones-multiplicativos",
  targetMinutes: 20,
  description: "Inicio del 3.° Bimestre: Sesión semanal de práctica activa Eduten: detección conceptual de la regla, fluidez en la recta de saltos y pensamiento reversible con máquinas matemáticas."
};

export const WEEKLY_MISSION = {
  id: "patrones-multiplicativos",
  title: "Misión Semanal: Patrones Multiplicativos",
  subtitle: "Entrenamiento de Fluidez Matemática Finlandesa",
  icon: "🧭",
  stations: [
    // ==============================================================
    // ESTACIÓN 1: DETECTOR DE LA REGLA (DIAGNÓSTICO CONCEPTUAL)
    // ==============================================================
    {
      id: "estacion-1",
      number: 1,
      name: "Estación 1: Detector de la Regla",
      shortTitle: "Detector de Regla",
      trophy: "bronce",
      trophyName: "Trofeo de Bronce",
      trophyIcon: "🥉",
      targetExercises: 8,
      type: "rule-detector",
      description: "Descubre la operación que conecta la secuencia. Diferencia patrones aditivos (+n) de multiplicativos (×n).",
      instructions: "Observa los números y elige en 1 clic qué regla hace crecer la secuencia.",
      tasks: [
        {
          id: "r1-01",
          sequence: [2, 4, 8, 16],
          options: ["+ 2", "× 2", "+ 4"],
          correctOption: "× 2",
          reason: "Multiplicar por 2 (cada número se duplica: 2×2=4, 4×2=8, 8×2=16).",
          commonMistakeHint: {
            "+ 2": "¡Atención! 2 + 2 = 4, pero 4 + 2 = 6 (¡no da 8!). La regla es multiplicar por 2.",
            "+ 4": "4 + 4 = 8, pero 2 + 4 = 6 (no empieza con 4). La regla que funciona para todos es multiplicar por 2."
          }
        },
        {
          id: "r1-02",
          sequence: [3, 9, 27],
          options: ["+ 6", "× 3", "+ 3"],
          correctOption: "× 3",
          reason: "Multiplicar por 3 (3×3=9, 9×3=27).",
          commonMistakeHint: {
            "+ 6": "3 + 6 = 9, pero 9 + 6 = 15 (¡no da 27!). La regla correcta es multiplicar por 3.",
            "+ 3": "3 + 3 = 6 (no da 9). Prueba con la multiplicación."
          }
        },
        {
          id: "r1-03",
          sequence: [5, 20, 80],
          options: ["+ 15", "× 4", "+ 5"],
          correctOption: "× 4",
          reason: "Multiplicar por 4 (5×4=20, 20×4=80).",
          commonMistakeHint: {
            "+ 15": "5 + 15 = 20, pero 20 + 15 = 35 (¡no da 80!). En un patrón multiplicativo se multiplica: 20 × 4 = 80.",
            "+ 5": "5 + 5 = 10 (no da 20). Prueba multiplicando."
          }
        },
        {
          id: "r1-04",
          sequence: [10, 50, 250],
          options: ["+ 40", "× 5", "+ 10"],
          correctOption: "× 5",
          reason: "Multiplicar por 5 (10×5=50, 50×5=250).",
          commonMistakeHint: {
            "+ 40": "10 + 40 = 50, pero 50 + 40 = 90 (¡no da 250!). Cada término se quintuplica: multiplica por 5.",
            "+ 10": "10 + 10 = 20 (no da 50)."
          }
        },
        {
          id: "r1-05",
          sequence: [4, 8, 16, 32],
          options: ["+ 4", "× 2", "+ 8"],
          correctOption: "× 2",
          reason: "Multiplicar por 2 (4×2=8, 8×2=16, 16×2=32).",
          commonMistakeHint: {
            "+ 4": "4 + 4 = 8, pero 8 + 4 = 12 (no da 16). La regla no es sumar, es multiplicar por 2.",
            "+ 8": "4 + 8 = 12 (no da 8)."
          }
        },
        {
          id: "r1-06",
          sequence: [6, 18, 54],
          options: ["+ 12", "× 3", "+ 6"],
          correctOption: "× 3",
          reason: "Multiplicar por 3 (6×3=18, 18×3=54).",
          commonMistakeHint: {
            "+ 12": "6 + 12 = 18, pero 18 + 12 = 30 (no da 54). La regla es multiplicar por 3.",
            "+ 6": "6 + 6 = 12 (no da 18)."
          }
        },
        {
          id: "r1-07",
          sequence: [1, 5, 25, 125],
          options: ["+ 4", "× 5", "+ 20"],
          correctOption: "× 5",
          reason: "Multiplicar por 5 (1×5=5, 5×5=25, 25×5=125).",
          commonMistakeHint: {
            "+ 4": "1 + 4 = 5, pero 5 + 4 = 9 (no da 25). La regla es multiplicar por 5.",
            "+ 20": "1 + 20 = 21 (no da 5)."
          }
        },
        {
          id: "r1-08",
          sequence: [7, 70, 700],
          options: ["+ 63", "× 10", "+ 100"],
          correctOption: "× 10",
          reason: "Multiplicar por 10 (7×10=70, 70×10=700).",
          commonMistakeHint: {
            "+ 63": "7 + 63 = 70, pero 70 + 63 = 133 (no da 700). Al agregar un cero a la derecha se multiplica por 10.",
            "+ 100": "7 + 100 = 107 (no da 70)."
          }
        }
      ]
    },

    // ==============================================================
    // ESTACIÓN 2: LA RECTA DE SALTOS (CÁLCULO Y FLUIDEZ)
    // ==============================================================
    {
      id: "estacion-2",
      number: 2,
      name: "Estación 2: La Recta de Saltos",
      shortTitle: "Recta de Saltos",
      trophy: "plata",
      trophyName: "Trofeo de Plata",
      trophyIcon: "🥈",
      targetExercises: 10,
      type: "jump-track",
      description: "Aplica la regla del operador multiplicativo para completar los términos que faltan en la recta numérica.",
      instructions: "Escribe el número que falta en la casilla y presiona Comprobar (o presiona Enter).",
      tasks: [
        {
          id: "j2-01",
          track: [2, 4, 8, "?"],
          rule: "× 2",
          missingIndex: 3,
          correctAnswer: 16,
          scaffold: "Multiplica el término anterior (8) por 2: 8 × 2 = 16."
        },
        {
          id: "j2-02",
          track: [3, 9, 27, "?"],
          rule: "× 3",
          missingIndex: 3,
          correctAnswer: 81,
          scaffold: "Descompón para multiplicar 27 × 3: (20 × 3 = 60) + (7 × 3 = 21) = 81."
        },
        {
          id: "j2-03",
          track: [5, 15, 45, "?"],
          rule: "× 3",
          missingIndex: 3,
          correctAnswer: 135,
          scaffold: "Descompón 45 × 3: (40 × 3 = 120) + (5 × 3 = 15) = 135."
        },
        {
          id: "j2-04",
          track: [4, 16, 64, "?"],
          rule: "× 4",
          missingIndex: 3,
          correctAnswer: 256,
          scaffold: "Descompón 64 × 4: (60 × 4 = 240) + (4 × 4 = 16) = 256."
        },
        {
          id: "j2-05",
          track: [10, 20, 40, "?"],
          rule: "× 2",
          missingIndex: 3,
          correctAnswer: 80,
          scaffold: "Duplica el 40: 40 × 2 = 80."
        },
        {
          id: "j2-06",
          track: [2, 10, 50, "?"],
          rule: "× 5",
          missingIndex: 3,
          correctAnswer: 250,
          scaffold: "Multiplica 50 × 5: piensa en 5 × 5 = 25, y agrega el cero: 250."
        },
        {
          id: "j2-07",
          track: [3, "?", 27, 81],
          rule: "× 3",
          missingIndex: 1,
          correctAnswer: 9,
          scaffold: "Aplica la regla desde el primer número: 3 × 3 = 9. (Comprueba: 9 × 3 = 27)."
        },
        {
          id: "j2-08",
          track: [4, "?", 64, 256],
          rule: "× 4",
          missingIndex: 1,
          correctAnswer: 16,
          scaffold: "Multiplica el primer número por 4: 4 × 4 = 16. (Comprueba: 16 × 4 = 64)."
        },
        {
          id: "j2-09",
          track: [5, 25, "?", 625],
          rule: "× 5",
          missingIndex: 2,
          correctAnswer: 125,
          scaffold: "Multiplica 25 × 5: 25, 50, 75, 100, 125. (Comprueba: 125 × 5 = 625)."
        },
        {
          id: "j2-10",
          track: [6, 18, "?", 162],
          rule: "× 3",
          missingIndex: 2,
          correctAnswer: 54,
          scaffold: "Multiplica 18 × 3: (10 × 3 = 30) + (8 × 3 = 24) = 54."
        }
      ]
    },

    // ==============================================================
    // ESTACIÓN 3: LA MÁQUINA DE ENTRADA Y SALIDA (PENSAMIENTO REVERSIBLE)
    // ==============================================================
    {
      id: "estacion-3",
      number: 3,
      name: "Estación 3: La Máquina de Funciones",
      shortTitle: "Máquina Entrada/Salida",
      trophy: "oro",
      trophyName: "Trofeo de Oro",
      trophyIcon: "🥇",
      targetExercises: 8,
      type: "function-machine",
      description: "Pensamiento relacional con tablas de entrada y salida. ¡Atención a las preguntas directas e inversas!",
      instructions: "Calcula el número que completa la tabla de la máquina.",
      tasks: [
        {
          id: "m3-01",
          ruleDisplay: "Regla fija: Entrada × 4",
          mode: "direct",
          table: [
            { in: 2, out: 8 },
            { in: 3, out: 12 },
            { in: 5, out: "?" }
          ],
          prompt: "¿Qué número sale cuando entra el 5?",
          correctAnswer: 20,
          scaffold: "Aplica la regla de la máquina: 5 × 4 = 20."
        },
        {
          id: "m3-02",
          ruleDisplay: "Regla fija: Entrada × 3",
          mode: "direct",
          table: [
            { in: 4, out: 12 },
            { in: 7, out: 21 },
            { in: 10, out: "?" }
          ],
          prompt: "¿Qué número sale cuando entra el 10?",
          correctAnswer: 30,
          scaffold: "Aplica la regla: 10 × 3 = 30."
        },
        {
          id: "m3-03",
          ruleDisplay: "Regla fija: Entrada × 5",
          mode: "direct",
          table: [
            { in: 3, out: 15 },
            { in: 6, out: 30 },
            { in: 8, out: "?" }
          ],
          prompt: "¿Qué número sale cuando entra el 8?",
          correctAnswer: 40,
          scaffold: "Aplica la regla: 8 × 5 = 40."
        },
        {
          id: "m3-04",
          ruleDisplay: "Regla fija: Entrada × 6",
          mode: "direct",
          table: [
            { in: 2, out: 12 },
            { in: 5, out: 30 },
            { in: 7, out: "?" }
          ],
          prompt: "¿Qué número sale cuando entra el 7?",
          correctAnswer: 42,
          scaffold: "Aplica la regla: 7 × 6 = 42."
        },
        {
          id: "m3-05",
          ruleDisplay: "Regla fija: Entrada × 4",
          mode: "inverse",
          table: [
            { in: 3, out: 12 },
            { in: 5, out: 20 },
            { in: "?", out: 32 }
          ],
          prompt: "¡Pregunta Inversa! Si la salida es 32, ¿qué número entró a la máquina?",
          correctAnswer: 8,
          scaffold: "Pensamiento inverso: ¿qué número multiplicado por 4 da 32? Divide: 32 ÷ 4 = 8."
        },
        {
          id: "m3-06",
          ruleDisplay: "Regla fija: Entrada × 3",
          mode: "inverse",
          table: [
            { in: 6, out: 18 },
            { in: 8, out: 24 },
            { in: "?", out: 27 }
          ],
          prompt: "¡Pregunta Inversa! Si la salida es 27, ¿qué número entró a la máquina?",
          correctAnswer: 9,
          scaffold: "¿Qué número multiplicado por 3 da 27? Divide: 27 ÷ 3 = 9."
        },
        {
          id: "m3-07",
          ruleDisplay: "Regla fija: Entrada × 5",
          mode: "inverse",
          table: [
            { in: 4, out: 20 },
            { in: 7, out: 35 },
            { in: "?", out: 50 }
          ],
          prompt: "¡Pregunta Inversa! Si la salida es 50, ¿qué número entró?",
          correctAnswer: 10,
          scaffold: "¿Qué número multiplicado por 5 da 50? Divide: 50 ÷ 5 = 10."
        },
        {
          id: "m3-08",
          ruleDisplay: "Regla fija: Entrada × 8",
          mode: "direct",
          table: [
            { in: 2, out: 16 },
            { in: 4, out: 32 },
            { in: 6, out: "?" }
          ],
          prompt: "¿Qué número sale cuando entra el 6?",
          correctAnswer: 48,
          scaffold: "Multiplica: 6 × 8 = 48."
        }
      ]
    },

    // ==============================================================
    // ESTACIÓN 4 (OPCIONAL): RETO MAESTRO DIAMANTE 💎
    // ==============================================================
    {
      id: "estacion-diamante",
      number: 4,
      name: "Desafío Diamante: Reto Maestro del Perú",
      shortTitle: "Reto Diamante",
      trophy: "diamante",
      trophyName: "Trofeo Diamante",
      trophyIcon: "💎",
      targetExercises: 3,
      type: "applied-problem",
      isOptionalMastery: true,
      description: "Problemas de aplicación contextualizada con cálculos de 2 pasos para estudiantes avanzados.",
      instructions: "Lee atentamente la situación matemática y calcula la respuesta final.",
      tasks: [
        {
          id: "d4-01",
          location: "Cusco (Chinchero)",
          title: "El telar geométrico de Chinchero",
          story: "En Chinchero, un telar tradicional triplica (×3) el número de rombos en cada fila: Fila 1 = 2, Fila 2 = 6, Fila 3 = 18, Fila 4 = 54.",
          question: "¿Cuántos rombos tejerán en la Fila 5?",
          formulaTrack: "2 ➔ 6 ➔ 18 ➔ 54 ➔ [ Fila 5 ]",
          correctAnswer: 162,
          scaffold: "Multiplica el último término (54) por 3: 54 × 3 = (50 × 3) + (4 × 3) = 150 + 12 = 162."
        },
        {
          id: "d4-02",
          location: "Junín (Huancayo)",
          title: "Piscigranja Comunal de Truchas",
          story: "La reproducción mensual de truchas sigue un patrón multiplicativo por 5: Mes 1 = 3, Mes 2 = 15, Mes 3 = [ A ], Mes 4 = [ B ], Mes 5 = 1875.",
          question: "Calcula primero el valor de A y de B. Luego responde: ¿cuánto vale la suma de A + B?",
          formulaTrack: "3 ➔ 15 ➔ [ A ] ➔ [ B ] ➔ 1875 (Regla: × 5)",
          correctAnswer: 450,
          scaffold: "Paso 1: A = 15 × 5 = 75. Paso 2: B = 75 × 5 = 375. Paso 3: Suma A + B = 75 + 375 = 450."
        },
        {
          id: "d4-03",
          location: "Puno (Altiplano)",
          title: "Cooperativa Textil de Alpaca",
          story: "Una cooperativa duplica (×2) cada año su producción de sacos de lana: Año 1 = 8 sacos, Año 2 = 16, Año 3 = 32. En el Año 4 venden toda la producción a S/. 150 Soles cada saco.",
          question: "¿Cuánto dinero en total (en Soles S/.) recaudarán por los sacos del Año 4?",
          formulaTrack: "Año 1: 8 ➔ Año 2: 16 ➔ Año 3: 32 ➔ Año 4: [ ? sacos ] × S/. 150",
          correctAnswer: 9600,
          scaffold: "Paso 1: Año 4 = 32 × 2 = 64 sacos. Paso 2: Recaudación = 64 sacos × S/. 150 = S/. 9600 Soles."
        }
      ]
    }
  ]
};

// Compatibilidad de exportación
export const EXPEDITIONS = [WEEKLY_MISSION];
export const TROPHY_THRESHOLDS = {
  bronce: { stars: 8, label: "Trofeo de Bronce", desc: "Supera la Estación 1: Detector de la Regla" },
  plata: { stars: 18, label: "Trofeo de Plata", desc: "Supera la Estación 2: La Recta de Saltos" },
  oro: { stars: 26, label: "Trofeo de Oro (Meta Oficial)", desc: "Supera la Estación 3: La Máquina de Funciones" },
  diamante: { stars: 29, label: "Trofeo de Diamante", desc: "Supera el Desafío Maestro Diamante" }
};

export const AVAILABLE_TOPICS = [
  {
    id: "patrones-multiplicativos",
    bimestre: 3,
    bimestreName: "3.° Bimestre",
    weekNumber: 1,
    title: "Semana 1: Patrones Multiplicativos",
    subtitle: "3.° Bimestre • Regularidad y Cambio • Detección, Saltos y Máquinas",
    status: "active",
    description: "Secuencias con razón multiplicativa, rectas de saltos y tablas de entrada/salida.",
    worksheetTitle: "3.° Bimestre • Regularidad y Cambio • Patrones Multiplicativos",
    stationNames: {
      s1: "Estación 1: Detector de la Regla",
      s2: "Estación 2: Recta de Saltos",
      s3: "Estación 3: Máquina de Funciones (Oro)",
      sDiam: "Reto Diamante: Problemas Aplicados"
    },
    difficulties: [
      { id: "confusion", label: "Confusión Suma vs Multiplicación (+ vs ×)", color: "#ef4444" },
      { id: "jump", label: "Falla en Regularidad de Saltos", color: "#f59e0b" },
      { id: "calc", label: "Dificultad en Cálculo Mental Inverso", color: "#3b82f6" },
      { id: "clean", label: "Dominio Fluido sin tropiezos", color: "var(--neon-green)" }
    ]
  },
  {
    id: "division-reparto",
    bimestre: 3,
    bimestreName: "3.° Bimestre",
    weekNumber: 2,
    title: "Semana 2: División y Reparto Equitativo",
    subtitle: "3.° Bimestre • Número y Operaciones • Algoritmo y Residuo",
    status: "available",
    description: "Reparto equitativo, comprobación de la división y problemas de sobrante.",
    worksheetTitle: "3.° Bimestre • Número y Operaciones • División y Reparto Equitativo",
    stationNames: {
      s1: "Estación 1: Reparto Concreto y Pictórico",
      s2: "Estación 2: Algoritmo y Residuo",
      s3: "Estación 3: Comprobación Dividendo (Oro)",
      sDiam: "Reto Diamante: Problemas de Sobrante"
    },
    difficulties: [
      { id: "confusion", label: "Confusión entre Residuo y Cociente", color: "#ef4444" },
      { id: "jump", label: "Falla en Tabla de Multiplicar asociada", color: "#f59e0b" },
      { id: "calc", label: "Dificultad en Reparto No Equitativo", color: "#3b82f6" },
      { id: "clean", label: "Dominio en Reparto Exacto e Inexacto", color: "var(--neon-green)" }
    ]
  },
  {
    id: "fracciones-unidad",
    bimestre: 3,
    bimestreName: "3.° Bimestre",
    weekNumber: 3,
    title: "Semana 3: Fracciones y Partes de la Unidad",
    subtitle: "3.° Bimestre • Número y Operaciones • Fracciones Propias y Equivalentes",
    status: "available",
    description: "Tiras de fracciones, comparación y equivalencias con representaciones concretas.",
    worksheetTitle: "3.° Bimestre • Número y Operaciones • Fracciones y Partes de la Unidad",
    stationNames: {
      s1: "Estación 1: Tira de Fracciones y Partes",
      s2: "Estación 2: Fracciones Equivalentes",
      s3: "Estación 3: Comparación y Orden (Oro)",
      sDiam: "Reto Diamante: Fracción de Cantidad"
    },
    difficulties: [
      { id: "confusion", label: "Confusión Numerador vs Denominador", color: "#ef4444" },
      { id: "jump", label: "Error en Equivalencias Visuales (1/2 = 2/4)", color: "#f59e0b" },
      { id: "calc", label: "Dificultad en Fracción de una Colección", color: "#3b82f6" },
      { id: "clean", label: "Comprensión Gráfica y Numérica Completa", color: "var(--neon-green)" }
    ]
  },
  {
    id: "operaciones-combinadas",
    bimestre: 3,
    bimestreName: "3.° Bimestre",
    weekNumber: 4,
    title: "Semana 4: Operaciones Combinadas y Enigmas",
    subtitle: "3.° Bimestre • Resolución de Problemas • Jerarquía y Paréntesis",
    status: "available",
    description: "Jerarquía de operaciones básicas en problemas de dos etapas.",
    worksheetTitle: "3.° Bimestre • Resolución de Problemas • Operaciones Combinadas",
    stationNames: {
      s1: "Estación 1: Jerarquía Básica (× y ÷)",
      s2: "Estación 2: Regla de Paréntesis",
      s3: "Estación 3: Enigmas de Dos Etapas (Oro)",
      sDiam: "Reto Diamante: Desafíos Integrados"
    },
    difficulties: [
      { id: "confusion", label: "Infracción de Jerarquía (Suma antes de ×)", color: "#ef4444" },
      { id: "jump", label: "Omisión de Regla de Paréntesis", color: "#f59e0b" },
      { id: "calc", label: "Dificultad en Problemas de Dos Etapas", color: "#3b82f6" },
      { id: "clean", label: "Resolución Ordenada y Correcta", color: "var(--neon-green)" }
    ]
  }
];

