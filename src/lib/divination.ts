import { create } from 'zustand';
import { GeminiClient } from './gemini';
import { geminiConfig } from './config';
import { 
  IDivinationRequest, 
  IDivinationResponse, 
  IDivinationHistory,
  EDivinationType 
} from '../types/divination.types';

// 状态接口定义
interface DivinationState {
  isLoading: boolean;
  currentRequest: IDivinationRequest | null;
  currentResponse: IDivinationResponse | null;
  history: IDivinationHistory[];
  error: string | null;
  
  // 动作
  startDivination: (request: IDivinationRequest, type: EDivinationType) => Promise<void>;
  clearCurrentResult: () => void;
  clearError: () => void;
  loadHistory: () => void;
}

// 最大历史记录数
const MAX_HISTORY_SIZE = 10;

// 创建Gemini客户端实例
const geminiClient = new GeminiClient({
  apiKey: geminiConfig.apiKey,
  model: geminiConfig.model,
  temperature: geminiConfig.temperature,
  topK: geminiConfig.topK,
  topP: geminiConfig.topP,
  maxOutputTokens: geminiConfig.maxOutputTokens,
  maxInputTokens: geminiConfig.maxInputTokens,
  responseMimeType: 'text/plain',
});

// 创建状态管理store
export const useDivinationStore = create<DivinationState>((set, get) => ({
  isLoading: false,
  currentRequest: null,
  currentResponse: null,
  history: [],
  error: null,

  // 开始算命
  startDivination: async (request: IDivinationRequest, type: EDivinationType) => {
    try {
      set({ isLoading: true, error: null });

      // 调用Gemini API获取预测结果
      const response = await geminiClient.generateDivination(request);

      // 创建历史记录
      const historyItem: IDivinationHistory = {
        id: crypto.randomUUID(),
        request,
        response,
        type,
        createdAt: new Date().toISOString(),
      };

      // 更新状态，限制历史记录数量
      set(state => ({
        isLoading: false,
        currentRequest: request,
        currentResponse: response,
        history: [historyItem, ...state.history].slice(0, MAX_HISTORY_SIZE),
      }));

      // 保存到本地存储
      try {
        const history = [historyItem, ...get().history].slice(0, MAX_HISTORY_SIZE);
        localStorage.setItem('divination_history', JSON.stringify(history));
      } catch (e) {
        console.error('保存历史记录失败:', e);
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '算命过程出现未知错误' 
      });
    }
  },

  // 清除当前结果
  clearCurrentResult: () => {
    set({ 
      currentRequest: null, 
      currentResponse: null,
      history: [],
    });
    // 清除本地存储
    try {
      localStorage.removeItem('divination_history');
    } catch (e) {
      console.error('清除历史记录失败:', e);
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 加载历史记录
  loadHistory: () => {
    try {
      const savedHistory = localStorage.getItem('divination_history');
      if (savedHistory) {
        const history = JSON.parse(savedHistory) as IDivinationHistory[];
        set({ 
          history,
          currentRequest: history[0]?.request || null,
          currentResponse: history[0]?.response || null,
        });
      }
    } catch (e) {
      console.error('加载历史记录失败:', e);
    }
  },
}));

// 工具函数：格式化运势评分
export const formatFortuneScore = (score: number): string => {
  if (score >= 90) return '大吉';
  if (score >= 80) return '吉';
  if (score >= 70) return '小吉';
  if (score >= 60) return '平';
  if (score >= 50) return '小凶';
  return '凶';
};

// 工具函数：获取运势颜色
export const getFortuneColor = (score: number): string => {
  if (score >= 90) return 'red.500';
  if (score >= 80) return 'orange.500';
  if (score >= 70) return 'yellow.500';
  if (score >= 60) return 'green.500';
  if (score >= 50) return 'blue.500';
  return 'purple.500';
};

// 工具函数：生成运势描述
export const generateFortuneDescription = (fortune: IDivinationResponse['fortune']): string => {
  const descriptions = [
    `总体运势${formatFortuneScore(fortune.overall)}`,
    `感情运势${formatFortuneScore(fortune.love)}`,
    `事业运势${formatFortuneScore(fortune.career)}`,
    `财运${formatFortuneScore(fortune.wealth)}`,
    `健康运势${formatFortuneScore(fortune.health)}`,
  ];

  return descriptions.join('，');
}; 