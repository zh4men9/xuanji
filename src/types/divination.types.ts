export interface IDivinationRequest {
  question: string;
  birthDateTime?: string;
  name?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface IFortuneScores {
  // 暂时不需要了，可以删除或者保留
  // overall: number;
  // love: number;
  // career: number;
  // wealth: number;
  // health: number;
}

export interface IDivinationResponse {
  answer: string;
  // fortune: IFortuneScores;
  // advice: string[];
  // timestamp: string;
}

export interface IDivinationStore {
  isLoading: boolean;
  error: string | null;
  currentResponse: IDivinationResponse['answer'] | null;
  history: IChatMessage[];
  generateDivination: (request: IDivinationRequest) => Promise<void>;
  clearResult: () => void;
  clearHistory: () => void;
}

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
} 