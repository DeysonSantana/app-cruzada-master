/**
 * Serviço de Integração com Inteligência Artificial (Google Gemini) para CruzadaMaster
 * Auto-descoberta dinâmica de modelos via ListModels, detecção inteligente de chaves e fallback resiliente.
 * Suporta sincronização de chaves na nuvem com a conta Google do jogador.
 */
import { CrosswordEngine, normalizeText } from './crosswordEngine.js';

const STORAGE_API_KEY = 'CRUZADAMASTER_AI_API_KEY';

export class AIService {
  constructor() {
    this.apiKey = localStorage.getItem(STORAGE_API_KEY) || '';
    this.cachedAvailableModels = null;
    this.cachedWorkingModel = null;
  }

  getApiKey() {
    return this.apiKey;
  }

  setApiKey(key, syncCloud = true) {
    this.apiKey = (key || '').trim();
    this.cachedAvailableModels = null;
    this.cachedWorkingModel = null;
    localStorage.setItem(STORAGE_API_KEY, this.apiKey);

    // Se estiver conectado com a conta Google, sincroniza no Firestore
    if (syncCloud && window.cruzadaApp?.authManager) {
      window.cruzadaApp.authManager.syncApiKeyToCloud(this.apiKey);
    }
  }

  hasApiKey() {
    return !!this.apiKey;
  }

  /**
   * Valida se o formato da chave parece ser do Google Gemini
   */
  validateKeyFormat(key) {
    const trimmed = (key || '').trim();
    if (trimmed.startsWith('github_pat_') || trimmed.startsWith('ghp_')) {
      return {
        valid: false,
        error: 'Você inseriu um token do GitHub. Para gerar com IA, obtenha uma chave gratuita da API do Google Gemini em: aistudio.google.com/app/apikey'
      };
    }
    if (!trimmed.startsWith('AIzaSy') && trimmed.length < 30) {
      return {
        valid: false,
        error: 'Chave de API parece incompleta. Chaves do Google Gemini começam com "AIzaSy...". Obtenha a sua em: aistudio.google.com/app/apikey'
      };
    }
    return { valid: true };
  }

