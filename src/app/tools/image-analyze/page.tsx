"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { MarkdownContent } from "@/components/MarkdownContent";

interface AnalyzeResult {
  result: string;
}

export default function ImageAnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(
    "请帮我详细分析这张图片中的内容、结构、场景信息和可能的意图。"
  );
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  function handleFileChange(files: FileList | null) {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) {
      setError("仅支持图片文件（jpg/png/webp 等）");
      return;
    }
    setError(null);
    setFile(f);
    setResult("");
    const url = URL.createObjectURL(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }

  async function handleAnalyze() {
    if (!file) {
      setError("请先上传一张图片");
      return;
    }
    setError(null);
    setLoading(true);
    setResult("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (prompt.trim()) formData.append("prompt", prompt.trim());

      const res = await fetch("/api/image-analyze", {
        method: "POST",
        body: formData,
      });

      const data: AnalyzeResult & { error?: string } = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "图片分析失败");
      }

      setResult(data.result ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "图片分析失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout
      title="图片理解"
      description="基于 GLM-4.1V-Thinking-Flash 的图片内容分析，可理解场景、结构与细节。"
    >
      <div className="space-y-6">
        {/* 上传区域 + 提示词 */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div
            className={`relative flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed px-4 py-10 sm:px-6 cursor-pointer bg-[var(--color-surface-elevated)]/80 transition 
            ${dragOver ? "border-[var(--color-accent)] bg-[var(--color-surface-elevated)]" : "border-[var(--color-border)] hover:border-[var(--color-accent)]/60"}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFileChange(e.dataTransfer.files);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-border-subtle)] text-[var(--color-accent)] shadow-sm">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M8.5 14.5L11 11.5L14.5 15.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9"
                    cy="9"
                    r="1.2"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  拖拽图片到此处，或点击选择
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  支持常见图片格式，单张上传即可。
                </p>
              </div>
              {file && (
                <p className="text-xs text-[var(--color-text-soft)] truncate max-w-full">
                  已选择：{file.name}
                </p>
              )}
            </div>
            {previewUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewExpanded(true);
                }}
                className="mt-6 w-full max-w-sm overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-sm cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
              >
                <img
                  src={previewUrl}
                  alt="预览"
                  className="block w-full h-48 object-cover"
                />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
              分析指令
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="flex-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y min-h-[120px]"
            />
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="mt-1 inline-flex items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] shadow-sm transition hover:bg-[var(--color-accent-dim)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "分析中…" : "开始分析"}
            </button>
            {error && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* 结果区域 */}
        <div
          ref={resultRef}
          className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/90 px-4 py-4 sm:px-6 sm:py-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
                分析结果
              </p>
              <p className="text-sm text-[var(--color-text-soft)]">
                来自 GLM-4.1V-Thinking-Flash 的图片解释
              </p>
            </div>
          </div>
          <div className="min-h-[120px] text-sm leading-relaxed text-[var(--color-text-soft)]">
            {loading && !result && (
              <span className="text-[var(--color-muted)]">分析中…</span>
            )}
            {!loading && !result && (
              <span className="text-[var(--color-muted)]">
                上传图片并点击「开始分析」，这里将展示结构化的文字说明、细节拆解和场景理解。
              </span>
            )}
            {result && <MarkdownContent content={result} />}
          </div>
        </div>

        {previewExpanded && previewUrl && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewExpanded(false)}
          >
            <div
              className="relative max-w-4xl max-h-[85vh] mx-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewExpanded(false)}
                className="absolute right-3 top-3 rounded-full bg-black/40 text-[var(--color-text)] hover:bg-black/60 px-2 py-1 text-xs font-medium"
              >
                关闭预览
              </button>
              <img
                src={previewUrl}
                alt="大图预览"
                className="block max-h-[85vh] w-auto object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

