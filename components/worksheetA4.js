// ==============================================================
// Expedición Matemática - Generador de Fichas Didácticas A4
// Didáctica Santillana & Eduten - 4.° de Primaria
// ==============================================================

import { storage } from '../data/storage.js';
import { AVAILABLE_TOPICS } from '../data/curriculum.js';

export function printIsolatedWorksheet(topicId = null) {
  const activeOrSelected = topicId || storage.getActiveTopic();
  const topic = AVAILABLE_TOPICS.find(t => t.id === activeOrSelected) || AVAILABLE_TOPICS[0];
  let iframe = document.getElementById('worksheet-print-frame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'worksheet-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
  }
  const htmlContent = renderWorksheetA4Html(activeOrSelected);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${topic.worksheetTitle}</title>
      <style>
        @page { 
          size: A4 portrait; 
          margin: 10mm 12mm 10mm 12mm; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { 
          background: white; 
          color: #111; 
          font-family: Arial, Helvetica, sans-serif; 
          line-height: 1.3; 
          margin: 0; 
          padding: 0;
          width: 100%;
        }
        .worksheet-a4 { 
          width: 100%; 
          max-width: 100%; 
          padding: 0; 
          margin: 0; 
          page-break-after: avoid;
          break-after: avoid;
        }
        .worksheet-header { 
          border-bottom: 2px solid #000; 
          padding-bottom: 4px; 
          margin-bottom: 8px; 
          text-align: center; 
        }
        .worksheet-title { 
          font-size: 15px; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
        }
        .worksheet-section { 
          border: 1.5px solid #222; 
          border-radius: 5px; 
          padding: 8px 12px; 
          margin-bottom: 8px; 
          page-break-inside: avoid; 
          break-inside: avoid;
        }
        .ws-sec-title { 
          font-size: 11px; 
          font-weight: 800; 
          text-transform: uppercase; 
          margin-bottom: 5px; 
          border-bottom: 1px solid #777; 
          padding-bottom: 2px; 
        }
        .ws-box { 
          display: inline-block; 
          min-width: 48px; 
          height: 32px; 
          border: 1.5px solid #000; 
          border-radius: 4px; 
          text-align: center; 
          line-height: 30px; 
          font-size: 13.5px; 
          font-weight: 700; 
          margin: 0 3px; 
        }
        .ws-box-empty { 
          min-width: 60px; 
          border: 2px dashed #000; 
          background: #fafafa; 
        }
        .ws-jump-arc { 
          display: inline-flex; 
          flex-direction: column; 
          align-items: center; 
          font-size: 10px; 
          font-weight: 800; 
          vertical-align: middle; 
          margin: 0 3px; 
          line-height: 1.1;
        }
        .ws-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 4px; 
          font-size: 11.5px; 
        }
        .ws-table th, .ws-table td { 
          border: 1px solid #333; 
          padding: 4px 8px; 
          text-align: center; 
        }
        .ws-table th { 
          background: #f0f0f0; 
          font-weight: 700; 
        }
        .ws-problem-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr; 
          gap: 8px; 
          margin-top: 4px; 
        }
        .ws-problem-col { 
          border: 1px dashed #666; 
          border-radius: 4px; 
          padding: 6px; 
          min-height: 95px; 
          font-size: 11px; 
        }
        .ws-problem-col-title { 
          font-weight: 800; 
          font-size: 10px; 
          border-bottom: 1px solid #aaa; 
          padding-bottom: 2px; 
          text-transform: uppercase; 
          color: #333; 
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `);
  doc.close();
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 250);
}

export function renderWorksheetA4Html(topicId = null) {
  const activeId = topicId || storage.getActiveTopic();
  const topic = AVAILABLE_TOPICS.find(t => t.id === activeId) || AVAILABLE_TOPICS[0];

  const studentHeader = `
    <div class="worksheet-header">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #111; padding-bottom: 4px; margin-bottom: 6px;">
        <div style="font-size: 11px; font-weight: 800; font-family: Arial, sans-serif; text-transform: uppercase;">
          COLEGIO LA SALLE SCHOOL • 4.° PRIMARIA • 3.° BIMESTRE • ${topic.title.toUpperCase()}
        </div>
        <div style="font-size: 10px; color: #333; font-family: Arial, sans-serif;">
          Sección: <strong>4.° [ &nbsp; ] Sigma &nbsp;&nbsp; [ &nbsp; ] Delta</strong> &nbsp;&nbsp;&nbsp;&nbsp; Fecha: ___/___/2026
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 11px;">
        <div>Estudiante: ____________________________________________________________________</div>
        <div>N.° Orden: [ &nbsp;&nbsp;&nbsp; ]</div>
      </div>
      <h1 class="worksheet-title">${topic.worksheetTitle}</h1>
    </div>
  `;

  const footer = `
    <div style="border-top: 1.5px dashed #555; margin-top: 8px; padding-top: 4px; display: flex; justify-content: space-between; font-size: 10px; color: #444;">
      <span>✂️ Recorta por la línea punteada y pega esta ficha en tu cuaderno de matemática.</span>
      <span>${topic.title} • Didáctica Santillana & Eduten</span>
    </div>
  `;

  let bodyContent = '';
  if (activeId === 'division-reparto') {
    bodyContent = renderWorksheetWeek2Content();
  } else if (activeId === 'fracciones-unidad') {
    bodyContent = renderWorksheetWeek3Content();
  } else if (activeId === 'operaciones-combinadas') {
    bodyContent = renderWorksheetWeek4Content();
  } else {
    bodyContent = renderWorksheetWeek1Content();
  }

  return `
    <div class="worksheet-a4">
      ${studentHeader}
      ${bodyContent}
      ${footer}
    </div>
  `;
}

// ==============================================================
// CONTENIDO FICHA SEMANA 1: PATRONES MULTIPLICATIVOS
// ==============================================================
export function renderWorksheetWeek1Content() {
  return `
    <!-- 1. Analiza y Compara -->
    <div class="worksheet-section">
      <div class="ws-sec-title">1. ANALIZA Y COMPARA: ¿SUMA O MULTIPLICACIÓN?</div>
      <p style="font-size: 12.5px; margin-bottom: 6px;">
        Observa con atención la siguiente secuencia numérica:
      </p>
      <div style="text-align: center; margin: 6px 0 8px 0;">
        <span class="ws-box">3</span> ➔ 
        <span class="ws-box">6</span> ➔ 
        <span class="ws-box">12</span> ➔ 
        <span class="ws-box">24</span>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • Si sumamos: 3 + 3 = 6. ¿Pero 6 + 3 da 12? &nbsp;&nbsp;&nbsp;&nbsp; 
        <strong>[ &nbsp;&nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] NO</strong>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • Explica por qué no funciona la suma: ___________________________________________________________
      </div>
      <div style="font-size: 12px;">
        • La regla constante que <strong>SÍ</strong> se cumple para toda la secuencia es: &nbsp;&nbsp;
        <strong>[ &nbsp;&nbsp; × 2 &nbsp;&nbsp; ]</strong>
      </div>
    </div>

    <!-- 2. Recta de Regularidad -->
    <div class="worksheet-section">
      <div class="ws-sec-title">2. COMPLETA LA RECTA DE REGULARIDAD</div>
      <p style="font-size: 12.5px; margin-bottom: 6px;">
        Descubre la regla constante y completa los casilleros que faltan:
      </p>
      
      <div style="margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 4px;">
        <span style="font-weight: 700; font-size: 12.5px; margin-right: 6px;">a)</span>
        <span class="ws-box">4</span>
        <div class="ws-jump-arc"><span>× 3</span><span>↷</span></div>
        <span class="ws-box">12</span>
        <div class="ws-jump-arc"><span>× 3</span><span>↷</span></div>
        <span class="ws-box">36</span>
        <div class="ws-jump-arc"><span>× 3</span><span>↷</span></div>
        <span class="ws-box ws-box-empty"></span>
      </div>

      <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
        <span style="font-weight: 700; font-size: 12.5px; margin-right: 6px;">b)</span>
        <span class="ws-box">5</span>
        <div class="ws-jump-arc"><span>× 4</span><span>↷</span></div>
        <span class="ws-box ws-box-empty"></span>
        <div class="ws-jump-arc"><span>× 4</span><span>↷</span></div>
        <span class="ws-box">80</span>
        <div class="ws-jump-arc"><span>× 4</span><span>↷</span></div>
        <span class="ws-box ws-box-empty"></span>
      </div>
    </div>

    <!-- 3. Descomposición Mental -->
    <div class="worksheet-section">
      <div class="ws-sec-title">3. ESTRATEGIA DE CÁLCULO MENTAL: DESCOMPOSICIÓN</div>
      <p style="font-size: 12px; margin-bottom: 5px;">
        Para multiplicar números de dos cifras mentalmente, descomponemos en decenas y unidades:
      </p>
      <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 5px 10px; margin-bottom: 6px; font-size: 11.5px;">
        <strong>Ejemplo guiado:</strong> &nbsp;&nbsp; 45 × 3 = (40 × 3) + (5 × 3) = 120 + 15 = <strong>135</strong>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • <strong>64 × 4</strong> = ( _____ × 4 ) + ( _____ × 4 ) = ___________ + ___________ = <strong>___________</strong>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • <strong>54 × 3</strong> = ( _____ × 3 ) + ( _____ × 3 ) = ___________ + ___________ = <strong>___________</strong>
      </div>
      <div style="font-size: 12px;">
        • <strong>36 × 4</strong> = ( _____ × 4 ) + ( _____ × 4 ) = ___________ + ___________ = <strong>___________</strong>
      </div>
    </div>

    <!-- 4. Tabla de Entrada y Salida -->
    <div class="worksheet-section">
      <div class="ws-sec-title">4. TABLA DE ENTRADA Y SALIDA (MÁQUINA MATEMÁTICA)</div>
      <p style="font-size: 12px; margin-bottom: 4px;">
        Aplica la regla fija para completar la tabla. ¡Atento a la última fila inversa!
      </p>
      <div style="font-weight: 800; font-size: 11.5px; text-align: center; margin: 3px 0 5px 0;">
        [ REGLA FIJA: ENTRADA × 5 ]
      </div>
      <table class="ws-table">
        <thead>
          <tr>
            <th style="width: 50%;">📥 ENTRADA ( Número )</th>
            <th style="width: 50%;">📤 SALIDA ( Entrada × 5 )</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>3</td>
            <td>15</td>
          </tr>
          <tr>
            <td>6</td>
            <td><strong>____________________</strong></td>
          </tr>
          <tr>
            <td>8</td>
            <td><strong>____________________</strong></td>
          </tr>
          <tr>
            <td><strong>____________________</strong> (Inverso)</td>
            <td>50</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 5. Situación Problemática -->
    <div class="worksheet-section">
      <div class="ws-sec-title">5. SITUACIÓN PROBLEMÁTICA</div>
      <p style="font-size: 12px; line-height: 1.4; margin-bottom: 5px;">
        En un taller de artesanía, cada fila de una alfombra duplica (×2) el número de figuras respecto a la fila anterior. Si la Fila 1 tiene 8 figuras: <strong>¿cuántas figuras tendrá la Fila 4?</strong>
      </p>
      <div class="ws-problem-grid">
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">DATOS</div>
          <div style="margin-top: 5px;">Fila 1 = 8 figuras</div>
          <div style="margin-top: 6px;">Fila 2 = _________</div>
          <div style="margin-top: 6px;">Fila 3 = _________</div>
          <div style="margin-top: 6px;">Fila 4 = _________</div>
        </div>
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">OPERACIÓN / CÁLCULO</div>
          <div style="color: #666; font-size: 10.5px; margin-bottom: 4px;">(Aplica la regla constante ×2):</div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
        </div>
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">RESPUESTA COMPLETA</div>
          <div style="margin-top: 28px; font-weight: 700; font-size: 11.5px; line-height: 1.4;">
            Rpta: En la Fila 4 tendrá ______________ figuras.
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==============================================================
// CONTENIDO FICHA SEMANA 2: DIVISIÓN Y REPARTO EQUITATIVO
// ==============================================================
export function renderWorksheetWeek2Content() {
  return `
    <!-- 1. Reparto Equitativo y Residuo -->
    <div class="worksheet-section">
      <div class="ws-sec-title">1. REPARTO EQUITATIVO Y RESIDUO (REPARTO CONCRETO)</div>
      <p style="font-size: 12px; margin-bottom: 6px;">
        En el laboratorio de cómputo se deben repartir <strong>45 audífonos</strong> entre <strong>6 mesas de trabajo</strong> en partes iguales:
      </p>
      <div style="text-align: center; margin: 6px 0 8px 0; font-family: monospace; font-size: 14px;">
        45 &nbsp; ÷ &nbsp; 6 &nbsp; = &nbsp; <span class="ws-box">7</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
        ¿Cuántos sobran? &nbsp; Residuo: <span class="ws-box">3</span>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • ¿Se puede entregar un audífono más a cada mesa con los que sobraron? &nbsp;&nbsp;
        <strong>[ &nbsp;&nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] NO</strong>
      </div>
      <div style="font-size: 12px;">
        • Justifica matemáticamente: El residuo (3) siempre debe ser <strong>menor</strong> que el divisor (6): ___________________
      </div>
    </div>

    <!-- 2. Comprobación Matemática -->
    <div class="worksheet-section">
      <div class="ws-sec-title">2. COMPROBACIÓN MATEMÁTICA: DIVIDENDO = (DIVISOR × COCIENTE) + RESIDUO</div>
      <p style="font-size: 12px; margin-bottom: 6px;">
        Aplica el algoritmo de comprobación para verificar cada división:
      </p>
      <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 4px 10px; margin-bottom: 6px; font-size: 11.5px;">
        <strong>Modelo:</strong> 68 ÷ 7 = 9 (residuo 5) &nbsp;➔&nbsp; Comprobación: ( 7 × 9 ) + 5 = 63 + 5 = <strong>68</strong> [ CORRECTO ]
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • <strong>76 ÷ 8 = 9 (residuo 4)</strong> &nbsp;➔&nbsp; ( _____ × _____ ) + _____ = _________ + _________ = <strong>_________</strong>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • <strong>89 ÷ 9 = 9 (residuo 8)</strong> &nbsp;➔&nbsp; ( _____ × _____ ) + _____ = _________ + _________ = <strong>_________</strong>
      </div>
      <div style="font-size: 12px;">
        • <strong>54 ÷ 5 = 10 (residuo 4)</strong> &nbsp;➔&nbsp; ( _____ × _____ ) + _____ = _________ + _________ = <strong>_________</strong>
      </div>
    </div>

    <!-- 3. Cálculo Mental: Mitades y Tercias -->
    <div class="worksheet-section">
      <div class="ws-sec-title">3. ESTRATEGIA DE CÁLCULO MENTAL: MITADES Y TERCERAS PARTES</div>
      <p style="font-size: 12px; margin-bottom: 5px;">
        Descompón el número en múltiplos exactos de 10 para calcular mentalmente:
      </p>
      <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 4px 10px; margin-bottom: 6px; font-size: 11.5px;">
        <strong>Ejemplo:</strong> Mitad de 74 = Mitad de ( 60 + 14 ) = 30 + 7 = <strong>37</strong>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • <strong>Mitad de 96</strong> = Mitad de ( 80 + 16 ) = _________ + _________ = <strong>_________</strong>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • <strong>Mitad de 58</strong> = Mitad de ( 40 + 18 ) = _________ + _________ = <strong>_________</strong>
      </div>
      <div style="font-size: 12px;">
        • <strong>Tercia de 75</strong> = Tercia de ( 60 + 15 ) = _________ + _________ = <strong>_________</strong>
      </div>
    </div>

    <!-- 4. Clasificación de Divisiones -->
    <div class="worksheet-section">
      <div class="ws-sec-title">4. CLASIFICACIÓN: DIVISIONES EXACTAS E INEXACTAS</div>
      <p style="font-size: 12px; margin-bottom: 4px;">
        Resuelve mentalmente y completa la tabla indicando si es exacta (residuo 0) o inexacta:
      </p>
      <table class="ws-table">
        <thead>
          <tr>
            <th style="width: 25%;">División</th>
            <th style="width: 25%;">Cociente</th>
            <th style="width: 25%;">Residuo</th>
            <th style="width: 25%;">¿Es división exacta?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>42 ÷ 6</td>
            <td>7</td>
            <td>0</td>
            <td><strong>SÍ (Residuo cero)</strong></td>
          </tr>
          <tr>
            <td>49 ÷ 6</td>
            <td>_________</td>
            <td>_________</td>
            <td>[ &nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] NO</td>
          </tr>
          <tr>
            <td>64 ÷ 8</td>
            <td>_________</td>
            <td>_________</td>
            <td>[ &nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] NO</td>
          </tr>
          <tr>
            <td>75 ÷ 8</td>
            <td>_________</td>
            <td>_________</td>
            <td>[ &nbsp; ] SÍ &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] NO</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 5. Situación Problemática -->
    <div class="worksheet-section">
      <div class="ws-sec-title">5. SITUACIÓN PROBLEMÁTICA DEL PERÚ</div>
      <p style="font-size: 12px; line-height: 1.4; margin-bottom: 5px;">
        En una cooperativa cafetalera de Chanchamayo (Junín), se cosecharon <strong>94 kilogramos</strong> de café especial. Si se deben envasar en bolsas de <strong>8 kilogramos</strong> cada una: <strong>¿Cuántas bolsas completas se podrán llenar y cuántos kilogramos sobrarán?</strong>
      </p>
      <div class="ws-problem-grid">
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">DATOS</div>
          <div style="margin-top: 5px;">• Total café = 94 kg</div>
          <div style="margin-top: 6px;">• Peso por bolsa = 8 kg</div>
          <div style="margin-top: 6px;">• Bolsas = ?</div>
          <div style="margin-top: 6px;">• Sobrante = ?</div>
        </div>
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">ALGORITMO Y COMPROBACIÓN</div>
          <div style="color: #666; font-size: 10.5px; margin-bottom: 4px;">Divide 94 ÷ 8:</div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          <div style="color: #666; font-size: 10.5px; margin-top: 2px;">Comprobación (8 × c) + r:</div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
        </div>
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">RESPUESTA COMPLETA</div>
          <div style="margin-top: 22px; font-weight: 700; font-size: 11.5px; line-height: 1.4;">
            Rpta: Se llenarán ________ bolsas completas y sobrarán ________ kg de café.
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==============================================================
// CONTENIDO FICHA SEMANA 3: FRACCIONES Y PARTES DE LA UNIDAD
// ==============================================================
export function renderWorksheetWeek3Content() {
  return `
    <!-- 1. Representación Gráfica -->
    <div class="worksheet-section">
      <div class="ws-sec-title">1. REPRESENTACIÓN GRÁFICA Y CONCEPTUAL</div>
      <p style="font-size: 12px; margin-bottom: 6px;">
        Escribe la fracción que representa la parte sombreada e identifica sus términos:
      </p>
      <div style="display: flex; justify-content: space-around; align-items: center; margin: 8px 0; font-size: 12px; flex-wrap: wrap; gap: 8px;">
        <div style="border: 1px solid #333; padding: 6px 12px; border-radius: 4px; text-align: center;">
          <div style="display: flex; gap: 2px; margin-bottom: 4px;">
            <span style="display:inline-block; width:16px; height:18px; background:#444; border:1px solid #000;"></span>
            <span style="display:inline-block; width:16px; height:18px; background:#444; border:1px solid #000;"></span>
            <span style="display:inline-block; width:16px; height:18px; background:#444; border:1px solid #000;"></span>
            <span style="display:inline-block; width:16px; height:18px; background:#444; border:1px solid #000;"></span>
            <span style="display:inline-block; width:16px; height:18px; background:#fff; border:1px solid #000;"></span>
            <span style="display:inline-block; width:16px; height:18px; background:#fff; border:1px solid #000;"></span>
          </div>
          <strong>[ 4 / 6 ]</strong> &nbsp; (Numerador: 4, Denominador: 6)
        </div>

        <div style="border: 1px solid #333; padding: 6px 12px; border-radius: 4px; text-align: center;">
          <div style="display: flex; gap: 2px; margin-bottom: 4px;">
            <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
            <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
            <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
            <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
            <span style="display:inline-block; width:14px; height:18px; background:#444; border:1px solid #000;"></span>
            <span style="display:inline-block; width:14px; height:18px; background:#fff; border:1px solid #000;"></span>
            <span style="display:inline-block; width:14px; height:18px; background:#fff; border:1px solid #000;"></span>
            <span style="display:inline-block; width:14px; height:18px; background:#fff; border:1px solid #000;"></span>
          </div>
          <strong>[ ___ / ___ ]</strong> &nbsp; (Num: ____, Den: ____)
        </div>
      </div>
      <div style="font-size: 12px;">
        • El <strong>denominador</strong> indica las partes totales en que se divide la unidad, y el <strong>numerador</strong> indica las partes que se toman.
      </div>
    </div>

    <!-- 2. Fracciones Equivalentes -->
    <div class="worksheet-section">
      <div class="ws-sec-title">2. FRACCIONES EQUIVALENTES (AMPLIFICACIÓN)</div>
      <p style="font-size: 12px; margin-bottom: 5px;">
        Multiplica el numerador y el denominador por el mismo número para obtener fracciones equivalentes:
      </p>
      <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 4px 10px; margin-bottom: 6px; font-size: 11.5px;">
        <strong>Modelo:</strong> 1/2 × 2/2 = <strong>2/4</strong> &nbsp;&nbsp;&nbsp;&nbsp; 1/2 × 3/3 = <strong>3/6</strong> &nbsp;&nbsp;&nbsp;&nbsp; 1/2 × 4/4 = <strong>4/8</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
        <span>• <strong>2/3</strong> × 2/2 = <strong>_____ / _____</strong></span>
        <span>• <strong>3/5</strong> × 2/2 = <strong>_____ / _____</strong></span>
        <span>• <strong>4/7</strong> × 2/2 = <strong>_____ / _____</strong></span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px;">
        <span>• <strong>2/3</strong> × 3/3 = <strong>_____ / _____</strong></span>
        <span>• <strong>3/5</strong> × 3/3 = <strong>_____ / _____</strong></span>
        <span>• <strong>1/4</strong> × 4/4 = <strong>_____ / _____</strong></span>
      </div>
    </div>

    <!-- 3. Comparación de Fracciones -->
    <div class="worksheet-section">
      <div class="ws-sec-title">3. COMPARACIÓN DE FRACCIONES (> , < , =)</div>
      <p style="font-size: 12px; margin-bottom: 6px;">
        Compara las fracciones colocando el signo correcto:
      </p>
      <div style="display: flex; justify-content: space-around; font-size: 12.5px; margin-bottom: 6px;">
        <span>a) 5/8 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 3/8</span>
        <span>b) 4/10 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 7/10</span>
        <span>c) 2/4 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 1/2</span>
      </div>
      <div style="display: flex; justify-content: space-around; font-size: 12.5px;">
        <span>d) 3/6 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 5/6</span>
        <span>e) 8/8 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 1 entero</span>
        <span>f) 6/9 &nbsp; <strong>[ &nbsp;&nbsp;&nbsp; ]</strong> &nbsp; 2/3</span>
      </div>
    </div>

    <!-- 4. Tabla de Lectura y Fracciones -->
    <div class="worksheet-section">
      <div class="ws-sec-title">4. TABLA DE LECTURA Y RELACIÓN CON LA MITAD (1/2)</div>
      <p style="font-size: 12px; margin-bottom: 4px;">
        Completa cómo se lee cada fracción y si es menor, igual o mayor que la mitad (1/2):
      </p>
      <table class="ws-table">
        <thead>
          <tr>
            <th style="width: 20%;">Fracción</th>
            <th style="width: 45%;">Cómo se lee</th>
            <th style="width: 35%;">¿Menor, igual o mayor que 1/2?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>3/4</td>
            <td>Tres cuartos</td>
            <td>Mayor que 1/2 (la mitad de 4 es 2)</td>
          </tr>
          <tr>
            <td>2/5</td>
            <td>__________________________________</td>
            <td>______________________________</td>
          </tr>
          <tr>
            <td>5/10</td>
            <td>__________________________________</td>
            <td>______________________________</td>
          </tr>
          <tr>
            <td>7/8</td>
            <td>__________________________________</td>
            <td>______________________________</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 5. Situación Problemática -->
    <div class="worksheet-section">
      <div class="ws-sec-title">5. SITUACIÓN PROBLEMÁTICA DEL PERÚ</div>
      <p style="font-size: 12px; line-height: 1.4; margin-bottom: 5px;">
        En una panadería tradicional de Oropesa (Cusco), dos familias compran panes chuta del mismo tamaño. La familia Quispe consume <strong>3/8</strong> de su pan y la familia Mamani consume <strong>5/8</strong> de su pan: <strong>¿Qué familia consumió más pan y qué fracción de pan le sobró a la familia Mamani?</strong>
      </p>
      <div class="ws-problem-grid">
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">DATOS</div>
          <div style="margin-top: 5px;">• Familia Quispe: 3/8</div>
          <div style="margin-top: 6px;">• Familia Mamani: 5/8</div>
          <div style="margin-top: 6px;">• ¿Quién comió más?</div>
          <div style="margin-top: 6px;">• ¿Cuánto sobró?</div>
        </div>
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">GRÁFICO Y COMPARACIÓN</div>
          <div style="color: #666; font-size: 10.5px; margin-bottom: 4px;">Compara 5/8 con 3/8:</div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          <div style="color: #666; font-size: 10.5px; margin-top: 2px;">Resta a la unidad (8/8 - 5/8):</div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
        </div>
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">RESPUESTA COMPLETA</div>
          <div style="margin-top: 18px; font-weight: 700; font-size: 11px; line-height: 1.4;">
            Rpta 1: Consumió más pan la familia ____________.<br>
            Rpta 2: A la familia Mamani le sobraron ________ de pan.
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==============================================================
// CONTENIDO FICHA SEMANA 4: OPERACIONES COMBINADAS
// ==============================================================
export function renderWorksheetWeek4Content() {
  return `
    <!-- 1. Regla de Oro de la Jerarquía -->
    <div class="worksheet-section">
      <div class="ws-sec-title">1. REGLA DE ORO DE LA JERARQUÍA OPERATORIA</div>
      <p style="font-size: 12px; margin-bottom: 6px;">
        Recuerda el orden estricto: <strong>1.° Paréntesis ( )</strong> &nbsp;➔&nbsp; <strong>2.° Multiplicación (×) y División (÷)</strong> &nbsp;➔&nbsp; <strong>3.° Suma (+) y Resta (-)</strong> de izquierda a derecha.
      </p>
      <div style="background: #f9fafb; border: 1px dashed #444; border-radius: 4px; padding: 5px 10px; margin-bottom: 6px; font-size: 11.5px;">
        a) 20 + 5 × 4 = 20 + 20 = <strong>40</strong> &nbsp;&nbsp;&nbsp;&nbsp; (Primero multiplicamos 5 × 4)<br>
        b) ( 20 + 5 ) × 4 = 25 × 4 = <strong>100</strong> &nbsp;&nbsp;&nbsp;&nbsp; (Primero resolvemos el paréntesis)
      </div>
      <div style="font-size: 12px;">
        • ¿Por qué dan resultados distintos si tienen los mismos números? _________________________________________
      </div>
    </div>

    <!-- 2. Resuelve Paso a Paso -->
    <div class="worksheet-section">
      <div class="ws-sec-title">2. RESUELVE PASO A PASO RESPETANDO LA JERARQUÍA</div>
      <p style="font-size: 12px; margin-bottom: 6px;">
        Desarrolla las operaciones intermedias en orden correcto:
      </p>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • <strong>45 - 5 × 6 + 10</strong> = 45 - _________ + 10 = _________ + 10 = <strong>_________</strong>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • <strong>( 32 ÷ 4 ) + ( 7 × 6 )</strong> = _________ + _________ = <strong>_________</strong>
      </div>
      <div style="font-size: 12px; margin-bottom: 5px;">
        • <strong>80 - ( 18 + 22 ) ÷ 2</strong> = 80 - _________ ÷ 2 = 80 - _________ = <strong>_________</strong>
      </div>
      <div style="font-size: 12px;">
        • <strong>90 - 3 × ( 15 + 5 )</strong> = 90 - 3 × _________ = 90 - _________ = <strong>_________</strong>
      </div>
    </div>

    <!-- 3. Enigma Matemático -->
    <div class="worksheet-section">
      <div class="ws-sec-title">3. ENIGMA MATEMÁTICO: COLOCA LOS PARÉNTESIS ( )</div>
      <p style="font-size: 12px; margin-bottom: 6px;">
        Coloca los paréntesis ( ) en el lugar exacto para que la igualdad sea verdadera:
      </p>
      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
        <span>a) 8 + 2 × 6 = 60 &nbsp;➔&nbsp; ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ) × 6 = 60</span>
        <span>b) 36 - 12 ÷ 4 = 6 &nbsp;➔&nbsp; ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ) ÷ 4 = 6</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px;">
        <span>c) 5 × 9 - 4 = 25 &nbsp;➔&nbsp; 5 × ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ) = 25</span>
        <span>d) 40 ÷ 5 + 3 = 5 &nbsp;➔&nbsp; 40 ÷ ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ) = 5</span>
      </div>
    </div>

    <!-- 4. Tabla de Análisis Operatorio -->
    <div class="worksheet-section">
      <div class="ws-sec-title">4. TABLA DE ANÁLISIS: ¿QUÉ SE RESUELVE PRIMERO?</div>
      <p style="font-size: 12px; margin-bottom: 4px;">
        Identifica qué operación se debe efectuar en primer lugar y halla el resultado final:
      </p>
      <table class="ws-table">
        <thead>
          <tr>
            <th style="width: 30%;">Expresión</th>
            <th style="width: 45%;">Primera operación obligatoria</th>
            <th style="width: 25%;">Resultado Final</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>24 + 16 ÷ 4</td>
            <td>División: 16 ÷ 4 = 4</td>
            <td><strong>28</strong></td>
          </tr>
          <tr>
            <td>( 24 + 16 ) ÷ 4</td>
            <td>__________________________________</td>
            <td><strong>_________</strong></td>
          </tr>
          <tr>
            <td>50 - 8 × 5</td>
            <td>__________________________________</td>
            <td><strong>_________</strong></td>
          </tr>
          <tr>
            <td>( 50 - 8 ) × 2</td>
            <td>__________________________________</td>
            <td><strong>_________</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 5. Situación Problemática -->
    <div class="worksheet-section">
      <div class="ws-sec-title">5. SITUACIÓN PROBLEMÁTICA DEL PERÚ</div>
      <p style="font-size: 12px; line-height: 1.4; margin-bottom: 5px;">
        En el Mercado Mayorista de Frutas de Lima, don Carlos compra <strong>4 cajas de mandarinas con 30 unidades</strong> cada una. Si regala <strong>20 mandarinas</strong> a sus sobrinos y reparte el resto en bolsas de <strong>5 unidades</strong>: <strong>¿Cuántas bolsas podrá vender en total? Escribe una sola operación combinada con paréntesis:</strong>
      </p>
      <div class="ws-problem-grid">
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">DATOS</div>
          <div style="margin-top: 5px;">• 4 cajas de 30 mandarinas</div>
          <div style="margin-top: 6px;">• Regala 20</div>
          <div style="margin-top: 6px;">• Bolsas de 5 mandarinas</div>
          <div style="margin-top: 6px;">• Total bolsas = ?</div>
        </div>
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">OPERACIÓN COMBINADA ÚNICA</div>
          <div style="color: #666; font-size: 10.5px; margin-bottom: 4px;">Escribe la fórmula con ( ):</div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px; font-weight:700; font-size:11px;">[ ( 4 × 30 ) - 20 ] ÷ 5 =</div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
          <div style="border-bottom: 1px dotted #bbb; height: 19px;"></div>
        </div>
        <div class="ws-problem-col">
          <div class="ws-problem-col-title">RESPUESTA COMPLETA</div>
          <div style="margin-top: 24px; font-weight: 700; font-size: 11.5px; line-height: 1.4;">
            Rpta: Don Carlos podrá vender un total de _________ bolsas de mandarinas.
          </div>
        </div>
      </div>
    </div>
  `;
}
