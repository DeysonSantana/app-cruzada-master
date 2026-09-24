/**
 * Motor Algorítmico do CruzadaMaster (CrosswordEngine)
 * Gerenciador de Matriz 2D, Interseções Ortogonais, Indexação Padrão e Gerador Procedural.
 */

/**
 * Remove diacríticos e acentos mantendo letras em caixa alta (A-Z)
 */
export function normalizeText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

export class CrosswordEngine {
  constructor() {
    this.title = 'Nova Cruzada';
    this.author = 'CruzadaMaster';
    this.difficulty = 'Médio';
    this.rows = 0;
    this.cols = 0;
    this.grid = []; // Matriz 2D: grid[r][c]
    this.words = []; // Array de WordPlacement
    this.wordsById = new Map();
    this.wordListAcross = [];
    this.wordListDown = [];
  }

  /**
   * Inicializa o motor com dados de um tabuleiro (curado ou gerado)
   */
  loadPuzzle(puzzleData) {
    if (!puzzleData || !puzzleData.words || puzzleData.words.length === 0) {
      throw new Error('Dados de palavras cruzadas inválidos ou vazios.');
    }

    this.title = puzzleData.title || 'Palavras Cruzadas';
    this.author = puzzleData.author || 'CruzadaMaster';
    this.difficulty = puzzleData.difficulty || 'Médio';

    // Normaliza as palavras e calcula bounding box
    let minR = Infinity, maxR = -Infinity;
    let minC = Infinity, maxC = -Infinity;

    const rawWords = puzzleData.words.map((w, index) => {
      const normWord = normalizeText(w.word);
      const dir = (w.direction || 'across').toLowerCase();
      const r = typeof w.row === 'number' ? w.row : 0;
      const c = typeof w.col === 'number' ? w.col : 0;
      const len = normWord.length;

      const endR = dir === 'down' ? r + len - 1 : r;
      const endC = dir === 'across' ? c + len - 1 : c;

      if (r < minR) minR = r;
      if (endR > maxR) maxR = endR;
      if (c < minC) minC = c;
      if (endC > maxC) maxC = endC;

      return {
        id: w.id || `w_${index}`,
        word: normWord,
        displayWord: w.displayWord || w.word,
        clue: w.clue || 'Sem dica disponível.',
        row: r,
        col: c,
        direction: dir,
        length: len,
        number: 0
      };
    });

    // Ajusta coordenadas caso o mínimo seja diferente de 0
    const offsetR = minR < 0 ? Math.abs(minR) : (minR > 0 ? -minR : 0);
    const offsetC = minC < 0 ? Math.abs(minC) : (minC > 0 ? -minC : 0);

    this.rows = (maxR - minR) + 1;
    this.cols = (maxC - minC) + 1;

    // Normaliza posições dos itens
    this.words = rawWords.map((w) => ({
      ...w,
      row: w.row + offsetR,
      col: w.col + offsetC
    }));

    this.buildGridMatrix();
    this.assignClueNumbers();
    return this;
  }

  /**
   * Constrói a matriz bidimensional de células
   */
  buildGridMatrix() {
    this.grid = [];
    this.wordsById.clear();

    for (let r = 0; r < this.rows; r++) {
      const rowArr = [];
      for (let c = 0; c < this.cols; c++) {
        rowArr.push({
          row: r,
          col: c,
          isBlock: true,
          solution: '',
          userValue: '',
          number: null,
          acrossWordId: null,
          downWordId: null,
          isLocked: false,
          isError: false
        });
      }
      this.grid.push(rowArr);
    }

    // Preenche as palavras na matriz
    for (const w of this.words) {
      this.wordsById.set(w.id, w);

      for (let i = 0; i < w.length; i++) {
        const currR = w.direction === 'down' ? w.row + i : w.row;
        const currC = w.direction === 'across' ? w.col + i : w.col;

        const cell = this.grid[currR][currC];
        cell.isBlock = false;
        cell.solution = w.word[i];

        if (w.direction === 'across') {
          cell.acrossWordId = w.id;
        } else {
          cell.downWordId = w.id;
        }
      }
    }
  }

