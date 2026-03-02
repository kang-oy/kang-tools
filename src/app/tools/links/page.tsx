"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { AI_LINK_CATEGORIES } from "@/data/ai-links";

interface HotItem {
  title: string;
  url: string;
  source: string;
  id: string | number;
}

const DOMESTIC_HOT_LINKS = [
  { name: "知乎热榜", url: "https://www.zhihu.com/hot" },
  { name: "微博热搜", url: "https://s.weibo.com/top/summary" },
  { name: "今日头条热榜", url: "https://www.toutiao.com/hot-event/hot-board/" },
  { name: "V2EX 最热", url: "https://www.v2ex.com/?tab=hot" },
  { name: "掘金热榜", url: "https://juejin.cn/hot" },
];

export default function LinksPage() {
  const [hot, setHot] = useState<HotItem[]>([]);
  const [hotLoading, setHotLoading] = useState(true);
  const [hotError, setHotError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/hot-list")
      .then((r) => r.json())
      .then((data) => {
        if (data.tech) setHot(data.tech);
        if (data.error) setHotError(data.error);
      })
      .catch(() => setHotError("加载失败"))
      .finally(() => setHotLoading(false));
  }, []);

  return (
    <ToolLayout
      title="AI 与热点"
      description="常用 AI 网站速览，按类型分类；科技热点与国内热榜入口。"
    >
      <div className="space-y-10">
        {/* AI 网站：按文件夹分类 */}
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)] mb-4">
            AI 网站
          </h2>
          <div className="space-y-6">
            {AI_LINK_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden"
              >
                <div className="border-b border-[var(--color-border)] px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
                  {cat.icon && <span>{cat.icon}</span>}
                  {cat.name}
                </div>
                <ul className="grid gap-px bg-[var(--color-border)] p-px sm:grid-cols-2 lg:grid-cols-3">
                  {cat.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-0.5 bg-[var(--color-surface-elevated)] px-4 py-3 hover:bg-[var(--color-surface)] transition group"
                      >
                        <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                          {link.name}
                        </span>
                        {link.desc && (
                          <span className="text-xs text-[var(--color-muted)]">
                            {link.desc}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 热点与新闻 */}
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)] mb-4">
            热点与新闻
          </h2>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden mb-4">
            <div className="border-b border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)]">
              科技热点（Hacker News）
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {hotLoading ? (
                <div className="px-4 py-6 text-sm text-[var(--color-muted)]">
                  加载中…
                </div>
              ) : hotError ? (
                <div className="px-4 py-6 text-sm text-red-400">
                  {hotError}
                </div>
              ) : hot.length === 0 ? (
                <div className="px-4 py-6 text-sm text-[var(--color-muted)]">
                  暂无数据
                </div>
              ) : (
                <ul className="divide-y divide-[var(--color-border)]">
                  {hot.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2.5 text-sm text-[var(--color-text-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)] transition line-clamp-2"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden">
            <div className="border-b border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)]">
              国内热榜入口
            </div>
            <ul className="flex flex-wrap gap-2 p-3">
              {DOMESTIC_HOT_LINKS.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text-soft)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}
