"use client";

import { useState, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";

function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64(str: string): string {
  const trimmed = str.replace(/\s/g, "");
  const binary = atob(trimmed);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function isValidBase64(str: string): boolean {
  const trimmed = str.replace(/\s/g, "");
  if (trimmed.length % 4) return false;
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(trimmed);
}

type Mode = "encode" | "decode";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    if (mode === "encode") {
      try {
        setOutput(encodeBase64(input));
      } catch (e) {
        setError(e instanceof Error ? e.message : "编码失败");
        setOutput("");
      }
    } else {
      if (!isValidBase64(input)) {
        setError("请输入有效的 Base64 字符串");
        setOutput("");
        return;
      }
      try {
        setOutput(decodeBase64(input));
      } catch (e) {
        setError(e instanceof Error ? e.message : "解码失败，请检查输入是否为合法 Base64");
        setOutput("");
      }
    }
  }, [input, mode]);

  useEffect(() => {
    run();
  }, [run]);

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run();
    }
  }

  return (
    <ToolLayout
      title="Base64 编解码"
      description="将文本与 Base64 互转，支持 UTF-8；结果可一键复制。快捷键：Ctrl/Cmd + Enter 执行。"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[var(--color-text-soft)]">模式</span>
          <div className="flex rounded-lg border border-[var(--color-border)] p-0.5 bg-[var(--color-surface-elevated)]">
            <button
              type="button"
              onClick={() => setMode("encode")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                mode === "encode"
                  ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
                  : "text-[var(--color-text-soft)] hover:text-[var(--color-text)]"
              }`}
            >
              编码
            </button>
            <button
              type="button"
              onClick={() => setMode("decode")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                mode === "decode"
                  ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
                  : "text-[var(--color-text-soft)] hover:text-[var(--color-text)]"
              }`}
            >
              解码
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-soft)]">
            {mode === "encode" ? "原文" : "Base64 字符串"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === "encode" ? "输入要编码的文本…" : "输入要解码的 Base64 字符串…"}
            rows={6}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 font-mono text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-text-soft)]">
              {mode === "encode" ? "Base64 结果" : "解码结果"}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? "已复制" : "复制"}
            </button>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden">
            <pre className="overflow-auto p-4 max-h-[320px] font-mono text-sm text-[var(--color-text-soft)] whitespace-pre-wrap break-all min-h-[120px]">
              {output || (mode === "encode" ? "编码结果将显示在这里" : "解码结果将显示在这里")}
            </pre>
          </div>
        </div>

        <p className="text-xs text-[var(--color-muted)]">
          使用 UTF-8 编码；解码时自动忽略空格与换行。快捷键：Ctrl + Enter（Windows/Linux）或 Cmd + Enter（Mac）执行。
        </p>
      </div>
    </ToolLayout>
  );
}
