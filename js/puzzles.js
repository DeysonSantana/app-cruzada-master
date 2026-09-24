/**
 * Banco de Palavras Cruzadas Nativas (Offline) do CruzadaMaster
 * 32 Tabuleiros curados em 8 Categorias Temáticas com interseções ortogonais balanceadas.
 */

export const PUZZLE_CATEGORIES = [
  {
    "id": "all",
    "name": "Todos",
    "icon": "✨"
  },
  {
    "id": "tech",
    "name": "Tecnologia",
    "icon": "💻"
  },
  {
    "id": "science",
    "name": "Ciência",
    "icon": "🔬"
  },
  {
    "id": "geo",
    "name": "Geografia",
    "icon": "🌍"
  },
  {
    "id": "pop",
    "name": "Cultura Pop",
    "icon": "🎬"
  },
  {
    "id": "history",
    "name": "História & Mitologia",
    "icon": "🏛️"
  },
  {
    "id": "music",
    "name": "Música & Artes",
    "icon": "🎵"
  },
  {
    "id": "sports",
    "name": "Esportes & Games",
    "icon": "⚽"
  },
  {
    "id": "literature",
    "name": "Literatura & Saber",
    "icon": "📚"
  }
];

export const DEFAULT_PUZZLES = [
  {
    "id": "tech_01",
    "title": "Tecnologia & Internet",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "t_1",
        "word": "INTERNET",
        "displayWord": "INTERNET",
        "clue": "Rede mundial de computadores interconectados que revolucionou a comunicação.",
        "row": 6,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "t_2",
        "word": "PYTHON",
        "displayWord": "PYTHON",
        "clue": "Linguagem de programação famosa com nome de serpente e sintaxe limpa.",
        "row": 4,
        "col": 2,
        "direction": "down"
      },
      {
        "id": "t_3",
        "word": "ROUTER",
        "displayWord": "ROUTER",
        "clue": "Aparelho roteador que distribui e gerencia o sinal Wi-Fi em uma rede.",
        "row": 8,
        "col": 1,
        "direction": "across"
      },
      {
        "id": "t_4",
        "word": "PIXEL",
        "displayWord": "PIXEL",
        "clue": "Menor elemento de uma imagem digital exibida na tela de um dispositivo.",
        "row": 4,
        "col": 2,
        "direction": "across"
      },
      {
        "id": "t_5",
        "word": "LINUX",
        "displayWord": "LINUX",
        "clue": "Sistema operacional de código aberto famoso pelo mascote pinguim Tux.",
        "row": 0,
        "col": 4,
        "direction": "down"
      }
    ],
    "category": "tech",
    "categoryName": "Tecnologia",
    "categoryIcon": "💻"
  },
  {
    "id": "ciencia_02",
    "title": "Ciência & Natureza",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "c_1",
        "word": "GRAVIDADE",
        "displayWord": "GRAVIDADE",
        "clue": "Força fundamental de atração mútua entre corpos celestes e a matéria.",
        "row": 4,
        "col": 4,
        "direction": "across"
      },
      {
        "id": "c_2",
        "word": "OXIGENIO",
        "displayWord": "OXIGÊNIO",
        "clue": "Gás vital produzido na fotossíntese e essencial para a respiração.",
        "row": 1,
        "col": 4,
        "direction": "down"
      },
      {
        "id": "c_3",
        "word": "PLANETA",
        "displayWord": "PLANETA",
        "clue": "Corpo celeste esférico que orbita o Sol ou outra estrela.",
        "row": 2,
        "col": 6,
        "direction": "down"
      },
      {
        "id": "c_4",
        "word": "GALAXIA",
        "displayWord": "GALÁXIA",
        "clue": "Enorme conglomerado gravitacional de estrelas, poeira e gás cósmico.",
        "row": 3,
        "col": 10,
        "direction": "down"
      },
      {
        "id": "c_5",
        "word": "FOSSIL",
        "displayWord": "FÓSSIL",
        "clue": "Vestígio ou resto preservado de seres vivos de eras geológicas passadas.",
        "row": 0,
        "col": 8,
        "direction": "down"
      },
      {
        "id": "c_6",
        "word": "CELULA",
        "displayWord": "CÉLULA",
        "clue": "Unidade microscópica estrutural e funcional de todos os seres vivos.",
        "row": 3,
        "col": 12,
        "direction": "down"
      },
      {
        "id": "c_7",
        "word": "ATOMO",
        "displayWord": "ÁTOMO",
        "clue": "Partícula elementar que compõe os elementos químicos.",
        "row": 1,
        "col": 0,
        "direction": "across"
      }
    ],
    "category": "science",
    "categoryName": "Ciência",
    "categoryIcon": "🔬"
  },
  {
    "id": "geografia_03",
    "title": "Geografia & Mundo",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "g_1",
        "word": "CONTINENTE",
        "displayWord": "CONTINENTE",
        "clue": "Grande extensão de terra cercada por águas oceânicas.",
        "row": 4,
        "col": 2,
        "direction": "across"
      },
      {
        "id": "g_2",
        "word": "AMAZONAS",
        "displayWord": "AMAZONAS",
        "clue": "Maior rio do planeta em extensão e descarga hídrica.",
        "row": 0,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "g_3",
        "word": "BRASIL",
        "displayWord": "BRASIL",
        "clue": "Maior país lusófono do mundo, localizado na América do Sul.",
        "row": 2,
        "col": 1,
        "direction": "across"
      },
      {
        "id": "g_4",
        "word": "OCEANO",
        "displayWord": "OCEANO",
        "clue": "Vasta massa contínua de água salgada que recobre ~71% da Terra.",
        "row": 6,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "g_5",
        "word": "EUROPA",
        "displayWord": "EUROPA",
        "clue": "Continente berço da Grécia Antiga, do Império Romano e do Renascimento.",
        "row": 3,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "g_6",
        "word": "TOQUIO",
        "displayWord": "TÓQUIO",
        "clue": "Metrópole cosmopolita e capital oficial do Japão.",
        "row": 4,
        "col": 10,
        "direction": "down"
      },
      {
        "id": "g_7",
        "word": "SAARA",
        "displayWord": "SAARA",
        "clue": "Maior deserto de areia e calor extremo do mundo, no norte africano.",
        "row": 0,
        "col": 2,
        "direction": "across"
      },
      {
        "id": "g_8",
        "word": "ANDES",
        "displayWord": "ANDES",
        "clue": "Imponente cordilheira montanhosa ao longo da costa ocidental sul-americana.",
        "row": 3,
        "col": 7,
        "direction": "down"
      }
    ],
    "category": "geo",
    "categoryName": "Geografia",
    "categoryIcon": "🌍"
  },
  {
    "id": "cultura_04",
    "title": "Cinema & Séries Pop",
    "author": "CruzadaMaster",
    "difficulty": "Difícil",
    "words": [
      {
        "id": "p_1",
        "word": "TRILOGIA",
        "displayWord": "TRILOGIA",
        "clue": "Série cinematográfica composta por três partes (ex: O Senhor dos Anéis).",
        "row": 0,
        "col": 1,
        "direction": "across"
      },
      {
        "id": "p_2",
        "word": "ROTEIRO",
        "displayWord": "ROTEIRO",
        "clue": "Guia textual com falas e orientações técnicas de cena para atores e direção.",
        "row": 0,
        "col": 2,
        "direction": "down"
      },
      {
        "id": "p_3",
        "word": "CINEMA",
        "displayWord": "CINEMA",
        "clue": "A sétima arte de projetar imagens sequenciais que contam histórias.",
        "row": 4,
        "col": 1,
        "direction": "across"
      },
      {
        "id": "p_4",
        "word": "MATRIZ",
        "displayWord": "MATRIZ",
        "clue": "Tradução literal da simulação digital distópica do clássico Matrix.",
        "row": 2,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "p_5",
        "word": "AVATAR",
        "displayWord": "AVATAR",
        "clue": "Épico de ficção científica ambientado na lua alienígena Pandora.",
        "row": 0,
        "col": 8,
        "direction": "down"
      },
      {
        "id": "p_6",
        "word": "OSCAR",
        "displayWord": "OSCAR",
        "clue": "Estatueta dourada mais cobiçada do cinema entregue anualmente pela Academia.",
        "row": 6,
        "col": 2,
        "direction": "across"
      },
      {
        "id": "p_7",
        "word": "VILAO",
        "displayWord": "VILÃO",
        "clue": "Personagem que antagoniza e desafia as ações do herói na narrativa.",
        "row": 1,
        "col": 8,
        "direction": "across"
      }
    ],
    "category": "pop",
    "categoryName": "Cultura Pop",
    "categoryIcon": "🎬"
  },
  {
    "id": "tech_02",
    "category": "tech",
    "categoryName": "Tecnologia",
    "categoryIcon": "💻",
    "title": "Linguagens de Programação",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_1",
        "word": "JAVASCRIPT",
        "displayWord": "JAVASCRIPT",
        "clue": "Linguagem nativa da web que dá dinamismo às páginas nos navegadores.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "TYPESCRIPT",
        "displayWord": "TYPESCRIPT",
        "clue": "Superconjunto de JavaScript com tipagem estática desenvolvido pela Microsoft.",
        "row": -4,
        "col": 4,
        "direction": "down"
      },
      {
        "id": "pw_2",
        "word": "PYTHON",
        "displayWord": "PYTHON",
        "clue": "Linguagem com sintaxe limpa e legível adorada em ciência de dados e IA.",
        "row": -4,
        "col": 2,
        "direction": "across"
      },
      {
        "id": "pw_3",
        "word": "KOTLIN",
        "displayWord": "KOTLIN",
        "clue": "Linguagem moderna e concisa oficial do Google para criar aplicativos Android.",
        "row": 3,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "RUST",
        "displayWord": "RUST",
        "clue": "Linguagem de sistemas ultra-rápida focada em segurança de memória e concorrência.",
        "row": 5,
        "col": 1,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "RUBY",
        "displayWord": "RUBY",
        "clue": "Linguagem dinâmica famosa pelo framework Rails e foco na produtividade.",
        "row": 5,
        "col": 1,
        "direction": "down"
      }
    ]
  },
  {
    "id": "tech_03",
    "category": "tech",
    "categoryName": "Tecnologia",
    "categoryIcon": "💻",
    "title": "Inteligência Artificial & Robôs",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_1",
        "word": "ALGORITMO",
        "displayWord": "ALGORITMO",
        "clue": "Sequência lógica finita de instruções para resolver um problema.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "AUTOMACAO",
        "displayWord": "AUTOMACAO",
        "clue": "Uso de sistemas e computadores para executar tarefas sem intervenção humana direta.",
        "row": 0,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_2",
        "word": "ROBOTICA",
        "displayWord": "ROBOTICA",
        "clue": "Área da engenharia e tecnologia que projeta e constrói autômatos.",
        "row": 3,
        "col": -1,
        "direction": "across"
      },
      {
        "id": "pw_3",
        "word": "NEURONIO",
        "displayWord": "NEURONIO",
        "clue": "Unidade básica das redes neurais artificiais inspirada no cérebro.",
        "row": -3,
        "col": 4,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "DATASET",
        "displayWord": "DATASET",
        "clue": "Conjunto de dados estruturado utilizado para treinar modelos de machine learning.",
        "row": -2,
        "col": -1,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "MACHINE",
        "displayWord": "MACHINE",
        "clue": "Termo em inglês de aprendizado de máquina (Machine Learning).",
        "row": 6,
        "col": -2,
        "direction": "across"
      }
    ]
  },
  {
    "id": "tech_04",
    "category": "tech",
    "categoryName": "Tecnologia",
    "categoryIcon": "💻",
    "title": "Cibersegurança & Redes",
    "author": "CruzadaMaster",
    "difficulty": "Difícil",
    "words": [
      {
        "id": "pw_3",
        "word": "CRIPTOGRAFIA",
        "displayWord": "CRIPTOGRAFIA",
        "clue": "Técnica de codificação de dados para garantir privacidade e sigilo.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "FIREWALL",
        "displayWord": "FIREWALL",
        "clue": "Barreira de segurança que monitora e filtra o tráfego de entrada e saída em uma rede.",
        "row": -2,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_5",
        "word": "PHISHING",
        "displayWord": "PHISHING",
        "clue": "Golpe digital onde cibercriminosos enganam vítimas para obter senhas e cartões.",
        "row": 0,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_2",
        "word": "MALWARE",
        "displayWord": "MALWARE",
        "clue": "Software malicioso criado para infectar sistemas, roubar dados ou causar danos.",
        "row": -1,
        "col": 8,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "BACKUP",
        "displayWord": "BACKUP",
        "clue": "Cópia de segurança de dados para recuperação em caso de perda ou falha.",
        "row": 3,
        "col": 7,
        "direction": "across"
      }
    ]
  },
  {
    "id": "science_02",
    "category": "science",
    "categoryName": "Ciência",
    "categoryIcon": "🔬",
    "title": "Astronomia & Cosmologia",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_5",
        "word": "TELESCOPIO",
        "displayWord": "TELESCOPIO",
        "clue": "Instrumento óptico fundamental para observar galáxias e corpos celestes distantes.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "ASTEROIDE",
        "displayWord": "ASTEROIDE",
        "clue": "Pequeno corpo rochoso que orbita o Sol, comum entre Marte e Júpiter.",
        "row": -2,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_1",
        "word": "NEBULOSA",
        "displayWord": "NEBULOSA",
        "clue": "Nuvem cósmica de poeira e gás interestelar onde nascem as estrelas.",
        "row": -1,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_2",
        "word": "METEORO",
        "displayWord": "METEORO",
        "clue": "Fenômeno luminoso popularmente chamado de estrela cadente na atmosfera.",
        "row": 2,
        "col": -5,
        "direction": "across"
      },
      {
        "id": "pw_3",
        "word": "COMETA",
        "displayWord": "COMETA",
        "clue": "Corpo celeste feito de gelo e rocha com uma cauda brilhante ao se aproximar do Sol.",
        "row": -1,
        "col": -2,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "ORBITA",
        "displayWord": "ORBITA",
        "clue": "Trajetória curva regular percorrida por um planeta ao redor de uma estrela.",
        "row": 0,
        "col": 6,
        "direction": "down"
      }
    ]
  },
  {
    "id": "science_03",
    "category": "science",
    "categoryName": "Ciência",
    "categoryIcon": "🔬",
    "title": "Corpo Humano & Medicina",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_5",
        "word": "NEURONIO",
        "displayWord": "NEURONIO",
        "clue": "Célula nervosa especializada na condução de impulsos elétricos.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "CORACAO",
        "displayWord": "CORACAO",
        "clue": "Órgão muscular vital que bombeia sangue para todo o organismo.",
        "row": -2,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "CEREBRO",
        "displayWord": "CEREBRO",
        "clue": "Centro de comando do sistema nervoso central que processa pensamentos e memórias.",
        "row": -1,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "ARTERIA",
        "displayWord": "ARTERIA",
        "clue": "Vaso sanguíneo resistente que transporta sangue rico em oxigênio a partir do coração.",
        "row": 3,
        "col": 3,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "PULMAO",
        "displayWord": "PULMAO",
        "clue": "Órgão respiratório responsável pela troca de oxigênio e dióxido de carbono.",
        "row": 5,
        "col": -4,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "SANGUE",
        "displayWord": "SANGUE",
        "clue": "Fluido vital vermelho composto por plasma, hemácias e leucócitos.",
        "row": 1,
        "col": -3,
        "direction": "down"
      }
    ]
  },
  {
    "id": "science_04",
    "category": "science",
    "categoryName": "Ciência",
    "categoryIcon": "🔬",
    "title": "Física & Energia",
    "author": "CruzadaMaster",
    "difficulty": "Difícil",
    "words": [
      {
        "id": "pw_1",
        "word": "ELETRON",
        "displayWord": "ELETRON",
        "clue": "Partícula subatômica de carga elétrica negativa que orbita o núcleo atômico.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "ENERGIA",
        "displayWord": "ENERGIA",
        "clue": "Capacidade de produzir trabalho ou gerar calor e movimento.",
        "row": 0,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_5",
        "word": "QUANTUM",
        "displayWord": "QUANTUM",
        "clue": "Menor quantidade indivisível de uma grandeza física em escalas atômicas.",
        "row": -4,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "TERMICA",
        "displayWord": "TERMICA",
        "clue": "Energia na forma de calor produzida pela agitação molecular.",
        "row": -2,
        "col": -3,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "PROTON",
        "displayWord": "PROTON",
        "clue": "Partícula nuclear com carga positiva que compõe o núcleo do átomo.",
        "row": 1,
        "col": -5,
        "direction": "across"
      },
      {
        "id": "pw_3",
        "word": "FOTON",
        "displayWord": "FOTON",
        "clue": "Partícula elementar mediadora da luz e da radiação eletromagnética.",
        "row": 0,
        "col": -3,
        "direction": "down"
      }
    ]
  },
  {
    "id": "geo_02",
    "category": "geo",
    "categoryName": "Geografia",
    "categoryIcon": "🌍",
    "title": "Brasil de Norte a Sul",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_1",
        "word": "BRASILIA",
        "displayWord": "BRASILIA",
        "clue": "Capital federal do Brasil com seu icônico Plano Piloto em formato de avião.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "SALVADOR",
        "displayWord": "SALVADOR",
        "clue": "Primeira capital do Brasil, famosa pelo Pelourinho e cultura afro-brasileira.",
        "row": -1,
        "col": 2,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "CURITIBA",
        "displayWord": "CURITIBA",
        "clue": "Capital paranaense modelo de sustentabilidade e transporte público.",
        "row": 6,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "CERRADO",
        "displayWord": "CERRADO",
        "clue": "Segundo maior bioma brasileiro conhecido como a savana mais rica em biodiversidade.",
        "row": 3,
        "col": -2,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "MANAUS",
        "displayWord": "MANAUS",
        "clue": "Metrópole no coração da Amazônia famosa pelo histórico Teatro Amazonas.",
        "row": -1,
        "col": 7,
        "direction": "down"
      },
      {
        "id": "pw_5",
        "word": "RECIFE",
        "displayWord": "RECIFE",
        "clue": "Veneza brasileira cortada por rios e pontes na costa de Pernambuco.",
        "row": 1,
        "col": -2,
        "direction": "down"
      }
    ]
  },
  {
    "id": "geo_03",
    "category": "geo",
    "categoryName": "Geografia",
    "categoryIcon": "🌍",
    "title": "Maravilhas do Planeta",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_1",
        "word": "PIRAMIDE",
        "displayWord": "PIRAMIDE",
        "clue": "Monumental estrutura arquitetônica triangular dos antigos faraós egípcios em Gizé.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_3",
        "word": "TAJMAHAL",
        "displayWord": "TAJMAHAL",
        "clue": "Mausoléu de mármore branco em Agra erguido como prova eterna de amor.",
        "row": -1,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_2",
        "word": "COLISEU",
        "displayWord": "COLISEU",
        "clue": "Anfiteatro milenar no centro de Roma onde lutavam gladiadores do Império.",
        "row": -3,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "EVEREST",
        "displayWord": "EVEREST",
        "clue": "Mais alto cume montanhoso do planeta Terra situado na cordilheira do Himalaia.",
        "row": 0,
        "col": 7,
        "direction": "down"
      },
      {
        "id": "pw_5",
        "word": "MURALLA",
        "displayWord": "MURALLA",
        "clue": "Grande Muralha que serpenteia milhares de quilômetros ao norte da China.",
        "row": 6,
        "col": -1,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "PETRA",
        "displayWord": "PETRA",
        "clue": "Histórica cidade esculpida diretamente na rocha rosa do deserto na Jordânia.",
        "row": 2,
        "col": 5,
        "direction": "down"
      }
    ]
  },
  {
    "id": "geo_04",
    "category": "geo",
    "categoryName": "Geografia",
    "categoryIcon": "🌍",
    "title": "Capitais do Mundo",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_5",
        "word": "BUENOSAIRES",
        "displayWord": "BUENOSAIRES",
        "clue": "Capital argentina do tango, da Casa Rosada e das parriladas.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "LONDRES",
        "displayWord": "LONDRES",
        "clue": "Metrópole britânica às margens do Tâmisa onde fica o relógio Big Ben.",
        "row": -2,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_1",
        "word": "LISBOA",
        "displayWord": "LISBOA",
        "clue": "Capital portuguesa banhada pelo rio Tejo famosa pelos pastéis de Belém.",
        "row": -3,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "BERLIM",
        "displayWord": "BERLIM",
        "clue": "Capital da Alemanha marcada pela Porta de Brandemburgo e pelo histórico muro.",
        "row": 3,
        "col": 2,
        "direction": "across"
      },
      {
        "id": "pw_3",
        "word": "MADRI",
        "displayWord": "MADRI",
        "clue": "Vibrante capital espanhola conhecida pelo Museu do Prado e Praça Maior.",
        "row": -1,
        "col": 6,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "PARIS",
        "displayWord": "PARIS",
        "clue": "Cidade Luz e capital francesa onde se ergue a imponente Torre Eiffel.",
        "row": -2,
        "col": -3,
        "direction": "across"
      }
    ]
  },
  {
    "id": "pop_02",
    "category": "pop",
    "categoryName": "Cultura Pop",
    "categoryIcon": "🎬",
    "title": "Universo dos Super-Heróis",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_2",
        "word": "VINGADORES",
        "displayWord": "VINGADORES",
        "clue": "Os maiores heróis da Terra que se unem para enfrentar ameaças cósmicas.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_3",
        "word": "CORINGA",
        "displayWord": "CORINGA",
        "clue": "O arqui-inimigo caótico do Batman com riso diabólico e terno roxo.",
        "row": -3,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "MUTANTE",
        "displayWord": "MUTANTE",
        "clue": "Seres que nasceram com o gene X que confere poderes especiais nos X-Men.",
        "row": 3,
        "col": -2,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "KRYPTON",
        "displayWord": "KRYPTON",
        "clue": "Planeta natal destruído do Superman de onde ele foi enviado bebê à Terra.",
        "row": -2,
        "col": -4,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "BATMAN",
        "displayWord": "BATMAN",
        "clue": "O Cavaleiro das Trevas que protege as ruas sombrias de Gotham City.",
        "row": 0,
        "col": -2,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "ESCUDO",
        "displayWord": "ESCUDO",
        "clue": "Arma defensiva indestrutível de vibranium empunhada pelo Capitão América.",
        "row": 3,
        "col": 4,
        "direction": "down"
      }
    ]
  },
  {
    "id": "pop_03",
    "category": "pop",
    "categoryName": "Cultura Pop",
    "categoryIcon": "🎬",
    "title": "Ficção Científica & Espaço",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_1",
        "word": "INTERESTELAR",
        "displayWord": "INTERESTELAR",
        "clue": "Épico espacial sobre buracos negros e a busca por um novo lar para a humanidade.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "CIBORGUE",
        "displayWord": "CIBORGUE",
        "clue": "Ser vivo aperfeiçoado com partes mecânicas e eletrônicas avançadas.",
        "row": -1,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "DROIDE",
        "displayWord": "DROIDE",
        "clue": "Robôs inteligentes como R2-D2, C-3PO e BB-8 nas galáxias distantes.",
        "row": 2,
        "col": -2,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "PORTAL",
        "displayWord": "PORTAL",
        "clue": "Passagem dimensional instantânea que conecta dois pontos do tempo ou espaço.",
        "row": -3,
        "col": 7,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "ALIEN",
        "displayWord": "ALIEN",
        "clue": "Criatura extraterrestre predadora perfeita que aterrorizou a tripulação da Nostromo.",
        "row": 2,
        "col": 6,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "JEDI",
        "displayWord": "JEDI",
        "clue": "Guardiões da paz e justiça armados com sabres de luz no universo de Star Wars.",
        "row": 0,
        "col": -2,
        "direction": "down"
      }
    ]
  },
  {
    "id": "pop_04",
    "category": "pop",
    "categoryName": "Cultura Pop",
    "categoryIcon": "🎬",
    "title": "Animações & Clássicos",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_4",
        "word": "PRINCESA",
        "displayWord": "PRINCESA",
        "clue": "Título nobre de heroínas de contos clássicos como Cinderela e Bela.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "FANTASIA",
        "displayWord": "FANTASIA",
        "clue": "Clássico animado inovador com Mickey Mouse como o aprendiz de feiticeiro.",
        "row": -2,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "TOYSTORY",
        "displayWord": "TOYSTORY",
        "clue": "Primeiro longa-metragem totalmente em CGI da história sobre brinquedos vivos.",
        "row": 3,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "SIMBA",
        "displayWord": "SIMBA",
        "clue": "Filhote de leão herdeiro do trono da Pedra do Rei em O Rei Leão.",
        "row": 5,
        "col": -1,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "PIXAR",
        "displayWord": "PIXAR",
        "clue": "Estúdio pioneiro de animação digital que criou Toy Story e Monstros S.A.",
        "row": -4,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "SHREK",
        "displayWord": "SHREK",
        "clue": "Ogro verde carismático que vive em um pântano com seu fiel amigo Burro.",
        "row": 5,
        "col": -1,
        "direction": "down"
      }
    ]
  },
  {
    "id": "history_01",
    "category": "history",
    "categoryName": "História & Mitologia",
    "categoryIcon": "🏛️",
    "title": "Mitologia Grega & Deuses",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_2",
        "word": "POSEIDON",
        "displayWord": "POSEIDON",
        "clue": "Deus grego dos mares e oceanos que empunha um tridente dourado.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "HERCULES",
        "displayWord": "HERCULES",
        "clue": "Semideus famoso pela força sobre-humana e pelos doze trabalhos lendários.",
        "row": -1,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_5",
        "word": "OLIMPO",
        "displayWord": "OLIMPO",
        "clue": "Montanha sagrada e morada dos doze principais deuses da Grécia Antiga.",
        "row": 0,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "MEDUSA",
        "displayWord": "MEDUSA",
        "clue": "Górgona com serpentes na cabeça cujo olhar petrifica quem a encara.",
        "row": -2,
        "col": 5,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "ATENA",
        "displayWord": "ATENA",
        "clue": "Deusa grega da sabedoria, da estratégia de guerra e das artes.",
        "row": 3,
        "col": 5,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "ZEUS",
        "displayWord": "ZEUS",
        "clue": "Soberano dos deuses do Monte Olimpo que controla os raios e o céu.",
        "row": 2,
        "col": 7,
        "direction": "down"
      }
    ]
  },
  {
    "id": "history_02",
    "category": "history",
    "categoryName": "História & Mitologia",
    "categoryIcon": "🏛️",
    "title": "Egito Antigo & Faraós",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_3",
        "word": "ESFINGE",
        "displayWord": "ESFINGE",
        "clue": "Monumento com corpo de leão e cabeça humana que guarda as pirâmides.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "PAPIRO",
        "displayWord": "PAPIRO",
        "clue": "Planta aquática fibrosa usada para produzir as primeiras folhas de escrita.",
        "row": -3,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_1",
        "word": "FARAO",
        "displayWord": "FARAO",
        "clue": "Título do monarca absoluto considerado a encarnação viva dos deuses no Egito.",
        "row": -2,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "MUMIA",
        "displayWord": "MUMIA",
        "clue": "Corpo embalsamado e enfaixado em linho para a preservação pós-morte.",
        "row": -6,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "TUMBA",
        "displayWord": "TUMBA",
        "clue": "Câmara sepulcral ricamente decorada construída para reis e rainhas.",
        "row": -5,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "NILO",
        "displayWord": "NILO",
        "clue": "Rio sagrado cujas cheias periódicas fertilizavam as margens do deserto egípcio.",
        "row": 2,
        "col": 0,
        "direction": "across"
      }
    ]
  },
  {
    "id": "history_03",
    "category": "history",
    "categoryName": "História & Mitologia",
    "categoryIcon": "🏛️",
    "title": "Império Romano & Gladiadores",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_6",
        "word": "GLADIADOR",
        "displayWord": "GLADIADOR",
        "clue": "Guerreiro que combatia nas arenas do Coliseu para entreter o povo romano.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "AQUEDUTO",
        "displayWord": "AQUEDUTO",
        "clue": "Impressionante obra de engenharia de arcos de pedra para transportar água.",
        "row": 0,
        "col": 2,
        "direction": "down"
      },
      {
        "id": "pw_5",
        "word": "IMPERIO",
        "displayWord": "IMPERIO",
        "clue": "Vasto domínio territorial liderado por Augusto após o fim da República.",
        "row": 3,
        "col": -1,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "SENADO",
        "displayWord": "SENADO",
        "clue": "Assembleia política de nobres e patrícios que governava a República Romana.",
        "row": 7,
        "col": -3,
        "direction": "across"
      },
      {
        "id": "pw_3",
        "word": "LEGIAO",
        "displayWord": "LEGIAO",
        "clue": "Principal divisão militar do exército romano composta por milhares de legionários.",
        "row": 6,
        "col": -2,
        "direction": "down"
      },
      {
        "id": "pw_2",
        "word": "CESAR",
        "displayWord": "CESAR",
        "clue": "General romano Júlio, proclamado ditador vitalício antes de ser assassinado.",
        "row": -3,
        "col": 5,
        "direction": "down"
      }
    ]
  },
  {
    "id": "history_04",
    "category": "history",
    "categoryName": "História & Mitologia",
    "categoryIcon": "🏛️",
    "title": "Idade Média & Castelos",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_2",
        "word": "CAVALEIRO",
        "displayWord": "CAVALEIRO",
        "clue": "Guerreiro de armadura montado a cavalo que seguia o código de cavalaria.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "CASTELO",
        "displayWord": "CASTELO",
        "clue": "Fortaleza de pedra murada com fossos que abrigava a nobreza feudal.",
        "row": 0,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "TORNEIO",
        "displayWord": "TORNEIO",
        "clue": "Competição de justas e duelos entre cavaleiros para exibir perícia.",
        "row": 3,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "ESCUDO",
        "displayWord": "ESCUDO",
        "clue": "Peça de proteção com o brasão de armas da família do nobre.",
        "row": 3,
        "col": 4,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "FEUDO",
        "displayWord": "FEUDO",
        "clue": "Propriedade de terras concedida por um suserano ao seu vassalo.",
        "row": 6,
        "col": 2,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "COROA",
        "displayWord": "COROA",
        "clue": "Ornamento dourado adornado com pedras preciosas usado por monarcas.",
        "row": 1,
        "col": -4,
        "direction": "across"
      }
    ]
  },
  {
    "id": "music_01",
    "category": "music",
    "categoryName": "Música & Artes",
    "categoryIcon": "🎵",
    "title": "Rock Clássico & Guitarras",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_1",
        "word": "GUITARRA",
        "displayWord": "GUITARRA",
        "clue": "Instrumento de seis cordas eletrificado com distorção marcante no rock.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "ACUSTICO",
        "displayWord": "ACUSTICO",
        "clue": "Show desplugado onde instrumentos elétricos são substituídos por violões.",
        "row": -2,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "CONCERTO",
        "displayWord": "CONCERTO",
        "clue": "Apresentação ao vivo de músicos para uma grande plateia de fãs.",
        "row": 4,
        "col": 1,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "BATERIA",
        "displayWord": "BATERIA",
        "clue": "Conjunto de tambores e pratos que comanda o ritmo e a pulsação.",
        "row": -2,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_3",
        "word": "BEATLES",
        "displayWord": "BEATLES",
        "clue": "Banda britânica lendária de Liverpool formada por John, Paul, George e Ringo.",
        "row": 2,
        "col": -2,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "SOLO",
        "displayWord": "SOLO",
        "clue": "Momento expressivo na música em que um instrumento se destaca sozinho.",
        "row": 5,
        "col": -2,
        "direction": "across"
      }
    ]
  },
  {
    "id": "music_02",
    "category": "music",
    "categoryName": "Música & Artes",
    "categoryIcon": "🎵",
    "title": "Música Brasileira & Ritmos",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_4",
        "word": "PANDEIRO",
        "displayWord": "PANDEIRO",
        "clue": "Instrumento de percussão indispensável nas rodas de choro e samba.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "CARNAVAL",
        "displayWord": "CARNAVAL",
        "clue": "Maior festa popular do planeta embalada por trios elétricos e escolas de samba.",
        "row": -1,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_5",
        "word": "VIOLAO",
        "displayWord": "VIOLAO",
        "clue": "Instrumento acústico de cordas dedilhadas no coração da MPB.",
        "row": 4,
        "col": 1,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "SAMBA",
        "displayWord": "SAMBA",
        "clue": "Gênero musical e dança símbolo da cultura brasileira nascido no Rio e na Bahia.",
        "row": 3,
        "col": -3,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "BOSSA",
        "displayWord": "BOSSA",
        "clue": "Bossa Nova, movimento harmônico refinado criado por Tom Jobim e João Gilberto.",
        "row": 0,
        "col": -3,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "FORRO",
        "displayWord": "FORRO",
        "clue": "Ritmo nordestino dançado a dois animado pela sanfona, zabumba e triângulo.",
        "row": 3,
        "col": 3,
        "direction": "down"
      }
    ]
  },
  {
    "id": "music_03",
    "category": "music",
    "categoryName": "Música & Artes",
    "categoryIcon": "🎵",
    "title": "Grandes Mestres da Pintura",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_3",
        "word": "MONALISA",
        "displayWord": "MONALISA",
        "clue": "Quadro mais célebre do mundo com o enigmático sorriso exposto no Louvre.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "DAVINCI",
        "displayWord": "DAVINCI",
        "clue": "Gênio renascentista italiano que pintou a Mona Lisa e A Última Ceia.",
        "row": -1,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_2",
        "word": "VANGOGH",
        "displayWord": "VANGOGH",
        "clue": "Pintor pós-impressionista holandês famoso por A Noite Estrelada e Girassóis.",
        "row": 3,
        "col": 1,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "PICASSO",
        "displayWord": "PICASSO",
        "clue": "Mestre espanhol cofundador do cubismo que pintou a impactante Guernica.",
        "row": 5,
        "col": 2,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "TELA",
        "displayWord": "TELA",
        "clue": "Suporte de tecido esticado onde o artista plástico aplica tintas a óleo.",
        "row": -3,
        "col": 7,
        "direction": "down"
      }
    ]
  },
  {
    "id": "music_04",
    "category": "music",
    "categoryName": "Música & Artes",
    "categoryIcon": "🎵",
    "title": "Instrumentos do Mundo",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_4",
        "word": "TROMPETE",
        "displayWord": "TROMPETE",
        "clue": "Instrumento de sopro de metal e pistões essencial no jazz e fanfarras.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "VIOLINO",
        "displayWord": "VIOLINO",
        "clue": "Pequeno instrumento de quatro cordas friccionadas com arco na música clássica.",
        "row": -2,
        "col": 2,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "FLAUTA",
        "displayWord": "FLAUTA",
        "clue": "Instrumento de sopro de tubo oco com orifícios com som doce e melodioso.",
        "row": -4,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "TAMBOR",
        "displayWord": "TAMBOR",
        "clue": "Instrumento de membrana esticada percutida para marcar batidas.",
        "row": 4,
        "col": -2,
        "direction": "across"
      },
      {
        "id": "pw_1",
        "word": "PIANO",
        "displayWord": "PIANO",
        "clue": "Instrumento nobre de teclado com 88 teclas pretas e brancas com cauda acústica.",
        "row": 2,
        "col": 1,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "HARPA",
        "displayWord": "HARPA",
        "clue": "Instrumento angelical com dezenas de cordas verticais dedilhadas.",
        "row": 3,
        "col": -1,
        "direction": "down"
      }
    ]
  },
  {
    "id": "sports_01",
    "category": "sports",
    "categoryName": "Esportes & Games",
    "categoryIcon": "⚽",
    "title": "Futebol & Copas do Mundo",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_1",
        "word": "GOLEIRO",
        "displayWord": "GOLEIRO",
        "clue": "Único jogador autorizado a defender a bola com as mãos dentro da grande área.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "ESTADIO",
        "displayWord": "ESTADIO",
        "clue": "Grande arena esportiva com arquibancadas para milhares de torcedores.",
        "row": 0,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "PENALTI",
        "displayWord": "PENALTI",
        "clue": "Cobrança de falta máxima frontal a 11 metros da linha do gol.",
        "row": 3,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "CAMPEAO",
        "displayWord": "CAMPEAO",
        "clue": "Aquele que vence a final do campeonato e ergue o troféu máximo.",
        "row": -6,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "TROFEU",
        "displayWord": "TROFEU",
        "clue": "Taça dourada concedida ao time vitorioso na celebração do título.",
        "row": -2,
        "col": -3,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "APITO",
        "displayWord": "APITO",
        "clue": "Instrumento sonoro utilizado pelo árbitro para sinalizar faltas e encerrar o jogo.",
        "row": 2,
        "col": 0,
        "direction": "down"
      }
    ]
  },
  {
    "id": "sports_02",
    "category": "sports",
    "categoryName": "Esportes & Games",
    "categoryIcon": "⚽",
    "title": "Jogos Olímpicos & Recordes",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_2",
        "word": "ATLETISMO",
        "displayWord": "ATLETISMO",
        "clue": "Conjunto clássico de provas esportivas de corrida, saltos e arremessos.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "GINASTICA",
        "displayWord": "GINASTICA",
        "clue": "Modalidade acrobática que exige imensa flexibilidade, força e equilíbrio.",
        "row": -3,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_1",
        "word": "MEDALHA",
        "displayWord": "MEDALHA",
        "clue": "Premiação de ouro, prata ou bronze conquistada no pódio dos Jogos.",
        "row": -1,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "NATACAO",
        "displayWord": "NATACAO",
        "clue": "Esporte aquático disputado em estilos como crawl, borboleta, peito e costas.",
        "row": 2,
        "col": -2,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "PODIO",
        "displayWord": "PODIO",
        "clue": "Estrutura elevada de três degraus onde os vencedores recebem homenagens.",
        "row": -2,
        "col": -3,
        "direction": "across"
      }
    ]
  },
  {
    "id": "sports_03",
    "category": "sports",
    "categoryName": "Esportes & Games",
    "categoryIcon": "⚽",
    "title": "Videogames Clássicos & Retrô",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_3",
        "word": "JOYSTICK",
        "displayWord": "JOYSTICK",
        "clue": "Controle direcional com alavanca e botões para comandar o personagem.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "NINTENDO",
        "displayWord": "NINTENDO",
        "clue": "Lendária empresa japonesa pioneira dona de franquias como Mario e Zelda.",
        "row": -1,
        "col": 5,
        "direction": "down"
      },
      {
        "id": "pw_1",
        "word": "CONSOLE",
        "displayWord": "CONSOLE",
        "clue": "Aparelho doméstico dedicado a rodar jogos eletrônicos conectado à TV.",
        "row": -1,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_2",
        "word": "ARCADE",
        "displayWord": "ARCADE",
        "clue": "Máquina de fliperama clássica movida a fichas muito popular nos anos 80 e 90.",
        "row": 5,
        "col": -4,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "FASE",
        "displayWord": "FASE",
        "clue": "Etapa de um jogo que precisa ser superada antes de enfrentar o chefe final.",
        "row": 2,
        "col": -1,
        "direction": "across"
      }
    ]
  },
  {
    "id": "sports_04",
    "category": "sports",
    "categoryName": "Esportes & Games",
    "categoryIcon": "⚽",
    "title": "Xadrez & Jogos de Tabuleiro",
    "author": "CruzadaMaster",
    "difficulty": "Difícil",
    "words": [
      {
        "id": "pw_2",
        "word": "TABULEIRO",
        "displayWord": "TABULEIRO",
        "clue": "Superfície quadriculada de 64 casas alternadas em preto e branco.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "RAINHA",
        "displayWord": "RAINHA",
        "clue": "Peça mais poderosa do xadrez que se move em qualquer direção e distância.",
        "row": -1,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_1",
        "word": "XEQUE",
        "displayWord": "XEQUE",
        "clue": "Aviso de que o Rei adversário está sob ataque iminente de uma peça.",
        "row": -3,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "BISPO",
        "displayWord": "BISPO",
        "clue": "Peça do xadrez que se movimenta exclusivamente pelas diagonais da sua cor.",
        "row": -1,
        "col": 6,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "ROQUE",
        "displayWord": "ROQUE",
        "clue": "Movimento especial de defesa envolvendo simultaneamente o Rei e a Torre.",
        "row": 3,
        "col": 5,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "PEAO",
        "displayWord": "PEAO",
        "clue": "Peça mais numerosa do jogo que avança uma casa e captura na diagonal.",
        "row": -2,
        "col": 2,
        "direction": "across"
      }
    ]
  },
  {
    "id": "lit_01",
    "category": "literature",
    "categoryName": "Literatura & Saber",
    "categoryIcon": "📚",
    "title": "Literatura Brasileira & Livros",
    "author": "CruzadaMaster",
    "difficulty": "Médio",
    "words": [
      {
        "id": "pw_1",
        "word": "MACHADO",
        "displayWord": "MACHADO",
        "clue": "Machado de Assis, mestre da literatura brasileira fundador da ABL e autor de Dom Casmurro.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "ROMANCE",
        "displayWord": "ROMANCE",
        "clue": "Narrativa literária longa em prosa que desenvolve múltiplos personagens e enredos.",
        "row": -2,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "CRONICA",
        "displayWord": "CRONICA",
        "clue": "Texto literário breve e descontraído inspirado em fatos do cotidiano.",
        "row": 0,
        "col": 2,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "POESIA",
        "displayWord": "POESIA",
        "clue": "Arte literária que expressa emoções em versos, estrofes e rimas sonoras.",
        "row": 4,
        "col": -2,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "ENREDO",
        "displayWord": "ENREDO",
        "clue": "Sucessão articulada de acontecimentos que compõe a história de um livro.",
        "row": -2,
        "col": -2,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "AUTOR",
        "displayWord": "AUTOR",
        "clue": "Criador ou escritor de uma obra literária protegida por direitos.",
        "row": 6,
        "col": 2,
        "direction": "across"
      }
    ]
  },
  {
    "id": "lit_02",
    "category": "literature",
    "categoryName": "Literatura & Saber",
    "categoryIcon": "📚",
    "title": "Filosofia & Pensamento",
    "author": "CruzadaMaster",
    "difficulty": "Difícil",
    "words": [
      {
        "id": "pw_1",
        "word": "SOCRATES",
        "displayWord": "SOCRATES",
        "clue": "Filósofo ateniense famoso pelo método socrático e pelo 'Conhece-te a ti mesmo'.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "VERDADE",
        "displayWord": "VERDADE",
        "clue": "Conformidade fiel entre aquilo que se pensa ou afirma e a realidade factual.",
        "row": -2,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "LOGICA",
        "displayWord": "LOGICA",
        "clue": "Estudo formal das leis do pensamento e dos princípios do raciocínio válido.",
        "row": -1,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "DUVIDA",
        "displayWord": "DUVIDA",
        "clue": "Estado de incerteza metodológica utilizado por Descartes para fundamentar o saber.",
        "row": 2,
        "col": -2,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "ETICA",
        "displayWord": "ETICA",
        "clue": "Ramo da filosofia que investiga a moralidade, a justiça e o bem comum.",
        "row": -1,
        "col": 5,
        "direction": "down"
      }
    ]
  },
  {
    "id": "lit_03",
    "category": "literature",
    "categoryName": "Literatura & Saber",
    "categoryIcon": "📚",
    "title": "Contos de Fada & Magia",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_1",
        "word": "FLORESTA",
        "displayWord": "FLORESTA",
        "clue": "Lugar misterioso e encantado onde se passam aventuras de contos clássicos.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "PRINCESA",
        "displayWord": "PRINCESA",
        "clue": "Heroína de vestidos elegantes como Cinderela e Branca de Neve.",
        "row": -1,
        "col": 3,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "FEITICO",
        "displayWord": "FEITICO",
        "clue": "Encantamento lançado por bruxas e magos em lendas mágicas.",
        "row": 0,
        "col": 0,
        "direction": "down"
      },
      {
        "id": "pw_5",
        "word": "CASTELO",
        "displayWord": "CASTELO",
        "clue": "Fortaleza mágica das histórias infantis com altas torres.",
        "row": 3,
        "col": 3,
        "direction": "across"
      },
      {
        "id": "pw_4",
        "word": "COROA",
        "displayWord": "COROA",
        "clue": "Símbolo dourado de realeza na cabeça de monarcas.",
        "row": 6,
        "col": -1,
        "direction": "across"
      },
      {
        "id": "pw_6",
        "word": "MAGIA",
        "displayWord": "MAGIA",
        "clue": "Poder sobrenatural de encantar coisas desafiando as leis naturais.",
        "row": 2,
        "col": -3,
        "direction": "across"
      }
    ]
  },
  {
    "id": "lit_04",
    "category": "literature",
    "categoryName": "Literatura & Saber",
    "categoryIcon": "📚",
    "title": "Expressões & Sabedoria",
    "author": "CruzadaMaster",
    "difficulty": "Fácil",
    "words": [
      {
        "id": "pw_1",
        "word": "PROVERBIO",
        "displayWord": "PROVERBIO",
        "clue": "Ditado popular que transmite ensinamentos e sabedoria através das gerações.",
        "row": 0,
        "col": 0,
        "direction": "across"
      },
      {
        "id": "pw_2",
        "word": "METAFORA",
        "displayWord": "METAFORA",
        "clue": "Figura de linguagem que estabelece uma comparação implícita de significados.",
        "row": -1,
        "col": 4,
        "direction": "down"
      },
      {
        "id": "pw_3",
        "word": "IRONIA",
        "displayWord": "IRONIA",
        "clue": "Expressão em que se diz o oposto do que realmente se quer sugerir com sagacidade.",
        "row": -1,
        "col": 1,
        "direction": "down"
      },
      {
        "id": "pw_6",
        "word": "SONETO",
        "displayWord": "SONETO",
        "clue": "Forma poética clássica com exatos quatorze versos em quartetos e tercetos.",
        "row": 4,
        "col": 3,
        "direction": "across"
      },
      {
        "id": "pw_5",
        "word": "VERSO",
        "displayWord": "VERSO",
        "clue": "Cada uma das linhas individuais que compõem a estrofe de uma poesia.",
        "row": 3,
        "col": 6,
        "direction": "down"
      },
      {
        "id": "pw_4",
        "word": "RIMA",
        "displayWord": "RIMA",
        "clue": "Identidade de sons finais entre palavras nos versos de um poema.",
        "row": 4,
        "col": -2,
        "direction": "across"
      }
    ]
  }
];
