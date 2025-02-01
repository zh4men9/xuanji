import { NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/gemini'
import { z } from 'zod'
import type { ChatMessage } from '@/types/chat.types'

// 定义请求参数验证 schema
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })),
  model: z.string().optional(),
  temperature: z.number().optional()
})

export async function POST(request: Request) {
  try {
    // 验证请求参数
    const body = await request.json()
    const validated = chatRequestSchema.safeParse(body)
    
    if (!validated.success) {
      return NextResponse.json(
        { 
          error: '请求参数无效',
          details: validated.error.format()
        },
        { status: 400 }
      )
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API 密钥未配置' },
        { status: 500 }
      )
    }

    // 调用 Gemini 服务
    const result = await chatCompletion({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      messages: validated.data.messages,
      model: validated.data.model,
      temperature: validated.data.temperature
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Chat API Error:', error)
    
    // 根据错误类型返回适当的状态码
    if (error.message?.includes('API 密钥无效')) {
      return NextResponse.json(
        { error: 'API 密钥配置错误' },
        { status: 401 }
      )
    }

    if (error.message?.includes('配额已用完')) {
      return NextResponse.json(
        { error: 'API 调用次数已达上限，请稍后再试' },
        { status: 429 }
      )
    }

    if (error.message?.includes('内容被过滤')) {
      return NextResponse.json(
        { error: '您的问题包含敏感内容，请重新组织语言' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 处理 OPTIONS 请求
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
