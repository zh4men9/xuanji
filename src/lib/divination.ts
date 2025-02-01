import { create } from 'zustand';
import type { IDivinationStore, IDivinationRequest, IChatMessage, IUserInfo } from '@/types/divination.types';
import { saveChatHistory } from './chat';

/**
 * Gemini API 响应格式示例:
 * {
 *   "id": "chatcmpl-abc123",
 *   "object": "chat.completion",
 *   "created": 1738386140,
 *   "model": "gemini-2.0-flash-exp",
 *   "choices": [
 *     {
 *       "message": {
 *         "role": "assistant",
 *         "content": "AI的回答内容",
 *         "refusal": null
 *       },
 *       "finish_reason": "stop",
 *       "index": 0,
 *       "logprobs": null
 *     }
 *   ],
 *   "_geminiModel": "gemini-2.0-flash-exp"
 * }
 * 
 * 注意: 获取 AI 回答内容需要使用 data.choices[0].message.content
 */

export const useDivinationStore = create<IDivinationStore>((set, get) => ({
  isLoading: false,
  error: null,
  history: [] as IChatMessage[],
  currentResponse: null,
  userInfo: {
    name: '',
    gender: undefined,
    birthDateTime: '',
  } as IUserInfo,
  selectedModel: 'gemini-1.5-pro-latest',

  clearResult: () => set({ currentResponse: null }),

  setUserInfo: (info: Partial<IUserInfo>) => {
    const newInfo = { ...get().userInfo, ...info };
    set({ userInfo: newInfo });
    localStorage.setItem('userInfo', JSON.stringify(newInfo));
  },

  setSelectedModel: (model: string) => set({ selectedModel: model }),

  generateDivination: async (request: IDivinationRequest) => {
    try {
      set({ isLoading: true, error: null });

      const userMessage: IChatMessage = {
        role: 'user',
        content: request.question,
      };

      const systemMessage: IChatMessage = {
        role: 'system',
        content: `你是一位专业的算命大师。用户信息：姓名：${request.name || '未提供'}，性别：${request.gender || '未提供'}，出生日期：${request.birthDateTime || '未提供'}。请用专业、详细的方式回答用户的问题，使用 markdown 格式。`,
      };

      const currentHistory = get().history;
      set({ history: [...currentHistory, userMessage] });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [systemMessage, ...currentHistory, userMessage],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText || '请求失败');
      }

      const data = await response.json();
      const aiMessage: IChatMessage = {
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || '抱歉，我现在无法回答这个问题。',
      };

      // 保存聊天记录到数据库
      await saveChatHistory(
        request.name || 'anonymous',
        request.question,
        aiMessage.content
      );

      set({ history: [...get().history, aiMessage] });
    } catch (error) {
      console.error('Divination Error:', error);
      set({ error: error instanceof Error ? error.message : '生成预测结果时出错' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearHistory: () => {
    set({ history: [] });
  },

  initializeUserInfo: () => {
    try {
      const savedInfo = localStorage.getItem('userInfo');
      if (savedInfo) {
        const parsedInfo = JSON.parse(savedInfo) as IUserInfo;
        set({ userInfo: parsedInfo });
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  },
}));
