/**
 * Criador Manual e Biblioteca de Palavras Cruzadas (CrosswordBuilder)
 * Criação visual de palavras + dicas, teste de encaixe procedural, salvamento local e biblioteca.
 */
import { CrosswordEngine, normalizeText } from './crosswordEngine.js';
import { soundFx } from './audio.js';

const STORAGE_MY_PUZZLES = 'CRUZADAMASTER_MY_PUZZLES';

export class CrosswordBuilder {
  constructor(app) {
    this.app = app;
    this.myPuzzles = this.loadMyPuzzles();
    this.currentGeneratedPreview = null;

    this.dom = {
      // Botões para abrir modais
      openBuilderBtn: document.getElementById('open-builder-btn'),
      drawerOpenBuilderBtn: document.getElementById('drawer-open-builder-btn'),
      openMyPuzzlesBtn: document.getElementById('open-my-puzzles-btn'),
      drawerOpenMyPuzzlesBtn: document.getElementById('drawer-open-my-puzzles-btn'),

      // Modal Criador Manual
      builderModal: document.getElementById('builder-modal'),
      closeBuilderModalBtn: document.getElementById('close-builder-modal-btn'),
      builderTitleInput: document.getElementById('builder-title-input'),
      builderDifficultySelect: document.getElementById('builder-difficulty-select'),
      builderWordsContainer: document.getElementById('builder-words-container'),
      builderAddWordRowBtn: document.getElementById('builder-add-word-row-btn'),
      builderTestBtn: document.getElementById('builder-test-btn'),
      builderSaveBtn: document.getElementById('builder-save-btn'),
      builderPlayBtn: document.getElementById('builder-play-btn'),
      builderFeedbackText: document.getElementById('builder-feedback-text'),
      builderPreviewCard: document.getElementById('builder-preview-card'),
      builderPreviewStats: document.getElementById('builder-preview-stats'),

      // Modal Minhas Cruzadas
      myPuzzlesModal: document.getElementById('my-puzzles-modal'),
      closeMyPuzzlesModalBtn: document.getElementById('close-my-puzzles-modal-btn'),
      myPuzzlesListContainer: document.getElementById('my-puzzles-list-container'),
      myPuzzlesCreateNewBtn: document.getElementById('my-puzzles-create-new-btn')
    };

    this.init();
  }

  init() {
    this.bindEvents();
  }

  loadMyPuzzles() {
    try {
      const data = localStorage.getItem(STORAGE_MY_PUZZLES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveMyPuzzles() {
    try {
      localStorage.setItem(STORAGE_MY_PUZZLES, JSON.stringify(this.myPuzzles));
      if (window.cruzadaApp?.authManager) {
        window.cruzadaApp.authManager.syncPuzzlesToCloud(this.myPuzzles);
      }
    } catch (e) {}
  }

  mergeCloudPuzzles(cloudPuzzles) {
    if (!Array.isArray(cloudPuzzles) || cloudPuzzles.length === 0) return;

    const existingIds = new Set(this.myPuzzles.map(p => p.id || p.title));
    let hasNew = false;

    cloudPuzzles.forEach(cp => {
      const idKey = cp.id || cp.title;
      if (!existingIds.has(idKey)) {
        this.myPuzzles.push(cp);
        existingIds.add(idKey);
        hasNew = true;
      }
    });

    if (hasNew) {
      try {
        localStorage.setItem(STORAGE_MY_PUZZLES, JSON.stringify(this.myPuzzles));
      } catch (e) {}
      console.log('[CrosswordBuilder] Tabuleiros da nuvem mesclados com sucesso.');
    }
  }

  bindEvents() {
    // Abrir Criador
    if (this.dom.openBuilderBtn) {
      this.dom.openBuilderBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.openBuilder();
      });
    }
    if (this.dom.drawerOpenBuilderBtn) {
      this.dom.drawerOpenBuilderBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.app.closeMobileDrawer();
        this.openBuilder();
      });
    }

