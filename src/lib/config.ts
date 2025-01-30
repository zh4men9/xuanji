/**
 * Gemini 模型配置
 */
export const geminiConfig = {
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL_NAME || 'gemini-pro',
  temperature: Number(process.env.GEMINI_TEMPERATURE || 0.7),
  topK: Number(process.env.GEMINI_TOP_K || 64),
  topP: Number(process.env.GEMINI_TOP_P || 0.95),
  maxOutputTokens: Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || 65536),
  maxInputTokens: Number(process.env.GEMINI_MAX_INPUT_TOKENS || 30720),
}; 