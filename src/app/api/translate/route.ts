import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const DEFAULT_MODEL = "gpt-4o-mini";

const LANG_NAMES: Record<string, string> = {
  auto: "源语言（自动检测）",
  zh: "中文",
  en: "英语",
  ja: "日语",
  ko: "韩语",
  fr: "法语",
  de: "德语",
  es: "西班牙语",
  ru: "俄语",
  ar: "阿拉伯语",
};

function buildPrompt(
  text: string,
  sourceLang: string,
  targetLang: string
): string {
  const targetName = LANG_NAMES[targetLang] ?? targetLang;
  const sourceHint =
    sourceLang === "auto"
      ? "（请自动识别源语言）"
      : `从${LANG_NAMES[sourceLang] ?? sourceLang}`;
  return `你是一名专业翻译。请${sourceHint}将下面这段文字翻译成${targetName}，并补充读音、使用场景与简要解释。

要求：严格按以下 JSON 格式输出，不要输出其他内容。若某项不适用可留空字符串。
{
  "result": "译文正文，保留原文换行",
  "pronunciation": "译文的读音（中文可标拼音，英语等可标音标或发音说明，短语/单词必填，长句可选）",
  "usage": "使用场景或例句（1～2 个简短例句或场景说明）",
  "explanation": "简要解释（词义、用法、易混点等，一两句话即可）"
}

原文：
${text}`;
}

function parseTranslateResponse(content: string): {
  result: string;
  pronunciation: string;
  usage: string;
  explanation: string;
} {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const obj = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      return {
        result: typeof obj.result === "string" ? obj.result : "",
        pronunciation: typeof obj.pronunciation === "string" ? obj.pronunciation : "",
        usage: typeof obj.usage === "string" ? obj.usage : "",
        explanation: typeof obj.explanation === "string" ? obj.explanation : "",
      };
    } catch {
      // fallback
    }
  }
  return {
    result: trimmed,
    pronunciation: "",
    usage: "",
    explanation: "",
  };
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
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const sourceLang = typeof body.sourceLang === "string" ? body.sourceLang : "auto";
    const targetLang = typeof body.targetLang === "string" ? body.targetLang : "en";

    if (!text) {
      return NextResponse.json(
        { error: "请输入待翻译文本" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey,
      ...(baseURL && { baseURL }),
    });

    const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
    const prompt = buildPrompt(text, sourceLang, targetLang);

    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });

    const raw =
      completion.choices[0]?.message?.content?.trim() ?? "";
    const parsed = parseTranslateResponse(raw);

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "翻译失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
