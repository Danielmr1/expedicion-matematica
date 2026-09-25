# 📘 PRD: Documento de Requisitos del Producto (Product Requirements Document)
## Plataforma «Expedición Matemática Perú» • Colegio La Salle School (2026)

---

## 1. Visión y Propósito del Producto

### 1.1 Declaración de Misión
**Expedición Matemática Perú** es un ecosistema educativo digital y gamificado de práctica matemática continua para estudiantes de **4.° de Primaria** (Secciones **4.° Sigma** y **4.° Delta**), diseñado bajo la fusión pedagógica de la **metodología finlandesa (Eduten / Universidad de Turku)** y el **Currículo Nacional del Perú (Santillana / MINEDU)**.

### 1.2 Objetivos Estratégicos
1. **Fluidez Matemática Activa:** Lograr que cada estudiante resuelva más de **100 micro-operaciones cognitivas por semana** en sesiones cortas de 15 a 20 minutos sin fatiga mental.
2. **Eliminación del Miedo al Error:** Reemplazar la penalización de notas reprobatorias tradicionales por un sistema formativo de reintentos inmediatos, andamiaje visual progresivo y pistas de razonamiento.
3. **Control Docente en Tiempo Real:** Proveer al profesor un panel centralizado de diagnóstico automático para detectar dificultades tempranas (*misconceptions*), gestionar nóminas escolares y generar material fotocopiable en 1 clic.
4. **Arquitectura Escalable:** Estructura modular lista para expandirse de 1.° a 6.° de primaria respetando el aislamiento pedagógico estricto entre grados.

---

## 2. Usuarios y Personas (Personas & Roles)

### 2.1 El Estudiante de Primaria (9 - 10 años)
* **Perfil:** Niños y niñas de 4.° Sigma y 4.° Delta.
* **Características cognitivas:** Necesidad de retroalimentación inmediata, alta receptividad a estímulos visuales limpios (gamificación, avatares, estrellas, trofeos) y baja tolerancia a fricciones de autenticación (contraseñas complejas olvidadas).
* **Casos de Uso:**
  * Iniciar sesión rápidamente con su usuario institucional y su **clave PIN de 4 dígitos**.
  * Seleccionar su avatar de fauna/cultura peruana (Cóndor, Vicuña, Chasqui, Delfín Rosado, Puma, Alpaca).
  * Recorrer las 4 estaciones semanales a su propio ritmo.
  * Superar micro-ejercicios visuales con retroalimentación instantánea y pistas de andamiaje.
  * Alcanzar la meta oficial de la semana (**Trofeo de Oro 🥇**) y retarse en el **Reto Diamante 💎**.
  * Pausar y reanudar su sesión sin perder avance.

### 2.2 El Docente de Matemáticas
* **Perfil:** Profesor titular del ciclo en Colegio La Salle School.
* **Puntos de dolor previos:** Corrección manual de cuadernos, falta de diagnóstico precoz de confusiones de conceptos, dificultad para monitorear dos salones en paralelo.
* **Casos de Uso:**
  * Ingresar con autenticación criptográfica segura (clave mensual o clave maestra).
  * Conmutar entre salones independientes (**4.° Sigma** y **4.° Delta**) viendo métricas en vivo.
  * Activar la **Misión Semanal Oficial** para todo el grado.
  * Utilizar el **Modo Simulador Docente (Alumno Virtual)** para probar la experiencia del estudiante antes de la clase.
  * Administrar la nómina escolar: editar nombres, apellidos y PINs únicos; matricular nuevos alumnos; retirar permanentemente alumnos con recálculo automático de promedios.
  * Imprimir **Tarjetas de Credenciales con PIN** (formato A4 recortable para pegar en cuadernos).
  * Descargar la **Ficha de Trabajo A4** de 1 sola página para el trabajo manual en el aula.
  * Exportar reportes detallados en formato **Excel / CSV**.

---

## 3. Principios Pedagógicos y Reglas de Negocio

### 3.1 Progresión por Estaciones (Metodología Turku / Eduten)
Cada tema semanal se estructura en 4 estaciones progresivas:
1. **Estación 1 • Detección Conceptual (Trofeo de Bronce 🥉):**
   * *Objetivo:* 8 micro-ejercicios de discriminación rápida. Identificación del concepto base (ej. diferenciar patrón aditivo vs. multiplicativo, reparto exacto vs. inexacto).
2. **Estación 2 • Práctica Procedimental (Trofeo de Plata 🥈):**
   * *Objetivo:* 10 ejercicios con andamiaje visual (recta numérica, tablas de función, descomposición).
3. **Estación 3 • Consolidación y Reversibilidad (Trofeo de Oro 🥇 - Meta Oficial):**
   * *Objetivo:* 8 ejercicios de nivel intermedio-avanzado que requieren pensamiento inverso (despejar incógnitas, completar secuencias bidireccionales).
   * *Criterio de Éxito:* Alcanzar la Estación 3 otorga la condición de "Semana Cumplida".
