// ==============================================================
// Expedición Matemática - Tarjetas de Acceso de Estudiantes (A4)
// ==============================================================

import { storage } from '../data/storage.js';
import { ICONS, CYBER_AVATARS } from '../data/icons.js';

const AVATAR_ICONS = {
  chasqui: '🏃‍♂️',
  condor: '🦅',
  vicuna: '🦙',
  delfin: '🐬',
  puma: '🐆'
};

export function renderCyberAvatar(key, size = 36) {
  if (CYBER_AVATARS && CYBER_AVATARS[key]) {
    return CYBER_AVATARS[key].svg(size);
  }
  return AVATAR_ICONS[key] || '🎒';
}

export function renderSingleCardHtml(s) {
  const isSigma = s.classroom === 'sigma';
  const tagBg = isSigma ? '#f5f3ff' : '#f0fdf4';
  const tagColor = isSigma ? '#6d28d9' : '#15803d';
  const tagBorder = isSigma ? '#ddd6fe' : '#bbf7d0';
  const accent = isSigma ? '#7c3aed' : '#059669';

  return `
    <div class="card-box">
      <div class="card-cut-corner">${ICONS.scissors(14, '#94a3b8')}</div>
      <div class="card-header">
        <div class="card-brand">
          ${ICONS.pixelLogo(18, accent)}
          <div>
            <div class="brand-title">EXPEDICIÓN MATEMÁTICA</div>
            <div class="brand-sub">4.° de Primaria</div>
          </div>
        </div>
        <div class="card-badge" style="background:${tagBg}; color:${tagColor}; border:1px solid ${tagBorder}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 800;">
          ${isSigma ? '4.° SIGMA' : '4.° DELTA'}
        </div>
      </div>

      <div class="card-body">
        <div class="avatar-badge" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
          ${renderCyberAvatar(s.avatar, 32)}
        </div>
        <div class="student-meta">
          <div class="student-num" style="font-family: 'JetBrains Mono', monospace;">ALUMNO N° ${String(s.num).padStart(2, '0')}</div>
          <div class="student-name">${s.name || s.displayName}</div>
        </div>
      </div>

      <div class="creds-box">
        <div class="cred-row">
          <span class="cred-label">USUARIO:</span>
          <span class="cred-value" style="font-family: 'JetBrains Mono', monospace;">${s.username}</span>
        </div>
        <div class="cred-row cred-pin-row">
          <span class="cred-label">CLAVE PIN:</span>
          <span class="cred-pin" style="color:${accent}; font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 900; letter-spacing: 2px;">${s.pin}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderCardsHtmlForPreview(filter = 'todos') {
  const allStudents = storage.getAllStudents(filter);
  return `
    <div class="cards-preview-grid">
      ${allStudents.map(s => renderSingleCardHtml(s)).join('')}
    </div>
  `;
}

export function renderCardsHtmlForPrint(filter = 'todos') {
  const allStudents = storage.getAllStudents();
  function chunk(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }

  let pages = [];
  if (filter === 'sigma') {
    const list = allStudents.filter(s => s.classroom === 'sigma');
    pages = chunk(list, 8);
  } else if (filter === 'delta') {
    const list = allStudents.filter(s => s.classroom === 'delta');
    pages = chunk(list, 8);
  } else {
    const sigma = allStudents.filter(s => s.classroom === 'sigma');
    const delta = allStudents.filter(s => s.classroom === 'delta');
    pages = [...chunk(sigma, 8), ...chunk(delta, 8)];
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Tarjetas de Credenciales • Expedición Matemática</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: white;
      color: #1e293b;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 190mm;
      height: 280mm;
      margin: 0 auto;
      background: white;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 5mm;
      page-break-after: always;
      box-sizing: border-box;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    .card-box {
      border: 1.5px dashed #94a3b8;
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      background: white;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .card-cut-corner {
      position: absolute;
      top: 3px;
      right: 4px;
      font-size: 11px;
      opacity: 0.6;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 5px;
      margin-bottom: 4px;
    }
    .card-brand {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .brand-icon {
      font-size: 16px;
    }
    .brand-title {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #0f172a;
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 8px;
      color: #64748b;
      font-weight: 600;
    }
    .card-badge {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 12px;
      white-space: nowrap;
    }
    .card-body {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 4px 0;
    }
    .avatar-badge {
      font-size: 26px;
      width: 42px;
      height: 42px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .student-meta {
      flex: 1;
      min-width: 0;
    }
    .student-num {
      font-size: 9px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .student-name {
      font-size: 12.5px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .creds-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 10px;
      margin: 4px 0;
    }
    .cred-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      line-height: 1.4;
    }
    .cred-label {
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.3px;
    }
    .cred-value {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }
    .cred-pin-row {
      margin-top: 3px;
      padding-top: 3px;
      border-top: 1px dashed #cbd5e1;
    }
    .cred-pin {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 2.5px;
    }
    .card-footer {
      font-size: 8px;
      color: #64748b;
      text-align: center;
      font-weight: 500;
      margin-top: 3px;
      line-height: 1.2;
    }
  </style>
</head>
<body>
  ${pages.map(page => `
    <div class="page">
      ${page.map(s => renderSingleCardHtml(s)).join('')}
    </div>
  `).join('')}
</body>
</html>`;
}

export function printIsolatedCards(filter = 'todos') {
  let iframe = document.getElementById('cards-print-frame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'cards-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
  }
  const htmlContent = renderCardsHtmlForPrint(filter);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(htmlContent);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 300);
}
