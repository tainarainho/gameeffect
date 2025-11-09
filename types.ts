// FIX: Removed self-referential import which caused declaration conflicts.
export type PlayerIdentity = 'Homem' | 'Mulher' | 'Não-binário';

export type GameTheme = 'Clima Ambiental' | 'Crimes Reais' | 'Política Global' | 'Aleatório';

export interface Choice {
  id: string;
  text: string;
}

export interface StoryNode {
  outcomeText: string;
  storyText: string;
  choices: Choice[];
  imagePrompt: string;
  soundDescription: string;
  isEnd: boolean;
  realEventReference?: string;
}

export interface GameHistoryItem {
  node: StoryNode;
  choice: Choice;
}