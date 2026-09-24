# 🧩 CruzadaMaster - Palavras Cruzadas Gamificadas, I.A & 100% Offline-First

> Aplicação web moderna, interativa, gamificada e **100% Offline-First (PWA)** projetada para funcionar com altíssima performance na **hospedagem gratuita do GitHub Pages** ou instalada como aplicativo nativo no celular e computador.

Membro da mesma família do **QuizMaster**, o **CruzadaMaster** foi desenvolvido com a mesma filosofia de excelência em engenharia: zero dependência pesada no backend, síntese de som nativa, compartilhamento universal por URL comprimida e gerador procedural inteligente.

---

## 🌟 Principais Recursos

### 1. 📶 100% Offline-First & PWA (Funciona sem Internet)
- **Service Worker (`sw.js`)**: Armazena em cache todos os arquivos essenciais para abrir em menos de 1 segundo mesmo no modo avião.
- **Instalação PWA**: Botão "Instalar App" para adicionar à tela inicial no Android, iOS, Windows e Mac.
- **Indicador de Conexão**: Badge dinâmico no topo informando o estado da rede (`🟢 Online` / `⚡ Offline PWA`).

### 2. 🔤 Mecânica Completa de Palavras Cruzadas
- **Grade 2D Dinâmica**: Suporte a grades responsivas (8x8, 10x10, 12x12...) que se adaptam perfeitamente a telas de qualquer tamanho.
- **Realce Inteligente**: Destaca a palavra inteira em foco e a célula atual com brilho e contraste nítido.
- **Auto-Avanço e Troca de Direção**: Ao digitar uma letra, o cursor avança para a próxima casa. Clique na mesma célula ou pressione <kbd>Espaço</kbd> para alternar entre **Horizontal** e **Vertical**.
- **Teclado On-Screen Mobile Dedicado**: Teclado virtual embutido na base da tela para dispositivos móveis, evitando que o teclado do sistema cubra o tabuleiro.

### 3. 🤖 Gerador de Cruzadas com Inteligência Artificial (Google Gemini)
- Digite qualquer tema (ex: *História Antiga*, *Séries dos Anos 90*, *Biologia Molecular*, *Fórmula 1*) e escolha o nível de dificuldade.
- A IA compõe as palavras e dicas e o **motor procedural ortogonal** do CruzadaMaster calcula as interseções e posiciona o tabuleiro automaticamente.

### 4. 🔗 Compartilhamento via URL Hash & QR Code Local
- Compartilhe qualquer tabuleiro (nativo ou gerado por IA) via link direto utilizando **compressão LZ-String** (`#crossword=...`).
- Exibe **QR Code gerado em Canvas local** para apontar a câmera do celular e jogar na hora sem precisar de login.
- Exportação e backup físico em arquivos `.json`.

### 5. 🔊 Áudio Nativo via Web Audio API
- Efeitos sonoros sintetizados em tempo real (digitação, backspace, alternância de direção, arpeggio de palavra concluída, som de vitória e buzina de erro).
- Zero arquivos de áudio externos para carregar — zero latência de som.

### 6. 🎨 5 Temas Visuais
- **Dark Neon** (Padrão Cyberpunk)
- **Clean Light** (Moderno claro)
- **Emerald Forest** (Verde esmeralda suave)
- **Sunset Amber** (Tons dourados e âmbar)
- **Midnight AMOLED** (Preto absoluto `#000000` para economia de bateria em telas OLED)

---

## 🛠️ Tecnologias Utilizadas

- **JavaScript ES6+ (ES Modules)**
- **Tailwind CSS & CSS Custom Variables**
- **Web Audio API**
- **Service Worker & Cache API**
- **Google Gemini API**
- **Lucide Icons & Canvas Confetti**

---

## 🚀 Como Jogar e Executar

Abra diretamente no navegador ou hospede gratuitamente no **GitHub Pages**:
1. Clone este repositório.
2. Ative o GitHub Pages nas configurações do repositório apontando para a branch `main`.
3. Acesse a URL gerada e aproveite!
