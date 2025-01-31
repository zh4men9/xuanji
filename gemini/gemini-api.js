/**
 * Gemini API 客户端实现
 * 
 * 功能特性：
 * 1. 自动模型映射：将通用模型名称映射到实际Gemini模型
 * 2. 指数退避重试机制：提高API调用可靠性
 * 3. 完整类型检查：确保请求参数有效性
 * 4. 错误处理：规范化错误输出
 * 
 * 模型映射关系：
 * | 请求模型            | 实际调用模型                 |
 * |-------------------|---------------------------|
 * | gpt-3.5-turbo      | gemini-1.5-flash-8b-latest |
 * | gpt-4              | gemini-1.5-pro-latest      |
 * | gpt-4o             | gemini-1.5-flash-latest    |
 * | gpt-4o-mini        | gemini-1.5-flash-8b-latest |
 * | gpt-4-vision-preview | gemini-1.5-flash-latest    |
 * | gpt-4-turbo        | gemini-1.5-pro-latest      |
 * | gpt-4-turbo-preview| gemini-2.0-flash-exp       |
 * | gemini*            | 保持原模型名称                |
 */

// 模型映射配置
const MODEL_MAPPING = {
  'gpt-3.5-turbo': 'gemini-1.5-flash-8b-latest',
  'gpt-4': 'gemini-1.5-pro-latest',
  'gpt-4o': 'gemini-1.5-flash-latest',
  'gpt-4o-mini': 'gemini-1.5-flash-8b-latest',
  'gpt-4-vision-preview': 'gemini-1.5-flash-latest',
  'gpt-4-turbo': 'gemini-1.5-pro-latest',
  'gpt-4-turbo-preview': 'gemini-2.0-flash-exp'
};

// 可重试的HTTP状态码
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

/**
 * 带重试机制的Gemini聊天补全API
 * @param {Object} params 请求参数
 * @param {string} params.apiKey API密钥
 * @param {string} params.model 请求模型名称
 * @param {Array} params.messages 消息历史
 * @param {number} [params.temperature=0.7] 生成温度
 * @param {number} [maxRetries=3] 最大重试次数
 * @param {number} [initialDelay=1000] 初始重试延迟(ms)
 * @returns {Promise<Object>} API响应
 * @throws {Error} 包含错误信息的异常
 * 
 * @example 单轮对话示例
 * // 简单问答场景
 * const response = await chatCompletion({
 *   apiKey: 'your-api-key',
 *   model: 'gpt-3.5-turbo',
 *   messages: [
 *     { role: 'user', content: '如何学习JavaScript？' }
 *   ],
 *   temperature: 0.5
 * });
 * console.log(response.choices[0].message.content);
 * 
 * @example 多轮对话示例
 * // 上下文保持对话
 * const conversation = await chatCompletion({
 *   apiKey: 'your-api-key',
 *   model: 'gpt-4-turbo-preview',
 *   messages: [
 *     { role: 'user', content: '帮我写一个Python的快速排序实现' },
 *     { role: 'assistant', content: '当然，以下是快速排序的实现...' },
 *     { role: 'user', content: '能否添加详细注释说明每一步的作用？' }
 *   ],
 *   maxRetries: 5 // 增加重试次数
 * });
 * console.log(conversation.choices[0].message.content);
 */
export async function chatCompletion({
  apiKey,
  model,
  messages,
  temperature = 0.7,
  maxRetries = 3,
  initialDelay = 1000
}) {
  // 参数校验
  if (!apiKey?.trim()) throw new Error('API密钥不能为空');
  if (!model?.trim()) throw new Error('模型名称不能为空');
  if (!Array.isArray(messages)) throw new Error('messages必须是数组');

  // 模型名称转换
  const targetModel = model.startsWith('gemini') 
    ? model 
    : MODEL_MAPPING[model] || 'gemini-1.5-flash-latest';

  const endpoint = 'https://vercel-gemini.zh4men9.top/v1/chat/completions';
  let retryCount = 0;
  let delay = initialDelay;

  while (retryCount <= maxRetries) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: targetModel,
          messages,
          temperature: Math.min(Math.max(temperature, 0), 2)
        })
      });

      // 处理成功响应
      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          _geminiModel: targetModel // 返回实际使用的模型
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

    } catch (error) {
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

  throw new Error('未知错误'); // 理论上不会执行到这里
}

// 导出模型映射供外部使用
export const SUPPORTED_MODELS = Object.keys(MODEL_MAPPING);