  /**
   * Indexa e numera as dicas seguindo a regra universal de palavras cruzadas:
   * Varre a grade de cima para baixo, da esquerda para a direita.
   */
  assignClueNumbers() {
    let currentNumber = 1;
    this.wordListAcross = [];
    this.wordListDown = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.isBlock) continue;

        let isStartOfAny = false;

        // Início de uma palavra horizontal?
        if (cell.acrossWordId) {
          const w = this.wordsById.get(cell.acrossWordId);
          if (w.row === r && w.col === c) {
            w.number = currentNumber;
            isStartOfAny = true;
            this.wordListAcross.push(w);
          }
        }

        // Início de uma palavra vertical?
        if (cell.downWordId) {
          const w = this.wordsById.get(cell.downWordId);
          if (w.row === r && w.col === c) {
            w.number = currentNumber;
            isStartOfAny = true;
            this.wordListDown.push(w);
          }
        }

        if (isStartOfAny) {
          cell.number = currentNumber;
          currentNumber++;
        }
      }
    }

    // Ordena listas pelo número da dica
    this.wordListAcross.sort((a, b) => a.number - b.number);
    this.wordListDown.sort((a, b) => a.number - b.number);
  }

  /**
   * Obtém a célula na posição (row, col)
   */
  getCell(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return null;
    }
    return this.grid[row][col];
  }

  /**
   * Insere ou atualiza o caractere do jogador
   */
  setUserLetter(row, col, char) {
    const cell = this.getCell(row, col);
    if (!cell || cell.isBlock || cell.isLocked) return false;

    const normalized = normalizeText(char);
    cell.userValue = normalized.length > 0 ? normalized[0] : '';
    cell.isError = false;
    return true;
  }

  /**
   * Apaga o conteúdo de uma célula (se não estiver travada por dica)
   */
  clearUserLetter(row, col) {
    const cell = this.getCell(row, col);
    if (!cell || cell.isBlock || cell.isLocked) return false;

    cell.userValue = '';
    cell.isError = false;
    return true;
  }

  /**
   * Verifica erros na grade. Marca `isError = true` nas letras preenchidas incorretas.
   * Retorna o total de erros encontrados.
   */
  checkErrors() {
    let errorCount = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.isBlock && cell.userValue !== '') {
          if (cell.userValue !== cell.solution) {
            cell.isError = true;
            errorCount++;
          } else {
            cell.isError = false;
          }
        }
      }
    }
    return errorCount;
  }

  /**
   * Limpa todas as marcações visuais de erro
   */
  clearErrors() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        cell.isError = false;
      }
    }
  }

  /**
   * Dica: Revela a letra correta de uma célula e a trava
   */
  revealLetter(row, col) {
    const cell = this.getCell(row, col);
    if (!cell || cell.isBlock) return null;

    cell.userValue = cell.solution;
    cell.isLocked = true;
    cell.isError = false;
    return cell.solution;
  }

  /**
   * Dica: Revela a palavra inteira e trava suas células
   */
  revealWord(wordId) {
    const word = this.wordsById.get(wordId);
    if (!word) return false;

    for (let i = 0; i < word.length; i++) {
      const r = word.direction === 'down' ? word.row + i : word.row;
      const c = word.direction === 'across' ? word.col + i : word.col;
      this.revealLetter(r, c);
    }
    return true;
  }

  /**
   * Checa se uma palavra foi completamente preenchida e está correta
   */
  isWordCorrect(wordId) {
    const word = this.wordsById.get(wordId);
    if (!word) return false;

    for (let i = 0; i < word.length; i++) {
      const r = word.direction === 'down' ? word.row + i : word.row;
      const c = word.direction === 'across' ? word.col + i : word.col;
      const cell = this.grid[r][c];
      if (cell.userValue !== cell.solution) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checa se a cruzada inteira foi preenchida com sucesso
   */
  isPuzzleComplete() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.isBlock) {
          if (cell.userValue !== cell.solution) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Retorna métricas de progresso da partida
   */
  getProgressStats() {
    let totalPlayableCells = 0;
    let filledCells = 0;
    let correctCells = 0;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.isBlock) {
          totalPlayableCells++;
          if (cell.userValue !== '') {
            filledCells++;
            if (cell.userValue === cell.solution) {
              correctCells++;
            }
          }
        }
      }
    }

    let completedWords = 0;
    for (const w of this.words) {
      if (this.isWordCorrect(w.id)) {
        completedWords++;
      }
    }

    const percentage = totalPlayableCells > 0 ? Math.round((correctCells / totalPlayableCells) * 100) : 0;

    return {
      totalPlayableCells,
      filledCells,
      correctCells,
      totalWords: this.words.length,
      completedWords,
      percentage
    };
  }

  /**
   * Serializa o progresso atual do usuário para persistência
   */
  exportState() {
    const values = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.isBlock && cell.userValue) {
          values.push({ r, c, v: cell.userValue, l: cell.isLocked ? 1 : 0 });
        }
      }
    }
    return values;
  }

  /**
   * Restaura o progresso do usuário
   */
  importState(stateValues) {
    if (!Array.isArray(stateValues)) return;
    for (const item of stateValues) {
      const cell = this.getCell(item.r, item.c);
      if (cell && !cell.isBlock) {
        cell.userValue = item.v;
        if (item.l) cell.isLocked = true;
      }
    }
  }

  // =========================================================================
  // GERADOR PROCEDURAL DE PALAVRAS CRUZADAS (ALGORITMO DE ENCAIXE)
  // =========================================================================

  /**
   * Gera proceduralmente uma grade válida e conectada a partir de uma lista de pares { word, clue }
   */
  static generateProcedural(wordCluePairs, options = {}) {
    const title = options.title || 'Cruzada Personalizada';
    const author = options.author || 'CruzadaMaster IA';
    const difficulty = options.difficulty || 'Médio';

    if (!Array.isArray(wordCluePairs) || wordCluePairs.length === 0) {
      throw new Error('Lista de palavras para gerar cruzada está vazia.');
    }

    // Normaliza e filtra pares
    const validPairs = wordCluePairs
      .map((item, idx) => ({
        id: `pw_${idx + 1}`,
        rawWord: item.word || '',
        word: normalizeText(item.word || ''),
        clue: item.clue || 'Dica misteriosa.'
      }))
      .filter((p) => p.word.length >= 2 && p.word.length <= 16);

    if (validPairs.length < 2) {
      throw new Error('Forneça pelo menos 2 palavras válidas com 2 ou mais letras.');
    }

    // Ordena da maior para a menor palavra
    validPairs.sort((a, b) => b.word.length - a.word.length);

    // Sistema de posicionamento em grade virtual esparsa
    const placedWords = [];
    const occupiedCells = new Map(); // key: "r,c" => { char, acrossId, downId }

    // 1. Posiciona a primeira palavra horizontalmente na origem (0, 0)
    const first = validPairs[0];
    const firstPlacement = {
      id: first.id,
      word: first.word,
      displayWord: first.rawWord,
      clue: first.clue,
      row: 0,
      col: 0,
      direction: 'across',
      length: first.word.length
    };
    placedWords.push(firstPlacement);

    for (let i = 0; i < first.word.length; i++) {
      occupiedCells.set(`0,${i}`, {
        char: first.word[i],
        acrossId: first.id,
        downId: null
      });
    }

    // 2. Tenta encaixar as palavras subsequentes criando interseções
    for (let pIdx = 1; pIdx < validPairs.length; pIdx++) {
      const candidate = validPairs[pIdx];
      let bestPlacement = null;
      let maxIntersections = -1;

      // Testa ambas direções: 'across' e 'down'
      for (const dir of ['across', 'down']) {
        const opposingDir = dir === 'across' ? 'down' : 'across';

        // Itera sobre todas as letras já posicionadas na grade
        for (const [coordKey, occ] of occupiedCells.entries()) {
          const [currR, currC] = coordKey.split(',').map(Number);

          // A célula já deve estar ocupada por uma palavra na direção oposta
          const hasOpposingWord = opposingDir === 'across' ? occ.acrossId : occ.downId;
          const hasSameWord = dir === 'across' ? occ.acrossId : occ.downId;

          if (!hasOpposingWord || hasSameWord) continue;

          // Procura se a letra do ponto coincide com alguma letra da palavra candidata
          for (let charIdx = 0; charIdx < candidate.word.length; charIdx++) {
            if (candidate.word[charIdx] === occ.char) {
              // Calcula onde a candidata começaria
              const startR = dir === 'down' ? currR - charIdx : currR;
              const startC = dir === 'across' ? currC - charIdx : currC;

              // Valida se o posicionamento é válido sem quebrar regras ortogonais
              const checkResult = CrosswordEngine.canPlaceWord(
                candidate.word,
                startR,
                startC,
                dir,
                candidate.id,
                occupiedCells
              );

              if (checkResult.valid) {
                // Heurística: prioriza palavras com mais interseções e proximidade ao centro
                const score = checkResult.intersections * 10 - (Math.abs(startR) + Math.abs(startC));
                if (score > maxIntersections) {
                  maxIntersections = score;
                  bestPlacement = {
                    id: candidate.id,
                    word: candidate.word,
                    displayWord: candidate.rawWord,
                    clue: candidate.clue,
                    row: startR,
                    col: startC,
                    direction: dir,
                    length: candidate.word.length
                  };
                }
              }
            }
          }
        }
      }

      // Se encontrou um posicionamento válido, fixa no tabuleiro
      if (bestPlacement) {
        placedWords.push(bestPlacement);
        for (let i = 0; i < bestPlacement.length; i++) {
          const r = bestPlacement.direction === 'down' ? bestPlacement.row + i : bestPlacement.row;
          const c = bestPlacement.direction === 'across' ? bestPlacement.col + i : bestPlacement.col;
          const key = `${r},${c}`;
          const existing = occupiedCells.get(key);

          if (existing) {
            if (bestPlacement.direction === 'across') existing.acrossId = bestPlacement.id;
            else existing.downId = bestPlacement.id;
          } else {
            occupiedCells.set(key, {
              char: bestPlacement.word[i],
              acrossId: bestPlacement.direction === 'across' ? bestPlacement.id : null,
              downId: bestPlacement.direction === 'down' ? bestPlacement.id : null
            });
          }
        }
      }
    }

    return {
      title,
      author,
      difficulty,
      words: placedWords
    };
  }

  /**
   * Valida se uma palavra pode ser colocada nas coordenadas (startR, startC) na direção indicada
   */
  static canPlaceWord(word, startR, startC, direction, wordId, occupiedCells) {
    let intersections = 0;
    const len = word.length;

    // Regra 1: As pontas da palavra (antes do início e depois do fim) não podem ter letras coladas
    const beforeR = direction === 'down' ? startR - 1 : startR;
    const beforeC = direction === 'across' ? startC - 1 : startC;
    if (occupiedCells.has(`${beforeR},${beforeC}`)) return { valid: false };

    const afterR = direction === 'down' ? startR + len : startR;
    const afterC = direction === 'across' ? startC + len : startC;
    if (occupiedCells.has(`${afterR},${afterC}`)) return { valid: false };

    // Regra 2: Para cada caractere da palavra
    for (let i = 0; i < len; i++) {
      const r = direction === 'down' ? startR + i : startR;
      const c = direction === 'across' ? startC + i : startC;
      const key = `${r},${c}`;
      const char = word[i];

      if (occupiedCells.has(key)) {
        const cell = occupiedCells.get(key);
        // Conflito de letra
        if (cell.char !== char) return { valid: false };

        // A célula já possui uma palavra nesta mesma direção? Não pode sobrepor na mesma orientação
        if (direction === 'across' && cell.acrossId) return { valid: false };
        if (direction === 'down' && cell.downId) return { valid: false };

        intersections++;
      } else {
        // Célula vazia: NÃO pode ter vizinhos paralelos grudados (tocando lateralmente)
        // Se a palavra for horizontal ('across'), não pode ter células ocupadas diretamente acima ou abaixo
        // Se a palavra for vertical ('down'), não pode ter células ocupadas diretamente à esquerda ou direita
        if (direction === 'across') {
          if (occupiedCells.has(`${r - 1},${c}`) || occupiedCells.has(`${r + 1},${c}`)) {
            return { valid: false };
          }
        } else {
          if (occupiedCells.has(`${r},${c - 1}`) || occupiedCells.has(`${r},${c + 1}`)) {
            return { valid: false };
          }
        }
      }
    }

    // Deve ter pelo menos uma interseção com as palavras existentes
    return {
      valid: intersections > 0,
      intersections
    };
  }
}
