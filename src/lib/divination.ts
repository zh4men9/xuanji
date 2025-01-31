import { create } from 'zustand';
import type { IDivinationStore, IDivinationRequest, IChatMessage } from '@/types/divination.types';

export const useDivinationStore = create<IDivinationStore>((set, get) => ({
  isLoading: false,
  error: null,
  currentResponse: null,
  history: [],

  generateDivination: async (request: IDivinationRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      const userMessage: IChatMessage = { role: 'user', content: `
              姓名：${request.name || '未提供'}
              性别：${request.gender || '未提供'}
              出生日期：${request.birthDateTime || '未提供'}
              问题：${request.question}
              
              请扮演一位专业的算命大师，用markdown格式详细解答我的问题。` };

      set({ history: [...get().history, userMessage] });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...get().history, userMessage]
        })
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      const aiMessage: IChatMessage = { role: 'assistant', content: data.answer };

      set({ history: [...get().history, aiMessage] });
      set({ currentResponse: data.answer });
    } catch (error: any) {
      set({ error: error.message || '生成预测结果时出错' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearResult: () => {
    set({ currentResponse: null, error: null });
  },

  clearHistory: () => {
    set({ history: [] });
  },
}));
