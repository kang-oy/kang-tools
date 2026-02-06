"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonTree } from "@/components/JsonTree";

type ViewMode = "tree" | "raw";

export default function JsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("tree");

  const parseJson = useCallback((): unknown => {
    try {
      return JSON.parse(input || "null");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "解析失败";
      setError(msg);
      return null;
    }
  }, [input]);

  function handleFormat() {
    setError(null);
    try {
      const parsed = JSON.parse(input || "null");
      setOutput(JSON.stringify(parsed, null, 2));
      setViewMode("raw");
    } catch (e) {
      setError(e instanceof Error ? e.message : "无效 JSON");
      setOutput("");
    }
  }

  function handleCompress() {
    setError(null);
    try {
      const parsed = JSON.parse(input || "null");
      setOutput(JSON.stringify(parsed));
      setViewMode("raw");
    } catch (e) {
      setError(e instanceof Error ? e.message : "无效 JSON");
      setOutput("");
    }
  }

  function handleTree() {
    setError(null);
    const parsed = parseJson();
    if (parsed !== null) {
      setOutput(JSON.stringify(parsed));
      setViewMode("tree");
    } else {
      setOutput("");
    }
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
  }

  const parsedForTree = (() => {
    if (viewMode !== "tree" || !output) return null;
    try {
      return JSON.parse(output);
    } catch {
      return null;
    }
  })();

  return (
    <ToolLayout
      title="JSON 美化"
      description="格式化、压缩 JSON，或使用树形视图查看结构。"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-soft)]">
            输入 JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "example", "count": 1}'
            rows={8}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 font-mono text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-elevated)]"
          >
            格式化
          </button>
          <button
            type="button"
            onClick={handleCompress}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-elevated)]"
          >
            压缩
          </button>
          <button
            type="button"
            onClick={handleTree}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-elevated)]"
          >
            树形视图
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {(output || parsedForTree) && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text-soft)]">
                输出
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "tree" ? "raw" : "tree")}
                  className="text-xs text-[var(--color-accent)] hover:underline"
                >
                  {viewMode === "tree" ? "切换为文本" : "切换为树形"}
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded bg-[var(--color-surface-elevated)] px-2 py-1 text-xs text-[var(--color-text-soft)] hover:text-[var(--color-accent)]"
                >
                  复制
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden">
              {viewMode === "tree" && parsedForTree !== null ? (
                <div className="overflow-auto p-4 max-h-[480px]">
                  <JsonTree data={parsedForTree} />
                </div>
              ) : (
                <pre className="overflow-auto p-4 max-h-[480px] font-mono text-sm text-[var(--color-text-soft)] whitespace-pre-wrap break-all">
                  {output}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
