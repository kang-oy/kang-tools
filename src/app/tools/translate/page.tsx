"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

const LANG_OPTIONS = [
  { value: "auto", label: "自动检测" },
  { value: "zh", label: "中文" },
  { value: "en", label: "英语" },
  { value: "ja", label: "日语" },
  { value: "ko", label: "韩语" },
  { value: "fr", label: "法语" },
  { value: "de", label: "德语" },
  { value: "es", label: "西班牙语" },
  { value: "ru", label: "俄语" },
  { value: "ar", label: "阿拉伯语" },
] as const;

interface TranslateResult {
  result: string;
  pronunciation: string;
  usage: string;
  explanation: string;
}

const emptyResult: TranslateResult = {
  result: "",
  pronunciation: "",
  usage: "",
  explanation: "",
};

export default function TranslatePage() {
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [sourceText, setSourceText] = useState("");
  const [data, setData] = useState<TranslateResult>(emptyResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleSwap() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang === "auto" ? "zh" : sourceLang);
    setSourceText(data.result);
    setData({ ...emptyResult, result: sourceText });
  }

  async function handleTranslate() {
    const text = sourceText.trim();
    if (!text) return;
    setError(null);
    setLoading(true);
    setData(emptyResult);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error ?? "翻译失败");
      setData({
        result: resData.result ?? "",
        pronunciation: resData.pronunciation ?? "",
        usage: resData.usage ?? "",
        explanation: resData.explanation ?? "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "翻译失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!data.result) return;
    try {
      await navigator.clipboard.writeText(data.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <ToolLayout
      title="翻译"
      description="基于大模型的文本翻译，支持多语种与自动检测源语言。"
    >
      <div className="space-y-4">
        {/* 语言选择栏 */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          >
            {LANG_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSwap}
            className="rounded-lg p-2 text-[var(--color-muted)] transition hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-accent)]"
            title="交换语言"
            aria-label="交换语言"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          >
            {LANG_OPTIONS.filter((o) => o.value !== "auto").map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={loading || !sourceText.trim()}
            className="ml-auto rounded-lg bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-accent-dim)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "翻译中…" : "翻译"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* 左右对照区域 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden">
            <div className="border-b border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)]">
              原文（Enter 翻译，Shift+Enter 换行）
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (sourceText.trim()) handleTranslate();
                }
              }}
              placeholder="请输入文本"
              disabled={loading}
              rows={12}
              className="flex-1 min-h-[240px] resize-y border-0 bg-transparent px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:ring-0 focus:outline-none disabled:opacity-70"
            />
          </div>
          <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)]">
              <span>译文</span>
              {data.result && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded px-2 py-1 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-border)]/50 transition"
                >
                  {copied ? "已复制" : "复制译文"}
                </button>
              )}
            </div>
            <div className="flex-1 min-h-[240px] overflow-y-auto px-4 py-3 space-y-4 text-sm">
              {loading && !data.result ? (
                <span className="text-[var(--color-muted)]">翻译中…</span>
              ) : (
                <>
                  <div className="text-[var(--color-text-soft)] whitespace-pre-wrap">
                    {data.result || "—"}
                  </div>
                  {data.result && (
                    <>
                      {data.pronunciation && (
                        <div>
                          <div className="text-[var(--color-muted)] text-xs mb-0.5">读音</div>
                          <div className="text-[var(--color-text-soft)]">{data.pronunciation}</div>
                        </div>
                      )}
                      {data.usage && (
                        <div>
                          <div className="text-[var(--color-muted)] text-xs mb-0.5">使用场景</div>
                          <div className="text-[var(--color-text-soft)]">{data.usage}</div>
                        </div>
                      )}
                      {data.explanation && (
                        <div>
                          <div className="text-[var(--color-muted)] text-xs mb-0.5">解释</div>
                          <div className="text-[var(--color-text-soft)]">{data.explanation}</div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
