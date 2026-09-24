/**
 * Gerenciador de Recursos Offline & PWA do CruzadaMaster
 * Registro de Service Worker, status de conectividade em tempo real e instalação PWA.
 */
import { soundFx } from './audio.js';

export class OfflineManager {
  constructor(app) {
    this.app = app;
    this.deferredPrompt = null;
    this.isOnline = navigator.onLine;

    this.dom = {
      statusBadge: document.getElementById('network-status-badge'),
      statusDot: document.getElementById('network-status-dot'),
      statusText: document.getElementById('network-status-text'),
      installBtn: document.getElementById('pwa-install-btn')
    };

    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.bindNetworkEvents();
    this.bindInstallPrompt();
    this.updateStatusUI();
  }

  /**
   * Registra o Service Worker para funcionamento 100% offline
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        console.log('[OfflineManager] ServiceWorker registrado com sucesso:', registration.scope);

        // Atualização em segundo plano
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[OfflineManager] Nova versão disponível em cache.');
              }
            });
          }
        });
      } catch (err) {
        console.warn('[OfflineManager] Falha ao registrar Service Worker:', err);
      }
    }
  }

  bindNetworkEvents() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateStatusUI();
      soundFx.playKey();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateStatusUI();
      soundFx.playError();
    });
  }

  updateStatusUI() {
    if (!this.dom.statusBadge) return;

    if (this.isOnline) {
      if (this.dom.statusDot) {
        this.dom.statusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
      }
      if (this.dom.statusText) {
        this.dom.statusText.textContent = 'Online';
        this.dom.statusText.className = 'text-[11px] font-semibold text-emerald-400';
      }
      this.dom.statusBadge.title = 'Conectado à internet (Cloud & IA disponíveis)';
    } else {
      if (this.dom.statusDot) {
        this.dom.statusDot.className = 'w-2 h-2 rounded-full bg-amber-400';
      }
      if (this.dom.statusText) {
        this.dom.statusText.textContent = 'Offline PWA';
        this.dom.statusText.className = 'text-[11px] font-semibold text-amber-400';
      }
      this.dom.statusBadge.title = 'Modo 100% Offline (Tabuleiros locais e sons ativos)';
    }
  }

  bindInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (this.dom.installBtn) {
        this.dom.installBtn.classList.remove('hidden');
      }
    });

    if (this.dom.installBtn) {
      this.dom.installBtn.addEventListener('click', async () => {
        soundFx.playClick();
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const choice = await this.deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          console.log('[OfflineManager] Usuário instalou o PWA CruzadaMaster.');
        }
        this.deferredPrompt = null;
        this.dom.installBtn.classList.add('hidden');
      });
    }

    window.addEventListener('appinstalled', () => {
      console.log('[OfflineManager] CruzadaMaster instalado como App Nativo.');
      if (this.dom.installBtn) {
        this.dom.installBtn.classList.add('hidden');
      }
    });
  }
}
