import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const { name, occasion, category } = await req.json()

  if (!name || !occasion) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `Write a warm, short and personal greeting message (2-3 sentences max) for someone named "${name}" on the occasion of "${occasion}" (${category} holiday).
Make it heartfelt, use their name, and keep it suitable for sharing on WhatsApp.
Return only the message text, nothing else.`

  try {
    const result = await model.generateContent(prompt)
    const message = result.response.text()
    return NextResponse.json({ message })
  } catch {
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
