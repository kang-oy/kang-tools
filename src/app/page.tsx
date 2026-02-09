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
    href: "/tools/json",
    title: "JSON 美化",
    description: "格式化、压缩 JSON，并提供可视化树形视图。",
    icon: "📋",
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-12">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
          小工具集合
        </h1>
        <p className="mt-2 text-[var(--color-text-soft)]">
          常用小能力与工具，按需使用；想到啥就加啥，纯vibe coding
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 stagger-reveal">
        {TOOLS.map(({ href, title, description, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]/40 hover:shadow-[var(--shadow-glow)]"
            >
              <span className="mb-3 block text-2xl opacity-80">{icon}</span>
              <h2 className="font-display font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
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
