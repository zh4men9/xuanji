import { MODEL_MAPPING } from '@/constants/models';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatCompletionParams {
  apiKey: string;
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
}

// 可重试的HTTP状态码
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

export async function chatCompletion({
  apiKey,
  messages,
  model = 'gpt-4-turbo-preview',
  temperature = 0.7
}: ChatCompletionParams) {
  // 参数校验
  if (!apiKey?.trim()) throw new Error('API密钥不能为空');
  if (!Array.isArray(messages)) throw new Error('messages必须是数组');

  const targetModel = model;
  
  try {
    // 使用代理服务器
    const response = await fetch('https://vercel-gemini.zh4men9.top/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: messages,
        temperature: Math.min(Math.max(temperature, 0), 2)
      }),
      // 添加超时设置
      signal: AbortSignal.timeout(15000) // 15秒超时
    });

    if (!response.ok) {
      // 处理可重试错误
      if (RETRYABLE_STATUS_CODES.has(response.status)) {
        throw new Error(`[Retryable] ${response.status} ${response.statusText}`);
      }

      const error = await response.json();
      throw new Error(error.error?.message || '请求失败');
    }

    const data = await response.json();
    
    // 解析响应
    const answer = data.choices?.[0]?.message?.content || '';
    
    // 提取运势分数和建议
    const scores = extractFortuneScores(answer);
    const advice = extractAdvice(answer);

    return {
      answer,
      fortune: scores,
      advice,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // 如果是超时错误，提供更友好的错误信息
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }
    
    throw new Error(error.message || '调用 AI 服务失败');
  }
}

// 辅助函数：从文本中提取运势分数
function extractFortuneScores(text: string) {
  const defaultScore = 70;
  return {
    overall: extractScore(text, '总体运势') || defaultScore,
    love: extractScore(text, '感情运势') || defaultScore,
    career: extractScore(text, '事业运势') || defaultScore,
    wealth: extractScore(text, '财运') || defaultScore,
    health: extractScore(text, '健康运势') || defaultScore,
  };
}

function extractScore(text: string, type: string): number {
  const regex = new RegExp(`${type}[：:](\\s*)(\\d+)`, 'i');
  const match = text.match(regex);
  return match ? parseInt(match[2]) : 0;
}

function extractAdvice(text: string): string[] {
  const adviceSection = text.split(/建议[：:]/i)[1];
  if (!adviceSection) return ['暂无具体建议'];
  
  return adviceSection
    .split(/[。\n]/)
    .map(advice => advice.trim())
    .filter(advice => advice.length > 0);
}
