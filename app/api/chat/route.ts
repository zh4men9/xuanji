import { NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/gemini'
import { z } from 'zod'

// 定义请求参数验证 schema
const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })),
  model: z.string().optional().default('gpt-4-turbo-preview'),
  temperature: z.number().min(0).max(2).optional().default(0.7)
})

export async function POST(req: Request) {
  try {
    // 验证请求参数
    const body = await req.json()
    const validated = requestSchema.safeParse(body)
    
    if (!validated.success) {
      return NextResponse.json(
        { error: '参数错误', details: validated.error.format() },
        { status: 400 }
      )
    }

    // 调用 Gemini 服务
    const result = await chatCompletion({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
      messages: validated.data.messages,
      model: validated.data.model,
      temperature: validated.data.temperature
    })

    // 设置响应头允许 CORS
    return new NextResponse(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: error.message || '服务器错误',
        code: error.code || 'INTERNAL_ERROR'
      },
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
