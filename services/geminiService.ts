import { GoogleGenAI, Type } from "@google/genai";
import { GameTheme, PlayerIdentity, StoryNode, GameHistoryItem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storyNodeSchema = {
  type: Type.OBJECT,
  properties: {
    outcomeText: { type: Type.STRING, description: "O que aconteceu como resultado direto da última escolha do jogador. Uma descrição concisa da consequência imediata." },
    storyText: { type: Type.STRING, description: "O texto descrevendo a NOVA CENA e o NOVO DILEMA. Deve ser curto, direto, impactante e em português do Brasil (máximo 4-5 frases)." },
    choices: {
      type: Type.ARRAY,
      description: "Uma lista de 3 opções claras e distintas para o jogador, ou um array vazio se isEnd for true.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Um identificador único para a escolha, ex: 'A', 'B', 'C'." },
          text: { type: Type.STRING, description: "O texto da escolha como será mostrado ao jogador." },
        },
        required: ['id', 'text'],
      },
    },
    imagePrompt: { type: Type.STRING, description: "Uma descrição detalhada para gerar uma imagem de fundo que combine com a atmosfera da cena. Ex: 'sala de interrogatório escura, foco em uma mesa de metal, estilo noir'." },
    soundDescription: { type: Type.STRING, description: "Uma breve descrição do som ambiente para a cena. Ex: 'silêncio tenso, zumbido de lâmpada fluorescente'." },
    isEnd: { type: Type.BOOLEAN, description: "Verdadeiro se esta cena for o final da história, caso contrário, falso." },
    realEventReference: { type: Type.STRING, description: "Apenas se isEnd for true. Uma breve descrição do evento real que inspirou a história (ex: 'Inspirado no desastre de Chernobyl de 1986.'). Se isEnd for false, este campo deve ser omitido ou nulo." }
  },
  required: ['outcomeText', 'storyText', 'choices', 'imagePrompt', 'soundDescription', 'isEnd'],
};

const getSystemInstruction = (theme: GameTheme) => `
Você é um Mestre do Jogo (Game Master) e contador de histórias, especialista em narrativas interativas baseadas no "Efeito Borboleta" com o tema principal de: ${theme}. Sua tarefa é criar histórias onde o jogador é o personagem central e catalisador de eventos baseados em fatos reais.

PRINCÍPIOS:
1.  **Jogador como Protagonista/Antagonista:** O jogador é a pessoa mais importante e o foco de todas as ações. A história é contada da sua perspectiva (segunda pessoa, ex: "Você está em uma sala...").
2.  **Efeito Borboleta (Coerência):** Pequenas escolhas devem ter consequências em cascata. Mantenha a coerência narrativa com o histórico de escolhas fornecido.
3.  **Destino Inevitável:** Às vezes, o destino da história pode convergir de volta para o resultado histórico real, apesar das escolhas, se as ações do jogador forem insuficientes para desviá-lo.
4.  **Base em Fatos Reais (Ficção):** Histórias inspiradas em casos reais, mas SEMPRE ficcionalizadas. NUNCA use nomes reais de pessoas, locais ou datas.
5.  **Tom e Estilo:** Mantenha a tensão e o mistério. A narrativa deve ser em português do Brasil, com textos curtos e impactantes.
6.  **Estrutura de Saída (CRÍTICO):** Você DEVE responder APENAS com um objeto JSON válido que corresponda ao esquema fornecido (StoryNode).
7.  **Fluxo de Texto:** O campo 'outcomeText' deve descrever o que ACONTECEU imediatamente após a última escolha. O campo 'storyText' deve descrever a NOVA CENA e o NOVO DILEMA onde o jogador fará a próxima escolha.
8.  **Nó Final:** Se 'isEnd' for true, 'outcomeText' deve ser o desfecho final da história, 'storyText' deve ser uma frase conclusiva curta (ex: "Seu destino está selado.") e 'choices' deve ser um array vazio [].
9.  **Referência Real no Final:** Apenas no nó final (quando 'isEnd' for true), preencha o campo 'realEventReference' com uma descrição curta e enciclopédica do evento real que inspirou a história. Exemplo: 'Esta história foi inspirada no caso do Zodíaco, um assassino em série não identificado que atuou na Califórnia no final dos anos 1960.' Não use este campo em nenhum outro nó.
`;

const parseGeminiResponse = (text: string): StoryNode | null => {
  try {
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    if (parsed.storyText && Array.isArray(parsed.choices) && parsed.outcomeText) {
      return parsed as StoryNode;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    console.error("Original text:", text);
    return null;
  }
};


export const startStory = async (theme: GameTheme, identity: PlayerIdentity): Promise<StoryNode> => {
  const prompt = `Inicie uma história interativa com o tema '${theme}' para um jogador que se identifica como '${identity}'. Posicione o jogador como o personagem principal. Para este primeiro nó, o 'outcomeText' deve ser uma introdução cinematográfica curta que estabelece a atmosfera. O 'storyText' deve apresentar o dilema inicial, o momento crucial antes da primeira grande decisão. Crie suspense e apresente 3 escolhas que representem o primeiro bater de asas da borboleta.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: getSystemInstruction(theme),
      responseMimeType: "application/json",
      responseSchema: storyNodeSchema,
      temperature: 0.9,
    },
  });

  const storyNode = parseGeminiResponse(response.text);
  if (!storyNode) {
    throw new Error("Falha ao gerar o início da história. A resposta da API não era um JSON válido.");
  }
  return storyNode;
};

export const advanceStory = async (history: GameHistoryItem[], identity: PlayerIdentity, theme: GameTheme): Promise<StoryNode> => {
  const lastItem = history[history.length - 1];
  const simplifiedHistory = history.map(item => `Cenário: "${item.node.storyText.substring(0, 50)}..." | Escolha: "${item.choice.text}"`).join('\n');
  
  const prompt = `
  Continue a história interativa. O jogador se identifica como '${identity}'.
  Histórico de escolhas:
  ${simplifiedHistory}

  A última decisão do jogador foi: "${lastItem.choice.text}".

  Com base nisso, crie a próxima cena:
  - 'outcomeText': Descreva a consequência direta e imediata da escolha "${lastItem.choice.text}". Seja claro sobre o resultado da ação.
  - 'storyText': Descreva a nova situação e o novo dilema que o jogador enfrenta como resultado. Apresente 3 novas escolhas.
  Lembre-se do Efeito Borboleta e do Destino Inevitável. Se este for o final, siga as regras do Nó Final e preencha o campo 'realEventReference'.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: getSystemInstruction(theme),
      responseMimeType: "application/json",
      responseSchema: storyNodeSchema,
      temperature: 0.9,
    },
  });

  const storyNode = parseGeminiResponse(response.text);
  if (!storyNode) {
    throw new Error("Falha ao avançar na história. A resposta da API não era um JSON válido.");
  }
  return storyNode;
};