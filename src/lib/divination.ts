import { create } from 'zustand';
import type { IDivinationStore, IDivinationRequest } from '@/types/divination.types';

export const useDivinationStore = create<IDivinationStore>((set) => ({
  isLoading: false,
  error: null,
  currentResponse: null,

  generateDivination: async (request: IDivinationRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `请扮演一位专业的算命大师，为我解答以下问题。
              姓名：${request.name || '未提供'}
              性别：${request.gender || '未提供'}
              出生日期：${request.birthDateTime || '未提供'}
              问题：${request.question}
              
              请从以下几个方面进行分析：
              1. 总体运势（0-100分）
              2. 感情运势（0-100分）
              3. 事业运势（0-100分）
              4. 财运（0-100分）
              5. 健康运势（0-100分）
              
              并给出具体建议。`
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      set({ currentResponse: data });
    } catch (error: any) {
      set({ error: error.message || '生成预测结果时出错' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearResult: () => {
    set({ currentResponse: null, error: null });
  },
}));
