/**
 * Conector Serverless para Banco de Dados e Autenticação (Firebase Auth + Dual-Mode Fallback)
 * Compatível 100% com GitHub Pages (Client-side puro)
 */

const STORAGE_FIREBASE_CONFIG = 'CRUZADAMASTER_FIREBASE_CONFIG';
const STORAGE_LOCAL_USER = 'CRUZADAMASTER_LOCAL_USER';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCqGd42xeen1HGc4PpgBa8sH1nhOi17ylM",
  authDomain: "quizmaster-f9388.firebaseapp.com",
  projectId: "quizmaster-f9388",
  storageBucket: "quizmaster-f9388.firebasestorage.app",
  messagingSenderId: "169092133424",
  appId: "1:169092133424:web:019d8ef6e122468864f3f5"
};

class ServerlessDB {
  constructor() {
    this.firebaseApp = null;
    this.auth = null;
    this.firestore = null;
    this.isCloudEnabled = false;
    this.googleProvider = null;
    this.initPromise = this.init();
  }

  async init() {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
      const { getAuth, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
      const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

      this.firebaseApp = initializeApp(DEFAULT_FIREBASE_CONFIG);
      this.auth = getAuth(this.firebaseApp);
      this.firestore = getFirestore(this.firebaseApp);
      this.googleProvider = new GoogleAuthProvider();
      this.googleProvider.setCustomParameters({ prompt: 'select_account' });
      this.isCloudEnabled = true;
      console.log('[ServerlessDB] Firebase inicializado com sucesso.');
    } catch (e) {
      console.warn('[ServerlessDB] Firebase indisponível ou offline. Operando em modo LocalStorage nativo.', e);
      this.isCloudEnabled = false;
    }
  }

  isOnlineCloud() {
    return this.isCloudEnabled && navigator.onLine;
  }
}

export const serverlessDB = new ServerlessDB();
