/**
 * Serviço de Integração com Inteligência Artificial (Google Gemini) para CruzadaMaster
 * Gera conjuntos balanceados de palavras e pistas temáticas com cascata de fallback resiliente.
 */
import { CrosswordEngine, normalizeText } from './crosswordEngine.js';

const STORAGE_API_KEY = 'CRUZADAMASTER_AI_API_KEY';

const GEMINI_CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

export class AIService {
  constructor() {
    this.apiKey = localStorage.getItem(STORAGE_API_KEY) || '';
    this.cachedWorkingModel = null;
  }

  getApiKey() {
    return this.apiKey;
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    this.cachedWorkingModel = null;
    localStorage.setItem(STORAGE_API_KEY, this.apiKey);
  }

  hasApiKey() {
    return !!this.apiKey;
  }

  /**
   * Gera uma cruzada temática via IA
   */
  async generateThemedCrossword({ topic, wordCount = 8, difficulty = 'Médio' }) {
    if (!this.apiKey) {
      throw new Error('Informe sua chave de API do Google Gemini para gerar palavras cruzadas com IA.');
    }

    const systemInstruction = `Você é um Criador Mestre de Palavras Cruzadas (Crossword Master).
Seu objetivo é sugerir palavras em português do Brasil e suas respectivas dicas sobre o tema solicitado.
REGRAS MANDATÓRIAS:
1. Retorne palavras de 3 a 10 letras apenas letras alfabéticas A-Z (sem espaços, sem hífens).
2. As palavras devem compartilhar letras comuns (vogais como A, E, O e consoantes comuns como R, S, T, M, N, L) para facilitar interseções.
3. Para cada palavra, forneça uma dica inteligente, intrigante e concisa (máximo 120 caracteres).
4. Você DEVE responder ESTRITAMENTE em formato JSON puro, sem markdown em volta, no seguinte formato:
{
  "title": "Título Temático Criativo",
  "difficulty": "${difficulty}",
  "words": [
    { "word": "PALAVRA", "clue": "Dica bem formulada sobre ela" }
  ]
}`;

    const userPrompt = `Crie exatamente ${wordCount} palavras e dicas sobre o tema: "${topic}".
Nível de Dificuldade: ${difficulty}.
Assegure que as palavras tenham bom vocabulário e letras que se cruzem com facilidade.`;

    const rawResponse = await this.callGeminiWithFallback(systemInstruction, userPrompt);
    const parsedData = this.cleanAndParseJSON(rawResponse);

    if (!parsedData || !Array.isArray(parsedData.words) || parsedData.words.length < 2) {
      throw new Error('A IA não retornou palavras válidas suficientes para montar a cruzada.');
    }

    // Usa o motor procedural para calcular as posições ortogonais da grade
    const generatedPuzzle = CrosswordEngine.generateProcedural(parsedData.words, {
      title: parsedData.title || `Cruzada: ${topic}`,
      author: 'CruzadaMaster IA',
      difficulty: parsedData.difficulty || difficulty
    });

    if (generatedPuzzle.words.length < 2) {
      throw new Error('Não foi possível cruzar as palavras sugeridas. Tente um tema mais amplo ou gere novamente.');
    }

    return generatedPuzzle;
  }

  /**
   * Executa a chamada à API do Gemini com fallback automático entre modelos
   */
  async callGeminiWithFallback(systemInstruction, userPrompt) {
    const modelsToTry = this.cachedWorkingModel
      ? [this.cachedWorkingModel, ...GEMINI_CANDIDATE_MODELS.filter(m => m !== this.cachedWorkingModel)]
      : GEMINI_CANDIDATE_MODELS;

    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
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
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `HTTP ${response.status} no modelo ${model}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error(`Resposta vazia recebida do modelo ${model}`);
        }

        this.cachedWorkingModel = model;
        return text;
      } catch (err) {
        console.warn(`[AIService] Falha no modelo ${model}:`, err.message);
        lastError = err;
      }
    }

    throw new Error(`Falha ao conectar com a IA: ${lastError?.message || 'Verifique sua chave de API e conexão.'}`);
  }

  cleanAndParseJSON(rawText) {
    if (!rawText) return null;
    let text = rawText.trim();
    // Remove delimitadores ```json se vierem na resposta
    if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '');
    if (text.startsWith('```')) text = text.replace(/^```\s*/, '');
    if (text.endsWith('```')) text = text.replace(/\s*```$/, '');

    return JSON.parse(text);
  }
}

export const aiService = new AIService();
