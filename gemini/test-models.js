import { chatCompletion } from './gemini-api.js';
import { writeFileSync } from 'fs';

const API_KEY = process.env.GEMINI_API_KEY;
const TEST_CASES = [
  // 单轮对话测试
  {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: '你好' }]
  },
  // 多轮对话测试
  {
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'user', content: '你好，我叫zh4men9' },
      { role: 'assistant', content: '你好！有什么可以帮助你的吗？' },
      { role: 'user', content: '请告诉我，我叫什么名字，并解释这个名字' }
    ]
  },
  // 其他模型测试...
];

async function runTests() {
  const results = [];
  const models = [
    'gpt-3.5-turbo',
    'gpt-4',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-vision-preview',
    'gpt-4-turbo',
    'gpt-4-turbo-preview'
  ];

  for (const model of models) {
    // 测试单轮对话
    try {
      const singleTurn = await chatCompletion({
        apiKey: API_KEY,
        model,
        messages: [{ role: 'user', content: `请详细介绍下你自己，包括但不限定于模型名字，你的制造者，你的能力边界等内容` }]
      });
      results.push({
        model,
        type: 'single-turn',
        request: `测试模型 ${model} 的单轮对话`,
        response: singleTurn.choices[0].message.content,
        status: 'success'
      });
    } catch (error) {
      results.push({
        model,
        type: 'single-turn',
        error: error.message,
        status: 'failed'
      });
    }

    // sleep
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 测试多轮对话
    try {
      const multiTurn = await chatCompletion({
        apiKey: API_KEY,
        model,
        messages: [
          { role: 'user', content: '你好，我叫zh4men9' },
          { role: 'assistant', content: '你好！' },
          { role: 'user', content: '请告诉我，我的名字，并做出合理的猜测，并为我取一个更优美的名字' }
        ]
      });
      results.push({
        model,
        type: 'multi-turn',
        request: '多轮对话测试',
        response: multiTurn.choices[0].message.content,
        status: 'success'
      });
    } catch (error) {
      results.push({
        model,
        type: 'multi-turn',
        error: error.message,
        status: 'failed'
      });
    }

    // sleep
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // 保存结果
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(
    `test-results-${timestamp}.json`,
    JSON.stringify(results, null, 2)
  );
  console.log('测试完成，结果已保存');
}

runTests();