    // Abrir Minhas Cruzadas
    if (this.dom.openMyPuzzlesBtn) {
      this.dom.openMyPuzzlesBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.openMyPuzzles();
      });
    }
    if (this.dom.drawerOpenMyPuzzlesBtn) {
      this.dom.drawerOpenMyPuzzlesBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.app.closeMobileDrawer();
        this.openMyPuzzles();
      });
    }

    // Fechar modais
    if (this.dom.closeBuilderModalBtn) {
      this.dom.closeBuilderModalBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.app.closeModal(this.dom.builderModal);
      });
    }
    if (this.dom.closeMyPuzzlesModalBtn) {
      this.dom.closeMyPuzzlesModalBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.app.closeModal(this.dom.myPuzzlesModal);
      });
    }

    // Botão Adicionar Linha
    if (this.dom.builderAddWordRowBtn) {
      this.dom.builderAddWordRowBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.addWordRow();
      });
    }

    // Botão Testar e Gerar
    if (this.dom.builderTestBtn) {
      this.dom.builderTestBtn.addEventListener('click', () => this.generatePreview());
    }

    // Botão Salvar
    if (this.dom.builderSaveBtn) {
      this.dom.builderSaveBtn.addEventListener('click', () => this.saveCurrentPuzzle());
    }

    // Botão Jogar Diretamente
    if (this.dom.builderPlayBtn) {
      this.dom.builderPlayBtn.addEventListener('click', () => this.playCurrentPuzzle());
    }

    // Botão Criar a partir de Minhas Cruzadas
    if (this.dom.myPuzzlesCreateNewBtn) {
      this.dom.myPuzzlesCreateNewBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.app.closeModal(this.dom.myPuzzlesModal);
        this.openBuilder();
      });
    }
  }

  openBuilder() {
    this.currentGeneratedPreview = null;
    if (this.dom.builderPreviewCard) {
      this.dom.builderPreviewCard.classList.add('hidden');
    }
    if (this.dom.builderSaveBtn) this.dom.builderSaveBtn.classList.add('hidden');
    if (this.dom.builderPlayBtn) this.dom.builderPlayBtn.classList.add('hidden');
    if (this.dom.builderFeedbackText) this.dom.builderFeedbackText.classList.add('hidden');

    if (this.dom.builderWordsContainer) {
      this.dom.builderWordsContainer.innerHTML = '';
      // Cria 4 linhas iniciais
      for (let i = 0; i < 4; i++) {
        this.addWordRow();
      }
    }

    this.app.openModal(this.dom.builderModal);
  }

  addWordRow(word = '', clue = '') {
    if (!this.dom.builderWordsContainer) return;

    const row = document.createElement('div');
    row.className = 'flex items-center gap-2 builder-row';

    row.innerHTML = `
      <input type="text" placeholder="PALAVRA" value="${word}" class="w-1/3 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-bold text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500 builder-word-input" />
      <input type="text" placeholder="Dica sobre a palavra..." value="${clue}" class="flex-1 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500 builder-clue-input" />
      <button type="button" class="p-2 rounded-xl bg-gray-800 hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 border border-gray-700 hover:border-rose-500/40 transition-colors remove-row-btn" title="Remover linha">
        ✕
      </button>
    `;

    // Filtra input para caixa alta automática
    const wordInput = row.querySelector('.builder-word-input');
    wordInput.addEventListener('input', (e) => {
      e.target.value = normalizeText(e.target.value);
    });

    const removeBtn = row.querySelector('.remove-row-btn');
    removeBtn.addEventListener('click', () => {
      soundFx.playClick();
      row.remove();
    });

    this.dom.builderWordsContainer.appendChild(row);
  }

  collectWordsFromForm() {
    const rows = this.dom.builderWordsContainer.querySelectorAll('.builder-row');
    const pairs = [];

    rows.forEach(r => {
      const wordVal = r.querySelector('.builder-word-input')?.value.trim();
      const clueVal = r.querySelector('.builder-clue-input')?.value.trim();

      if (wordVal && clueVal) {
        pairs.push({
          word: normalizeText(wordVal),
          clue: clueVal
        });
      }
    });

    return pairs;
  }

  generatePreview() {
    soundFx.playClick();
    const pairs = this.collectWordsFromForm();

    if (pairs.length < 2) {
      this.showFeedback('Adicione pelo menos 2 palavras válidas com suas respectivas dicas.', 'error');
      return;
    }

    const title = this.dom.builderTitleInput ? this.dom.builderTitleInput.value.trim() : 'Minha Cruzada';
    const difficulty = this.dom.builderDifficultySelect ? this.dom.builderDifficultySelect.value : 'Médio';
    const author = this.app.authManager ? this.app.authManager.getUserName() : 'Criador';

    try {
      const generated = CrosswordEngine.generateProcedural(pairs, {
        title: title || 'Cruzada Personalizada',
        author,
        difficulty
      });

      if (generated.words.length < 2) {
        this.showFeedback('As palavras informadas não compartilham letras suficientes para cruzar. Adicione mais palavras com letras comuns (A, E, O, R, S).', 'error');
        return;
      }

      this.currentGeneratedPreview = generated;
      soundFx.playWordComplete();

      if (this.dom.builderPreviewCard) {
        this.dom.builderPreviewCard.classList.remove('hidden');
      }
      if (this.dom.builderPreviewStats) {
        this.dom.builderPreviewStats.textContent = `Grade montada com sucesso: ${generated.words.length} palavras cruzadas perfeitamente!`;
      }
      if (this.dom.builderSaveBtn) this.dom.builderSaveBtn.classList.remove('hidden');
      if (this.dom.builderPlayBtn) this.dom.builderPlayBtn.classList.remove('hidden');
      if (this.dom.builderFeedbackText) this.dom.builderFeedbackText.classList.add('hidden');
    } catch (err) {
      soundFx.playError();
      this.showFeedback(err.message || 'Erro ao calcular cruzamento das palavras.', 'error');
    }
  }

  saveCurrentPuzzle() {
    if (!this.currentGeneratedPreview) return;

    soundFx.playClick();
    const puzzle = {
      ...this.currentGeneratedPreview,
      id: 'custom_' + Date.now(),
      createdAt: new Date().toISOString()
    };

    this.myPuzzles.unshift(puzzle);
    this.saveMyPuzzles();

    soundFx.playVictory();
    this.showFeedback('🎉 Tabuleiro salvo em "Minhas Cruzadas" com sucesso!', 'success');
  }

  playCurrentPuzzle() {
    if (!this.currentGeneratedPreview) return;

    soundFx.playClick();
    this.app.closeModal(this.dom.builderModal);
    this.app.loadNewPuzzle(this.currentGeneratedPreview);
  }

  openMyPuzzles() {
    if (!this.dom.myPuzzlesListContainer) return;
    this.dom.myPuzzlesListContainer.innerHTML = '';

    if (this.myPuzzles.length === 0) {
      this.dom.myPuzzlesListContainer.innerHTML = `
        <div class="text-center py-8 text-gray-400">
          <p class="text-sm font-semibold">Você ainda não criou nenhuma cruzada.</p>
          <span class="text-xs text-gray-500 mt-1 block">Clique em "Criar Nova Cruzada" para começar!</span>
        </div>
      `;
    } else {
      this.myPuzzles.forEach((puzzle, index) => {
        const item = document.createElement('div');
        item.className = 'p-4 rounded-xl bg-gray-800/80 border border-gray-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3';

        item.innerHTML = `
          <div>
            <h4 class="font-bold text-white text-sm">${puzzle.title}</h4>
            <span class="text-xs text-gray-400 font-medium">${puzzle.words.length} palavras • ${puzzle.difficulty} • por ${puzzle.author || 'Você'}</span>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-center">
            <button class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs play-custom-btn transition-colors">
              Jogar
            </button>
            <button class="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sky-300 share-custom-btn transition-colors" title="Compartilhar Link">
              🔗
            </button>
            <button class="p-1.5 rounded-lg bg-gray-700 hover:bg-rose-900 text-rose-400 delete-custom-btn transition-colors" title="Excluir">
              🗑️
            </button>
          </div>
        `;

        item.querySelector('.play-custom-btn').addEventListener('click', () => {
          soundFx.playClick();
          this.app.closeModal(this.dom.myPuzzlesModal);
          this.app.loadNewPuzzle(puzzle);
        });

        item.querySelector('.share-custom-btn').addEventListener('click', () => {
          soundFx.playClick();
          this.app.closeModal(this.dom.myPuzzlesModal);
          this.app.currentPuzzleData = puzzle;
          this.app.openShareModal();
        });

        item.querySelector('.delete-custom-btn').addEventListener('click', () => {
          if (confirm(`Deseja excluir a cruzada "${puzzle.title}"?`)) {
            soundFx.playClick();
            this.myPuzzles.splice(index, 1);
            this.saveMyPuzzles();
            this.openMyPuzzles(); // Re-renderiza
          }
        });

        this.dom.myPuzzlesListContainer.appendChild(item);
      });
    }

    this.app.openModal(this.dom.myPuzzlesModal);
  }

  showFeedback(msg, type = 'info') {
    if (!this.dom.builderFeedbackText) return;
    this.dom.builderFeedbackText.textContent = msg;
    this.dom.builderFeedbackText.className = type === 'error'
      ? 'text-xs text-rose-400 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 block'
      : (type === 'success' 
        ? 'text-xs text-emerald-400 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 block' 
        : 'text-xs text-indigo-300 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 block');
  }
}
