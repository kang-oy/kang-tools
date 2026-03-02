export interface LinkItem {
  name: string;
  url: string;
  desc?: string;
}

export interface LinkCategory {
  id: string;
  name: string;
  icon?: string;
  links: LinkItem[];
}

export const AI_LINK_CATEGORIES: LinkCategory[] = [
  {
    id: "llm",
    name: "大模型 / 对话",
    icon: "💬",
    links: [
      { name: "豆包", url: "https://www.doubao.com/", desc: "字节跳动大模型" },
      { name: "DeepSeek", url: "https://www.deepseek.com/", desc: "深度求索" },
      { name: "Claude", url: "https://claude.ai/", desc: "Anthropic" },
      { name: "ChatGPT", url: "https://chat.openai.com/", desc: "OpenAI" },
      { name: "通义千问", url: "https://tongyi.aliyun.com/", desc: "阿里云" },
      { name: "文心一言", url: "https://yiyan.baidu.com/", desc: "百度" },
      { name: "Kimi", url: "https://kimi.moonshot.cn/", desc: "月之暗面" },
      { name: "智谱清言", url: "https://chatglm.cn/", desc: "智谱 AI" },
      { name: "Gemini", url: "https://gemini.google.com/", desc: "Google" },
      { name: "Copilot", url: "https://copilot.microsoft.com/", desc: "Microsoft" },
    ],
  },
  {
    id: "image",
    name: "AI 绘图 / 图像",
    icon: "🎨",
    links: [
      { name: "Midjourney", url: "https://www.midjourney.com/", desc: "图像生成" },
      { name: "DALL·E", url: "https://openai.com/dall-e-3", desc: "OpenAI 图像" },
      { name: "可灵", url: "https://klingai.kuaishou.com/", desc: "快手视频/图像" },
      { name: "即梦", url: "https://jimeng.jianying.com/", desc: "剪映 AI" },
      { name: "Stable Diffusion", url: "https://stability.ai/", desc: "开源图像" },
      { name: "Ideogram", url: "https://ideogram.ai/", desc: "文字+图像" },
      { name: "Leonardo", url: "https://leonardo.ai/", desc: "游戏/概念图" },
    ],
  },
  {
    id: "tools",
    name: "其他 AI 工具",
    icon: "🛠",
    links: [
      { name: "Cursor", url: "https://cursor.com/", desc: "AI 编程编辑器" },
      { name: "GitHub Copilot", url: "https://github.com/features/copilot", desc: "代码补全" },
      { name: "Notion AI", url: "https://www.notion.so/product/ai", desc: "笔记与写作" },
      { name: "Perplexity", url: "https://www.perplexity.ai/", desc: "AI 搜索" },
      { name: "Phind", url: "https://www.phind.com/", desc: "开发者搜索" },
      { name: "Gamma", url: "https://gamma.app/", desc: "AI 做 PPT" },
      { name: "Runway", url: "https://runwayml.com/", desc: "视频生成" },
      { name: "Sora", url: "https://openai.com/sora", desc: "OpenAI 视频" },
    ],
  },
];
