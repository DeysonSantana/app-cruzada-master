/**
 * Gerenciador de Autenticação e Perfis do CruzadaMaster
 * Suporta Login com Google (Firebase Auth) e Modo Visitante Local
 */
import { serverlessDB } from './firebaseConfig.js';
import { soundFx } from './audio.js';

const STORAGE_LOCAL_USER = 'CRUZADAMASTER_USER_PROFILE';

export class AuthManager {
  constructor(app) {
    this.app = app;
    this.currentUser = this.loadLocalUser();

    this.dom = {
      // Header Auth Elements
      headerAuthBtn: document.getElementById('header-auth-btn'),
      headerUserAvatar: document.getElementById('header-user-avatar'),
      headerUserName: document.getElementById('header-user-name'),

      // Drawer Auth Elements
      drawerAuthCard: document.getElementById('drawer-auth-card'),
      drawerUserAvatar: document.getElementById('drawer-user-avatar'),
      drawerUserName: document.getElementById('drawer-user-name'),
      drawerUserEmail: document.getElementById('drawer-user-email'),
      drawerAuthActionBtn: document.getElementById('drawer-auth-action-btn'),

      // Modal de Autenticação
      authModal: document.getElementById('auth-modal'),
      closeAuthModalBtn: document.getElementById('close-auth-modal-btn'),
      googleLoginBtn: document.getElementById('google-login-btn'),
      guestNameInput: document.getElementById('guest-name-input'),
      guestAvatarSelect: document.getElementById('guest-avatar-select'),
      saveGuestProfileBtn: document.getElementById('save-guest-profile-btn'),
      authFeedbackText: document.getElementById('auth-feedback-text')
    };

    this.init();
  }

  async init() {
    this.bindEvents();
    this.updateUI();

    // Aguarda inicialização do Firebase e escuta mudanças de sessão
    await serverlessDB.initPromise;
    if (serverlessDB.auth) {
      const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
      onAuthStateChanged(serverlessDB.auth, (user) => {
        if (user) {
          this.currentUser = {
            uid: user.uid,
            displayName: user.displayName || 'Jogador',
            email: user.email,
            photoURL: user.photoURL,
            isGoogle: true
          };
        } else if (!this.currentUser || this.currentUser.isGoogle) {
          this.currentUser = this.loadLocalUser();
        }
        this.saveLocalUser(this.currentUser);
        this.updateUI();
      });
    }
  }

  loadLocalUser() {
    try {
      const raw = localStorage.getItem(STORAGE_LOCAL_USER);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    return {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      displayName: 'Palavrista',
      avatarEmoji: '🧩',
      isGoogle: false
    };
  }

  saveLocalUser(user) {
    try {
      localStorage.setItem(STORAGE_LOCAL_USER, JSON.stringify(user));
    } catch (e) {}
  }

  getUser() {
    return this.currentUser;
  }

  getUserName() {
    return this.currentUser?.displayName || 'Jogador';
  }

  bindEvents() {
    if (this.dom.headerAuthBtn) {
      this.dom.headerAuthBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.openAuthModal();
      });
    }

    if (this.dom.drawerAuthActionBtn) {
      this.dom.drawerAuthActionBtn.addEventListener('click', () => {
        soundFx.playClick();
        if (this.currentUser?.isGoogle) {
          this.logout();
        } else {
          this.app.closeMobileDrawer();
          this.openAuthModal();
        }
      });
    }

    if (this.dom.closeAuthModalBtn) {
      this.dom.closeAuthModalBtn.addEventListener('click', () => {
        soundFx.playClick();
        this.closeAuthModal();
      });
    }

    // Login com Google
    if (this.dom.googleLoginBtn) {
      this.dom.googleLoginBtn.addEventListener('click', () => this.loginWithGoogle());
    }

