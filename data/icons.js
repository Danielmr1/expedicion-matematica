// Iconos vectoriales modernos (Estilo Cyber-Tech / Satrix / Tabler)
export const ICONS = {
  // Logo Pixelado Geométrico Matemático
  pixelLogo: (size = 32, color = 'var(--neon-green)') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
      <rect x="6" y="2" width="12" height="3" fill="${color}" />
      <rect x="3" y="5" width="4" height="3" fill="${color}" />
      <rect x="5" y="8" width="14" height="3" fill="${color}" />
      <rect x="11" y="11" width="8" height="3" fill="${color}" />
      <rect x="5" y="14" width="14" height="3" fill="${color}" />
      <rect x="3" y="17" width="4" height="3" fill="${color}" />
      <rect x="6" y="20" width="12" height="3" fill="${color}" />
    </svg>
  `,

  // Ondas de Lago / Expedición
  ripple: (size = 20, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-ripple" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 7c3 -2 6 -2 9 0s6 2 9 0" />
      <path d="M3 17c3 -2 6 -2 9 0s6 2 9 0" />
      <path d="M3 12c3 -2 6 -2 9 0s6 2 9 0" />
    </svg>
  `,

  // Candado cerrado (con trazo y color personalizable)
  lock: (size = 20, color = 'currentColor', fill = 'none') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-tabler-lock" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6" />
      <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
      <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
    </svg>
  `,

  // Candado abierto / Desbloqueado
  unlock: (size = 20, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6"/>
      <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
      <path d="M8 11v-5a4 4 0 0 1 8 0"/>
    </svg>
  `,

  // Trofeo Vectorial
  trophy: (size = 20, color = 'var(--color-gold)') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M8 21l8 0"/>
      <path d="M12 17l0 4"/>
      <path d="M7 4l10 0"/>
      <path d="M17 4v8a5 5 0 0 1 -10 0v-8"/>
      <path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
      <path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
    </svg>
  `,

  // Estrella
  star: (size = 18, color = 'var(--color-gold)') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none" style="display:inline-block; vertical-align:middle;">
      <path d="M12 1.5l2.8 6.9 7.4.6-5.6 4.9 1.7 7.3-6.3-3.8-6.3 3.8 1.7-7.3-5.6-4.9 7.4-.6z"/>
    </svg>
  `,

  // Rayo / Energía XP
  bolt: (size = 18, color = 'var(--neon-green)') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none" style="display:inline-block; vertical-align:middle;">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  `,

  // Impresora
  printer: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/>
      <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/>
      <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"/>
    </svg>
  `,

  // Descarga
  download: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/>
      <path d="M7 11l5 5l5 -5"/>
      <path d="M12 4l0 12"/>
    </svg>
  `,

  // Documento / Ficha
  fileText: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
      <path d="M9 9l1 0"/>
      <path d="M9 13l6 0"/>
      <path d="M9 17l6 0"/>
    </svg>
  `,

  // Reloj / Tiempo
  clock: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
      <path d="M12 7v5l3 3"/>
    </svg>
  `,

  // Usuario / Alumno
  user: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/>
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>
    </svg>
  `,

  // Cerrar Sesión / Salir
  logout: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/>
      <path d="M9 12h12l-3 -3"/>
      <path d="M18 15l3 -3"/>
    </svg>
  `,

  // Flecha Adelante
  arrowRight: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M5 12l14 0"/>
      <path d="M13 18l6 -6"/>
      <path d="M13 6l6 6"/>
    </svg>
  `,

  // Check / Verificado
  check: (size = 18, color = 'var(--color-success)') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M5 12l5 5l10 -10"/>
    </svg>
  `,

  // Tijeras (para tarjetas de corte)
  scissors: (size = 16, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
      <path d="M6 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
      <path d="M8.6 8.6l10.4 10.4"/>
      <path d="M8.6 15.4l10.4 -10.4"/>
    </svg>
  `,

  // Insignia / Corona
  badge: (size = 18, color = 'var(--neon-green)') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 3l8 4.5l0 9a12 12 0 0 1 -8 7.5a12 12 0 0 1 -8 -7.5l0 -9l8 -4.5"/>
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
    </svg>
  `,

  // Brújula / Orientación (Modo Expedición)
  compass: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M8 16l2 -6l6 -2l-2 6l-6 2" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    </svg>
  `,

  // Foco / Bombilla / Idea
  lightbulb: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
      <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
      <path d="M9.7 17l4.6 0" />
    </svg>
  `,

  // Escudo Verificado / Seguridad sin pérdida de vidas
  shieldCheck: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
      <path d="M9 12l2 2l4 -4" />
    </svg>
  `,

  // Cuaderno / Libro Escolar La Salle
  book: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
      <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
      <path d="M3 6l0 13" />
      <path d="M12 6l0 13" />
      <path d="M21 6l0 13" />
    </svg>
  `,

  // Sonido / Audio Activo
  volume: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M15 8a5 5 0 0 1 0 8" />
      <path d="M17.7 5a9 9 0 0 1 0 14" />
      <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v16a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
    </svg>
  `,

  // Sonido Silenciado (Mute)
  volumeMute: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v16a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
      <path d="M16 10l4 4m0 -4l-4 4" />
    </svg>
  `,

  // Menú Tres Puntos (Kebab Menu)
  dotsVertical: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <circle cx="12" cy="12" r="1.5" fill="${color}" />
      <circle cx="12" cy="5" r="1.5" fill="${color}" />
      <circle cx="12" cy="19" r="1.5" fill="${color}" />
    </svg>
  `,

  // Ajustes / Configuración
  settings: (size = 18, color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,

  // Insignia / Ícono Vectorial de Felicitación Temática (Acierto de Micro-Ejercicio)
  feedbackSuccess: (theme = 'andina', size = 32) => {
    if (theme === 'cyber') {
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
          <polygon points="18,2 33,10 33,26 18,34 3,26 3,10" fill="rgba(132, 255, 0, 0.18)" stroke="#84ff00" stroke-width="2"/>
          <circle cx="18" cy="18" r="9.5" fill="rgba(132, 255, 0, 0.3)"/>
          <path d="M12 18 L16 22 L24 13" stroke="#84ff00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="8" cy="9" r="1.5" fill="#ffffff"/>
          <circle cx="28" cy="27" r="1.5" fill="#84ff00"/>
        </svg>
      `;
    }
    // andina / expedicion: Estrella Inti Dorada Ceremonial
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
        <circle cx="18" cy="18" r="15" fill="rgba(245, 158, 11, 0.2)" stroke="#d97706" stroke-width="1.8"/>
        <!-- Rayos ceremoniales Inti -->
        <path d="M18 3 L18 6 M18 30 L18 33 M3 18 L6 18 M30 18 L33 18 M7 7 L9.5 9.5 M26.5 26.5 L29 29 M7 29 L9.5 26.5 M26.5 9.5 L29 7" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
        <circle cx="18" cy="18" r="10" fill="#fef3c7" stroke="#b45309" stroke-width="1.5"/>
        <path d="M12.5 18 L16.5 22 L23.5 14" stroke="#b45309" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  },

  // Foco / Bombilla Vectorial para Pistas de Apoyo Pedagógico
  feedbackHint: (size = 30) => `
    <svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
      <circle cx="18" cy="18" r="15" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" stroke-width="1.6"/>
      <path d="M13 14a5 5 0 1 1 10 0a4 4 0 0 0 -2 3.5v1.5h-6v-1.5a4 4 0 0 0 -2 -3.5" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="1.8"/>
      <path d="M15 22h6m-5 3h4" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="18" cy="13" r="1.5" fill="#fef08a"/>
    </svg>
  `
};

