import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// 图片分析工具，固定使用 GLM-4.1V-Thinking-Flash
const IMAGE_ANALYZE_MODEL = "GLM-4.1V-Thinking-Flash";

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
    const contentType = req.headers.get("content-type") ?? "";

    let imageDataUrl: string | null = null;
    let prompt =
      "请用结构化、详细的中文描述这张图片的内容、关键元素、场景信息以及可能的含义。";

    if (contentType.includes("multipart/form-data")) {
      // 支持直接上传图片文件：form-data 中字段名为 file，文本提示可选字段名为 prompt
      const formData = await req.formData();
      const file = formData.get("file");
      const promptFromForm = formData.get("prompt");

      if (typeof promptFromForm === "string" && promptFromForm.trim()) {
        prompt = promptFromForm.trim();
      }

      if (!file || typeof file === "string") {
        return NextResponse.json(
          { error: "请通过字段 file 上传图片文件" },
          { status: 400 }
        );
      }

      const blob = file as Blob;
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mime =
        (blob as File).type ||
        "image/png";

      imageDataUrl = `data:${mime};base64,${base64}`;
    } else {
      // 也支持 JSON 形式：{ imageBase64: "data:...base64...", prompt?: string }
      const body = await req.json();
      if (
        typeof body.prompt === "string" &&
        body.prompt.trim()
      ) {
        prompt = body.prompt.trim();
      }
      if (typeof body.imageBase64 === "string") {
        imageDataUrl = body.imageBase64;
      }
    }

    if (!imageDataUrl) {
      return NextResponse.json(
        {
          error:
            "未收到图片。请使用 multipart/form-data 上传 file 字段，或在 JSON 中提供 imageBase64 字段（data URL 或纯 base64 均可）。",
        },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey,
      ...(baseURL && { baseURL }),
    });

    const completion = await client.chat.completions.create({
      model: IMAGE_ANALYZE_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl,
              },
            },
          ] as any,
        } as any,
      ],
    });

    const content =
      completion.choices[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({
      result: content,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "图片分析失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

