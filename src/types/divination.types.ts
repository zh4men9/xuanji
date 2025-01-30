/**
 * 算命系统类型定义
 */

export interface IDivinationRequest {
  question: string;          // 用户问题
  birthDateTime?: string;    // 出生日期时间（可选）
  name?: string;            // 姓名（可选）
  gender?: 'male' | 'female' | 'other';  // 性别（可选）
}

export interface IDivinationResponse {
  answer: string;           // AI回答
  fortune: {
    overall: number;        // 总体运势 0-100
    love: number;          // 感情运势 0-100
    career: number;        // 事业运势 0-100
    wealth: number;        // 财运 0-100
    health: number;        // 健康运势 0-100
  };
  advice: string[];        // 建议数组
  timestamp: string;       // 预测时间戳
}

export interface IGeminiConfig {
  apiKey: string;           // Gemini API密钥
  model: string;           // 模型名称
  temperature: number;     // 温度参数
  topK: number;           // Top-K采样参数
  topP: number;           // Top-P采样参数
  maxOutputTokens: number; // 最大输出token数
  maxInputTokens: number;  // 最大输入token数
  responseMimeType: string; // 响应MIME类型
}

export enum EDivinationType {
  GENERAL = 'general',     // 综合运势
  LOVE = 'love',          // 感情运势
  CAREER = 'career',      // 事业运势
  WEALTH = 'wealth',      // 财运
  HEALTH = 'health'       // 健康运势
}

export interface IDivinationHistory {
  id: string;             // 预测记录ID
  userId?: string;        // 用户ID（可选）
  request: IDivinationRequest;
  response: IDivinationResponse;
  type: EDivinationType;
  createdAt: string;      // 创建时间
} 