// Avatares Cyber-Vectoriales estilizados (Perú Tech / Andinos)
export const CYBER_AVATARS = {
  condor: {
    name: 'Cóndor Andino',
    tag: 'CNDR-01',
    color: 'var(--color-sigma)',
    svg: (size = 40) => `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="var(--bg-surface-elevated, #141416)" stroke="var(--border-subtle, #27272a)" />
        <path d="M20 9L27 19H23L26 27H20L21 31H19L20 27H14L17 19H13L20 9Z" fill="var(--color-sigma)" />
        <circle cx="20" cy="14" r="2" fill="var(--bg-canvas, #09090b)" />
      </svg>
    `
  },
  vicuna: {
    name: 'Vicuña Real',
    tag: 'VIC-02',
    color: 'var(--color-delta)',
    svg: (size = 40) => `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="var(--bg-surface-elevated, #141416)" stroke="var(--border-subtle, #27272a)" />
        <path d="M15 11C15 9.89543 15.8954 9 17 9H23C24.1046 9 25 9.89543 25 11V18H28V24H25V31H21V25H19V31H15V22L17 18V11H15Z" fill="var(--color-delta)" />
        <circle cx="22" cy="12" r="1.5" fill="var(--bg-canvas, #09090b)" />
      </svg>
    `
  },
  chasqui: {
    name: 'Chasqui Veloz',
    tag: 'CHSQ-03',
    color: 'var(--color-delta)',
    svg: (size = 40) => `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="var(--bg-surface-elevated, #141416)" stroke="var(--border-subtle, #27272a)" />
        <circle cx="22" cy="11" r="3" fill="var(--color-delta)" />
        <path d="M14 18L19 16L24 19L28 17L27 20L23 21L21 26L25 31H21L18 27L15 31H11L16 23L14 18Z" fill="var(--color-delta)" />
      </svg>
    `
  },
  delfin: {
    name: 'Delfín Rosado',
    tag: 'DLF-04',
    color: '#f43f5e',
    svg: (size = 40) => `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="var(--bg-surface-elevated, #141416)" stroke="var(--border-subtle, #27272a)" />
        <path d="M10 22C13 14 24 10 29 13C31 14 31 17 28 19C25 21 21 21 17 25C15 27 12 29 9 29C11 26 10 24 10 22Z" fill="#f43f5e" />
        <circle cx="26" cy="15" r="1.5" fill="var(--bg-canvas, #09090b)" />
      </svg>
    `
  },
  puma: {
    name: 'Puma Andino',
    tag: 'PMA-05',
    color: 'var(--color-gold)',
    svg: (size = 40) => `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="var(--bg-surface-elevated, #141416)" stroke="var(--border-subtle, #27272a)" />
        <path d="M12 12L15 16H25L28 12L27 18C29 20 29 24 25 27L20 30L15 27C11 24 11 20 13 18L12 12Z" fill="var(--color-gold)" />
        <circle cx="16" cy="21" r="1.5" fill="var(--bg-canvas, #09090b)" />
        <circle cx="24" cy="21" r="1.5" fill="var(--bg-canvas, #09090b)" />
      </svg>
    `
  },
  alpaca: {
    name: 'Alpaca Andina',
    tag: 'ALPC-06',
    color: 'var(--color-sigma)',
    svg: (size = 40) => `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="var(--bg-surface-elevated, #141416)" stroke="var(--border-subtle, #27272a)" />
        <path d="M16 10C16 9 17 8 18 8H22C23 8 24 9 24 10V16C26 17 28 20 28 23V30H24V25H22V30H18V25H16V22L18 17V10H16Z" fill="var(--color-sigma)" />
        <circle cx="21" cy="11" r="1.5" fill="var(--bg-canvas, #09090b)" />
      </svg>
    `
  }
};

