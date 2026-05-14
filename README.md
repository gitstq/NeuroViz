<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.zh-TW.md">繁體中文</a> | <a href="README.en.md">English</a>
</p>

<h1 align="center">🧠 NeuroViz</h1>

<p align="center">
  <strong>交互式 AI 模型架构可视化教学平台</strong><br>
  在浏览器中探索 Transformer、BERT、CNN、RNN 的内部工作原理<br>
  零依赖 · 纯前端 · 开箱即用
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/dependencies-zero-orange" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/browser-any-green" alt="Any Browser">
</p>

---

## 🎉 项目介绍

**NeuroViz** 是一款专为 AI 学习者和开发者打造的交互式模型架构可视化工具。它将复杂的神经网络内部结构转化为直观的可视化界面，让用户能够：

- 🔍 **实时观察** Transformer、BERT、CNN、RNN 等主流架构的每一层如何处理输入数据
- 👁️ **可视化注意力权重**，理解模型如何"关注"输入中的不同部分
- 📊 **投影词嵌入向量**到 2D 空间，直观感受语义关系
- 📚 **内置交互式教程**，从零开始学习深度学习核心概念

### 💡 灵感来源

受 poloclub/transformer-explainer 启发，NeuroViz 采用完全独立自研的纯前端方案，无需任何构建工具和后端依赖，打开浏览器即可使用。

### 🌟 差异化亮点

| 特性 | NeuroViz | 其他方案 |
|------|----------|----------|
| 模型支持 | Transformer + BERT + CNN + RNN | 通常仅支持单一模型 |
| 运行方式 | 零依赖，直接打开 HTML | 需要 Node.js / Python 环境 |
| 注意力可视化 | 多层多头实时切换 | 通常仅展示单层 |
| 教学功能 | 内置 6 节交互式课程 | 无 |
| 导出功能 | SVG / PNG / JSON / CSV / Markdown | 有限 |
| 主题 | 亮色/暗色主题切换 | 通常仅亮色 |

---

## ✨ 核心特性

### 🏗️ 架构可视化
- **4 种模型架构**：Transformer (GPT-2 风格)、BERT Encoder、CNN 文本分类器、RNN 序列模型
- **交互式架构图**：点击任意层查看详细参数和说明
- **逐步执行模式**：逐层观察数据前向传播过程
- **缩放和平移**：自由探索复杂架构

### 👁️ 注意力热力图
- **多层多头切换**：自由选择不同层和注意力头
- **实时统计**：平均注意力、最大注意力、熵值、最强连接
- **悬停提示**：查看任意 token 对的注意力权重
- **一键导出**：导出为高清 PNG 图片

### 📊 词嵌入投影
- **3 种降维模式**：PCA、t-SNE、原始维度
- **交互式探索**：悬停和点击查看 token 详情
- **相似度连线**：自动绘制语义相近 token 的连线

### 📚 交互式教程
- **6 节精选课程**：从 Transformer 基础到 GPT vs BERT 对比
- **即时测验**：每节课配有互动小测验
- **实操引导**：课程中引导用户切换到对应视图进行实践

### 🎨 用户体验
- 🌙 **亮色/暗色主题**：自动记忆偏好
- ⌨️ **键盘快捷键**：`Ctrl+Enter` 快速运行
- 📱 **响应式设计**：适配桌面和平板
- 📥 **多格式导出**：SVG、PNG、JSON、CSV、Markdown

---

## 🚀 快速开始

### 方法一：直接打开（推荐）

```bash
# 克隆仓库
git clone https://github.com/gitstq/NeuroViz.git
cd NeuroViz

# 直接在浏览器中打开 index.html
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

### 方法二：本地服务器

```bash
# 使用 Python
python3 -m http.server 8080

# 或使用 Node.js
npx serve .

# 或使用 PHP
php -S localhost:8080
```

然后访问 `http://localhost:8080`

### 方法三：在线使用

直接访问 [GitHub Pages](https://gitstq.github.io/NeuroViz/)（如已部署）

---

## 📖 详细使用指南

### 基本操作流程

1. **选择模型**：在顶部下拉菜单中选择要探索的模型架构
2. **输入文本**：在左侧面板输入任意文本（默认已填入示例文本）
3. **点击运行**：点击 ▶️ Run 按钮或按 `Ctrl+Enter`
4. **探索可视化**：
   - 切换到 **Architecture** 标签查看模型结构
   - 切换到 **Attention** 标签查看注意力模式
   - 切换到 **Embeddings** 标签查看词嵌入投影
   - 切换到 **Lessons** 标签学习交互式课程

### 逐步执行模式

1. 点击左侧面板的 🔍 **Step Mode** 按钮
2. 使用底部控制栏的 ⏮️ **Prev** / ⏭️ **Next** 按钮逐层执行
3. 或点击 ⏩ **Auto Play** 自动播放前向传播过程

### 导出功能

| 功能 | 格式 | 操作位置 |
|------|------|----------|
| 架构图 | SVG / PNG | Architecture 视图工具栏 |
| 注意力热力图 | PNG | Attention 视图工具栏 |
| 分析报告 | Markdown | 控制台命令 |

---

## 💡 设计思路与迭代规划

### 设计理念

- **教育优先**：每个可视化元素都配有清晰的说明，降低理解门槛
- **零门槛**：无需安装任何依赖，打开浏览器即可使用
- **交互驱动**：通过交互操作（而非被动阅读）来学习抽象概念
- **模块化**：10 个独立 JS 模块，代码结构清晰，易于扩展

### 技术选型

| 选择 | 原因 |
|------|------|
| 纯 HTML/CSS/JS | 零构建依赖，最大化可访问性 |
| Canvas 2D API | 高性能渲染，适合架构图和嵌入投影 |
| CSS Custom Properties | 优雅的主题切换实现 |
| IIFE 模块模式 | 无需打包工具，浏览器原生支持 |

### 后续迭代计划

- [ ] 添加更多模型架构（ViT、Whisper、LLaMA 等）
- [ ] 支持加载真实预训练模型的权重
- [ ] 添加梯度流可视化
- [ ] 支持自定义模型配置（JSON/YAML）
- [ ] 添加更多语言版本的教程
- [ ] 集成 WebGPU 加速渲染
- [ ] 添加协作标注功能

---

## 📦 项目结构

```
NeuroViz/
├── index.html              # 主页面
├── css/
│   ├── style.css           # 全局样式与主题
│   ├── architecture.css    # 架构可视化样式
│   ├── attention.css       # 注意力热力图样式
│   ├── embedding.css       # 嵌入投影样式
│   ├── controls.css        # UI 组件样式
│   └── lessons.css         # 教程页面样式
├── js/
│   ├── utils.js            # 工具函数库
│   ├── models.js           # 模型架构定义
│   ├── tokenizer.js        # 分词器与嵌入生成
│   ├── embedding.js        # 嵌入投影渲染
│   ├── attention.js        # 注意力可视化
│   ├── architecture.js     # 架构图渲染
│   ├── renderer.js         # 渲染器总控
│   ├── lessons.js          # 交互式教程
│   ├── export.js           # 导出工具
│   └── app.js              # 应用主控制器
├── LICENSE                 # MIT 开源协议
└── .gitignore              # Git 忽略配置
```

---

## 🤝 贡献指南

欢迎所有形式的贡献！请遵循以下步骤：

1. **Fork** 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 **Pull Request**

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

### Issue 反馈

发现 Bug 或有功能建议？请 [提交 Issue](https://github.com/gitstq/NeuroViz/issues)。

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源，可自由使用、修改和分发。

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq">gitstq</a>
</p>
