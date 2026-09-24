/**
 * Renderizador de Grade e Painel de Pistas do CruzadaMaster (GridRenderer)
 * Renderização dinâmica CSS Grid, realces de palavra ativa, célula em foco e scroll sincronizado.
 */

export class GridRenderer {
  constructor(app) {
    this.app = app;
    this.gridContainer = document.getElementById('crossword-grid');
    this.cluesAcrossContainer = document.getElementById('clues-across-list');
    this.cluesDownContainer = document.getElementById('clues-down-list');
    this.activeClueBarText = document.getElementById('active-clue-text');
    this.activeClueBarBadge = document.getElementById('active-clue-badge');
  }

  /**
   * Renderiza a estrutura completa da grade e das listas de pistas
   */
  render(engine, activeState) {
    if (!this.gridContainer || !engine) return;

    this.renderGrid(engine, activeState);
    this.renderClues(engine, activeState);
    this.updateActiveClueBar(engine, activeState);
  }

  /**
   * Constrói as células da grade 2D com CSS Grid responsivo
   */
  renderGrid(engine, activeState) {
    const { rows, cols, grid } = engine;
    const { activeRow, activeCol, activeDirection, activeWordId } = activeState;

    this.gridContainer.innerHTML = '';
    this.gridContainer.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    this.gridContainer.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;

    // Calcula dimensão máxima para manter proporção quadrada perfeita (aspect-ratio 1/1)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellData = grid[r][c];
        const cellEl = document.createElement('div');
        cellEl.className = 'cw-cell';
        cellEl.dataset.row = r;
        cellEl.dataset.col = c;

        if (cellData.isBlock) {
          cellEl.classList.add('cw-cell-block');
        } else {
          cellEl.classList.add('cw-cell-playable');

          // Verifica se é a célula em foco exato
          if (r === activeRow && c === activeCol) {
            cellEl.classList.add('cw-cell-active');
          }

          // Verifica se pertence à palavra atualmente ativa
          if (activeWordId) {
            const isPartAcross = cellData.acrossWordId === activeWordId;
            const isPartDown = cellData.downWordId === activeWordId;
            if (isPartAcross || isPartDown) {
              cellEl.classList.add('cw-cell-word-highlight');
            }
          }

          // Estados de trava ou erro
          if (cellData.isLocked) {
            cellEl.classList.add('cw-cell-locked');
          }
          if (cellData.isError) {
            cellEl.classList.add('cw-cell-error');
          }

          // Número da dica no canto superior esquerdo
          if (cellData.number) {
            const numEl = document.createElement('span');
            numEl.className = 'cw-cell-number';
            numEl.textContent = cellData.number;
            cellEl.appendChild(numEl);
          }

          // Letra do jogador
          const letterEl = document.createElement('span');
          letterEl.className = 'cw-cell-letter';
          letterEl.textContent = cellData.userValue || '';
          cellEl.appendChild(letterEl);

          // Evento de clique para focar ou alternar direção
          cellEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.app.inputController.handleCellClick(r, c);
          });
        }

        this.gridContainer.appendChild(cellEl);
      }
    }
  }

  /**
   * Renderiza as listas de pistas Horizontais e Verticais
   */
  renderClues(engine, activeState) {
    const { wordListAcross, wordListDown } = engine;
    const { activeWordId } = activeState;

    if (this.cluesAcrossContainer) {
      this.cluesAcrossContainer.innerHTML = '';
      wordListAcross.forEach(word => {
        const item = this.createClueElement(word, activeWordId === word.id, engine.isWordCorrect(word.id));
        this.cluesAcrossContainer.appendChild(item);
        if (activeWordId === word.id) {
          this.scrollClueIntoView(item, this.cluesAcrossContainer);
        }
      });
    }

    if (this.cluesDownContainer) {
      this.cluesDownContainer.innerHTML = '';
      wordListDown.forEach(word => {
        const item = this.createClueElement(word, activeWordId === word.id, engine.isWordCorrect(word.id));
        this.cluesDownContainer.appendChild(item);
        if (activeWordId === word.id) {
          this.scrollClueIntoView(item, this.cluesDownContainer);
        }
      });
    }
  }

  /**
   * Cria o elemento visual de uma dica individual
   */
  createClueElement(word, isActive, isCompleted) {
    const el = document.createElement('div');
    el.className = `cw-clue-item ${isActive ? 'cw-clue-active' : ''} ${isCompleted ? 'cw-clue-completed' : ''}`;
    el.dataset.wordId = word.id;
    el.dataset.direction = word.direction;

    el.innerHTML = `
      <div class="flex items-start gap-2.5">
        <span class="cw-clue-badge">${word.number}</span>
        <div class="flex-1">
          <p class="cw-clue-text leading-snug">${word.clue}</p>
          <span class="text-[11px] opacity-60 font-semibold uppercase tracking-wider">${word.length} letras</span>
        </div>
        ${isCompleted ? '<span class="text-emerald-400 font-bold shrink-0">✓</span>' : ''}
      </div>
    `;

    el.addEventListener('click', () => {
      this.app.inputController.selectWord(word.id);
    });

    return el;
  }

  /**
   * Atualiza a barra superior de dica ativa
   */
  updateActiveClueBar(engine, activeState) {
    if (!this.activeClueBarText || !this.activeClueBarBadge) return;

    const { activeWordId } = activeState;
    if (!activeWordId) {
      this.activeClueBarBadge.textContent = 'SELECIONE';
      this.activeClueBarText.textContent = 'Toque em uma célula da grade para começar.';
      return;
    }

    const word = engine.wordsById.get(activeWordId);
    if (word) {
      const dirText = word.direction === 'across' ? 'HORIZONTAL' : 'VERTICAL';
      this.activeClueBarBadge.textContent = `${word.number} ${dirText}`;
      this.activeClueBarText.textContent = `${word.clue} (${word.length} letras)`;
    }
  }

  /**
   * Rola a dica ativa suavemente para o campo de visão
   */
  scrollClueIntoView(clueElement, container) {
    if (!clueElement || !container) return;
    try {
      clueElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {
      // Fallback
    }
  }

  /**
   * Atualização leve apenas dos valores das células (evita recriar o DOM a cada caractere digitado)
   */
  updateCellValues(engine, activeState) {
    const { rows, cols, grid } = engine;
    const { activeRow, activeCol, activeWordId } = activeState;

    const cells = this.gridContainer.querySelectorAll('.cw-cell-playable');
    cells.forEach(cellEl => {
      const r = parseInt(cellEl.dataset.row, 10);
      const c = parseInt(cellEl.dataset.col, 10);
      const cellData = grid[r][c];

      // Atualiza texto
      const letterSpan = cellEl.querySelector('.cw-cell-letter');
      if (letterSpan) {
        letterSpan.textContent = cellData.userValue || '';
      }

      // Atualiza classes ativas
      cellEl.classList.toggle('cw-cell-active', r === activeRow && c === activeCol);

      let inWord = false;
      if (activeWordId) {
        inWord = cellData.acrossWordId === activeWordId || cellData.downWordId === activeWordId;
      }
      cellEl.classList.toggle('cw-cell-word-highlight', inWord);
      cellEl.classList.toggle('cw-cell-locked', cellData.isLocked);
      cellEl.classList.toggle('cw-cell-error', cellData.isError);
    });

    this.renderClues(engine, activeState);
    this.updateActiveClueBar(engine, activeState);
  }
}