// ===================================================================
// EMBLEMAS DE RANGO ADAPTATIVOS (EXPEDICIÓN VS CIBER-NAVE)
// Sin iconos genéricos: Identidad ceremonial andina vs Tecnología espacial
// ===================================================================
export const THEMED_EMBLEMS = {
  expedicion: {
    bronce: {
      name: 'Brújula Solar Andina',
      article: 'la',
      tierLabel: 'Bronce',
      short: 'Brújula',
      color: '#b78f5c',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <circle cx="24" cy="24" r="21" stroke="#b78f5c" stroke-width="2" stroke-dasharray="3 3" fill="rgba(183, 143, 92, 0.08)"/>
          <circle cx="24" cy="24" r="17" stroke="#b78f5c" stroke-width="1.5"/>
          <!-- Rumbos Cardinales -->
          <line x1="24" y1="4" x2="24" y2="8" stroke="#9a6a3b" stroke-width="2" stroke-linecap="round"/>
          <line x1="24" y1="40" x2="24" y2="44" stroke="#9a6a3b" stroke-width="2" stroke-linecap="round"/>
          <line x1="4" y1="24" x2="8" y2="24" stroke="#9a6a3b" stroke-width="2" stroke-linecap="round"/>
          <line x1="40" y1="24" x2="44" y2="24" stroke="#9a6a3b" stroke-width="2" stroke-linecap="round"/>
          <!-- Aguja de 4 Puntas Solar -->
          <polygon points="24,9 27,24 24,21" fill="#b78f5c"/>
          <polygon points="24,9 21,24 24,21" fill="#9a6a3b"/>
          <polygon points="24,39 27,24 24,27" fill="#9a6a3b"/>
          <polygon points="24,39 21,24 24,27" fill="#b78f5c"/>
          <polygon points="39,24 24,27 27,24" fill="#b78f5c"/>
          <polygon points="39,24 24,21 27,24" fill="#9a6a3b"/>
          <polygon points="9,24 24,27 21,24" fill="#9a6a3b"/>
          <polygon points="9,24 24,21 21,24" fill="#b78f5c"/>
          <!-- Centro Solar Dorado -->
          <circle cx="24" cy="24" r="3.5" fill="#f8f6f0" stroke="#9a6a3b" stroke-width="1.5"/>
          <circle cx="24" cy="24" r="1.5" fill="#244663"/>
        </svg>
      `
    },
    plata: {
      name: 'Sendero de Olas del Lago',
      article: 'el',
      tierLabel: 'Plata',
      short: 'Sendero',
      color: '#94a3b8',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <!-- Medallón de Plata Escudo Fluido -->
          <rect x="4" y="4" width="40" height="40" rx="12" fill="rgba(148, 163, 184, 0.12)" stroke="#94a3b8" stroke-width="2"/>
          <rect x="8" y="8" width="32" height="32" rx="8" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2 2"/>
          <!-- Olas Ancestrales del Titicaca -->
          <path d="M12 28 C16 23, 20 23, 24 28 C28 33, 32 33, 36 28" stroke="#64748b" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M12 20 C16 15, 20 15, 24 20 C28 25, 32 25, 36 20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <path d="M16 12 C18 9, 21 9, 24 12 C27 15, 30 15, 32 12" stroke="#e2e8f0" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          <!-- Gotas de Luz de Plata -->
          <circle cx="24" cy="37" r="2.5" fill="#cbd5e1"/>
          <circle cx="16" cy="37" r="1.5" fill="#94a3b8"/>
          <circle cx="32" cy="37" r="1.5" fill="#94a3b8"/>
        </svg>
      `
    },
    oro: {
      name: 'Disco Solar Inti Ceremonial',
      article: 'el',
      tierLabel: 'Oro',
      short: 'Sol Inti',
      color: '#f59e0b',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <!-- Resplandor Dorado Inti -->
          <circle cx="24" cy="24" r="22" fill="rgba(245, 158, 11, 0.12)"/>
          <!-- Rayos Escalonados de Orfebrería Andina -->
          <path d="M22 2 H26 L24 9 Z" fill="#d97706"/>
          <path d="M22 46 H26 L24 39 Z" fill="#d97706"/>
          <path d="M2 22 V26 L9 24 Z" fill="#d97706"/>
          <path d="M46 22 V26 L39 24 Z" fill="#d97706"/>
          <path d="M7 7 L10 10 L13 7 L11 4 Z" fill="#f59e0b"/>
          <path d="M41 7 L38 10 L35 7 L37 4 Z" fill="#f59e0b"/>
          <path d="M7 41 L10 38 L13 41 L11 44 Z" fill="#f59e0b"/>
          <path d="M41 41 L38 38 L35 41 L37 44 Z" fill="#f59e0b"/>
          <!-- Corona Circular Solar -->
          <circle cx="24" cy="24" r="15" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
          <circle cx="24" cy="24" r="11" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
          <circle cx="24" cy="24" r="6" fill="#fde68a"/>
          <!-- Rostro Geométrico Ancestral (Ojos y boca lineales puros) -->
          <line x1="20" y1="22" x2="22" y2="22" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
          <line x1="26" y1="22" x2="28" y2="22" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
          <path d="M21 26 Q24 28 27 26" stroke="#78350f" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        </svg>
      `
    },
    diamante: {
      name: 'Chakana Sagrada de los Andes',
      article: 'la',
      tierLabel: 'Chakana',
      short: 'Chakana',
      color: '#244663',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <!-- Aura Mística Chakana -->
          <rect x="6" y="6" width="36" height="36" rx="6" fill="rgba(36, 70, 99, 0.15)"/>
          <!-- Cruz Escalonada Andina (Chakana Geométrica) -->
          <path d="
            M 18 6
            H 30
            V 12
            H 36
            V 18
            H 42
            V 30
            H 36
            V 36
            H 30
            V 42
            H 18
            V 36
            H 12
            V 30
            H 6
            V 18
            H 12
            V 12
            H 18
            Z
          " fill="#244663" stroke="#b78f5c" stroke-width="2.2" stroke-linejoin="bevel"/>
          <!-- Portal Central Chakana (Solsticios y Equinoccios) -->
          <circle cx="24" cy="24" r="6" fill="#f8f6f0" stroke="#b78f5c" stroke-width="2"/>
          <circle cx="24" cy="24" r="3" fill="#b78f5c"/>
          <!-- Puntos Sagrados de las 4 Esquinas -->
          <circle cx="15" cy="15" r="1.5" fill="#f8f6f0"/>
          <circle cx="33" cy="15" r="1.5" fill="#f8f6f0"/>
          <circle cx="15" cy="33" r="1.5" fill="#f8f6f0"/>
          <circle cx="33" cy="33" r="1.5" fill="#f8f6f0"/>
        </svg>
      `
    },
    ninguno: {
      name: 'Ruta en Preparación',
      article: 'la',
      tierLabel: 'Sin Rango',
      short: 'Sin rango',
      color: '#cebdaa',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <circle cx="24" cy="24" r="20" stroke="#cebdaa" stroke-width="2" stroke-dasharray="4 4" fill="rgba(206, 189, 170, 0.1)"/>
          <circle cx="24" cy="24" r="3" fill="#cebdaa"/>
        </svg>
      `
    }
  },

  cyber: {
    bronce: {
      name: 'Sensor Radar Orbital',
      article: 'el',
      tierLabel: 'Bronce',
      short: 'Sensor',
      color: '#f59e0b',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <circle cx="24" cy="24" r="21" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4 2" fill="rgba(245, 158, 11, 0.08)"/>
          <circle cx="24" cy="24" r="13" stroke="rgba(245, 158, 11, 0.6)" stroke-width="1.2"/>
          <circle cx="24" cy="24" r="5" stroke="#f59e0b" stroke-width="1.5"/>
          <!-- Retícula Táctica -->
          <line x1="24" y1="4" x2="24" y2="44" stroke="#f59e0b" stroke-width="1.2" stroke-opacity="0.7"/>
          <line x1="4" y1="24" x2="44" y2="24" stroke="#f59e0b" stroke-width="1.2" stroke-opacity="0.7"/>
          <!-- Haz de Escaneo Sectorial -->
          <path d="M24 24 L39 9 A21 21 0 0 1 45 24 Z" fill="rgba(245, 158, 11, 0.35)"/>
          <!-- Objetivos Detectados -->
          <circle cx="34" cy="16" r="2.5" fill="#fef08a"/>
          <circle cx="15" cy="31" r="2" fill="#f59e0b"/>
        </svg>
      `
    },
    plata: {
      name: 'Propulsor Vectorial Warp',
      article: 'el',
      tierLabel: 'Plata',
      short: 'Vector Warp',
      color: '#38bdf8',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <!-- Marco Tecnológico Hexagonal -->
          <polygon points="24,3 43,14 43,34 24,45 5,34 5,14" stroke="#38bdf8" stroke-width="1.8" fill="rgba(56, 189, 248, 0.1)"/>
          <!-- Chevrones de Aceleración Warp -->
          <path d="M12 35 L24 24 L36 35" stroke="#0284c7" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 26 L24 16 L34 26" stroke="#38bdf8" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 18 L24 10 L31 18" stroke="#ffffff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Destello de Propulsión -->
          <circle cx="24" cy="7" r="2" fill="#ffffff"/>
        </svg>
      `
    },
    oro: {
      name: 'Reactor Cuántico de Fusión',
      article: 'el',
      tierLabel: 'Oro',
      short: 'Reactor',
      color: '#84ff00',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <!-- Campo Magnético Exterior -->
          <circle cx="24" cy="24" r="22" stroke="#84ff00" stroke-width="1.5" stroke-dasharray="6 3" fill="rgba(132, 255, 0, 0.08)"/>
          <!-- Anillos Giroscópicos de Plasma -->
          <ellipse cx="24" cy="24" rx="20" ry="7.5" stroke="#84ff00" stroke-width="1.8" transform="rotate(-30 24 24)" fill="none"/>
          <ellipse cx="24" cy="24" rx="20" ry="7.5" stroke="#84ff00" stroke-width="1.8" transform="rotate(30 24 24)" fill="none"/>
          <ellipse cx="24" cy="24" rx="20" ry="7.5" stroke="#84ff00" stroke-width="1.8" transform="rotate(90 24 24)" fill="none"/>
          <!-- Núcleo de Energía Pura -->
          <circle cx="24" cy="24" r="6" fill="#84ff00"/>
          <circle cx="24" cy="24" r="3" fill="#ffffff"/>
        </svg>
      `
    },
    diamante: {
      name: 'Prisma Hiperespacial Alfa',
      article: 'el',
      tierLabel: 'Prisma Alfa',
      short: 'Prisma Alfa',
      color: '#c084fc',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <!-- Aura Cuántica Púrpura/Cian -->
          <circle cx="24" cy="24" r="22" fill="rgba(192, 132, 252, 0.15)"/>
          <!-- Octaedro Holográfico Facetado -->
          <polygon points="24,5 40,24 24,43 8,24" fill="none" stroke="#c084fc" stroke-width="2"/>
          <!-- Facetas Tridimensionales -->
          <polygon points="24,5 24,24 8,24" fill="rgba(56, 189, 248, 0.45)" stroke="#38bdf8" stroke-width="1.5"/>
          <polygon points="24,5 40,24 24,24" fill="rgba(192, 132, 252, 0.55)" stroke="#c084fc" stroke-width="1.5"/>
          <polygon points="8,24 24,24 24,43" fill="rgba(147, 51, 234, 0.6)" stroke="#a855f7" stroke-width="1.5"/>
          <polygon points="40,24 24,43 24,24" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" stroke-width="1.5"/>
          <!-- Núcleo de Singularity -->
          <circle cx="24" cy="24" r="3.5" fill="#ffffff"/>
          <line x1="24" y1="1" x2="24" y2="47" stroke="#ffffff" stroke-width="1" stroke-opacity="0.6"/>
          <line x1="1" y1="24" x2="47" y2="24" stroke="#ffffff" stroke-width="1" stroke-opacity="0.6"/>
        </svg>
      `
    },
    ninguno: {
      name: 'Sistema en Espera',
      article: 'el',
      tierLabel: 'Sin Rango',
      short: 'Sin rango',
      color: '#52525b',
      svg: (size = 32) => `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
          <polygon points="24,5 41,15 41,33 24,43 7,33 7,15" stroke="#52525b" stroke-width="1.8" stroke-dasharray="3 3" fill="rgba(39, 39, 42, 0.4)"/>
          <circle cx="24" cy="24" r="2.5" fill="#71717a"/>
        </svg>
      `
    }
  }
};

/**
 * Obtiene el objeto de emblema temático según el modo y rango
 * @param {string} theme - 'andina' | 'expedicion' | 'cyber'
 * @param {string} tier - 'bronce' | 'plata' | 'oro' | 'diamante' | 'ninguno'
 */
export function getThemedEmblem(theme, tier) {
  const mode = (theme === 'cyber') ? 'cyber' : 'expedicion';
  const modeEmblems = THEMED_EMBLEMS[mode] || THEMED_EMBLEMS.expedicion;
  return modeEmblems[tier] || modeEmblems.ninguno;
}

/**
 * Obtiene el artículo gramatical ('el' o 'la') del emblema temático
 * @param {string} theme - 'andina' | 'expedicion' | 'cyber'
 * @param {string} tier - 'bronce' | 'plata' | 'oro' | 'diamante' | 'ninguno'
 */
export function getEmblemArticle(theme, tier) {
  const emblem = getThemedEmblem(theme, tier);
  return emblem.article || 'el';
}
