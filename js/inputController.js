/**
 * Controlador de Entrada e Navegação do CruzadaMaster (InputController)
 * Teclado físico desktop, teclado virtual mobile integrado e navegação inteligente.
 */
import { soundFx } from './audio.js';

export class InputController {
  constructor(app) {
    this.app = app;
    this.activeRow = 0;
    this.activeCol = 0;
    this.activeDirection = 'across'; // 'across' | 'down'
    this.activeWordId = null;

    this.virtualKeypadContainer = document.getElementById('virtual-keypad');
    this.init();
  }

  init() {
    this.bindPhysicalKeyboard();
    this.renderVirtualKeypad();
  }

  /**
   * Define a célula inicial ao carregar um novo tabuleiro
   */
  setDefaultFocus(engine) {
    if (!engine || engine.words.length === 0) return;
    const firstWord = engine.words[0];
    this.activeRow = firstWord.row;
    this.activeCol = firstWord.col;
    this.activeDirection = firstWord.direction;
    this.activeWordId = firstWord.id;
  }

  getActiveState() {
    return {
      activeRow: this.activeRow,
      activeCol: this.activeCol,
      activeDirection: this.activeDirection,
      activeWordId: this.activeWordId
    };
  }

  /**
   * Manipula o clique em uma célula
   */
  handleCellClick(row, col) {
    const engine = this.app.engine;
    const cell = engine.getCell(row, col);
    if (!cell || cell.isBlock) return;

    soundFx.init(); // Desbloqueia Web Audio no gesto

    // Se já estava selecionada, tenta alternar a direção (se a célula for interseção)
    if (this.activeRow === row && this.activeCol === col) {
      if (cell.acrossWordId && cell.downWordId) {
        this.activeDirection = this.activeDirection === 'across' ? 'down' : 'across';
        this.activeWordId = this.activeDirection === 'across' ? cell.acrossWordId : cell.downWordId;
        soundFx.playToggleDirection();
      }
    } else {
      this.activeRow = row;
      this.activeCol = col;

      // Mantém a direção atual se a nova célula a suportar
      if (this.activeDirection === 'across' && cell.acrossWordId) {
        this.activeWordId = cell.acrossWordId;
      } else if (this.activeDirection === 'down' && cell.downWordId) {
        this.activeWordId = cell.downWordId;
      } else {
        // Alterna para a direção que existir
        if (cell.acrossWordId) {
          this.activeDirection = 'across';
          this.activeWordId = cell.acrossWordId;
        } else if (cell.downWordId) {
          this.activeDirection = 'down';
          this.activeWordId = cell.downWordId;
        }
      }
      soundFx.playKey();
    }

    this.app.syncUI();
  }

  /**
   * Foca diretamente uma palavra a partir do clique na lista de pistas
   */
  selectWord(wordId) {
    const engine = this.app.engine;
    const word = engine.wordsById.get(wordId);
    if (!word) return;

    soundFx.playClick();
    this.activeRow = word.row;
    this.activeCol = word.col;
    this.activeDirection = word.direction;
    this.activeWordId = word.id;

    // Se a primeira célula já estiver preenchida, tenta focar na primeira vazia
    for (let i = 0; i < word.length; i++) {
      const r = word.direction === 'down' ? word.row + i : word.row;
      const c = word.direction === 'across' ? word.col + i : word.col;
      const cell = engine.getCell(r, c);
      if (cell && !cell.userValue) {
        this.activeRow = r;
        this.activeCol = c;
        break;
      }
    }

    this.app.syncUI();
  }

  /**
   * Insere caractere digitado na célula atual
   */
  typeLetter(char) {
    const engine = this.app.engine;
    const cell = engine.getCell(this.activeRow, this.activeCol);
    if (!cell || cell.isBlock || cell.isLocked) return;

    const success = engine.setUserLetter(this.activeRow, this.activeCol, char);
    if (success) {
      soundFx.playKey();

      // Checa se a palavra inteira foi concluída corretamente
      if (this.activeWordId && engine.isWordCorrect(this.activeWordId)) {
        soundFx.playWordComplete();
      }

      // Auto-avanço para a próxima célula da palavra
      this.moveNextInWord();

      // Atualiza interface e verifica vitória
      this.app.syncUI();
      this.app.checkPuzzleCompletion();
    }
  }

  /**
   * Apaga a letra atual (Backspace)
   */
  deleteLetter() {
    const engine = this.app.engine;
    const cell = engine.getCell(this.activeRow, this.activeCol);
    if (!cell || cell.isBlock) return;

    soundFx.playBackspace();

    if (cell.userValue && !cell.isLocked) {
      engine.clearUserLetter(this.activeRow, this.activeCol);
    } else {
      // Se já estava vazia, retrocede e apaga a anterior
      this.movePrevInWord();
      const prevCell = engine.getCell(this.activeRow, this.activeCol);
      if (prevCell && !prevCell.isLocked) {
        engine.clearUserLetter(this.activeRow, this.activeCol);
      }
    }

    this.app.syncUI();
  }

