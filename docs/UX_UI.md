# 🎨 UX/UI: Sistema de Diseño y Experiencia de Usuario
## Expedición Matemática Perú • Colegio La Salle School (2026)

---

## 1. Filosofía de Diseño y Experiencia

La experiencia de usuario está optimizada para **estudiantes de 4.° grado de primaria (9 a 10 años)** y su **docente de aula**:
1. **Claridad Cognitiva:** Cero desorden visual. La interfaz guía la atención del estudiante al ejercicio matemático activo.
2. **Refuerzo Positivo Constante:** Animaciones sutiles, micro-sonidos de celebración y estrellas acumulables que premian el esfuerzo y no solo la velocidad.
3. **Ergonomía Táctil y de Escritorio:** Botones con áreas de contacto mínimas de **44 × 44 px**, adecuados tanto para dedos en tablets como para el ratón en computadoras de laboratorio.

---

## 2. Sistema de Temas Dual (Dual Theme System)

La aplicación soporta dos temas visuales conmutables con persistencia en `localStorage`:

### 2.1 Tema 1: Andino Institucional (`data-theme="andina"`) • Predeterminado
Inspirado en la geografía y riqueza cultural peruana:
* **Fondo Principal:** Gradiente suave de cielo andino con texturas de lago y totoras.
* **Azul Marino Institucional (`--bg-surface`):** `#1e3a5f` con bordes dorados suaves.
* **Dorado Inca (`--color-gold`):** `#d97706` para trofeos, metas y emblemas.
* **Verde Éxito (`--color-success`):** `#15803d` para estrellas y respuestas correctas.
* **Sensación:** Cálida, escolar, respetuosa de la identidad La Salle.

### 2.2 Tema 2: Cyber-Tech Satrix (`data-theme="cyber"`)
Diseñado para momentos de gamificación y alta concentración:
* **Fondo Principal:** Azul profundo espacial `#0b132b`.
* **Verde Neón Cyber (`--neon-green`):** `#00ff9d` para bordes activos, botones principales y resaltados.
* **Vidrio Translúcido (*Glassmorphism*):** Paneles con `backdrop-filter: blur(12px)` y sombras con resplandor neón.
* **Sensación:** Futurista, estimulante para dinámicas tipo videojuego matemático.

---

## 3. Paleta de Colores Semántica y Jerarquía de Salones

| Color / Token | Valor Hex / Variable | Significado Semántico |
| :--- | :--- | :--- |
| **Color Sigma** | `#7c3aed` (Púrpura Vibrante) | Identidad oficial del salón **4.° Sigma**. |
| **Color Delta** | `#0284c7` (Azul Océano) | Identidad oficial del salón **4.° Delta**. |
| **Éxito / Correcto** | `#10b981` / `#00ff9d` | Aciertos, estrellas ganadas, validaciones de PIN disponibles. |
| **Error / Alerta** | `#ef4444` / `#f87171` | Respuestas incorrectas, PIN repetido, botón de eliminar alumno. |
| **Atención / Pista** | `#f59e0b` / `#fbbf24` | Trofeo de Oro, pistas pedagógicas de andamiaje, advertencias. |
| **Texto Principal** | `#ffffff` / `#f8fafc` | Lectura de alta legibilidad sobre fondos oscuros (contraste WCAG AAA). |
| **Texto Secundario**| `#94a3b8` / `#cbd5e1` | Metadatos, etiquetas y subtítulos informativos. |

---

## 4. Tipografía y Legibilidad Escolar

La plataforma utiliza 3 familias tipográficas complementarias:
1. **`Plus Jakarta Sans` / `Segoe UI` (Cuerpo de texto y consignas):**
   * Fuentes de alta legibilidad con espaciado generoso para facilitar la comprensión lectora de enunciados matemáticos.
2. **`JetBrains Mono` / `Consolas` (Números, PINs, datos y tablas):**
   * Tipografía monoespaciada donde cada dígito ocupa exactamente el mismo ancho. Impide la desalineación de columnas de números o sumas verticales.
3. **`Space Grotesk` (Títulos, medallas y cabeceras):**
   * Carácter moderno y lúdico para celebraciones y nombres de estaciones.

---

## 5. Sistema de Sonido y Respuestas Hápticas (Web Audio API)

Para evitar la descarga de archivos MP3 externos lentos, los sonidos se sintetizan internamente en el navegador mediante osciladores Web Audio API nativos:
* **Tono de Acierto (`correct`):** Secuencia de 2 notas ascendentes brillantes (523Hz y 659Hz) al acertar un micro-ejercicio.
* **Tono de Error (`error`):** Frecuencia baja suave (220Hz) que señala la necesidad de revisar sin sonar estridente ni castigador.
* **Tono de Celebración (`celebration`):** Acorde festivo triádico mayor (C-E-G) al conquistar una estación y desbloquear un trofeo.
* **Control de Silencio:** Botón flotante accesible en todo momento para silenciar el audio en salones de clase silenciosos.

---

## 6. Componentes Reutilizables de Interfaz

### 6.1 Avatares de Identidad Peruana (SVG Dinámicos)
Seis avatares emblemáticos renderizados vectorialmente para cada estudiante:
* **Cóndor Andino:** Majestuosidad y visión de altura.
* **Vicuña Altiplánica:** Rapidez y perseverancia.
* **Chasqui Mensajero:** Agilidad y cálculo continuo.
* **Delfín Rosado Amazónico:** Inteligencia y curiosidad.
* **Puma Costero/Andino:** Precisión y fuerza de razonamiento.
* **Alpaca Cordillerana:** Calidez y constancia.

### 6.2 Modales de Interacción Protegida
* **Diseño:** Centrados con fondo semitransparente oscuro (*backdrop overlay*) y animación suave de entrada (*pop-in*).
* **Teclado:** Respaldados con atajos estándar (`Escape` para cerrar, `Enter` para confirmar).
* **Casos:**
  1. *Modal de Victoria de Estación:* Muestra el trofeo girando y botón a la siguiente estación.
  2. *Modal de Pausa:* Permite al niño salir a comer o descansar sin perder su avance.
  3. *Modal de Edición Docente:* Edición de nombres, usuario y PIN con validación reactiva en tiempo real.
  4. *Modal de Ficha A4 y Tarjetas:* Previsualizaciones integradas con botón de impresión directa.