4. **Reto Diamante 💎 • Aplicación Contextualizada:**
   * *Objetivo:* 3 problemas aplicados en contextos peruanos (telares de Chinchero, piscigranjas de Huancayo, mercados locales).

### 3.2 Diagnóstico Formativo de Dificultades Típicas (4 Obligatorias)
Cada tema debe clasificar y contabilizar automáticamente las fallas en:
* `confusion` (Rojo `#ef4444`): Error conceptual básico inicial.
* `jump` (Ámbar `#f59e0b`): Falla en la regularidad o paso intermedio.
* `calc` (Azul `#3b82f6`): Tropiezo en cálculo mental o reversibilidad.
* `clean` (Verde `var(--neon-green)`): Dominio fluido sin errores.

### 3.3 Reglas de Negocio de Estudiantes y Credenciales
1. **Unicidad de PIN Escolar:** Todo alumno tiene un PIN numérico de exactamente **4 dígitos**. Ningún alumno del colegio puede compartir el mismo PIN con otro (validador global).
2. **Generación Inteligente de Usuario:** El nombre de usuario institucional sigue el estándar `primerNombre.primerApellido` (ej. `josias.alvarado`), sanitizado de tildes y caracteres especiales. Solo se actualiza automáticamente si se edita el primer nombre o el apellido paterno principal.
3. **Ordenamiento Alfabético Oficial:** Cualquier adición, edición o retiro de alumnos reordena automáticamente toda el aula alfabéticamente por apellidos (`localeCompare(..., 'es')`) y reasigna los números de lista correlativos (`N° 01, 02, 03...`).
4. **Eliminación y Recálculo:** Al retirar un alumno, sus puntos y estrellas se descuentan de los totales del aula y el promedio de la clase se recalcula en tiempo real sobre los alumnos activos.
5. **Pausa de Seguridad Anti-Fuerza Bruta:** Si un estudiante comete 4 intentos fallidos consecutivos de inicio de sesión, el sistema aplica una pausa de 30 segundos; al 5to fallo, 60 segundos; al 6to+, 120 segundos.

---

## 4. Requisitos Funcionales por Módulo

| Módulo | Requisito Funcional | Criterio de Aceptación |
| :--- | :--- | :--- |
| **RF-01: Login** | Autenticación diferenciada (Docente vs. Alumno). | Docente ingresa con usuario profesor y hash SHA-256. Alumno ingresa con usuario + PIN 4 dígitos. |
| **RF-02: Pausa de Seguridad** | Bloqueo temporal ante intentos fallidos reiterados. | Al 4to error, bloquea inputs y muestra cuenta regresiva visible. |
| **RF-03: Práctica Activa** | Despliegue de micro-tareas con retroalimentación inmediata. | Botones de selección múltiple o teclado numérico; feedback visual y sonoro instantáneo. |
| **RF-04: Andamiaje** | Pistas ante error común (`commonMistakeHint`) y pasos guiados. | Muestra pista pedagógica sin revelar la respuesta de inmediato. |
| **RF-05: Dashboard Docente** | Monitoreo dual independiente (4.° Sigma vs. 4.° Delta). | Muestra totales de alumnos, minutos de práctica, estrellas y semáforo de trofeos. |
| **RF-06: Gestión Alumnos** | Edición, adición y eliminación permanente de estudiantes. | Modal con validación de PIN único en vivo y reordenamiento alfabético automático. |
| **RF-07: Alumno Virtual** | Simulación de la experiencia del estudiante para el docente. | Botón ubicado junto a Ficha A4 y Excel; no altera métricas reales del aula. |
| **RF-08: Tarjetas Credenciales** | Impresión de tarjetas recortables A4 con PIN. | Directo del salón seleccionado, 8 por hoja, con líneas de corte para cuaderno. |
| **RF-09: Ficha A4 Cuaderno** | Generación de hoja fotocopiable en escala de grises. | 1 sola página A4 que incluye los 4 momentos didácticos (Analiza, Práctica, Cálculo, Problemas). |
| **RF-10: Exportación CSV** | Descarga de datos para registros oficiales y Excel. | Codificación UTF-8 con BOM (`\uFEFF`) para preservar tildes y letra ñ en Excel. |

---

## 5. Requisitos No Funcionales (NFR)
* **Rendimiento:** Carga inicial inferior a 1 segundo en conexiones escolares estándar (sin frameworks pesados).
* **Compatibilidad:** 100% operativo en Chrome, Edge, Safari, Firefox y navegadores móviles de tablets y celulares.
* **Seguridad:** Cero contraseñas de profesor en texto plano en el cliente (hashes SHA-256 irreversibles).
* **Disponibilidad Offline-First:** Persistencia en `localStorage` con sincronización asíncrona hacia Supabase.
* **Accesibilidad:** Alto contraste, tamaños táctiles mínimos de 44px y diseño responsivo adaptativo.
