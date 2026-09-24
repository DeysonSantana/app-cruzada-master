/**
 * Gerenciador de Temas Visuais do CruzadaMaster
 * Suporta 5 esquemas de cores: Dark Neon, Modern Light, Emerald Eco, Sunset Amber e Midnight AMOLED.
 */
import { soundFx } from './audio.js';

const STORAGE_THEME_KEY = 'CRUZADAMASTER_THEME';

export const THEMES = [
  { id: 'dark-neon', name: 'Dark Neon', icon: 'zap', bg: '#090d16', accent: '#6366f1' },
  { id: 'light-modern', name: 'Clean Light', icon: 'sun', bg: '#f8fafc', accent: '#4f46e5' },
  { id: 'emerald', name: 'Emerald Forest', icon: 'leaf', bg: '#061712', accent: '#10b981' },
  { id: 'sunset', name: 'Sunset Amber', icon: 'flame', bg: '#180e12', accent: '#f59e0b' },
  { id: 'midnight-amoled', name: 'Midnight AMOLED', icon: 'moon', bg: '#000000', accent: '#38bdf8' }
];

export class ThemeManager {
  constructor(app) {
    this.app = app;
    this.currentTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'dark-neon';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme, false);
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

    // Remove classes anteriores
    THEMES.forEach(t => {
      body.classList.remove(`theme-${t.id}`);
      root.classList.remove(`theme-${t.id}`);
    });

    // Modo Dark vs Light
    if (validTheme === 'light-modern') {
      root.classList.remove('dark');
      body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      body.classList.add('dark');
    }

    body.classList.add(`theme-${validTheme}`);
    root.classList.add(`theme-${validTheme}`);

    // Atualiza theme-color no meta tag mobile
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const matched = THEMES.find(t => t.id === validTheme);
    if (themeMeta && matched) {
      themeMeta.setAttribute('content', matched.bg);
    }

    if (playSound) {
      soundFx.playClick();
    }

    // Dispara evento para re-renderização de SVG/Canvas se necessário
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: validTheme } }));
  }

  cycleTheme() {
    const currentIndex = THEMES.findIndex(t => t.id === this.currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    this.applyTheme(THEMES[nextIndex].id, true);
    return THEMES[nextIndex];
  }
}
