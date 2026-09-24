/**
 * Gerenciador de Compartilhamento, Backup e QR Code do CruzadaMaster
 * Suporta compressão via URL Hash (#crossword=...), QR Code em Canvas e Exportação JSON/CSV.
 */

/**
 * Compacta a estrutura de dados do tabuleiro para reduzir tamanho do payload no URL hash
 */
export function minifyCrosswordPayload(puzzleData) {
  const dirMap = { 'across': 0, 'down': 1 };

  return {
    t: puzzleData.title || 'Cruzada Personalizada',
    a: puzzleData.author || 'Criador',
    d: puzzleData.difficulty || 'Médio',
    w: (puzzleData.words || []).map(item => [
      item.word || '',
      item.clue || '',
      item.row,
      item.col,
      dirMap[item.direction] !== undefined ? dirMap[item.direction] : 0,
      item.displayWord || item.word || ''
    ])
  };
}

/**
 * Descompacta a estrutura de dados a partir do payload comprimido
 */
export function unminifyCrosswordPayload(minified) {
  if (!minified) return null;
  if (minified.words && Array.isArray(minified.words)) {
    return minified;
  }

  const dirReverseMap = { 0: 'across', 1: 'down' };
  const title = minified.t || minified.title || 'Cruzada Personalizada';
  const author = minified.a || minified.author || 'Criador';
  const difficulty = minified.d || minified.difficulty || 'Médio';
  const rawWords = minified.w || minified.words || [];

  const words = rawWords.map((item, idx) => {
    if (Array.isArray(item)) {
      const dirVal = item[4];
      const dirStr = typeof dirVal === 'number' ? (dirReverseMap[dirVal] || 'across') : (dirVal || 'across');
      return {
        id: `shared_${idx + 1}`,
        word: item[0] || '',
        clue: item[1] || '',
        row: item[2],
        col: item[3],
        direction: dirStr,
        displayWord: item[5] || item[0] || ''
      };
    } else {
      return {
        id: item.id || `shared_${idx + 1}`,
        word: item.word || '',
        clue: item.clue || '',
        row: item.row,
        col: item.col,
        direction: item.direction || 'across',
        displayWord: item.displayWord || item.word || ''
      };
    }
  });

  return {
    title,
    author,
    difficulty,
    words
  };
}

/**
 * Codifica o tabuleiro em uma URL completa com hash comprimido
 */
export function encodeCrosswordToUrl(puzzleData) {
  try {
    const minified = minifyCrosswordPayload(puzzleData);
    const jsonStr = JSON.stringify(minified);

    let compressed = '';
    if (window.LZString) {
      compressed = window.LZString.compressToEncodedURIComponent(jsonStr);
    } else {
      compressed = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    }

    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#crossword=${compressed}`;
  } catch (err) {
    console.error('Erro ao codificar URL da cruzada:', err);
    return window.location.href;
  }
}

/**
 * Decodifica o tabuleiro a partir do hash da URL atual
 */
export function decodeCrosswordFromUrl() {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('#crossword=')) return null;

    const rawPayload = hash.split('#crossword=')[1];
    if (!rawPayload) return null;

    let jsonStr = '';
    if (window.LZString) {
      jsonStr = window.LZString.decompressFromEncodedURIComponent(rawPayload);
    }
    if (!jsonStr) {
      try {
        jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(rawPayload))));
      } catch (e) {
        return null;
      }
    }

    if (!jsonStr) return null;
    const parsed = JSON.parse(jsonStr);
    return unminifyCrosswordPayload(parsed);
  } catch (err) {
    console.error('Erro ao decodificar cruzada da URL:', err);
    return null;
  }
}

/**
 * Copia texto para a área de transferência com feedback
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const successful = document.execCommand('copy');
  document.body.removeChild(textarea);
  return successful;
}

/**
 * Renderiza um QR Code em um elemento container utilizando a biblioteca QRCode se disponível
 * ou fallback Canvas visual
 */
export function renderQRCode(container, url, size = 180) {
  if (!container) return;
  container.innerHTML = '';

  if (window.QRCode) {
    new window.QRCode(container, {
      text: url,
      width: size,
      height: size,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : 0
    });
  } else {
    // Canvas fallback minimalista
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#4f46e5';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Link copiado!', size / 2, size / 2);
    container.appendChild(canvas);
  }
}

/**
 * Exporta o tabuleiro como arquivo .json para download físico
 */
export function exportCrosswordAsJSON(puzzleData) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(puzzleData, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  const safeTitle = (puzzleData.title || 'cruzada').toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `${safeTitle}_cruzadamaster.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
