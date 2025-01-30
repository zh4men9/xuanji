import { GoogleGenerativeAI } from '@google/generative-ai';
import { IGeminiConfig, IDivinationRequest, IDivinationResponse } from '../types/divination.types';
import { fetchWithProxy } from './proxy';
import { geminiConfig } from './config';

// 配置全局 fetch
const originalFetch = globalThis.fetch;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  globalThis.fetch = fetchWithProxy;
}

// 重试装饰器
function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  backoffFactor: number = 1.5,
  initialWait: number = 3000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    let waitTime = initialWait;

    const attempt = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        attempts++;
        console.error(`第 ${attempts} 次调用失败:`, error);

        if (attempts >= maxRetries) {
          reject(error);
          return;
        }

        console.log(`等待 ${waitTime / 1000} 秒后重试...`);
        setTimeout(attempt, waitTime);
        waitTime *= backoffFactor;
      }
    };

    attempt();
  });
}

export class GeminiClient {
  private client: GoogleGenerativeAI;
  private chat: any;
  private history: Array<{ role: string; parts: Array<{ text: string }> }>;

  constructor(config: IGeminiConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.history = [];
    
    // 初始化聊天
    const model = this.client.getGenerativeModel({ 
      model: config.model,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxOutputTokens,
        topK: config.topK,
        topP: config.topP,
      }
    });

    this.chat = model.startChat({
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxOutputTokens,
        topK: config.topK,
        topP: config.topP,
      },
      history: this.history,
    });
  }

  /**
   * 生成算命回答
   * @param request 算命请求
   * @returns 算命响应
   */
  async generateDivination(request: IDivinationRequest): Promise<IDivinationResponse> {
    return retry(async () => {
      try {
        // 构建提示词
        const prompt = this.buildPrompt(request);

        // 添加用户消息到历史记录
        this.history.push({
          role: 'user',
          parts: [{ text: prompt }]
        });

        // 发送消息并获取回答
        const result = await this.chat.sendMessage(prompt);
        const response = result.response;
        const text = response.text();

        // 添加模型回答到历史记录
        this.history.push({
          role: 'model',
          parts: [{ text }]
        });

        // 解析回答
        return this.parseResponse(text);
      } catch (error: any) {
        console.error('Gemini API调用失败:', error);
        
        // 如果是模型不可用错误，给出更具体的提示
        if (error.message?.includes('Model not found') || error.message?.includes('not supported')) {
          throw new Error('当前模型暂时不可用，请检查模型名称或尝试使用 gemini-pro 模型');
        }
        
        throw new Error('算命服务暂时不可用，请稍后再试');
      }
    });
  }

  /**
   * 清除对话历史
   */
  clearHistory() {
    this.history = [];
    // 重新初始化聊天
    const model = this.client.getGenerativeModel({ 
      model: geminiConfig.model,
      generationConfig: {
        temperature: geminiConfig.temperature,
        maxOutputTokens: geminiConfig.maxOutputTokens,
        topK: geminiConfig.topK,
        topP: geminiConfig.topP,
      }
    });

    this.chat = model.startChat({
      generationConfig: {
        temperature: geminiConfig.temperature,
        maxOutputTokens: geminiConfig.maxOutputTokens,
        topK: geminiConfig.topK,
        topP: geminiConfig.topP,
      },
      history: this.history,
    });
  }

  /**
   * 构建提示词
   * @param request 算命请求
   * @returns 提示词
   */
  private buildPrompt(request: IDivinationRequest): string {
    const { question, birthDateTime, name, gender } = request;
    
    let prompt = `作为一个专业的算命大师，请根据以下信息进行分析和预测：\n\n`;
    prompt += `问题：${question}\n`;
    
    if (birthDateTime) {
      prompt += `出生日期时间：${birthDateTime}\n`;
    }
    if (name) {
      prompt += `姓名：${name}\n`;
    }
    if (gender) {
      prompt += `性别：${gender}\n`;
    }

    prompt += `\n请提供以下格式的回答：
1. 详细的分析和预测
2. 各方面运势评分（0-100）：总体运势、感情运势、事业运势、财运、健康运势
3. 具体的建议（3-5条）

请用中文回答，语气要温和专业，回答要有逻辑性和说服力。`;

    return prompt;
  }

  /**
   * 解析API响应
   * @param text API响应文本
   * @returns 格式化的算命响应
   */
  private parseResponse(text: string): IDivinationResponse {
    // 简单的示例解析逻辑，实际项目中需要更复杂的解析
    const lines = text.split('\n');
    const answer = lines[0];
    const advice = lines.filter(line => line.startsWith('- ')).map(line => line.slice(2));

    return {
      answer,
      fortune: {
        overall: Math.floor(Math.random() * 100),
        love: Math.floor(Math.random() * 100),
        career: Math.floor(Math.random() * 100),
        wealth: Math.floor(Math.random() * 100),
        health: Math.floor(Math.random() * 100),
      },
      advice: advice.length > 0 ? advice : ['保持乐观积极的心态', '注意作息规律', '多关注身边的机会'],
      timestamp: new Date().toISOString(),
    };
  }
}