    // Salvar Perfil Convidado Local
    if (this.dom.saveGuestProfileBtn) {
      this.dom.saveGuestProfileBtn.addEventListener('click', () => {
        const name = this.dom.guestNameInput ? this.dom.guestNameInput.value.trim() : '';
        const emoji = this.dom.guestAvatarSelect ? this.dom.guestAvatarSelect.value : '🧩';

        if (!name) {
          this.showFeedback('Por favor, informe seu nome.', 'error');
          return;
        }

        this.currentUser = {
          uid: this.currentUser?.uid || ('guest_' + Math.random().toString(36).substring(2, 9)),
          displayName: name,
          avatarEmoji: emoji,
          isGoogle: false
        };

        this.saveLocalUser(this.currentUser);
        this.updateUI();
        soundFx.playWordComplete();
        this.closeAuthModal();
      });
    }
  }

  async loginWithGoogle() {
    soundFx.playClick();
    this.showFeedback('Conectando ao Google...', 'info');

    if (!serverlessDB.auth || !serverlessDB.googleProvider) {
      this.showFeedback('Serviço de autenticação temporariamente indisponível. Utilize o modo visitante.', 'error');
      return;
    }

    try {
      const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
      const result = await signInWithPopup(serverlessDB.auth, serverlessDB.googleProvider);
      const user = result.user;

      this.currentUser = {
        uid: user.uid,
        displayName: user.displayName || 'Jogador',
        email: user.email,
        photoURL: user.photoURL,
        isGoogle: true
      };

      this.saveLocalUser(this.currentUser);
      this.updateUI();
      soundFx.playWordComplete();
      this.closeAuthModal();
    } catch (err) {
      console.error('[AuthManager] Erro no login Google:', err);
      soundFx.playError();
      this.showFeedback(err.message || 'Falha ao autenticar com o Google.', 'error');
    }
  }

  async logout() {
    soundFx.playClick();
    if (serverlessDB.auth && this.currentUser?.isGoogle) {
      try {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        await signOut(serverlessDB.auth);
      } catch (e) {}
    }

    this.currentUser = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      displayName: 'Palavrista',
      avatarEmoji: '🧩',
      isGoogle: false
    };
    this.saveLocalUser(this.currentUser);
    this.updateUI();
  }

  updateUI() {
    const isGoogle = !!this.currentUser?.isGoogle;
    const name = this.currentUser?.displayName || 'Entrar';
    const photo = this.currentUser?.photoURL;
    const emoji = this.currentUser?.avatarEmoji || '🧩';

    // Header
    if (this.dom.headerUserName) {
      this.dom.headerUserName.textContent = name;
    }
    if (this.dom.headerUserAvatar) {
      if (photo) {
        this.dom.headerUserAvatar.innerHTML = `<img src="${photo}" alt="${name}" class="w-full h-full rounded-full object-cover" />`;
      } else {
        this.dom.headerUserAvatar.innerHTML = `<span class="text-sm">${emoji}</span>`;
      }
    }

    // Mobile Drawer
    if (this.dom.drawerUserName) {
      this.dom.drawerUserName.textContent = this.currentUser?.displayName || 'Visitante';
    }
    if (this.dom.drawerUserEmail) {
      this.dom.drawerUserEmail.textContent = isGoogle ? (this.currentUser?.email || '') : 'Modo Offline Local';
    }
    if (this.dom.drawerUserAvatar) {
      if (photo) {
        this.dom.drawerUserAvatar.innerHTML = `<img src="${photo}" alt="${name}" class="w-full h-full rounded-xl object-cover shadow" />`;
      } else {
        this.dom.drawerUserAvatar.innerHTML = `<span class="text-2xl">${emoji}</span>`;
      }
    }
    if (this.dom.drawerAuthActionBtn) {
      this.dom.drawerAuthActionBtn.textContent = isGoogle ? 'Sair da Conta' : 'Fazer Login com Google';
      this.dom.drawerAuthActionBtn.className = isGoogle
        ? 'w-full py-2 px-3 text-xs font-bold rounded-xl bg-gray-800 hover:bg-rose-950/40 text-gray-300 hover:text-rose-400 border border-gray-700 hover:border-rose-500/40 transition-colors'
        : 'w-full py-2 px-3 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-colors';
    }
  }

  openAuthModal() {
    if (!this.dom.authModal) return;
    if (this.dom.guestNameInput) {
      this.dom.guestNameInput.value = this.currentUser?.displayName || '';
    }
    if (this.dom.guestAvatarSelect && this.currentUser?.avatarEmoji) {
      this.dom.guestAvatarSelect.value = this.currentUser.avatarEmoji;
    }
    if (this.dom.authFeedbackText) {
      this.dom.authFeedbackText.classList.add('hidden');
    }
    this.app.openModal(this.dom.authModal);
  }

  closeAuthModal() {
    if (this.dom.authModal) {
      this.app.closeModal(this.dom.authModal);
    }
  }

  showFeedback(msg, type = 'info') {
    if (!this.dom.authFeedbackText) return;
    this.dom.authFeedbackText.textContent = msg;
    this.dom.authFeedbackText.className = type === 'error'
      ? 'text-xs text-rose-400 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 block'
      : 'text-xs text-indigo-300 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 block';
  }
}
