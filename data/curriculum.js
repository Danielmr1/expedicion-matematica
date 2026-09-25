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
          scaffold: "Multiplica el término anterior (8) por la regla (× 2): ¿Cuánto es 8 × 2?"
        },
        {
          id: "j2-02",
          track: [3, 9, 27, "?"],
          rule: "× 3",
          missingIndex: 3,
          correctAnswer: 81,
          scaffold: "Descompón 27 × 3 en dos partes fáciles: (20 × 3) + (7 × 3). ¡Calcula y suma ambos resultados!"
        },
        {
          id: "j2-03",
          track: [5, 15, 45, "?"],
          rule: "× 3",
          missingIndex: 3,
          correctAnswer: 135,
          scaffold: "Descompón 45 × 3 en dos partes: (40 × 3) + (5 × 3). ¡Suma ambos resultados!"
        },
        {
          id: "j2-04",
          track: [4, 16, 64, "?"],
          rule: "× 4",
          missingIndex: 3,
          correctAnswer: 256,
          scaffold: "Descompón 64 × 4 en dos partes fáciles: (60 × 4) + (4 × 4). ¡Calcula la suma de ambos resultados!"
        },
        {
          id: "j2-05",
          track: [10, 20, 40, "?"],
          rule: "× 2",
          missingIndex: 3,
          correctAnswer: 80,
          scaffold: "Duplica el número anterior aplicando la regla: ¿Cuánto es 40 × 2?"
        },
        {
          id: "j2-06",
          track: [2, 10, 50, "?"],
          rule: "× 5",
          missingIndex: 3,
          correctAnswer: 250,
          scaffold: "Multiplica 50 × 5: primero piensa en 5 × 5 y luego agrégale un cero al final."
        },
        {
          id: "j2-07",
          track: [3, "?", 27, 81],
          rule: "× 3",
          missingIndex: 1,
          correctAnswer: 9,
          scaffold: "Aplica la regla desde el primer término: ¿Cuánto es 3 × 3? (Comprueba que el siguiente paso dé 27)."
        },
        {
          id: "j2-08",
          track: [4, "?", 64, 256],
          rule: "× 4",
          missingIndex: 1,
          correctAnswer: 16,
          scaffold: "Multiplica el primer término por la regla (× 4): ¿Cuánto es 4 × 4?"
        },
        {
          id: "j2-09",
          track: [5, 25, "?", 625],
          rule: "× 5",
          missingIndex: 2,
          correctAnswer: 125,
          scaffold: "Multiplica 25 × 5: avanza de 25 en 25 cinco veces o descompón (20 × 5) + (5 × 5)."
        },
        {
          id: "j2-10",
          track: [6, 18, "?", 162],
          rule: "× 3",
          missingIndex: 2,
          correctAnswer: 54,
          scaffold: "Multiplica 18 × 3 descomponiendo: (10 × 3) + (8 × 3). ¡Suma ambos productos!"
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
          scaffold: "Aplica la regla de la máquina al número de entrada: calcula 5 × 4."
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
          scaffold: "Aplica la regla de la máquina al número que entra: calcula 10 × 3."
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
          scaffold: "Aplica la regla de la máquina: calcula 8 × 5."
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
          scaffold: "Aplica la regla de la máquina: calcula 7 × 6."
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
          scaffold: "Pensamiento inverso: ¿qué número multiplicado por 4 da 32? Puedes calcular 32 ÷ 4."
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
          scaffold: "¿Qué número multiplicado por 3 da 27? Puedes calcular 27 ÷ 3."
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
          scaffold: "¿Qué número multiplicado por 5 da 50? Puedes calcular 50 ÷ 5."
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
          scaffold: "Aplica la regla fija al número de entrada: calcula 6 × 8."
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
          scaffold: "Multiplica el último término (54) por 3: descompón en (50 × 3) + (4 × 3) y suma ambos productos."
        },
        {
          id: "d4-02",
          location: "Junín (Huancayo)",
          title: "Piscigranja Comunal de Truchas",
          story: "La reproducción mensual de truchas sigue un patrón multiplicativo por 5: Mes 1 = 3, Mes 2 = 15, Mes 3 = [ A ], Mes 4 = [ B ], Mes 5 = 1875.",
          question: "Calcula primero el valor de A y de B. Luego responde: ¿cuánto vale la suma de A + B?",
          formulaTrack: "3 ➔ 15 ➔ [ A ] ➔ [ B ] ➔ 1875 (Regla: × 5)",
          correctAnswer: 450,
          scaffold: "Paso 1: Calcula A (15 × 5). Paso 2: Con ese valor calcula B (A × 5). Paso 3: Suma A + B."
        },
        {
          id: "d4-03",
          location: "Puno (Altiplano)",
          title: "Cooperativa Textil de Alpaca",
          story: "Una cooperativa duplica (×2) cada año su producción de sacos de lana: Año 1 = 8 sacos, Año 2 = 16, Año 3 = 32. En el Año 4 venden toda la producción a S/. 150 Soles cada saco.",
          question: "¿Cuánto dinero en total (en Soles S/.) recaudarán por los sacos del Año 4?",
          formulaTrack: "Año 1: 8 ➔ Año 2: 16 ➔ Año 3: 32 ➔ Año 4: [ ? sacos ] × S/. 150",
          correctAnswer: 9600,
          scaffold: "Paso 1: Duplica 32 sacos para hallar el total del Año 4. Paso 2: Multiplica esa cantidad de sacos por el precio (S/. 150)."
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

// ==============================================================
// MISIÓN SEMANA 2: DIVISIÓN Y REPARTO EQUITATIVO
// ==============================================================
export const MISSION_DIVISION = {
  id: "division-reparto",
  title: "Misión Semanal: División y Reparto Equitativo",
  subtitle: "Entrenamiento de Algoritmo y Residuo",
  icon: "➗",
  stations: [
    {
      id: "estacion-1",
      number: 1,
      name: "Estación 1: Reparto Concreto y Pictórico",
      shortTitle: "Reparto Concreto",
      trophy: "bronce",
      trophyName: "Trofeo de Bronce",
      trophyIcon: "🥉",
      targetExercises: 8,
      type: "rule-detector",
      description: "Resuelve repartos equitativos exactos identificando el cociente adecuado.",
      instructions: "Calcula el reparto exacto y elige la respuesta correcta en 1 clic.",
      tasks: [
        {
          id: "div-r1-01",
          sequence: [24, "÷ 4", "?"],
          options: ["6", "5", "8"],
          correctOption: "6",
          reason: "24 dividido entre 4 es igual a 6 (4 × 6 = 24).",
          commonMistakeHint: { "5": "4 × 5 = 20 (faltan 4).", "8": "4 × 8 = 32 (se pasa de 24)." }
        },
        {
          id: "div-r1-02",
          sequence: [35, "÷ 5", "?"],
          options: ["7", "6", "8"],
          correctOption: "7",
          reason: "35 dividido entre 5 es igual a 7 (5 × 7 = 35).",
          commonMistakeHint: { "6": "5 × 6 = 30 (faltan 5).", "8": "5 × 8 = 40 (se pasa)." }
        },
        {
          id: "div-r1-03",
          sequence: [48, "÷ 6", "?"],
          options: ["8", "7", "9"],
          correctOption: "8",
          reason: "48 dividido entre 6 es igual a 8 (6 × 8 = 48).",
          commonMistakeHint: { "7": "6 × 7 = 42.", "9": "6 × 9 = 54." }
        },
        {
          id: "div-r1-04",
          sequence: [56, "÷ 7", "?"],
          options: ["8", "9", "6"],
          correctOption: "8",
          reason: "56 dividido entre 7 es igual a 8 (7 × 8 = 56).",
          commonMistakeHint: { "9": "7 × 9 = 63.", "6": "7 × 6 = 42." }
        },
        {
          id: "div-r1-05",
          sequence: [72, "÷ 8", "?"],
          options: ["9", "8", "7"],
          correctOption: "9",
          reason: "72 dividido entre 8 es igual a 9 (8 × 9 = 72).",
          commonMistakeHint: { "8": "8 × 8 = 64.", "7": "8 × 7 = 56." }
        },
        {
          id: "div-r1-06",
          sequence: [63, "÷ 9", "?"],
          options: ["7", "8", "6"],
          correctOption: "7",
          reason: "63 dividido entre 9 es igual a 7 (9 × 7 = 63).",
          commonMistakeHint: { "8": "9 × 8 = 72.", "6": "9 × 6 = 54." }
        },
        {
          id: "div-r1-07",
          sequence: [40, "÷ 5", "?"],
          options: ["8", "7", "6"],
          correctOption: "8",
          reason: "40 dividido entre 5 es igual a 8 (5 × 8 = 40).",
          commonMistakeHint: { "7": "5 × 7 = 35.", "6": "5 × 6 = 30." }
        },
        {
          id: "div-r1-08",
          sequence: [81, "÷ 9", "?"],
          options: ["9", "8", "10"],
          correctOption: "9",
          reason: "81 dividido entre 9 es igual a 9 (9 × 9 = 81).",
          commonMistakeHint: { "8": "9 × 8 = 72.", "10": "9 × 10 = 90." }
        }
      ]
    },
    {
      id: "estacion-2",
      number: 2,
      name: "Estación 2: Algoritmo y Residuo",
      shortTitle: "Algoritmo y Residuo",
      trophy: "plata",
      trophyName: "Trofeo de Plata",
      trophyIcon: "🥈",
      targetExercises: 8,
      type: "jump-track",
      description: "Calcula divisiones sucesivas y pasos de reducción equitativa.",
      instructions: "Observa la secuencia de reducción y escribe el número faltante.",
      tasks: [
        {
          id: "div-j2-01",
          rule: "÷ 2",
          ruleLabel: "Reducción por mitad: Dividir entre 2 (÷ 2)",
          track: [80, 40, 20, 10],
          missingIndex: 2,
          correctAnswer: 20,
          scaffold: "Paso 1: 80 ÷ 2 = 40. Paso 2: Ahora halla la mitad de 40."
        },
        {
          id: "div-j2-02",
          rule: "÷ 3",
          ruleLabel: "Tercera parte sucesiva: Dividir entre 3 (÷ 3)",
          track: [81, 27, 9, 3],
          missingIndex: 2,
          correctAnswer: 9,
          scaffold: "Paso 1: 81 ÷ 3 = 27. Paso 2: Ahora divide 27 ÷ 3."
        },
        {
          id: "div-j2-03",
          rule: "÷ 2",
          ruleLabel: "Reducción por mitad: Dividir entre 2 (÷ 2)",
          track: [64, 32, 16, 8],
          missingIndex: 3,
          correctAnswer: 8,
          scaffold: "Aplica la regla de dividir entre 2 al término anterior: ¿Cuánto es 16 ÷ 2?"
        },
        {
          id: "div-j2-04",
          rule: "÷ 5",
          ruleLabel: "Quinta parte: Dividir entre 5 (÷ 5)",
          track: [125, 25, 5],
          missingIndex: 1,
          correctAnswer: 25,
          scaffold: "Aplica la regla de reducción: calcula 125 dividido entre 5."
        },
        {
          id: "div-j2-05",
          rule: "÷ 2",
          ruleLabel: "Reducción por mitad: Dividir entre 2 (÷ 2)",
          track: [120, 60, 30, 15],
          missingIndex: 2,
          correctAnswer: 30,
          scaffold: "Aplica la regla dividiendo entre 2: calcula la mitad de 60."
        },
        {
          id: "div-j2-06",
          rule: "÷ 4",
          ruleLabel: "Cuarta parte: Dividir entre 4 (÷ 4)",
          track: [64, 16, 4],
          missingIndex: 1,
          correctAnswer: 16,
          scaffold: "Divide 64 ÷ 4: descompón en (40 ÷ 4) + (24 ÷ 4) y suma ambos cocientes."
        },
        {
          id: "div-j2-07",
          rule: "÷ 3",
          ruleLabel: "Tercera parte: Dividir entre 3 (÷ 3)",
          track: [90, 30, 10],
          missingIndex: 1,
          correctAnswer: 30,
          scaffold: "Divide 90 ÷ 3: piensa en 9 ÷ 3 y agrégale el cero al final."
        },
        {
          id: "div-j2-08",
          rule: "÷ 2",
          ruleLabel: "Mitad sucesiva: Dividir entre 2 (÷ 2)",
          track: [100, 50, 25],
          missingIndex: 2,
          correctAnswer: 25,
          scaffold: "Aplica la regla de reducción: calcula 50 ÷ 2."
        }
      ]
    },
    {
      id: "estacion-3",
      number: 3,
      name: "Estación 3: Comprobación Dividendo (Oro)",
      shortTitle: "Comprobación Dividendo",
      trophy: "oro",
      trophyName: "Trofeo de Oro",
      trophyIcon: "🥇",
      targetExercises: 8,
      type: "function-machine",
      description: "Comprueba la división: Dividendo = (Divisor × Cociente) + Residuo.",
      instructions: "Aplica la fórmula de comprobación y halla el Dividendo original.",
      tasks: [
        {
          id: "div-m3-01",
          ruleDisplay: "FÓRMULA: Dividendo = (Divisor × Cociente) + Residuo",
          table: [
            { in: "( 7 × 8 ) + 3", out: 59 },
            { in: "( 6 × 9 ) + 4", out: "?" }
          ],
          prompt: "Calcula el dividendo: ( 6 × 9 ) + 4",
          correctAnswer: 58,
          scaffold: "Paso 1: Multiplica cociente por divisor (6 × 9). Paso 2: Súmale el residuo (4)."
        },
        {
          id: "div-m3-02",
          ruleDisplay: "FÓRMULA: Dividendo = (Divisor × Cociente) + Residuo",
          table: [
            { in: "( 8 × 7 ) + 5", out: "?" }
          ],
          prompt: "Calcula el dividendo: ( 8 × 7 ) + 5",
          correctAnswer: 61,
          scaffold: "Multiplica divisor por cociente (8 × 7) y súmale 5 de residuo."
        },
        {
          id: "div-m3-03",
          ruleDisplay: "FÓRMULA: Dividendo = (Divisor × Cociente) + Residuo",
          table: [
            { in: "( 9 × 8 ) + 6", out: "?" }
          ],
          prompt: "Calcula el dividendo: ( 9 × 8 ) + 6",
          correctAnswer: 78,
          scaffold: "Calcula 9 × 8 y súmale los 6 que sobraron."
        },
        {
          id: "div-m3-04",
          ruleDisplay: "FÓRMULA: Dividendo = (Divisor × Cociente) + Residuo",
          table: [
            { in: "( 5 × 9 ) + 2", out: "?" }
          ],
          prompt: "Calcula el dividendo: ( 5 × 9 ) + 2",
          correctAnswer: 47,
          scaffold: "Calcula el producto 5 × 9 y súmale 2 de residuo."
        },
        {
          id: "div-m3-05",
          ruleDisplay: "FÓRMULA: Dividendo = (Divisor × Cociente) + Residuo",
          table: [
            { in: "( 8 × 8 ) + 7", out: "?" }
          ],
          prompt: "Calcula el dividendo: ( 8 × 8 ) + 7",
          correctAnswer: 71,
          scaffold: "Multiplica 8 × 8 y suma el residuo de 7."
        },
        {
          id: "div-m3-06",
          ruleDisplay: "FÓRMULA: Dividendo = (Divisor × Cociente) + Residuo",
          table: [
            { in: "( 7 × 7 ) + 6", out: "?" }
          ],
          prompt: "Calcula el dividendo: ( 7 × 7 ) + 6",
          correctAnswer: 55,
          scaffold: "Calcula 7 × 7 y súmale los 6 de residuo."
        },
        {
          id: "div-m3-07",
          ruleDisplay: "FÓRMULA: Dividendo = (Divisor × Cociente) + Residuo",
          table: [
            { in: "( 6 × 8 ) + 5", out: "?" }
          ],
          prompt: "Calcula el dividendo: ( 6 × 8 ) + 5",
          correctAnswer: 53,
          scaffold: "Multiplica 6 × 8 y suma el residuo (5)."
        },
        {
          id: "div-m3-08",
          ruleDisplay: "FÓRMULA: Dividendo = (Divisor × Cociente) + Residuo",
          table: [
            { in: "( 9 × 7 ) + 4", out: "?" }
          ],
          prompt: "Calcula el dividendo: ( 9 × 7 ) + 4",
          correctAnswer: 67,
          scaffold: "Multiplica 9 × 7 y súmale los 4 de residuo."
        }
      ]
    },
    {
      id: "estacion-diamante",
      number: 4,
      name: "Reto Diamante: Problemas de Sobrante",
      shortTitle: "Problemas de Sobrante",
      trophy: "diamante",
      trophyName: "Trofeo de Diamante",
      trophyIcon: "💎",
      targetExercises: 3,
      type: "applied-problem",
      isOptionalMastery: true,
      description: "Problemas de división de dos etapas con interpretación del residuo.",
      instructions: "Lee atentamente la situación real del Perú y responde con el número exacto.",
      tasks: [
        {
          id: "div-d4-01",
          location: "Chanchamayo (Junín)",
          title: "Cooperativa Cafetalera",
          story: "En la cosecha se recolectaron 94 kg de café de exportación. Se empacan en bolsas de 8 kg cada una.",
          question: "¿Cuántas bolsas completas se pueden llenar?",
          formulaTrack: "94 ÷ 8 = Cociente [ ? bolsas completas ] con residuo de kg sobrantes",
          correctAnswer: 11,
          scaffold: "Divide 94 ÷ 8: busca el número más cercano que multiplicado por 8 no pase de 94 (8 × ? ≤ 94)."
        },
        {
          id: "div-d4-02",
          location: "Piura (Valle del Chira)",
          title: "Cosecha de Mangos de Exportación",
          story: "Un agricultor recolectó 115 mangos de primera calidad y los colocó en cajas de 9 mangos cada una.",
          question: "¿Cuántos mangos sobraron luego de llenar todas las cajas posibles?",
          formulaTrack: "115 ÷ 9 = 12 cajas completas con residuo de [ ? mangos ]",
          correctAnswer: 7,
          scaffold: "Calcula 12 cajas de 9 mangos (12 × 9). Luego resta ese total de 115 para hallar los que sobran."
        },
        {
          id: "div-d4-03",
          location: "Ica (Valle Fértil)",
          title: "Exportación de Espárragos",
          story: "Una empresa embaló 150 atados de espárragos verdes en 6 contenedores refrigerados en partes iguales.",
          question: "¿Cuántos atados de espárragos se colocaron en cada contenedor?",
          formulaTrack: "150 ÷ 6 = [ ? atados por contenedor ] (División exacta)",
          correctAnswer: 25,
          scaffold: "Divide 150 ÷ 6: descompón 150 en (120 ÷ 6) + (30 ÷ 6) y suma los resultados."
        }
      ]
    }
  ]
};

// ==============================================================
// MISIÓN SEMANA 3: FRACCIONES Y PARTES DE LA UNIDAD
// ==============================================================
export const MISSION_FRACCIONES = {
  id: "fracciones-unidad",
  title: "Misión Semanal: Fracciones y Partes de la Unidad",
  subtitle: "Entrenamiento de Fracciones Propias y Equivalentes",
  icon: "🍰",
  stations: [
    {
      id: "estacion-1",
      number: 1,
      name: "Estación 1: Tira de Fracciones y Partes",
      shortTitle: "Tira de Fracciones",
      trophy: "bronce",
      trophyName: "Trofeo de Bronce",
      trophyIcon: "🥉",
      targetExercises: 8,
      type: "rule-detector",
      description: "Identifica partes de la unidad, numeradores y denominadores.",
      instructions: "Lee la pregunta conceptual y selecciona la opción correcta.",
      tasks: [
        {
          id: "frc-r1-01",
          sequence: ["1 entero", "Dividido en 2 partes iguales", "?"],
          options: ["1/2", "1/4", "2/1"],
          correctOption: "1/2",
          reason: "Cada parte igual representa un medio (1/2).",
          commonMistakeHint: { "1/4": "Eso sería dividir en 4 partes.", "2/1": "2/1 representa 2 enteros." }
        },
        {
          id: "frc-r1-02",
          sequence: ["4 partes iguales", "Tomamos 3 partes", "?"],
          options: ["3/4", "4/3", "1/4"],
          correctOption: "3/4",
          reason: "3 partes de 4 representan tres cuartos (3/4).",
          commonMistakeHint: { "4/3": "El denominador va abajo (4).", "1/4": "1/4 es solo una parte." }
        },
        {
          id: "frc-r1-03",
          sequence: ["En la fracción 5/8", "¿Cuál es el DENOMINADOR?", "?"],
          options: ["8", "5", "13"],
          correctOption: "8",
          reason: "El denominador es el número inferior que indica el total de partes iguales (8).",
          commonMistakeHint: { "5": "5 es el numerador (partes tomadas).", "13": "13 es la suma." }
        },
        {
          id: "frc-r1-04",
          sequence: ["En la fracción 4/9", "¿Cuál es el NUMERADOR?", "?"],
          options: ["4", "9", "5"],
          correctOption: "4",
          reason: "El numerador es el número superior que indica las partes consideradas (4).",
          commonMistakeHint: { "9": "9 es el denominador." }
        },
        {
          id: "frc-r1-05",
          sequence: ["¿Cuántos cuartos (1/4)", "forman 1 entero completo?", "?"],
          options: ["4", "2", "8"],
          correctOption: "4",
          reason: "4 cuartos (4/4) equivalen a la unidad completa.",
          commonMistakeHint: { "2": "2 cuartos forman medio (1/2)." }
        },
        {
          id: "frc-r1-06",
          sequence: ["¿Cuántos octavos (1/8)", "equivalen a 1/2 entero?", "?"],
          options: ["4", "2", "8"],
          correctOption: "4",
          reason: "4/8 simplificado equivale exactamente a 1/2.",
          commonMistakeHint: { "2": "2/8 = 1/4.", "8": "8/8 es la unidad entera." }
        },
        {
          id: "frc-r1-07",
          sequence: ["¿Cuál es una fracción propia", "(menor que la unidad)?", "?"],
          options: ["3/5", "7/4", "6/6"],
          correctOption: "3/5",
          reason: "En 3/5 el numerador es menor que el denominador, por lo que es menor que 1.",
          commonMistakeHint: { "7/4": "7/4 es impropia (mayor que 1).", "6/6": "6/6 es igual a 1." }
        },
        {
          id: "frc-r1-08",
          sequence: ["5 partes iguales de chocolate", "Comemos 2 partes", "?"],
          options: ["2/5", "5/2", "3/5"],
          correctOption: "2/5",
          reason: "La fracción comida es dos quintos (2/5).",
          commonMistakeHint: { "3/5": "3/5 es lo que sobra.", "5/2": "El denominador va abajo." }
        }
      ]
    },
    {
      id: "estacion-2",
      number: 2,
      name: "Estación 2: Fracciones Equivalentes",
      shortTitle: "Fracciones Equivalentes",
      trophy: "plata",
      trophyName: "Trofeo de Plata",
      trophyIcon: "🥈",
      targetExercises: 8,
      type: "jump-track",
      description: "Encuentra denominadores y numeradores equivalentes multiplicando por el mismo factor.",
      instructions: "Completa el número que hace equivalente la fracción.",
      tasks: [
        {
          id: "frc-j2-01",
          rule: "× 2",
          ruleLabel: "Equivalencia duplicando: 1/2 = 2/4 = 4/8 = 8/[ ? ]",
          track: [2, 4, 8, 16],
          missingIndex: 3,
          correctAnswer: 16,
          scaffold: "Para hallar la fracción equivalente con numerador 8 (4 × 2), duplica también el denominador (8 × 2)."
        },
        {
          id: "frc-j2-02",
          rule: "× 3",
          ruleLabel: "Equivalencia triplicando: 1/3 = 2/6 = 3/9 = 4/[ ? ]",
          track: [3, 6, 9, 12],
          missingIndex: 3,
          correctAnswer: 12,
          scaffold: "Observa la secuencia de los denominadores: van aumentando de 3 en 3 (3, 6, 9...)."
        },
        {
          id: "frc-j2-03",
          rule: "× 4",
          ruleLabel: "Equivalencia en cuartos: 1/4 = 2/8 = 3/12 = 4/[ ? ]",
          track: [4, 8, 12, 16],
          missingIndex: 3,
          correctAnswer: 16,
          scaffold: "Observa cómo avanzan los denominadores de 4 en 4: ¿cuál sigue después de 12?"
        },
        {
          id: "frc-j2-04",
          rule: "× 5",
          ruleLabel: "Equivalencia en quintos: 1/5 = 2/10 = 3/15 = 4/[ ? ]",
          track: [5, 10, 15, 20],
          missingIndex: 3,
          correctAnswer: 20,
          scaffold: "Los denominadores son múltiplos de 5: 5, 10, 15... ¿cuál sigue?"
        },
        {
          id: "frc-j2-05",
          rule: "× 2",
          ruleLabel: "Numerador equivalente: 1/2 = 2/4 = [ ? ]/8",
          track: [1, 2, 4, 8],
          missingIndex: 2,
          correctAnswer: 4,
          scaffold: "Si el denominador se duplicó de 4 a 8 (4 × 2), multiplica el numerador anterior (2) por 2."
        },
        {
          id: "frc-j2-06",
          rule: "× 2",
          ruleLabel: "Numeradores en tercios: 2/3 = 4/6 = [ ? ]/12",
          track: [2, 4, 8],
          missingIndex: 2,
          correctAnswer: 8,
          scaffold: "Si el denominador se cuadruplicó (3 × 4 = 12), calcula el nuevo numerador multiplicando 2 × 4."
        },
        {
          id: "frc-j2-07",
          rule: "× 3",
          ruleLabel: "Denominadores: 2/5 = 4/10 = 6/[ ? ]",
          track: [5, 10, 15],
          missingIndex: 2,
          correctAnswer: 15,
          scaffold: "Si el numerador se triplicó (2 × 3 = 6), triplica también el denominador: calcula 5 × 3."
        },
        {
          id: "frc-j2-08",
          rule: "× 2",
          ruleLabel: "Equivalencias: 3/4 = 6/8 = [ ? ]/16",
          track: [3, 6, 12],
          missingIndex: 2,
          correctAnswer: 12,
          scaffold: "Si el denominador se multiplicó por 4 (4 × 4 = 16), multiplica también el numerador: calcula 3 × 4."
        }
      ]
    },
    {
      id: "estacion-3",
      number: 3,
      name: "Estación 3: Fracción de una Cantidad (Oro)",
      shortTitle: "Fracción de Cantidad",
      trophy: "oro",
      trophyName: "Trofeo de Oro",
      trophyIcon: "🥇",
      targetExercises: 8,
      type: "function-machine",
      description: "Calcula la fracción de un número entero (dividir entre denominador y multiplicar por numerador).",
      instructions: "Aplica la regla y calcula la cantidad resultante.",
      tasks: [
        {
          id: "frc-m3-01",
          ruleDisplay: "REGLA: (Total ÷ Denominador) × Numerador",
          table: [
            { in: "1/4 de 24", out: 6 },
            { in: "1/3 de 27", out: "?" }
          ],
          prompt: "Calcula: 1/3 de 27",
          correctAnswer: 9,
          scaffold: "Para hallar 1/3 de 27, divide 27 entre 3."
        },
        {
          id: "frc-m3-02",
          ruleDisplay: "REGLA: (Total ÷ Denominador) × Numerador",
          table: [
            { in: "1/5 de 35", out: "?" }
          ],
          prompt: "Calcula: 1/5 de 35",
          correctAnswer: 7,
          scaffold: "Para calcular 1/5 de 35, divide el total (35) entre 5."
        },
        {
          id: "frc-m3-03",
          ruleDisplay: "REGLA: (Total ÷ Denominador) × Numerador",
          table: [
            { in: "2/3 de 18", out: "?" }
          ],
          prompt: "Calcula: 2/3 de 18",
          correctAnswer: 12,
          scaffold: "Paso 1: Divide 18 ÷ 3 para hallar 1/3. Paso 2: Multiplica ese resultado por 2 para obtener 2/3."
        },
        {
          id: "frc-m3-04",
          ruleDisplay: "REGLA: (Total ÷ Denominador) × Numerador",
          table: [
            { in: "3/4 de 20", out: "?" }
          ],
          prompt: "Calcula: 3/4 de 20",
          correctAnswer: 15,
          scaffold: "Paso 1: Divide 20 ÷ 4 para hallar 1/4. Paso 2: Multiplica ese resultado por 3 para obtener 3/4."
        },
        {
          id: "frc-m3-05",
          ruleDisplay: "REGLA: (Total ÷ Denominador) × Numerador",
          table: [
            { in: "2/5 de 30", out: "?" }
          ],
          prompt: "Calcula: 2/5 de 30",
          correctAnswer: 12,
          scaffold: "Paso 1: Divide 30 ÷ 5 para calcular 1/5. Paso 2: Multiplica ese valor por 2 para tener 2/5."
        },
        {
          id: "frc-m3-06",
          ruleDisplay: "REGLA: (Total ÷ Denominador) × Numerador",
          table: [
            { in: "3/8 de 32", out: "?" }
          ],
          prompt: "Calcula: 3/8 de 32",
          correctAnswer: 12,
          scaffold: "Paso 1: Divide 32 ÷ 8 para hallar 1/8. Paso 2: Multiplica ese cociente por 3."
        },
        {
          id: "frc-m3-07",
          ruleDisplay: "REGLA: (Total ÷ Denominador) × Numerador",
          table: [
            { in: "5/6 de 24", out: "?" }
          ],
          prompt: "Calcula: 5/6 de 24",
          correctAnswer: 20,
          scaffold: "Paso 1: Divide 24 ÷ 6 para hallar 1/6. Paso 2: Multiplica ese resultado por 5."
        },
        {
          id: "frc-m3-08",
          ruleDisplay: "REGLA: (Total ÷ Denominador) × Numerador",
          table: [
            { in: "3/5 de 45", out: "?" }
          ],
          prompt: "Calcula: 3/5 de 45",
          correctAnswer: 27,
          scaffold: "Paso 1: Divide 45 ÷ 5 para calcular 1/5. Paso 2: Multiplica ese resultado por 3."
        }
      ]
    },
    {
      id: "estacion-diamante",
      number: 4,
      name: "Reto Diamante: Fracción de Cantidad en el Perú",
      shortTitle: "Fracciones del Perú",
      trophy: "diamante",
      trophyName: "Trofeo de Diamante",
      trophyIcon: "💎",
      targetExercises: 3,
      type: "applied-problem",
      isOptionalMastery: true,
      description: "Resuelve problemas de contexto peruano aplicando fracciones de cantidades.",
      instructions: "Lee atentamente la situación real y escribe tu respuesta.",
      tasks: [
        {
          id: "frc-d4-01",
          location: "Cusco (Valle Sagrado)",
          title: "Cosecha de Maíz Morado",
          story: "De una cosecha comunal de 120 kg de maíz morado, las 3/4 partes fueron enviadas a la feria de Lima.",
          question: "¿Cuántos kilogramos de maíz morado se enviaron a Lima?",
          formulaTrack: "3/4 de 120 kg = (120 ÷ 4) × 3 = [ ? kg ]",
          correctAnswer: 90,
          scaffold: "Paso 1: Divide 120 ÷ 4 para hallar 1/4 de queso. Paso 2: Multiplica ese resultado por 3."
        },
        {
          id: "frc-d4-02",
          location: "Arequipa (Valle del Colca)",
          title: "Producción de Queso Andino",
          story: "Una pequeña cooperativa produjo 60 moldes de queso paria. Se vendieron 2/3 del total en el mercado de la ciudad.",
          question: "¿Cuántos moldes de queso se vendieron en total?",
          formulaTrack: "2/3 de 60 moldes = (60 ÷ 3) × 2 = [ ? moldes ]",
          correctAnswer: 40,
          scaffold: "Paso 1: Divide 60 ÷ 3 para hallar 1/3. Paso 2: Multiplica por 2 para obtener los 2/3 vendidos."
        },
        {
          id: "frc-d4-03",
          location: "Trujillo (La Libertad)",
          title: "Transporte de Caña de Azúcar",
          story: "Un camión transporta 80 sacos de azúcar rubia. En la primera tienda se descargan las 3/5 partes del cargamento.",
          question: "¿Cuántos sacos de azúcar se descargaron en la primera tienda?",
          formulaTrack: "3/5 de 80 sacos = (80 ÷ 5) × 3 = [ ? sacos ]",
          correctAnswer: 48,
          scaffold: "Paso 1: Divide 80 ÷ 5 para calcular 1/5. Paso 2: Multiplica por 3 para obtener los 3/5 donados."
        }
      ]
    }
  ]
};

// ==============================================================
// MISIÓN SEMANA 4: OPERACIONES COMBINADAS Y ENIGMAS
// ==============================================================
export const MISSION_OPERACIONES = {
  id: "operaciones-combinadas",
  title: "Misión Semanal: Operaciones Combinadas y Enigmas",
  subtitle: "Entrenamiento de Jerarquía y Paréntesis",
  icon: "⚙️",
  stations: [
    {
      id: "estacion-1",
      number: 1,
      name: "Estación 1: Jerarquía Básica (× y ÷)",
      shortTitle: "Jerarquía Básica",
      trophy: "bronce",
      trophyName: "Trofeo de Bronce",
      trophyIcon: "🥉",
      targetExercises: 8,
      type: "rule-detector",
      description: "Identifica qué operación debe resolverse primero respetando la prioridad matemática.",
      instructions: "Selecciona la operación que tiene prioridad o el resultado correcto en 1 clic.",
      tasks: [
        {
          id: "op-r1-01",
          sequence: ["15 + 4 × 6", "¿Qué se resuelve PRIMERO?", "?"],
          options: ["4 × 6", "15 + 4", "Cualquiera"],
          correctOption: "4 × 6",
          reason: "La multiplicación siempre tiene mayor prioridad que la suma.",
          commonMistakeHint: { "15 + 4": "¡Cuidado! Nunca sumes antes de multiplicar si no hay paréntesis." }
        },
        {
          id: "op-r1-02",
          sequence: ["40 - 24 ÷ 3", "¿Qué se resuelve PRIMERO?", "?"],
          options: ["24 ÷ 3", "40 - 24", "La resta"],
          correctOption: "24 ÷ 3",
          reason: "La división tiene mayor prioridad que la resta.",
          commonMistakeHint: { "40 - 24": "La división se hace primero: 24 ÷ 3 = 8." }
        },
        {
          id: "op-r1-03",
          sequence: ["( 18 - 6 ) × 4", "¿Qué se resuelve PRIMERO?", "?"],
          options: ["( 18 - 6 )", "6 × 4", "La multiplicación"],
          correctOption: "( 18 - 6 )",
          reason: "Los paréntesis rompen la regla y siempre se resuelven antes que todo.",
          commonMistakeHint: { "6 × 4": "El paréntesis tiene la máxima prioridad siempre." }
        },
        {
          id: "op-r1-04",
          sequence: ["10 + 5 × 2", "¿Cuál es el resultado?", "?"],
          options: ["20", "30", "25"],
          correctOption: "20",
          reason: "Primero 5 × 2 = 10, luego 10 + 10 = 20.",
          commonMistakeHint: { "30": "Sumaste 10 + 5 = 15 primero (¡error de jerarquía!)." }
        },
        {
          id: "op-r1-05",
          sequence: ["30 - 12 ÷ 2", "¿Cuál es el resultado?", "?"],
          options: ["24", "9", "26"],
          correctOption: "24",
          reason: "Primero 12 ÷ 2 = 6, luego 30 - 6 = 24.",
          commonMistakeHint: { "9": "Restaste 30 - 12 = 18 y dividiste entre 2 (¡error!)." }
        },
        {
          id: "op-r1-06",
          sequence: ["( 7 + 3 ) × 5", "¿Cuál es el resultado?", "?"],
          options: ["50", "22", "38"],
          correctOption: "50",
          reason: "El paréntesis va primero: 7 + 3 = 10. Luego 10 × 5 = 50.",
          commonMistakeHint: { "22": "Omitiste los paréntesis." }
        },
        {
          id: "op-r1-07",
          sequence: ["25 - ( 15 - 5 )", "¿Cuál es el resultado?", "?"],
          options: ["15", "5", "35"],
          correctOption: "15",
          reason: "Paréntesis primero: 15 - 5 = 10. Luego 25 - 10 = 15.",
          commonMistakeHint: { "5": "Verifica la resta final: 25 - 10 = 15." }
        },
        {
          id: "op-r1-08",
          sequence: ["8 × 3 + 10 ÷ 2", "¿Cuál es el resultado?", "?"],
          options: ["29", "17", "34"],
          correctOption: "29",
          reason: "8 × 3 = 24 y 10 ÷ 2 = 5. Luego 24 + 5 = 29.",
          commonMistakeHint: { "17": "Calcula ambas operaciones y luego suma: 24 + 5." }
        }
      ]
    },
    {
      id: "estacion-2",
      number: 2,
      name: "Estación 2: Regla de Paréntesis",
      shortTitle: "Regla de Paréntesis",
      trophy: "plata",
      trophyName: "Trofeo de Plata",
      trophyIcon: "🥈",
      targetExercises: 8,
      type: "jump-track",
      description: "Resuelve operaciones de dos etapas paso a paso.",
      instructions: "Observa la secuencia y escribe el resultado final.",
      tasks: [
        {
          id: "op-j2-01",
          rule: "Paso a paso",
          ruleLabel: "Resuelve: (4 + 6) × 3 ➔ 10 × 3 ➔ [ ? ]",
          track: [10, 20, 30],
          missingIndex: 2,
          correctAnswer: 30,
          scaffold: "Jerarquía: primero resuelve el paréntesis (4 + 6 = 10). Luego multiplica ese resultado por 3."
        },
        {
          id: "op-j2-02",
          rule: "Paso a paso",
          ruleLabel: "Resuelve: (12 - 4) × 5 ➔ 8 × 5 ➔ [ ? ]",
          track: [8, 20, 40],
          missingIndex: 2,
          correctAnswer: 40,
          scaffold: "Jerarquía: primero resuelve el paréntesis (12 - 4). Luego multiplica el resultado por 5."
        },
        {
          id: "op-j2-03",
          rule: "Paso a paso",
          ruleLabel: "Resuelve: 50 - (6 × 5) ➔ 50 - 30 ➔ [ ? ]",
          track: [50, 30, 20],
          missingIndex: 2,
          correctAnswer: 20,
          scaffold: "Jerarquía: primero la multiplicación (6 × 5). Luego resta ese resultado a 50."
        },
        {
          id: "op-j2-04",
          rule: "Paso a paso",
          ruleLabel: "Resuelve: (20 + 16) ÷ 4 ➔ 36 ÷ 4 ➔ [ ? ]",
          track: [36, 18, 9],
          missingIndex: 2,
          correctAnswer: 9,
          scaffold: "Jerarquía: primero suma dentro del paréntesis (20 + 16). Luego divide esa suma entre 4."
        },
        {
          id: "op-j2-05",
          rule: "Paso a paso",
          ruleLabel: "Resuelve: (8 × 4) - 12 ➔ 32 - 12 ➔ [ ? ]",
          track: [32, 22, 20],
          missingIndex: 2,
          correctAnswer: 20,
          scaffold: "Jerarquía: primero multiplica 8 × 4. Luego réstale 12."
        },
        {
          id: "op-j2-06",
          rule: "Paso a paso",
          ruleLabel: "Resuelve: 60 ÷ (2 + 4) ➔ 60 ÷ 6 ➔ [ ? ]",
          track: [60, 30, 10],
          missingIndex: 2,
          correctAnswer: 10,
          scaffold: "Jerarquía: primero suma dentro del paréntesis (2 + 4). Luego divide 60 entre esa suma."
        },
        {
          id: "op-j2-07",
          rule: "Paso a paso",
          ruleLabel: "Resuelve: (15 + 25) ÷ 5 ➔ 40 ÷ 5 ➔ [ ? ]",
          track: [40, 20, 8],
          missingIndex: 2,
          correctAnswer: 8,
          scaffold: "Jerarquía: primero suma dentro del paréntesis (15 + 25). Luego divide esa suma entre 5."
        },
        {
          id: "op-j2-08",
          rule: "Paso a paso",
          ruleLabel: "Resuelve: (7 × 7) - 19 ➔ 49 - 19 ➔ [ ? ]",
          track: [49, 39, 30],
          missingIndex: 2,
          correctAnswer: 30,
          scaffold: "Jerarquía: primero la multiplicación (7 × 7). Luego réstale 19."
        }
      ]
    },
    {
      id: "estacion-3",
      number: 3,
      name: "Estación 3: Enigmas de Dos Etapas (Oro)",
      shortTitle: "Enigmas de Dos Etapas",
      trophy: "oro",
      trophyName: "Trofeo de Oro",
      trophyIcon: "🥇",
      targetExercises: 8,
      type: "function-machine",
      description: "Calcula operaciones combinadas directas aplicando orden riguroso.",
      instructions: "Resuelve la expresión combinada respetando la jerarquía.",
      tasks: [
        {
          id: "op-m3-01",
          ruleDisplay: "REGLA: Paréntesis primero, luego × y ÷, finalmente + y -",
          table: [
            { in: "12 + ( 5 × 6 )", out: 42 },
            { in: "45 - ( 8 × 4 )", out: "?" }
          ],
          prompt: "Calcula: 45 - ( 8 × 4 )",
          correctAnswer: 13,
          scaffold: "Paso 1: Multiplica 8 × 4. Paso 2: Resta ese resultado a 45 (45 - producto)."
        },
        {
          id: "op-m3-02",
          ruleDisplay: "REGLA: Paréntesis primero, luego × y ÷, finalmente + y -",
          table: [
            { in: "( 18 ÷ 2 ) + ( 7 × 3 )", out: "?" }
          ],
          prompt: "Calcula: ( 18 ÷ 2 ) + ( 7 × 3 )",
          correctAnswer: 30,
          scaffold: "Paso 1: Divide 18 ÷ 2. Paso 2: Multiplica 7 × 3. Paso 3: Suma ambos resultados."
        },
        {
          id: "op-m3-03",
          ruleDisplay: "REGLA: Paréntesis primero, luego × y ÷, finalmente + y -",
          table: [
            { in: "( 50 - 20 ) ÷ 6", out: "?" }
          ],
          prompt: "Calcula: ( 50 - 20 ) ÷ 6",
          correctAnswer: 5,
          scaffold: "Paso 1: Resuelve la resta entre paréntesis (50 - 20). Paso 2: Divide ese resultado entre 6."
        },
        {
          id: "op-m3-04",
          ruleDisplay: "REGLA: Paréntesis primero, luego × y ÷, finalmente + y -",
          table: [
            { in: "6 × ( 4 + 5 )", out: "?" }
          ],
          prompt: "Calcula: 6 × ( 4 + 5 )",
          correctAnswer: 54,
          scaffold: "Paso 1: Suma dentro del paréntesis (4 + 5). Paso 2: Multiplica 6 por esa suma."
        },
        {
          id: "op-m3-05",
          ruleDisplay: "REGLA: Paréntesis primero, luego × y ÷, finalmente + y -",
          table: [
            { in: "( 9 × 9 ) - ( 10 × 3 )", out: "?" }
          ],
          prompt: "Calcula: ( 9 × 9 ) - ( 10 × 3 )",
          correctAnswer: 51,
          scaffold: "Paso 1: Multiplica 9 × 9. Paso 2: Multiplica 10 × 3. Paso 3: Resta ambos productos."
        },
        {
          id: "op-m3-06",
          ruleDisplay: "REGLA: Paréntesis primero, luego × y ÷, finalmente + y -",
          table: [
            { in: "80 - ( 6 × 8 )", out: "?" }
          ],
          prompt: "Calcula: 80 - ( 6 × 8 )",
          correctAnswer: 32,
          scaffold: "Paso 1: Resuelve primero la multiplicación (6 × 8). Paso 2: Réstala de 80."
        },
        {
          id: "op-m3-07",
          ruleDisplay: "REGLA: Paréntesis primero, luego × y ÷, finalmente + y -",
          table: [
            { in: "( 100 ÷ 10 ) + ( 6 × 7 )", out: "?" }
          ],
          prompt: "Calcula: ( 100 ÷ 10 ) + ( 6 × 7 )",
          correctAnswer: 52,
          scaffold: "Paso 1: Divide 100 ÷ 10. Paso 2: Multiplica 6 × 7. Paso 3: Suma ambos resultados."
        },
        {
          id: "op-m3-08",
          ruleDisplay: "REGLA: Paréntesis primero, luego × y ÷, finalmente + y -",
          table: [
            { in: "( 72 ÷ 8 ) × ( 15 - 11 )", out: "?" }
          ],
          prompt: "Calcula: ( 72 ÷ 8 ) × ( 15 - 11 )",
          correctAnswer: 36,
          scaffold: "Paso 1: Divide 72 ÷ 8. Paso 2: Resta (15 - 11). Paso 3: Multiplica ambos resultados."
        }
      ]
    },
    {
      id: "estacion-diamante",
      number: 4,
      name: "Reto Diamante: Desafíos Integrados",
      shortTitle: "Desafíos Integrados",
      trophy: "diamante",
      trophyName: "Trofeo de Diamante",
      trophyIcon: "💎",
      targetExercises: 3,
      type: "applied-problem",
      isOptionalMastery: true,
      description: "Problemas verbales contextualizados de dos etapas.",
      instructions: "Lee atentamente la situación y escribe tu respuesta final.",
      tasks: [
        {
          id: "op-d4-01",
          location: "Lima (Librería Escolar)",
          title: "Útiles Escolares La Salle",
          story: "Un salón compró 5 paquetes con 12 cuadernos cada uno para el inicio de clases. Además, la profesora aportó 25 cuadernos más que tenía en su casillero.",
          question: "¿Cuántos cuadernos en total tiene el salón?",
          formulaTrack: "( 5 × 12 ) + 25 = 60 + 25 = [ ? cuadernos ]",
          correctAnswer: 85,
          scaffold: "Paso 1: Multiplica 5 docenas (5 × 12). Paso 2: Suma los 25 cuadernos sueltos."
        },
        {
          id: "op-d4-02",
          location: "Ayacucho (Barrio de Santa Ana)",
          title: "Taller Artesanal de Retablos",
          story: "Un maestro artesano elaboró 4 docenas de retablos ayacuchanos (1 docena = 12 unidades). En la feria regional logró vender 18 retablos.",
          question: "¿Cuántos retablos le quedaron por vender?",
          formulaTrack: "( 4 × 12 ) - 18 = 48 - 18 = [ ? retablos ]",
          correctAnswer: 30,
          scaffold: "Paso 1: Multiplica 4 docenas de retablos (4 × 12). Paso 2: Resta los 18 que se vendieron."
        },
        {
          id: "op-d4-03",
          location: "Tacna (Valle de Sama)",
          title: "Cosecha de Olivos",
          story: "Tres agricultores recolectaron 6 baldes de aceitunas con 15 kg cada uno. Al clasificar la fruta, separaron 16 kg dañados.",
          question: "¿Cuántos kilogramos de aceitunas seleccionadas quedaron en buen estado?",
          formulaTrack: "( 6 × 15 ) - 16 = 90 - 16 = [ ? kg ]",
          correctAnswer: 74,
          scaffold: "Paso 1: Multiplica 6 cajones por 15 kg (6 × 15). Paso 2: Resta los 16 kg descartados."
        }
      ]
    }
  ]
};

// ==============================================================
// FUNCIÓN CENTRAL: OBTENER MISIÓN SEGÚN TEMA SELECCIONADO
// ==============================================================
export function getWeeklyMission(topicId) {
  if (topicId === 'division-reparto') return MISSION_DIVISION;
  if (topicId === 'fracciones-unidad') return MISSION_FRACCIONES;
  if (topicId === 'operaciones-combinadas') return MISSION_OPERACIONES;
  return WEEKLY_MISSION;
}


