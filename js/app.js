/**
 * Orquestrador Central da Aplicação CruzadaMaster (CruzadaApp)
 * Gerencia o ciclo de vida do jogo, modais, timer, pontuação, hints, auth, criador e drawer mobile.
 */
import { CrosswordEngine } from './crosswordEngine.js';
import { GridRenderer } from './gridRenderer.js';
import { InputController } from './inputController.js';
import { ThemeManager } from './themeManager.js';
import { OfflineManager } from './offlineManager.js';
import { AuthManager } from './authManager.js';
import { CrosswordBuilder } from './crosswordBuilder.js';
import { DEFAULT_PUZZLES, PUZZLE_CATEGORIES } from './puzzles.js';
import { soundFx } from './audio.js';
import { 
  encodeCrosswordToUrl, 
  decodeCrosswordFromUrl, 
  renderQRCode, 
  copyToClipboard, 
  exportCrosswordAsJSON 
} from './shareManager.js';
import { aiService } from './aiService.js';

const STORAGE_LAST_PUZZLE = 'CRUZADAMASTER_SAVED_PUZZLE';
const STORAGE_LAST_STATE = 'CRUZADAMASTER_SAVED_STATE';

class CruzadaApp {
  constructor() {
    this.engine = new CrosswordEngine();
    this.gridRenderer = null;
    this.inputController = null;
    this.themeManager = null;
    this.offlineManager = null;
    this.authManager = null;
    this.crosswordBuilder = null;

    // Estado da partida
    this.score = 1000;
    this.hintsUsed = 0;
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.isCompleted = false;
    this.currentPuzzleData = null;
    this.selectedCategory = 'all';

    // Cache de elementos do DOM
    this.dom = {
      // Header & Status
      puzzleTitle: document.getElementById('header-puzzle-title'),
      puzzleDifficultyBadge: document.getElementById('header-difficulty-badge'),
      timerDisplay: document.getElementById('timer-display'),
      scoreBadge: document.getElementById('score-badge'),
      progressPercent: document.getElementById('progress-percent'),
      progressBar: document.getElementById('progress-bar-fill'),

      // Ações Principais
      selectPuzzleBtn: document.getElementById('select-puzzle-btn'),
      aiGeneratorBtn: document.getElementById('ai-generator-btn'),
      shareBtn: document.getElementById('share-btn'),
      drawerShareBtn: document.getElementById('drawer-share-btn'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      drawerThemeBtn: document.getElementById('drawer-theme-btn'),
      soundToggleBtn: document.getElementById('sound-toggle-btn'),
      drawerSoundBtn: document.getElementById('drawer-sound-btn'),

      // Mobile Aside Drawer
      mobileMenuToggleBtn: document.getElementById('mobile-menu-toggle-btn'),
      closeMobileDrawerBtn: document.getElementById('close-mobile-drawer-btn'),
      mobileDrawerContainer: document.getElementById('mobile-drawer-container'),
      mobileDrawerBackdrop: document.getElementById('mobile-drawer-backdrop'),
      drawerSelectPuzzleBtn: document.getElementById('drawer-select-puzzle-btn'),
      drawerAiBtn: document.getElementById('drawer-ai-btn'),

      // Botões de Dicas
      hintLetterBtn: document.getElementById('hint-letter-btn'),
      hintWordBtn: document.getElementById('hint-word-btn'),
      checkErrorsBtn: document.getElementById('check-errors-btn'),
      resetBoardBtn: document.getElementById('reset-board-btn'),

      // Modais
      modalBackdrop: document.getElementById('modal-backdrop'),
      puzzlesModal: document.getElementById('puzzles-modal'),
      aiModal: document.getElementById('ai-modal'),
      shareModal: document.getElementById('share-modal'),
      victoryModal: document.getElementById('victory-modal'),
      themeModal: document.getElementById('theme-modal'),

      // Elementos do Modal de Puzzles
      puzzlesListContainer: document.getElementById('puzzles-list-container'),
      puzzlesCategoriesBar: document.getElementById('puzzles-categories-bar'),
      puzzlesCountBadge: document.getElementById('puzzles-count-badge'),
      closePuzzlesModalBtn: document.getElementById('close-puzzles-modal-btn'),

      // Elementos do Modal de IA
      closeAiModalBtn: document.getElementById('close-ai-modal-btn'),
      aiTopicInput: document.getElementById('ai-topic-input'),
      aiDifficultySelect: document.getElementById('ai-difficulty-select'),
      aiApiKeyInput: document.getElementById('ai-api-key-input'),
      aiGenerateSubmitBtn: document.getElementById('ai-generate-submit-btn'),
      aiLoadingIndicator: document.getElementById('ai-loading-indicator'),
      aiFeedbackText: document.getElementById('ai-feedback-text'),

      // Elementos do Modal de Compartilhamento
      closeShareModalBtn: document.getElementById('close-share-modal-btn'),
      shareUrlInput: document.getElementById('share-url-input'),
      copyShareUrlBtn: document.getElementById('copy-share-url-btn'),
      copyShareFeedback: document.getElementById('copy-share-feedback'),
      shareQrContainer: document.getElementById('share-qr-container'),
      exportJsonBtn: document.getElementById('export-json-btn'),

      // Elementos do Modal de Vitória
      victoryTitle: document.getElementById('victory-title'),
      victoryTime: document.getElementById('victory-time'),
      victoryScore: document.getElementById('victory-score'),
      victoryHints: document.getElementById('victory-hints'),
      victoryPlayNextBtn: document.getElementById('victory-play-next-btn'),
      victoryCloseBtn: document.getElementById('victory-close-btn')
    };

    this.init();
  }

  init() {
    this.themeManager = new ThemeManager(this);
    this.offlineManager = new OfflineManager(this);
    this.authManager = new AuthManager(this);
    this.crosswordBuilder = new CrosswordBuilder(this);
    this.gridRenderer = new GridRenderer(this);
    this.inputController = new InputController(this);

    this.bindEvents();
    this.bindMobileDrawer();
    this.bindModals();
    this.updateSoundIcons();

    // Carrega cruzada inicial (URL compartilhada > LocalStorage > Default #1)
    const sharedPuzzle = decodeCrosswordFromUrl();
    if (sharedPuzzle) {
      this.loadNewPuzzle(sharedPuzzle);
      this.showToast(`🎉 Cruzada compartilhada "${sharedPuzzle.title}" carregada com sucesso!`);
    } else {
      const savedPuzzle = this.loadSavedPuzzle();
      if (savedPuzzle) {
        this.loadNewPuzzle(savedPuzzle.puzzle, savedPuzzle.state);
      } else {
        this.loadNewPuzzle(DEFAULT_PUZZLES[0]);
      }
    }

    // Escuta mudanças de hash na URL
    window.addEventListener('hashchange', () => {
      const newShared = decodeCrosswordFromUrl();
      if (newShared) {
        this.loadNewPuzzle(newShared);
        this.showToast(`🎉 Cruzada "${newShared.title}" carregada!`);
      }
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Carrega um novo tabuleiro no motor e inicializa renderizadores
   */
  loadNewPuzzle(puzzleData, savedState = null) {
    this.currentPuzzleData = puzzleData;
    this.engine.loadPuzzle(puzzleData);

    if (savedState) {
      this.engine.importState(savedState);
    }

    this.score = 1000;
    this.hintsUsed = 0;
    this.isCompleted = false;
    this.startTimer();

    this.inputController.setDefaultFocus(this.engine);
    this.gridRenderer.render(this.engine, this.inputController.getActiveState());
    this.updateStatsUI();

    // Atualiza cabeçalho
    if (this.dom.puzzleTitle) {
      this.dom.puzzleTitle.textContent = this.engine.title;
    }
    if (this.dom.puzzleDifficultyBadge) {
      this.dom.puzzleDifficultyBadge.textContent = this.engine.difficulty;
    }

    this.saveCurrentState();
  }

  /**
   * Sincroniza a interface após qualquer digitação, clique ou navegação
   */
  syncUI() {
    this.gridRenderer.updateCellValues(this.engine, this.inputController.getActiveState());
    this.updateStatsUI();
    this.saveCurrentState();
  }

  /**
   * Atualiza placar, barra de progresso e estatísticas
   */
  updateStatsUI() {
    const stats = this.engine.getProgressStats();

    if (this.dom.progressPercent) {
      this.dom.progressPercent.textContent = `${stats.percentage}%`;
    }
    if (this.dom.progressBar) {
      this.dom.progressBar.style.width = `${stats.percentage}%`;
    }
    if (this.dom.scoreBadge) {
      this.dom.scoreBadge.textContent = `${Math.max(0, this.score)} pts`;
    }
  }

  /**
   * Timer de jogo
   */
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerSeconds = 0;

    this.timerInterval = setInterval(() => {
      if (!this.isCompleted) {
        this.timerSeconds++;
        this.renderTimer();
      }
    }, 1000);
    this.renderTimer();
  }

  renderTimer() {
    if (!this.dom.timerDisplay) return;
    const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
    const secs = (this.timerSeconds % 60).toString().padStart(2, '0');
    this.dom.timerDisplay.textContent = `${mins}:${secs}`;
  }

  /**
   * Checa se o jogador venceu
   */
  checkPuzzleCompletion() {
    if (this.isCompleted) return;

    if (this.engine.isPuzzleComplete()) {
      this.isCompleted = true;
      if (this.timerInterval) clearInterval(this.timerInterval);

      // Bônus por tempo (se finalizado em menos de 5 min)
      const timeBonus = Math.max(0, 300 - this.timerSeconds) * 2;
      this.score += timeBonus;
      this.updateStatsUI();

      soundFx.playVictory();
      this.triggerConfetti();
      this.openVictoryModal();
    }
  }

  /**
   * Sistema de Dicas
   */
  useHintLetter() {
    if (this.isCompleted) return;
    soundFx.init();

    const { activeRow, activeCol } = this.inputController.getActiveState();
    const cell = this.engine.getCell(activeRow, activeCol);

    if (cell && !cell.isBlock && !cell.isLocked) {
      this.engine.revealLetter(activeRow, activeCol);
      this.score = Math.max(0, this.score - 50);
      this.hintsUsed++;
      soundFx.playHint();
      this.syncUI();
      this.checkPuzzleCompletion();
    }
  }

  useHintWord() {
    if (this.isCompleted) return;
    soundFx.init();

    const { activeWordId } = this.inputController.getActiveState();
    if (activeWordId) {
      this.engine.revealWord(activeWordId);
      this.score = Math.max(0, this.score - 200);
      this.hintsUsed++;
      soundFx.playHint();
      this.syncUI();
      this.checkPuzzleCompletion();
    }
  }

  checkAndHighlightErrors() {
    soundFx.init();
    const errorCount = this.engine.checkErrors();

    if (errorCount > 0) {
      soundFx.playError();
      this.score = Math.max(0, this.score - 25);
    } else {
      soundFx.playWordComplete();
    }

    this.syncUI();

    setTimeout(() => {
      this.engine.clearErrors();
      this.syncUI();
    }, 3000);
  }

  resetCurrentBoard() {
    if (confirm('Deseja realmente reiniciar este tabuleiro de palavras cruzadas?')) {
      soundFx.playClick();
      this.loadNewPuzzle(this.currentPuzzleData);
    }
  }

  saveCurrentState() {
    try {
      if (this.currentPuzzleData) {
        localStorage.setItem(STORAGE_LAST_PUZZLE, JSON.stringify(this.currentPuzzleData));
        localStorage.setItem(STORAGE_LAST_STATE, JSON.stringify(this.engine.exportState()));
      }
    } catch (e) {}
  }

  loadSavedPuzzle() {
    try {
      const rawPuzzle = localStorage.getItem(STORAGE_LAST_PUZZLE);
      const rawState = localStorage.getItem(STORAGE_LAST_STATE);
      if (rawPuzzle) {
        return {
          puzzle: JSON.parse(rawPuzzle),
          state: rawState ? JSON.parse(rawState) : null
        };
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  triggerConfetti() {
    if (window.confetti) {
      window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        window.confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
        window.confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
      }, 300);
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-2xl z-50 animate-bounce flex items-center gap-2 border border-indigo-400';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  updateSoundIcons() {
    const isMuted = soundFx.isMuted();
    const iconHtml = isMuted 
      ? '<i data-lucide="volume-x" class="w-4 h-4 text-gray-400"></i>' 
      : '<i data-lucide="volume-2" class="w-4 h-4 text-indigo-400"></i>';

    if (this.dom.soundToggleBtn) this.dom.soundToggleBtn.innerHTML = iconHtml;
    if (this.dom.drawerSoundBtn) {
      this.dom.drawerSoundBtn.innerHTML = `
        ${iconHtml}
        <span>${isMuted ? 'Sons Desativados' : 'Sons Ativados'}</span>
      `;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // MOBILE ASIDE DRAWER
  // =========================================================================

  bindMobileDrawer() {
    if (this.dom.mobileMenuToggleBtn) {
      this.dom.mobileMenuToggleBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.openMobileDrawer();
      });
    }

    if (this.dom.closeMobileDrawerBtn) {
      this.dom.closeMobileDrawerBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.closeMobileDrawer();
      });
    }

    if (this.dom.mobileDrawerBackdrop) {
      this.dom.mobileDrawerBackdrop.addEventListener('click', () => {
        this.closeMobileDrawer();
      });
    }

    if (this.dom.drawerSelectPuzzleBtn) {
      this.dom.drawerSelectPuzzleBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.closeMobileDrawer();
        this.openPuzzlesModal();
      });
    }

    if (this.dom.drawerAiBtn) {
      this.dom.drawerAiBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.closeMobileDrawer();
        this.openAiModal();
      });
    }

