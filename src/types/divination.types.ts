export interface IDivinationRequest {
  question: string;
  birthDateTime?: string;
  name?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface IFortuneScores {
  overall: number;
  love: number;
  career: number;
  wealth: number;
  health: number;
}

export interface IDivinationResponse {
  answer: string;
  fortune: IFortuneScores;
  advice: string[];
  timestamp: string;
}

export interface IDivinationStore {
  isLoading: boolean;
  error: string | null;
  currentResponse: IDivinationResponse | null;
  generateDivination: (request: IDivinationRequest) => Promise<void>;
  clearResult: () => void;
} 