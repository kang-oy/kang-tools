"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { MarkdownContent } from "@/components/MarkdownContent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((data) => setModel(data.model ?? null))
      .catch(() => setModel(null));
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  function handleStop() {
    abortRef.current?.abort();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
        signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("无响应流");

      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: acc } : m
          )
        );
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // 用户中断，保留已生成内容，不覆盖为错误
        return;
      }
      const message = err instanceof Error ? err.message : "请求失败";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: `错误: ${message}` } : m
        )
      );
    } finally {
      abortRef.current = null;
      setLoading(false);
    }
  }

  return (
    <ToolLayout
      title="Chat"
      description={model ? `基于 ${model} 大模型的对话` : "基于大模型的对话"}
    >
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div
          ref={listRef}
          className="flex-1 min-h-[360px] max-h-[60vh] overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 && (
            <p className="text-[var(--color-muted)] text-sm text-center py-8">
              输入消息开始对话
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                  m.role === "user"
                    ? "bg-[var(--color-accent)]/20 text-[var(--color-text)]"
                    : "bg-[var(--color-surface-elevated)] text-[var(--color-text-soft)]"
                }`}
              >
                {m.role === "user" ? (
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {m.content}
                  </p>
                ) : (
                  <div className="min-h-[1em]">
                    {m.content ? (
                      <MarkdownContent content={m.content} />
                    ) : loading ? (
                      <span className="text-[var(--color-muted)]">…</span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="border-t border-[var(--color-border)] p-3">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) formRef.current?.requestSubmit();
                }
              }}
              placeholder="输入消息… Shift+Enter 换行"
              disabled={loading}
              rows={1}
              className="flex-1 min-h-[42px] max-h-[200px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-50 resize-y"
            />
            {loading ? (
              <button
                type="button"
                onClick={handleStop}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-soft)] transition hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
              >
                停止
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-accent-dim)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发送
              </button>
            )}
          </div>
        </form>
      </div>
    </ToolLayout>
  );
}
