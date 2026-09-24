# 🏗️ CruzadaMaster - Documentação Técnica e Arquitetura do Sistema

Este documento fornece um guia técnico detalhado para desenvolvedores e **Agentes de Inteligência Artificial** (Gemini, Claude, GPT, etc.) para que qualquer modelo possa compreender instantaneamente a arquitetura, fluxo de dados, contratos de API e continuar o desenvolvimento sem atritos.

---

## 🎯 1. Visão Geral e Princípios de Design

- **100% Offline-First & PWA**: A aplicação funciona completamente sem internet através de um **Service Worker (`sw.js`)** com estratégias *Cache-First* e manifesto PWA (`manifest.json`), podendo ser instalada como app nativo no celular e desktop.
- **Zero-Backend / Serverless no GitHub Pages**: O jogo roda 100% no cliente sem necessidade de container Docker, Node.js no servidor ou banco de dados pago.
- **Recursos Nativos sem Dependência Externa**:
  - **Áudio**: Sintetizado nativamente via **Web Audio API** (`audio.js`), sem download de MP3/WAV.
  - **QR Code & Compressão**: Gerado em Canvas local de alta densidade e URL hash encurtado via **LZ-String** (`#crossword=...`).
  - **IA Dinâmica**: Integração com a API do **Google Gemini** com chave de API do usuário armazenada no `LocalStorage` e fallback em cascata de modelos (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`).

---

## 🗺️ 2. Mapa de Módulos (`js/` e `sw.js`)

| Arquivo | Responsabilidade | Dependências |
| :--- | :--- | :--- |
| `sw.js` | **Service Worker PWA**: Pre-cache dos assets estáticos e cache dinâmico em tempo de execução para funcionamento 100% offline. | Cache Storage API |
| `manifest.json` | **Manifesto PWA**: Metadados para instalação na tela inicial (*standalone display*). | Navegador |
| `css/styles.css` | **Design System & 5 Temas**: Estilização da grade, células ativas, realces e suporte aos 5 temas visuais (Dark Neon, Clean Light, Emerald, Sunset, Midnight AMOLED). | CSS Variables |
| `js/app.js` | **Controlador Central (SPA)**: Gerencia ciclo de vida do jogo, timer, score, dicas, sincronização e modais. | Todos os módulos |
| `js/crosswordEngine.js` | **Motor Algorítmico 2D**: Matriz de células, normalização diacrítica, indexação de números das pistas e **gerador procedural de palavras cruzadas**. | - |
| `js/gridRenderer.js` | **Renderizador da Grade**: Monta e atualiza o CSS Grid dinâmico, realce de palavra ativa, célula em foco e sincronização das pistas. | DOM |
| `js/inputController.js` | **Controlador de Entrada**: Gestão do teclado físico (desktop) e teclado virtual on-screen (mobile), auto-avanço de células e alternância de direção. | `audio.js` |
| `js/puzzles.js` | **Catálogo de Tabuleiros Nativos**: Coleção balanceada de palavras cruzadas offline pré-geradas e verificadas ortogonalmente. | - |
| `js/audio.js` | **Sintetizador Web Audio API**: Efeitos sonoros sintetizados em tempo real (digitação, backspace, palavra completa, vitória, erro e dicas). | Web Audio API |
| `js/themeManager.js` | **Gerenciador de Temas Visuais**: Aplica e persiste os 5 temas via variáveis CSS e `LocalStorage`. | `audio.js` |
| `js/shareManager.js` | **Compartilhamento & QR Code**: Minificação de payload, compressão LZ-String no hash da URL, QR Code e exportação JSON. | LZ-String, QRCode |
| `js/aiService.js` | **Gerador com IA (Google Gemini)**: Geração temática de palavras e pistas sob demanda com encadeamento no gerador procedural. | Gemini API, `crosswordEngine.js` |
| `js/offlineManager.js` | **Gerenciador Offline & PWA**: Registro do Service Worker, status de rede (`🟢 Online` / `⚡ Offline`) e prompt de instalação PWA. | - |

---

## 🧮 3. Contratos de Dados & Algoritmo de Cruzamento

### 3.1 Modelo de Palavra (`WordPlacement`)
```javascript
{
  id: "w_1",
  word: "PYTHON",           // String normalizada (A-Z)
  displayWord: "PYTHON",    // Palavra original para exibição
  clue: "Linguagem de programação com nome de réptil.",
  row: 4,                   // Posição inicial Y (0-indexed)
  col: 2,                   // Posição inicial X (0-indexed)
  direction: "across",      // 'across' ou 'down'
  length: 6,
  number: 1                 // Número atribuído na varredura padrão
}
```

### 3.2 Regra de Varredura e Numeração Padrão
As pistas são numeradas automaticamente pelo motor varrendo a grade de cima para baixo, da esquerda para a direita. Qualquer célula não-bloqueada que seja o início de uma palavra horizontal ou vertical recebe o próximo número inteiro da sequência.

---

## 🚀 4. Como Executar

### Localmente (Servidor Estático Simples):
```bash
npx serve .
# ou
python3 -m http.server 8080
```

### Deploy no GitHub Pages:
Basta fazer o push para a branch `main` e ativar o GitHub Pages apontando para a raiz do repositório. O jogo funciona imediatamente.