  /**
   * Consulta a API do Google para descobrir quais modelos estão disponíveis para a chave do usuário
   */
  async discoverAvailableModels() {
    if (this.cachedAvailableModels && this.cachedAvailableModels.length > 0) {
      return this.cachedAvailableModels;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || '';

      if (response.status === 400 || response.status === 403 || errMsg.includes('API key not valid')) {
        throw new Error('Chave de API do Google Gemini inválida. Crie ou copie uma chave ativa no Google AI Studio: aistudio.google.com/app/apikey');
      }
      throw new Error(`Falha ao consultar modelos disponíveis no Gemini: ${errMsg || response.statusText}`);
    }

    const data = await response.json();
    const allModels = data.models || [];

    // Filtra apenas modelos que suportam o método 'generateContent'
    const supported = allModels
      .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
      .map(m => m.name.replace(/^models\//, ''));

    if (supported.length === 0) {
      throw new Error('Nenhum modelo com suporte a generateContent foi encontrado para sua conta.');
    }

    // Ordena priorizando modelos rápidos (Flash)
    const priority = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'];
    supported.sort((a, b) => {
      const idxA = priority.findIndex(p => a.includes(p));
      const idxB = priority.findIndex(p => b.includes(p));
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });

    this.cachedAvailableModels = supported;
    console.log('[AIService] Modelos descobertos para esta chave:', supported);
    return supported;
  }

  /**
   * Gera uma cruzada temática via IA
   */
  async generateThemedCrossword({ topic, wordCount = 8, difficulty = 'Médio' }) {
    if (!this.apiKey) {
      throw new Error('Por favor, informe sua chave de API do Google Gemini.');
    }

    const formatCheck = this.validateKeyFormat(this.apiKey);
    if (!formatCheck.valid) {
      throw new Error(formatCheck.error);
    }

    const systemInstruction = `Você é um Criador Mestre de Palavras Cruzadas (Crossword Master).
Seu objetivo é sugerir palavras em português do Brasil e suas respectivas dicas sobre o tema solicitado.
REGRAS MANDATÓRIAS:
1. Retorne palavras de 3 a 10 letras apenas alfabéticas A-Z (sem espaços, sem hífens, sem acentos).
2. As palavras devem compartilhar letras comuns (especialmente vogais A, E, O, I e consoantes frequentes R, S, T, M, N, L) para garantir que consigam se cruzar ortogonalmente em grade.
3. Para cada palavra, forneça uma dica inteligente, intrigante e concisa (máximo 100 caracteres).
4. Responda ESTRITAMENTE em formato JSON puro no seguinte padrão:
{
  "title": "Título Temático Criativo",
  "difficulty": "${difficulty}",
  "words": [
    { "word": "PALAVRA", "clue": "Dica bem formulada sobre ela" }
  ]
}`;

    const numWords = Math.max(wordCount, 10);
    const userPrompt = `Gere ${numWords} palavras e dicas sobre o tema: "${topic}".
Nível de Dificuldade: ${difficulty}.
Responda EXCLUSIVAMENTE com o objeto JSON especificado, sem nenhum texto introdutório ou explicativo.`;

    const rawResponse = await this.callGeminiWithDiscovery(systemInstruction, userPrompt);
    const parsedData = this.cleanAndParseJSON(rawResponse);

    // Suporta 'words', 'palavras', 'items' ou 'itens'
    const rawList = parsedData?.words || parsedData?.palavras || parsedData?.items || parsedData?.itens || [];
    if (!Array.isArray(rawList) || rawList.length < 2) {
      throw new Error('A IA não retornou palavras suficientes para montar a cruzada. Tente gerar novamente.');
    }

    // Normaliza os itens garantindo pares { word, clue }
    const normalizedWords = rawList.map(item => ({
      word: (item.word || item.palavra || item.termo || '').trim(),
      clue: (item.clue || item.dica || item.definicao || '').trim()
    })).filter(w => w.word.length >= 2 && w.clue.length > 0);

    if (normalizedWords.length < 2) {
      throw new Error('A IA não gerou palavras válidas com dicas. Tente gerar novamente com outro tema.');
    }

    // Calcula as posições ortogonais da grade com o motor procedural
    const generatedPuzzle = CrosswordEngine.generateProcedural(normalizedWords, {
      title: parsedData.title || parsedData.titulo || `Cruzada: ${topic}`,
      author: 'CruzadaMaster IA',
      difficulty: parsedData.difficulty || parsedData.dificuldade || difficulty
    });

    if (generatedPuzzle.words.length < 2) {
      throw new Error('Não foi possível cruzar as palavras sugeridas. Tente um tema mais amplo ou clique em Gerar novamente.');
    }

    return generatedPuzzle;
  }

  /**
   * Executa a chamada à API do Gemini utilizando modelos validados
   */
  async callGeminiWithDiscovery(systemInstruction, userPrompt) {
    const availableModels = await this.discoverAvailableModels();

    let modelsToTry = this.cachedWorkingModel
      ? [this.cachedWorkingModel, ...availableModels.filter(m => m !== this.cachedWorkingModel)]
      : availableModels;

    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const requestPayload = {
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemInstruction}\n\n${userPrompt}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        };

        let response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload)
        });

        // Caso algum modelo não suporte responseMimeType (400), tenta sem o cabeçalho
        if (!response.ok && response.status === 400) {
          const errDataCopy = await response.clone().json().catch(() => ({}));
          const errMsg = errDataCopy.error?.message || '';
          if (errMsg.toLowerCase().includes('mimetype') || errMsg.toLowerCase().includes('generationconfig')) {
            delete requestPayload.generationConfig.responseMimeType;
            response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestPayload)
            });
          }
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${response.status} no modelo ${model}`;

          if (response.status === 400 || response.status === 403) {
            throw new Error(`Erro na API do Gemini: ${errMsg}`);
          }
          throw new Error(errMsg);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          const finishReason = data.candidates?.[0]?.finishReason;
          if (finishReason === 'SAFETY') {
            throw new Error('A resposta foi bloqueada pelos filtros de moderação do Gemini.');
          }
          throw new Error(`Resposta vazia recebida do modelo ${model}`);
        }

        this.cachedWorkingModel = model;
        return text;
      } catch (err) {
        console.warn(`[AIService] Falha no modelo ${model}:`, err.message);
        lastError = err;
        if (err.message.includes('API key not valid') || err.message.includes('Chave de API')) {
          throw err;
        }
      }
    }

    throw new Error(`Falha ao conectar com o Gemini: ${lastError?.message || 'Verifique sua chave de API.'}`);
  }

  /**
   * Limpa e decodifica respostas JSON de forma ultra-resiliente
   */
  cleanAndParseJSON(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('A resposta recebida da IA está vazia.');
    }

    let text = rawText.trim().replace(/^\uFEFF/, '');

    // 1. Tentativa direta de parsing JSON nativo
    try {
      return JSON.parse(text);
    } catch (e) {}

    // 2. Extrai de bloco de código Markdown (```json ... ``` ou ``` ... ```)
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      const candidate = codeBlockMatch[1].trim();
      try {
        return JSON.parse(candidate);
      } catch (e) {
        try {
          const cleaned = candidate.replace(/,\s*([\]}])/g, '$1');
          return JSON.parse(cleaned);
        } catch (e2) {}
      }
    }

    // 3. Extrai substring delimitada pelo primeiro '{' e último '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (e) {
        try {
          // Remove vírgulas trailing que LLMs comumente produzem
          const cleaned = candidate.replace(/,\s*([\]}])/g, '$1');
          return JSON.parse(cleaned);
        } catch (e2) {}
      }
    }

    throw new Error('Não foi possível interpretar a resposta da IA como JSON. Por favor, tente gerar novamente.');
  }
}

export const aiService = new AIService();