  /**
   * Avança para a próxima célula da palavra ativa
   */
  moveNextInWord() {
    const engine = this.app.engine;
    const word = engine.wordsById.get(this.activeWordId);
    if (!word) return;

    const currOffset = this.activeDirection === 'down' 
      ? this.activeRow - word.row 
      : this.activeCol - word.col;

    if (currOffset < word.length - 1) {
      if (this.activeDirection === 'down') {
        this.activeRow++;
      } else {
        this.activeCol++;
      }
    }
  }

  /**
   * Retrocede para a célula anterior na palavra ativa
   */
  movePrevInWord() {
    const engine = this.app.engine;
    const word = engine.wordsById.get(this.activeWordId);
    if (!word) return;

    const currOffset = this.activeDirection === 'down' 
      ? this.activeRow - word.row 
      : this.activeCol - word.col;

    if (currOffset > 0) {
      if (this.activeDirection === 'down') {
        this.activeRow--;
      } else {
        this.activeCol--;
      }
    }
  }

  /**
   * Alterna a direção da palavra manualmente
   */
  toggleDirection() {
    const engine = this.app.engine;
    const cell = engine.getCell(this.activeRow, this.activeCol);
    if (!cell || cell.isBlock) return;

    if (cell.acrossWordId && cell.downWordId) {
      this.activeDirection = this.activeDirection === 'across' ? 'down' : 'across';
      this.activeWordId = this.activeDirection === 'across' ? cell.acrossWordId : cell.downWordId;
      soundFx.playToggleDirection();
      this.app.syncUI();
    }
  }

  /**
   * Pula para a próxima palavra na lista
   */
  selectNextWord() {
    const engine = this.app.engine;
    const allWords = [...engine.wordListAcross, ...engine.wordListDown];
    if (allWords.length === 0) return;

    let currentIndex = allWords.findIndex(w => w.id === this.activeWordId);
    let nextIndex = (currentIndex + 1) % allWords.length;
    this.selectWord(allWords[nextIndex].id);
  }

  /**
   * Navegação direcional pelas setas do teclado
   */
  navigate(dr, dc) {
    const engine = this.app.engine;
    let newR = this.activeRow + dr;
    let newC = this.activeCol + dc;

    if (newR >= 0 && newR < engine.rows && newC >= 0 && newC < engine.cols) {
      const cell = engine.getCell(newR, newC);
      if (cell && !cell.isBlock) {
        this.activeRow = newR;
        this.activeCol = newC;
        if (this.activeDirection === 'across' && cell.acrossWordId) {
          this.activeWordId = cell.acrossWordId;
        } else if (this.activeDirection === 'down' && cell.downWordId) {
          this.activeWordId = cell.downWordId;
        }
        soundFx.playKey();
        this.app.syncUI();
      }
    }
  }

  /**
   * Escuta o teclado físico do computador
   */
  bindPhysicalKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Ignora se estiver digitando em um campo de texto ou modal
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        this.deleteLetter();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.toggleDirection();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.selectNextWord();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigate(-1, 0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigate(1, 0);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.navigate(0, -1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.navigate(0, 1);
      } else if (/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]$/.test(e.key)) {
        e.preventDefault();
        this.typeLetter(e.key);
      }
    });
  }

  /**
   * Renderiza o Teclado Virtual Mobile (On-Screen Keypad)
   */
  renderVirtualKeypad() {
    if (!this.virtualKeypadContainer) return;

    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
      ['DIR', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
    ];

    this.virtualKeypadContainer.innerHTML = '';

    rows.forEach(rowKeys => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'keypad-row flex justify-center gap-1 sm:gap-1.5 my-1';

      rowKeys.forEach(key => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'keypad-key font-bold text-sm sm:text-base rounded-lg shadow-sm transition-all select-none active:scale-95';

        if (key === 'DEL') {
          btn.innerHTML = '⌫';
          btn.classList.add('keypad-action-btn', 'px-3', 'bg-rose-500/20', 'text-rose-400', 'border', 'border-rose-500/30');
          btn.title = 'Apagar letra';
          btn.addEventListener('click', () => this.deleteLetter());
        } else if (key === 'DIR') {
          btn.innerHTML = '⇄';
          btn.classList.add('keypad-action-btn', 'px-3', 'bg-indigo-500/20', 'text-indigo-400', 'border', 'border-indigo-500/30');
          btn.title = 'Alternar direção (Horizontal/Vertical)';
          btn.addEventListener('click', () => this.toggleDirection());
        } else {
          btn.textContent = key;
          btn.classList.add('keypad-letter-btn', 'w-8', 'h-10', 'sm:w-10', 'sm:h-12', 'bg-gray-800/90', 'text-white', 'hover:bg-gray-700');
          btn.addEventListener('click', () => this.typeLetter(key));
        }

        rowDiv.appendChild(btn);
      });

      this.virtualKeypadContainer.appendChild(rowDiv);
    });
  }
}
