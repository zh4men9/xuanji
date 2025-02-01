# 玄机(XuanJi) - AI 算命系统

<p align="center">
  <img src="public/logo.png" width="120" alt="玄机AI算命系统 Logo" />
</p>

<h3 align="center">基于 Gemini 的智能算命系统</h3>

<p align="center">
  使用 Next.js 14 + React + TypeScript + Chakra UI 构建
</p>

---

## ✨ 功能特点

- **🔮 智能算命**：基于 Google Gemini AI 模型，提供强大的智能预测能力。
- **📊 多维度运势分析**：
    - **综合运势**：全面解读当日/当年的整体运势。
    - **情感运势**：分析感情发展趋势，提供建议。
    - **事业运势**：解析事业发展，助力职业规划。
    - **财富运势**：预测财运走向，把握投资机会 ( *开发中* )。
    - **健康运势**：关注健康状况，提供养生建议 ( *开发中* )。
- **💫 专业解答**：AI 扮演资深算命大师，提供详细、专业的解答和建议。
- **📝 对话历史记录**：保存您的算命对话历史，方便回顾 ( *开发中* )。
- **📱 响应式设计**：完美适配桌面、平板、手机等各种设备屏幕。
- **⚡️ 快速响应**：基于 Next.js 14 构建，提供卓越的性能和用户体验。

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **前端**: React 19, TypeScript
- **UI 组件库**: Chakra UI
- **状态管理**: Zustand
- **AI 模型**: Google Gemini API
- **代码高亮**: react-syntax-highlighter, prismjs
- **Markdown 解析**: react-markdown, remark-gfm
- **数据库**: Vercel Postgres ( *未来计划* )
- **部署平台**: Vercel

## 🚀 快速开始

1. **克隆项目**

   ```bash
   git clone https://github.com/zh4men9/xuanji.git
   cd xuanji
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **配置环境变量**

   ```bash
   cp .env.example .env.local
   ```
   编辑 `.env.local` 文件，填入你的 Gemini API Key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```

4. **启动开发服务器**

   ```bash
   pnpm dev
   ```

5. **访问**

   打开浏览器，访问 [http://localhost:3000](http://localhost:3000) 即可体验玄机 AI 算命系统。

## 🎯 未来规划 (TODO)

- **用户系统**：
    - 用户注册、登录功能
    - 用户个性化设置
    - 历史记录云端同步
- **更多运势维度**：
    - 健康运势、学业运势等更细致的运势分析
- **更丰富的 AI 模型支持**：
    - 接入更多 AI 模型，提供更精准、多样化的算命结果
- **数据库支持**：
    - 使用 Vercel Postgres 或其他数据库，存储用户数据和历史记录
- **优化用户体验**：
    - 持续优化界面设计和交互体验
    - 增加用户引导和帮助文档
- **国际化支持**：
    - 支持多语言，方便更广泛的用户使用

## ⚙️ 环境变量

- `NEXT_PUBLIC_GEMINI_API_KEY`:  **必须**，Google Gemini API 密钥，用于访问 Gemini AI 模型。

## 📜 开发规范

- **TypeScript 严格模式**:  保证代码质量和可维护性。
- **ESLint & Prettier**:  统一代码风格，提高开发效率。
- **React 函数式组件 & Hooks**:  遵循 React 最新实践。
- **Chakra UI 组件库**:  快速构建美观、易用的用户界面。
- **Git Commit 规范**:  清晰、规范的 Git 提交信息，方便代码 review 和版本管理。

## 📄 许可证

本项目使用 MIT License 开源，您可以自由使用和修改。

---

**感谢使用 玄机(XuanJi) - AI 算命系统！**

**如有任何问题或建议，欢迎通过以下方式联系我：**

- 邮箱: zh4men9@163.com
- 微信: zh4men9

**期待您的反馈和贡献！**
