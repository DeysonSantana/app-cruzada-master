/**
 * Banco de Palavras Cruzadas Nativas (Offline) do CruzadaMaster
 * Tabuleiros curados com interseções ortogonais verificadas e balanceadas.
 */

export const DEFAULT_PUZZLES = [
  {
    id: "tech_01",
    title: "Tecnologia & Internet",
    author: "CruzadaMaster",
    difficulty: "Fácil",
    words: [
      {
        id: "t_1",
        word: "INTERNET",
        displayWord: "INTERNET",
        clue: "Rede mundial de computadores interconectados que revolucionou a comunicação.",
        row: 6,
        col: 0,
        direction: "across"
      },
      {
        id: "t_2",
        word: "PYTHON",
        displayWord: "PYTHON",
        clue: "Linguagem de programação famosa com nome de serpente e sintaxe limpa.",
        row: 4,
        col: 2,
        direction: "down"
      },
      {
        id: "t_3",
        word: "ROUTER",
        displayWord: "ROUTER",
        clue: "Aparelho roteador que distribui e gerencia o sinal Wi-Fi em uma rede.",
        row: 8,
        col: 1,
        direction: "across"
      },
      {
        id: "t_4",
        word: "PIXEL",
        displayWord: "PIXEL",
        clue: "Menor elemento de uma imagem digital exibida na tela de um dispositivo.",
        row: 4,
        col: 2,
        direction: "across"
      },
      {
        id: "t_5",
        word: "LINUX",
        displayWord: "LINUX",
        clue: "Sistema operacional de código aberto famoso pelo mascote pinguim Tux.",
        row: 0,
        col: 4,
        direction: "down"
      }
    ]
  },
  {
    id: "ciencia_02",
    title: "Ciência & Natureza",
    author: "CruzadaMaster",
    difficulty: "Médio",
    words: [
      {
        id: "c_1",
        word: "GRAVIDADE",
        displayWord: "GRAVIDADE",
        clue: "Força fundamental de atração mútua entre corpos celestes e a matéria.",
        row: 4,
        col: 4,
        direction: "across"
      },
      {
        id: "c_2",
        word: "OXIGENIO",
        displayWord: "OXIGÊNIO",
        clue: "Gás vital produzido na fotossíntese e essencial para a respiração.",
        row: 1,
        col: 4,
        direction: "down"
      },
      {
        id: "c_3",
        word: "PLANETA",
        displayWord: "PLANETA",
        clue: "Corpo celeste esférico que orbita o Sol ou outra estrela.",
        row: 2,
        col: 6,
        direction: "down"
      },
      {
        id: "c_4",
        word: "GALAXIA",
        displayWord: "GALÁXIA",
        clue: "Enorme conglomerado gravitacional de estrelas, poeira e gás cósmico.",
        row: 3,
        col: 10,
        direction: "down"
      },
      {
        id: "c_5",
        word: "FOSSIL",
        displayWord: "FÓSSIL",
        clue: "Vestígio ou resto preservado de seres vivos de eras geológicas passadas.",
        row: 0,
        col: 8,
        direction: "down"
      },
      {
        id: "c_6",
        word: "CELULA",
        displayWord: "CÉLULA",
        clue: "Unidade microscópica estrutural e funcional de todos os seres vivos.",
        row: 3,
        col: 12,
        direction: "down"
      },
      {
        id: "c_7",
        word: "ATOMO",
        displayWord: "ÁTOMO",
        clue: "Partícula elementar que compõe os elementos químicos.",
        row: 1,
        col: 0,
        direction: "across"
      }
    ]
  },
  {
    id: "geografia_03",
    title: "Geografia & Mundo",
    author: "CruzadaMaster",
    difficulty: "Médio",
    words: [
      {
        id: "g_1",
        word: "CONTINENTE",
        displayWord: "CONTINENTE",
        clue: "Grande extensão de terra cercada por águas oceânicas.",
        row: 4,
        col: 2,
        direction: "across"
      },
      {
        id: "g_2",
        word: "AMAZONAS",
        displayWord: "AMAZONAS",
        clue: "Maior rio do planeta em extensão e descarga hídrica.",
        row: 0,
        col: 3,
        direction: "down"
      },
      {
        id: "g_3",
        word: "BRASIL",
        displayWord: "BRASIL",
        clue: "Maior país lusófono do mundo, localizado na América do Sul.",
        row: 2,
        col: 1,
        direction: "across"
      },
      {
        id: "g_4",
        word: "OCEANO",
        displayWord: "OCEANO",
        clue: "Vasta massa contínua de água salgada que recobre ~71% da Terra.",
        row: 6,
        col: 0,
        direction: "across"
      },
      {
        id: "g_5",
        word: "EUROPA",
        displayWord: "EUROPA",
        clue: "Continente berço da Grécia Antiga, do Império Romano e do Renascimento.",
        row: 3,
        col: 0,
        direction: "down"
      },
      {
        id: "g_6",
        word: "TOQUIO",
        displayWord: "TÓQUIO",
        clue: "Metrópole cosmopolita e capital oficial do Japão.",
        row: 4,
        col: 10,
        direction: "down"
      },
      {
        id: "g_7",
        word: "SAARA",
        displayWord: "SAARA",
        clue: "Maior deserto de areia e calor extremo do mundo, no norte africano.",
        row: 0,
        col: 2,
        direction: "across"
      },
      {
        id: "g_8",
        word: "ANDES",
        displayWord: "ANDES",
        clue: "Imponente cordilheira montanhosa ao longo da costa ocidental sul-americana.",
        row: 3,
        col: 7,
        direction: "down"
      }
    ]
  },
  {
    id: "cultura_04",
    title: "Cinema & Séries Pop",
    author: "CruzadaMaster",
    difficulty: "Difícil",
    words: [
      {
        id: "p_1",
        word: "TRILOGIA",
        displayWord: "TRILOGIA",
        clue: "Série cinematográfica composta por três partes (ex: O Senhor dos Anéis).",
        row: 0,
        col: 1,
        direction: "across"
      },
      {
        id: "p_2",
        word: "ROTEIRO",
        displayWord: "ROTEIRO",
        clue: "Guia textual com falas e orientações técnicas de cena para atores e direção.",
        row: 0,
        col: 2,
        direction: "down"
      },
      {
        id: "p_3",
        word: "CINEMA",
        displayWord: "CINEMA",
        clue: "A sétima arte de projetar imagens sequenciais que contam histórias.",
        row: 4,
        col: 1,
        direction: "across"
      },
      {
        id: "p_4",
        word: "MATRIZ",
        displayWord: "MATRIZ",
        clue: "Tradução literal da simulação digital distópica do clássico Matrix.",
        row: 2,
        col: 0,
        direction: "across"
      },
      {
        id: "p_5",
        word: "AVATAR",
        displayWord: "AVATAR",
        clue: "Épico de ficção científica ambientado na lua alienígena Pandora.",
        row: 0,
        col: 8,
        direction: "down"
      },
      {
        id: "p_6",
        word: "OSCAR",
        displayWord: "OSCAR",
        clue: "Estatueta dourada mais cobiçada do cinema entregue anualmente pela Academia.",
        row: 6,
        col: 2,
        direction: "across"
      },
      {
        id: "p_7",
        word: "VILAO",
        displayWord: "VILÃO",
        clue: "Personagem que antagoniza e desafia as ações do herói na narrativa.",
        row: 1,
        col: 8,
        direction: "across"
      }
    ]
  }
];
