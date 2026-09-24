/**
 * Orquestrador Central da Aplicação CruzadaMaster (CruzadaApp)
 * Gerencia o ciclo de vida do jogo, modais, timer, pontuação, hints e celebração de vitória.
 */
import { CrosswordEngine } from './crosswordEngine.js';
import { GridRenderer } from './gridRenderer.js';
import { InputController } from './inputController.js';
import { ThemeManager } from './themeManager.js';
import { OfflineManager } from './offlineManager.js';
import { DEFAULT_PUZZLES } from './puzzles.js';
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

    // Estado da partida
    this.score = 1000;
    this.hintsUsed = 0;
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.isCompleted = false;
    this.currentPuzzleData = null;

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
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      soundToggleBtn: document.getElementById('sound-toggle-btn'),

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

      // Elementos do Modal de Puzzles
      puzzlesListContainer: document.getElementById('puzzles-list-container'),
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
    this.gridRenderer = new GridRenderer(this);
    this.inputController = new InputController(this);

    this.bindEvents();
    this.bindModals();
    this.updateSoundIcon();

    // Carrega cruzada inicial (URL compartilhada > LocalStorage > Default #1)
    const sharedPuzzle = decodeCrosswordFromUrl();
    if (sharedPuzzle) {
      this.loadNewPuzzle(sharedPuzzle);
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
   * Sistema de Dicas: Revelar Letra
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

  /**
   * Sistema de Dicas: Revelar Palavra Inteira
   */
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

  /**
   * Sistema de Dicas: Verificar e destacar erros
   */
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

    // Remove destaque vermelho após 3 segundos
    setTimeout(() => {
      this.engine.clearErrors();
      this.syncUI();
    }, 3000);
  }

  /**
   * Limpa o tabuleiro atual
   */
  resetCurrentBoard() {
    if (confirm('Deseja realmente reiniciar este tabuleiro de palavras cruzadas?')) {
      soundFx.playClick();
      this.loadNewPuzzle(this.currentPuzzleData);
    }
  }

  /**
   * Persistência de progresso em LocalStorage
   */
  saveCurrentState() {
    try {
      if (this.currentPuzzleData) {
        localStorage.setItem(STORAGE_LAST_PUZZLE, JSON.stringify(this.currentPuzzleData));
        localStorage.setItem(STORAGE_LAST_STATE, JSON.stringify(this.engine.exportState()));
      }
    } catch (e) {
      console.warn('Não foi possível salvar estado no LocalStorage:', e);
    }
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

  /**
   * Animação de Confetti festivo
   */
  triggerConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        window.confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        window.confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    }
  }

  updateSoundIcon() {
    if (this.dom.soundToggleBtn) {
      const isMuted = soundFx.isMuted();
      this.dom.soundToggleBtn.innerHTML = isMuted 
        ? '<i data-lucide="volume-x" class="w-5 h-5 text-gray-400"></i>' 
        : '<i data-lucide="volume-2" class="w-5 h-5 text-indigo-400"></i>';
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // =========================================================================
  // GESTÃO DE MODAIS E EVENTOS DE INTERFACE
  // =========================================================================

  bindEvents() {
    // Alternar som
    if (this.dom.soundToggleBtn) {
      this.dom.soundToggleBtn.addEventListener('click', () => {
        soundFx.init();
        soundFx.toggleMute();
        this.updateSoundIcon();
        if (!soundFx.isMuted()) soundFx.playKey();
      });
    }

    // Alternar tema
    if (this.dom.themeToggleBtn) {
      this.dom.themeToggleBtn.addEventListener('click', () => {
        this.themeManager.cycleTheme();
      });
    }

    // Dicas
    if (this.dom.hintLetterBtn) {
      this.dom.hintLetterBtn.addEventListener('click', () => this.useHintLetter());
    }
    if (this.dom.hintWordBtn) {
      this.dom.hintWordBtn.addEventListener('click', () => this.useHintWord());
    }
    if (this.dom.checkErrorsBtn) {
      this.dom.checkErrorsBtn.addEventListener('click', () => this.checkAndHighlightErrors());
    }
    if (this.dom.resetBoardBtn) {
      this.dom.resetBoardBtn.addEventListener('click', () => this.resetCurrentBoard());
    }

    // Compartilhamento
    if (this.dom.shareBtn) {
      this.dom.shareBtn.addEventListener('click', () => this.openShareModal());
    }
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

    // Modal de Puzzles
    if (this.dom.selectPuzzleBtn) {
      this.dom.selectPuzzleBtn.addEventListener('click', () => this.openPuzzlesModal());
    }

    // Modal de IA
    if (this.dom.aiGeneratorBtn) {
      this.dom.aiGeneratorBtn.addEventListener('click', () => this.openAiModal());
    }
    if (this.dom.aiGenerateSubmitBtn) {
      this.dom.aiGenerateSubmitBtn.addEventListener('click', () => this.handleAiGenerate());
    }

    // Modal de Vitória
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
      this.dom.victoryModal
    ].forEach(m => {
      if (m) m.classList.add('hidden');
    });
    if (this.dom.modalBackdrop) {
      this.dom.modalBackdrop.classList.add('hidden');
    }
  }

  openPuzzlesModal() {
    if (!this.dom.puzzlesListContainer) return;
    this.dom.puzzlesListContainer.innerHTML = '';

    DEFAULT_PUZZLES.forEach((puzzle, idx) => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700/80 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center justify-between gap-3 group';

      card.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center group-hover:scale-105 transition-transform">
            ${idx + 1}
          </div>
          <div>
            <h4 class="font-bold text-white group-hover:text-indigo-300 transition-colors">${puzzle.title}</h4>
            <span class="text-xs text-gray-400 font-medium">${puzzle.words.length} palavras • ${puzzle.difficulty}</span>
          </div>
        </div>
        <button class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors">
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

// Inicializa a aplicação assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.cruzadaApp = new CruzadaApp();
});
