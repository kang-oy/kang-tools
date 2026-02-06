"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const proseClass =
  "text-sm text-[var(--color-text-soft)] leading-relaxed [&_*]:break-words " +
  "[&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:first:mt-0 " +
  "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1.5 " +
  "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 " +
  "[&_p]:my-1.5 [&_p:first]:mt-0 [&_p:last]:mb-0 " +
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 " +
  "[&_li]:my-0.5 " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-accent)]/50 [&_blockquote]:pl-3 [&_blockquote]:my-2 [&_blockquote]:text-[var(--color-muted)] " +
  "[&_code]:font-mono [&_code]:text-xs [&_code]:bg-[var(--color-bg)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[var(--color-accent)] " +
  "[&_pre]:my-2 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:bg-[var(--color-bg)] [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[var(--color-text-soft)] " +
  "[&_a]:text-[var(--color-accent)] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80 " +
  "[&_hr]:border-[var(--color-border)] [&_hr]:my-3 " +
  "[&_table]:w-full [&_table]:my-2 [&_th]:text-left [&_th]:font-medium [&_th]:py-1.5 [&_th]:pr-2 [&_td]:py-1.5 [&_td]:pr-2 [&_td]:border-t [&_td]:border-[var(--color-border)] " +
  "[&_strong]:font-semibold [&_strong]:text-[var(--color-text)] " +
  "[&_tr]:border-b [&_tr]:border-[var(--color-border)]";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className={proseClass}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