    if (this.dom.drawerShareBtn) {
      this.dom.drawerShareBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.closeMobileDrawer();
        this.openShareModal();
      });
    }

    if (this.dom.drawerThemeBtn) {
      this.dom.drawerThemeBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.closeMobileDrawer();
        this.themeManager.openThemeModal();
      });
    }

    if (this.dom.drawerSoundBtn) {
      this.dom.drawerSoundBtn.addEventListener('click', () => {
        soundFx.init();
        soundFx.toggleMute();
        this.updateSoundIcons();
        if (!soundFx.isMuted()) soundFx.playKey();
      });
    }
  }

  openMobileDrawer() {
    if (!this.dom.mobileDrawerContainer) return;
    this.dom.mobileDrawerContainer.classList.add('drawer-open');
    if (window.lucide) window.lucide.createIcons();
  }

  closeMobileDrawer() {
    if (!this.dom.mobileDrawerContainer) return;
    this.dom.mobileDrawerContainer.classList.remove('drawer-open');
  }

  // =========================================================================
  // GESTÃO DE MODAIS E EVENTOS
  // =========================================================================

  bindEvents() {
    if (this.dom.soundToggleBtn) {
      this.dom.soundToggleBtn.addEventListener('click', () => {
        soundFx.init();
        soundFx.toggleMute();
        this.updateSoundIcons();
        if (!soundFx.isMuted()) soundFx.playKey();
      });
    }

    if (this.dom.themeToggleBtn) {
      this.dom.themeToggleBtn.addEventListener('click', () => {
        this.themeManager.openThemeModal();
      });
    }

    if (this.dom.hintLetterBtn) this.dom.hintLetterBtn.addEventListener('click', () => this.useHintLetter());
    if (this.dom.hintWordBtn) this.dom.hintWordBtn.addEventListener('click', () => this.useHintWord());
    if (this.dom.checkErrorsBtn) this.dom.checkErrorsBtn.addEventListener('click', () => this.checkAndHighlightErrors());
    if (this.dom.resetBoardBtn) this.dom.resetBoardBtn.addEventListener('click', () => this.resetCurrentBoard());

    if (this.dom.shareBtn) this.dom.shareBtn.addEventListener('click', () => this.openShareModal());

    if (this.dom.copyShareUrlBtn) {
      this.dom.copyShareUrlBtn.addEventListener('click', async () => {
        const url = this.dom.shareUrlInput.value;
        const success = await copyToClipboard(url);
        if (success) {
          soundFx.playClick();
          this.dom.copyShareFeedback.classList.remove('hidden');
          setTimeout(() => this.dom.copyShareFeedback.classList.add('hidden'), 2500);
        }
      });
    }

    if (this.dom.exportJsonBtn) {
      this.dom.exportJsonBtn.addEventListener('click', () => {
        soundFx.playClick();
        exportCrosswordAsJSON(this.currentPuzzleData);
      });
    }

    if (this.dom.selectPuzzleBtn) this.dom.selectPuzzleBtn.addEventListener('click', () => this.openPuzzlesModal());
    if (this.dom.aiGeneratorBtn) this.dom.aiGeneratorBtn.addEventListener('click', () => this.openAiModal());
    if (this.dom.aiGenerateSubmitBtn) this.dom.aiGenerateSubmitBtn.addEventListener('click', () => this.handleAiGenerate());

    if (this.dom.aiApiKeyInput) {
      this.dom.aiApiKeyInput.addEventListener('change', (e) => {
        const val = e.target.value.trim();
        if (val) {
          aiService.setApiKey(val);
          if (this.authManager) {
            this.authManager.updateAiModalSyncStatus();
          }
        }
      });
    }

    if (this.dom.victoryPlayNextBtn) {
      this.dom.victoryPlayNextBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.closeModal(this.dom.victoryModal);
        this.openPuzzlesModal();
      });
    }

    if (this.dom.victoryCloseBtn) {
      this.dom.victoryCloseBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.closeModal(this.dom.victoryModal);
      });
    }
  }

  bindModals() {
    const closeButtons = [
      { btn: this.dom.closePuzzlesModalBtn, modal: this.dom.puzzlesModal },
      { btn: this.dom.closeAiModalBtn, modal: this.dom.aiModal },
      { btn: this.dom.closeShareModalBtn, modal: this.dom.shareModal }
    ];

    closeButtons.forEach(({ btn, modal }) => {
      if (btn && modal) {
        btn.addEventListener('click', () => {
          soundFx.playClick();
          this.closeModal(modal);
        });
      }
    });

    if (this.dom.modalBackdrop) {
      this.dom.modalBackdrop.addEventListener('click', () => {
        this.closeAllModals();
      });
    }
  }

  openModal(modal) {
    if (!modal) return;
    soundFx.init();
    if (this.dom.modalBackdrop) {
      this.dom.modalBackdrop.classList.remove('hidden');
    }
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    if (this.dom.modalBackdrop) {
      this.dom.modalBackdrop.classList.add('hidden');
    }
  }

  closeAllModals() {
    [
      this.dom.puzzlesModal, 
      this.dom.aiModal, 
      this.dom.shareModal, 
      this.dom.victoryModal,
      this.dom.themeModal
    ].forEach(m => {
      if (m) m.classList.add('hidden');
    });
    if (this.dom.modalBackdrop) {
      this.dom.modalBackdrop.classList.add('hidden');
    }
  }

  openPuzzlesModal(selectedCategory = this.selectedCategory) {
    this.selectedCategory = selectedCategory || 'all';
    if (!this.dom.puzzlesListContainer) return;

    // 1. Renderiza a barra de filtros de categorias
    if (this.dom.puzzlesCategoriesBar) {
      this.dom.puzzlesCategoriesBar.innerHTML = '';
      PUZZLE_CATEGORIES.forEach(cat => {
        const isActive = this.selectedCategory === cat.id;
        const count = cat.id === 'all' 
          ? DEFAULT_PUZZLES.length 
          : DEFAULT_PUZZLES.filter(p => p.category === cat.id).length;

        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = isActive
          ? 'px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs whitespace-nowrap shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all'
          : 'px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700/60 font-semibold text-xs whitespace-nowrap flex items-center gap-1.5 transition-all';

        pill.innerHTML = `
          <span>${cat.icon}</span>
          <span>${cat.name}</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-indigo-700 text-indigo-100 font-extrabold' : 'bg-gray-700 text-gray-400'}">${count}</span>
        `;

        pill.addEventListener('click', () => {
          soundFx.playClick();
          this.openPuzzlesModal(cat.id);
        });

        this.dom.puzzlesCategoriesBar.appendChild(pill);
      });
    }

    // 2. Filtra os tabuleiros pela categoria selecionada
    const filtered = this.selectedCategory === 'all'
      ? DEFAULT_PUZZLES
      : DEFAULT_PUZZLES.filter(p => p.category === this.selectedCategory);

    // 3. Atualiza o contador de cruzadas
    if (this.dom.puzzlesCountBadge) {
      const activeCat = PUZZLE_CATEGORIES.find(c => c.id === this.selectedCategory);
      this.dom.puzzlesCountBadge.textContent = this.selectedCategory === 'all'
        ? `${DEFAULT_PUZZLES.length} cruzadas curadas em 8 categorias`
        : `${filtered.length} cruzadas em "${activeCat?.name || ''}"`;
    }

    // 4. Renderiza os cards de cruzadas
    this.dom.puzzlesListContainer.innerHTML = '';

    filtered.forEach((puzzle) => {
      const card = document.createElement('div');
      card.className = 'p-3.5 sm:p-4 rounded-2xl bg-gray-800/70 hover:bg-gray-800 border border-gray-700/80 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center justify-between gap-3 group';

      let diffBadgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      if (puzzle.difficulty === 'Fácil') {
        diffBadgeClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      } else if (puzzle.difficulty === 'Difícil') {
        diffBadgeClass = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      }

      const icon = puzzle.categoryIcon || '🧩';

      card.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-gray-900/80 border border-gray-700 text-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
            ${icon}
          </div>
          <div class="min-w-0">
            <h4 class="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors truncate">${puzzle.title}</h4>
            <div class="flex items-center gap-2 mt-0.5 flex-wrap text-xs">
              <span class="text-gray-400 font-medium">${puzzle.words.length} palavras</span>
              <span class="text-gray-600">•</span>
              <span class="px-2 py-0.5 rounded-md border text-[10px] font-bold ${diffBadgeClass}">${puzzle.difficulty}</span>
              ${puzzle.categoryName ? `<span class="text-gray-500 text-[10px] hidden sm:inline">• ${puzzle.categoryName}</span>` : ''}
            </div>
          </div>
        </div>
        <button class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all shrink-0">
          Jogar
        </button>
      `;

      card.addEventListener('click', () => {
        soundFx.playClick();
        this.closeModal(this.dom.puzzlesModal);
        this.loadNewPuzzle(puzzle);
      });

      this.dom.puzzlesListContainer.appendChild(card);
    });

    this.openModal(this.dom.puzzlesModal);
  }

  openAiModal() {
    if (this.dom.aiApiKeyInput) {
      this.dom.aiApiKeyInput.value = aiService.getApiKey();
    }
    if (this.dom.aiFeedbackText) {
      this.dom.aiFeedbackText.classList.add('hidden');
    }
    if (this.authManager) {
      this.authManager.updateAiModalSyncStatus();
    }
    this.openModal(this.dom.aiModal);
  }

  async handleAiGenerate() {
    const topic = this.dom.aiTopicInput ? this.dom.aiTopicInput.value.trim() : '';
    const difficulty = this.dom.aiDifficultySelect ? this.dom.aiDifficultySelect.value : 'Médio';
    const apiKey = this.dom.aiApiKeyInput ? this.dom.aiApiKeyInput.value.trim() : '';

    if (!topic) {
      alert('Por favor, informe um tema para as palavras cruzadas.');
      return;
    }

    if (apiKey) {
      aiService.setApiKey(apiKey);
    }

    if (!aiService.hasApiKey()) {
      alert('Informe sua chave da API Google Gemini para gerar a cruzada.');
      return;
    }

    soundFx.playClick();
    this.dom.aiLoadingIndicator.classList.remove('hidden');
    this.dom.aiGenerateSubmitBtn.disabled = true;
    this.dom.aiFeedbackText.classList.add('hidden');

    try {
      const generated = await aiService.generateThemedCrossword({ topic, difficulty, wordCount: 8 });
      this.closeModal(this.dom.aiModal);
      this.loadNewPuzzle(generated);
      soundFx.playWordComplete();
    } catch (err) {
      soundFx.playError();
      this.dom.aiFeedbackText.textContent = err.message || 'Erro ao gerar cruzada.';
      this.dom.aiFeedbackText.classList.remove('hidden');
    } finally {
      this.dom.aiLoadingIndicator.classList.add('hidden');
      this.dom.aiGenerateSubmitBtn.disabled = false;
    }
  }

  openShareModal() {
    const url = encodeCrosswordToUrl(this.currentPuzzleData);
    if (this.dom.shareUrlInput) {
      this.dom.shareUrlInput.value = url;
    }
    if (this.dom.shareQrContainer) {
      renderQRCode(this.dom.shareQrContainer, url, 180);
    }
    this.openModal(this.dom.shareModal);
  }

  openVictoryModal() {
    if (this.dom.victoryTitle) {
      this.dom.victoryTitle.textContent = this.engine.title;
    }
    if (this.dom.victoryTime) {
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      this.dom.victoryTime.textContent = `${mins}m ${secs}s`;
    }
    if (this.dom.victoryScore) {
      this.dom.victoryScore.textContent = `${this.score} pts`;
    }
    if (this.dom.victoryHints) {
      this.dom.victoryHints.textContent = `${this.hintsUsed} dica(s)`;
    }
    this.openModal(this.dom.victoryModal);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cruzadaApp = new CruzadaApp();
});
