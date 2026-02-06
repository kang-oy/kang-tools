import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const DEFAULT_MODEL = "gpt-4o-mini";

export async function GET() {
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
  return NextResponse.json({ model });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY 未配置" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { messages } = body as { messages: { role: string; content: string }[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages 必填且为非空数组" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey,
      ...(baseURL && { baseURL }),
    });

    const model = body.model ?? process.env.OPENAI_MODEL ?? DEFAULT_MODEL;

    const stream = await client.chat.completions.create({
      model,
      messages: messages.map((m) => ({
        role: m.role as "system" | "user" | "assistant",
        content: m.content,
      })),
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "请求失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
