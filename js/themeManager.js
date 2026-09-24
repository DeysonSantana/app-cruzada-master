/**
 * Gerenciador de Temas Visuais do CruzadaMaster
 * Suporta 8 esquemas de cores de alta fidelidade visual para o tabuleiro e interface.
 */
import { soundFx } from './audio.js';

const STORAGE_THEME_KEY = 'CRUZADAMASTER_THEME';

export const THEMES = [
  { 
    id: 'dark-neon', 
    name: 'Dark Neon', 
    icon: 'zap', 
    bg: '#090d16', 
    card: '#0f172a',
    accent: '#6366f1',
    description: 'Estilo moderno cyberpunk com brilho neon'
  },
  { 
    id: 'light-modern', 
    name: 'Clean Light', 
    icon: 'sun', 
    bg: '#f8fafc', 
    card: '#ffffff',
    accent: '#4f46e5',
    description: 'Interface clara com alto contraste e legibilidade'
  },
  { 
    id: 'emerald', 
    name: 'Emerald Forest', 
    icon: 'leaf', 
    bg: '#04120e', 
    card: '#08211a',
    accent: '#10b981',
    description: 'Tons suaves de verde esmeralda e menta'
  },
  { 
    id: 'sunset', 
    name: 'Sunset Amber', 
    icon: 'flame', 
    bg: '#150b0f', 
    card: '#221218',
    accent: '#f59e0b',
    description: 'Tons quentes de pôr do sol, vinho e âmbar'
  },
  { 
    id: 'midnight-amoled', 
    name: 'Midnight AMOLED', 
    icon: 'moon', 
    bg: '#000000', 
    card: '#080808',
    accent: '#38bdf8',
    description: 'Preto puro para economia de bateria em telas OLED'
  },
  { 
    id: 'dracula', 
    name: 'Dracula Synth', 
    icon: 'sparkles', 
    bg: '#1e1f29', 
    card: '#282a36',
    accent: '#ff79c6',
    description: 'Paleta clássica Dracula com roxo e rosa vibrante'
  },
  { 
    id: 'parchment', 
    name: 'Pergaminho & Café', 
    icon: 'book', 
    bg: '#f4ebd9', 
    card: '#fbf7ee',
    accent: '#78350f',
    description: 'Estilo clássico de jornal e livro de cruzadas tradicional'
  },
  { 
    id: 'matrix', 
    name: 'Matrix Hacker', 
    icon: 'terminal', 
    bg: '#020d06', 
    card: '#05180c',
    accent: '#00ff66',
    description: 'Terminal retrô com fósforo verde de computador clássico'
  }
];

export class ThemeManager {
  constructor(app) {
    this.app = app;
    this.currentTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'dark-neon';

    this.dom = {
      themeModal: document.getElementById('theme-modal'),
      closeThemeModalBtn: document.getElementById('close-theme-modal-btn'),
      themesGridContainer: document.getElementById('themes-grid-container')
    };

    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme, false);
    this.bindEvents();
  }

  bindEvents() {
    if (this.dom.closeThemeModalBtn) {
      this.dom.closeThemeModalBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.app.closeModal(this.dom.themeModal);
      });
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  applyTheme(themeId, playSound = true) {
    const validTheme = THEMES.some(t => t.id === themeId) ? themeId : 'dark-neon';
    this.currentTheme = validTheme;
    localStorage.setItem(STORAGE_THEME_KEY, validTheme);

    const root = document.documentElement;
    const body = document.body;

    // Remove temas anteriores
    THEMES.forEach(t => {
      body.classList.remove(`theme-${t.id}`);
      root.classList.remove(`theme-${t.id}`);
    });

    // Modo Dark vs Light
    if (validTheme === 'light-modern' || validTheme === 'parchment') {
      root.classList.remove('dark');
      body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      body.classList.add('dark');
    }

    body.classList.add(`theme-${validTheme}`);
    root.classList.add(`theme-${validTheme}`);

    // Atualiza theme-color no meta mobile
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const matched = THEMES.find(t => t.id === validTheme);
    if (themeMeta && matched) {
      themeMeta.setAttribute('content', matched.bg);
    }

    if (playSound) {
      soundFx.playClick();
    }

    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: validTheme } }));
  }

  cycleTheme() {
    const currentIndex = THEMES.findIndex(t => t.id === this.currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    this.applyTheme(THEMES[nextIndex].id, true);
    return THEMES[nextIndex];
  }

  openThemeModal() {
    if (!this.dom.themesGridContainer) return;
    this.dom.themesGridContainer.innerHTML = '';

    THEMES.forEach(theme => {
      const isSelected = theme.id === this.currentTheme;
      const card = document.createElement('div');
      card.className = `p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 group relative overflow-hidden ${
        isSelected ? 'border-2 shadow-lg ring-2 ring-indigo-500/30' : 'border-gray-700/80 hover:border-gray-500'
      }`;
      card.style.backgroundColor = theme.card;
      card.style.borderColor = isSelected ? theme.accent : undefined;

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-3.5 h-3.5 rounded-full shadow-sm" style="background-color: ${theme.accent}"></span>
            <h4 class="font-bold text-sm" style="color: ${theme.id === 'light-modern' || theme.id === 'parchment' ? '#0f172a' : '#f8fafc'}">${theme.name}</h4>
          </div>
          ${isSelected ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase" style="background-color: ${theme.accent}; color: #ffffff">Ativo</span>` : ''}
        </div>
        <p class="text-xs leading-snug opacity-75" style="color: ${theme.id === 'light-modern' || theme.id === 'parchment' ? '#475569' : '#94a3b8'}">${theme.description}</p>
        <div class="flex gap-1.5 mt-1">
          <span class="w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold" style="background-color: ${theme.bg}; border-color: ${theme.accent}; color: ${theme.accent}">C</span>
          <span class="w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold" style="background-color: ${theme.card}; border-color: ${theme.accent}; color: #ffffff">R</span>
          <span class="w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold" style="background-color: ${theme.accent}; border-color: ${theme.accent}; color: #ffffff">Z</span>
        </div>
      `;

      card.addEventListener('click', () => {
        this.applyTheme(theme.id, true);
        this.openThemeModal(); // Re-renderiza para atualizar status ativo
      });

      this.dom.themesGridContainer.appendChild(card);
    });

    this.app.openModal(this.dom.themeModal);
  }
}
