import type { ChatMessage } from '@/types/chat.types';

// 模型映射配置
const MODEL_MAPPING: Record<string, string> = {
  'gpt-3.5-turbo': 'gemini-1.5-flash-8b-latest',
  'gpt-4': 'gemini-1.5-pro-latest',
  'gpt-4o': 'gemini-1.5-flash-latest',
  'gpt-4o-mini': 'gemini-1.5-flash-8b-latest',
  'gpt-4-vision-preview': 'gemini-1.5-flash-latest',
  'gpt-4-turbo': 'gemini-1.5-pro-latest',
  'gpt-4-turbo-preview': 'gemini-2.0-flash-exp'
} as const;

// 可重试的HTTP状态码
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

interface ChatCompletionOptions {
  apiKey: string;
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxRetries?: number;
  initialDelay?: number;
}

export async function chatCompletion({
  apiKey,
  messages,
  model = 'gpt-4-turbo-preview',
  temperature = 0.7,
  maxRetries = 3,
  initialDelay = 1000
}: ChatCompletionOptions) {
  // 参数校验
  if (!apiKey?.trim()) throw new Error('API密钥不能为空');
  if (!Array.isArray(messages)) throw new Error('messages必须是数组');

  // 模型名称转换
  const targetModel = model.startsWith('gemini') 
    ? model 
    : MODEL_MAPPING[model] || 'gemini-1.5-pro-latest';

  // 处理系统消息和用户消息
  const systemMessage = messages.find(msg => msg.role === 'system');
  const userMessages = messages.filter(msg => msg.role !== 'system');

  // 为用户问题添加算命相关的提示词
  const enhancedMessages = userMessages.map(msg => {
    if (msg.role === 'user') {
      return {
        ...msg,
        content: `作为一位专业的算命大师，请用专业的角度分析以下问题，给出详细的解答。请确保回答包含运势分析和具体建议。问题：${msg.content}`
      };
    }
    return msg;
  });

  // 如果有系统消息，将其添加到消息列表开头
  const finalMessages = systemMessage 
    ? [systemMessage, ...enhancedMessages]
    : enhancedMessages;

  let retryCount = 0;
  let delay = initialDelay;

  while (retryCount <= maxRetries) {
    try {
      const response = await fetch('https://vercel-gemini.zh4men9.top/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: targetModel,
          messages: finalMessages,
          temperature: Math.min(Math.max(temperature, 0), 2)
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          _geminiModel: targetModel
        };
      }

      // 处理可重试错误
      if (RETRYABLE_STATUS_CODES.has(response.status)) {
        throw new Error(`[Retryable] ${response.status} ${response.statusText}`);
      }

      // 处理不可重试错误
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API请求失败: ${response.statusText}`
      );

    } catch (error: any) {
      // 最后一次重试后仍然失败
      if (retryCount === maxRetries) {
        throw new Error(`请求失败（重试${maxRetries}次）: ${error.message}`);
      }

      // 非重试类型错误直接抛出
      if (!error.message.includes('[Retryable]')) {
        throw error;
      }

      // 指数退避重试
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
      retryCount++;
    }
  }

  throw new Error('未知错误');
}
