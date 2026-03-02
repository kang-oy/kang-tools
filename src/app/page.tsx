import Link from "next/link";

const chatModel = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const TOOLS = [
  {
    href: "/tools/chat",
    title: "Chat",
    description: `类似 ChatGPT 的对话，当前模型：${chatModel}。`,
    icon: "💬",
  },
  {
    href: "/tools/translate",
    title: "翻译",
    description: "基于大模型的文本翻译，支持多语种与自动检测源语言。",
    icon: "🌐",
  },
  {
    href: "/tools/links",
    title: "AI 与热点",
    description: "AI 网站按类型分类速览，科技热点与国内热榜入口。",
    icon: "🔗",
  },
  {
    href: "/tools/json",
    title: "JSON 美化",
    description: "格式化、压缩 JSON，并提供可视化树形视图。",
    icon: "📋",
  },
  {
    href: "/tools/base64",
    title: "Base64 编解码",
    description: "文本与 Base64 互转，支持 UTF-8，结果可一键复制。",
    icon: "🔐",
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-12">
        <p className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-widest mb-2">
          Tools &amp; Labs
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
          小工具集合
        </h1>
        <p className="mt-2 text-[var(--color-text-soft)] max-w-xl">
          常用小能力与工具，按需使用；想到啥就加啥，纯 vibe coding
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 stagger-reveal">
        {TOOLS.map(({ href, title, description, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="card-glow group block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-5"
            >
              <span className="mb-3 block text-2xl opacity-90 group-hover:opacity-100 transition">{icon}</span>
              <h2 className="font-display font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                {title}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                {description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
