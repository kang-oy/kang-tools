# Kang Tools

基于 Next.js 的小工具与小能力集合，支持持续扩展新工具。

## 环境要求

- Node.js 18+
- 部分工具需配置环境变量（见下方）

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境变量示例并填写（Chat 工具需要）
cp .env.local.example .env.local

# 开发
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## 环境变量（Chat 工具）

在项目根目录创建 `.env.local`，例如：

```env
# OpenAI API（必填）
OPENAI_API_KEY=sk-...

# 可选，默认 https://api.openai.com/v1；若使用代理或自建可改
OPENAI_BASE_URL=https://api.openai.com/v1

# 可选，默认 gpt-4o-mini；可改为 gpt-4o、gpt-4、Qwen3-8B 等
OPENAI_MODEL=gpt-4o-mini
```

## 已实现工具

1. **Chat** (`/tools/chat`)  
   类 ChatGPT 对话，流式输出，使用 OpenAI API。API Key 与 Base URL 从环境变量读取。

2. **JSON 美化** (`/tools/json`)  
   - 格式化：缩进 2 空格  
   - 压缩：单行  
   - 树形视图：可折叠的键值树，类型高亮（键、字符串、数字、布尔、null）

## 项目结构（便于扩展）

- `src/app/page.tsx` — 首页工具列表
- `src/app/tools/<name>/page.tsx` — 各工具页面
- `src/app/api/` — 后端 API（如 Chat 的 `/api/chat`）
- `src/components/` — 通用组件：`Nav`、`ToolLayout`、`JsonTree`
- `src/app/globals.css` — 全局样式与 CSS 变量（主题、字体）

新增工具时：在 `Nav` 和首页 `TOOLS` 中增加一项，再在 `src/app/tools/` 下新增对应页面即可。
