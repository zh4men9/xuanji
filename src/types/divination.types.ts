export interface IDivinationRequest {
  question: string;
  name?: string;
  gender?: 'male' | 'female' | 'other';
  birthDateTime?: string;
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

export interface IUserInfo {
  name: string;
  gender?: 'male' | 'female' | 'other';
  birthDateTime: string;
}

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface IDivinationStore {
  setSelectedModel: any;
  selectedModel: any;
  isLoading: boolean;
  error: string | null;
  currentResponse: IDivinationResponse['answer'] | null;
  history: IChatMessage[];
  userInfo: IUserInfo;
  
  setUserInfo: (info: Partial<IUserInfo>) => void;
  generateDivination: (request: IDivinationRequest) => Promise<void>;
  clearResult: () => void;
  clearHistory: () => void;
  initializeUserInfo: () => void;
}