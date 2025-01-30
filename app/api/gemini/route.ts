import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiConfig } from '@/lib/config';

// 禁用 Edge Runtime，因为我们需要使用 Node.js 的代理功能
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();

    // 初始化 Gemini 客户端
    const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
    const model = genAI.getGenerativeModel({ 
      model: geminiConfig.model,
      generationConfig: {
        temperature: geminiConfig.temperature,
        topK: geminiConfig.topK,
        topP: geminiConfig.topP,
        maxOutputTokens: geminiConfig.maxOutputTokens,
      }
    });

    // 创建聊天会话
    const chat = model.startChat({
      history: requestData.history || [],
      generationConfig: {
        temperature: geminiConfig.temperature,
        topK: geminiConfig.topK,
        topP: geminiConfig.topP,
        maxOutputTokens: geminiConfig.maxOutputTokens,
      },
    });

    // 生成回答
    const result = await chat.sendMessage(requestData.prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      text,
      history: chat.getHistory()
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: '算命服务暂时不可用，请稍后再试' },
      { status: 500 }
    );
  }
} 