"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const TOOLS = [
  { href: "/", label: "首页" },
  { href: "/tools/chat", label: "Chat" },
  { href: "/tools/translate", label: "翻译" },
  { href: "/tools/json", label: "JSON 美化" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)] transition hover:text-[var(--color-accent)]"
        >
          Kang Tools
        </Link>
        <nav className="flex items-center gap-1">
          {TOOLS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[var(--color-surface-elevated)] text-[var(--color-accent)]"
                    : "text-[var(--color-text-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-2 text-[var(--color-text-soft)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)]"
            title={theme === "dark" ? "切换为浅色" : "切换为深色"}
            aria-label={theme === "dark" ? "切换为浅色模式" : "切换为深色模式"}
          >
            {theme === "dark" ? (
              <span className="text-lg leading-none">☀️</span>
            ) : (
              <span className="text-lg leading-none">🌙</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
