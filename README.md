# 玄机(XuanJi) - AI算命系统

基于 Gemini 的智能算命系统，使用 Next.js 14 + React + TypeScript + Chakra UI 构建。

## 功能特点

- 🔮 智能算命：基于 Gemini AI 模型的智能预测
- 📊 运势分析：总体运势、感情、事业、财运、健康多维度分析
- 💫 专业解答：AI 扮演专业算命大师，提供详细解答
- 📱 响应式设计：完美适配各种设备屏幕
- ⚡️ 快速响应：基于 Next.js 14 的高性能应用

## 技术栈

- **框架**: Next.js 14
- **前端**: React 19, TypeScript
- **UI**: Chakra UI
- **状态管理**: Zustand
- **AI**: Google Gemini API
- **部署**: Vercel

## 开始使用

1. 克隆项目
```bash
git clone https://github.com/zh4men9/xuanji.git
cd xuanji
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 添加你的 Gemini API Key
```

4. 启动开发服务器
```bash
pnpm dev
```

5. 访问 http://localhost:3000

## 部署

本项目使用 Vercel 部署。点击下面的按钮一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/zh4men9/xuanji)

## 环境变量

- `NEXT_PUBLIC_GEMINI_API_KEY`: Gemini API 密钥

## 开发规范

- 遵循 TypeScript 严格模式
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 React 函数式组件和 Hooks 最佳实践
- 使用 Chakra UI 组件和主题系统

## 许可证

MIT License
