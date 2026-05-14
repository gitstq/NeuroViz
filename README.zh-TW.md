<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.zh-TW.md">繁體中文</a> | <a href="README.en.md">English</a>
</p>

<h1 align="center">🧠 NeuroViz</h1>

<p align="center">
  <strong>互動式 AI 模型架構視覺化教學平台</strong><br>
  在瀏覽器中探索 Transformer、BERT、CNN、RNN 的內部工作原理<br>
  零依賴 · 純前端 · 開箱即用
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/dependencies-zero-orange" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/browser-any-green" alt="Any Browser">
</p>

---

## 🎉 專案介紹

**NeuroViz** 是一款專為 AI 學習者和開發者打造的互動式模型架構視覺化工具。它將複雜的神經網路內部結構轉化為直觀的視覺化介面，讓使用者能夠：

- 🔍 **即時觀察** Transformer、BERT、CNN、RNN 等主流架構的每一層如何處理輸入資料
- 👁️ **視覺化注意力權重**，理解模型如何「關注」輸入中的不同部分
- 📊 **投影詞嵌入向量**到 2D 空間，直觀感受語義關係
- 📚 **內建互動式教程**，從零開始學習深度學習核心概念

### 💡 靈感來源

受 poloclub/transformer-explainer 啟發，NeuroViz 採用完全獨立自研的純前端方案，無需任何建置工具和後端依賴，打開瀏覽器即可使用。

### 🌟 差異化亮點

| 特性 | NeuroViz | 其他方案 |
|------|----------|----------|
| 模型支援 | Transformer + BERT + CNN + RNN | 通常僅支援單一模型 |
| 執行方式 | 零依賴，直接開啟 HTML | 需要 Node.js / Python 環境 |
| 注意力視覺化 | 多層多頭即時切換 | 通常僅展示單層 |
| 教學功能 | 內建 6 節互動式課程 | 無 |
| 匯出功能 | SVG / PNG / JSON / CSV / Markdown | 有限 |
| 主題 | 亮色/暗色主題切換 | 通常僅亮色 |

---

## ✨ 核心特性

### 🏗️ 架構視覺化
- **4 種模型架構**：Transformer (GPT-2 風格)、BERT Encoder、CNN 文字分類器、RNN 序列模型
- **互動式架構圖**：點擊任意層查看詳細參數和說明
- **逐步執行模式**：逐層觀察資料前向傳播過程
- **縮放和平移**：自由探索複雜架構

### 👁️ 注意力熱力圖
- **多層多頭切換**：自由選擇不同層和注意力頭
- **即時統計**：平均注意力、最大注意力、熵值、最強連接
- **懸停提示**：查看任意 token 對的注意力權重
- **一鍵匯出**：匯出為高畫質 PNG 圖片

### 📊 詞嵌入投影
- **3 種降維模式**：PCA、t-SNE、原始維度
- **互動式探索**：懸停和點擊查看 token 詳情
- **相似度連線**：自動繪製語義相近 token 的連線

### 📚 互動式教程
- **6 節精選課程**：從 Transformer 基礎到 GPT vs BERT 對比
- **即時測驗**：每節課配有互動小測驗
- **實作引導**：課程中引導使用者切換到對應視圖進行實踐

### 🎨 使用者體驗
- 🌙 **亮色/暗色主題**：自動記憶偏好
- ⌨️ **鍵盤快捷鍵**：`Ctrl+Enter` 快速執行
- 📱 **響應式設計**：適配桌面和平板
- 📥 **多格式匯出**：SVG、PNG、JSON、CSV、Markdown

---

## 🚀 快速開始

### 方法一：直接開啟（推薦）

```bash
# 克隆倉庫
git clone https://github.com/gitstq/NeuroViz.git
cd NeuroViz

# 直接在瀏覽器中開啟 index.html
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

### 方法二：本地伺服器

```bash
# 使用 Python
python3 -m http.server 8080

# 或使用 Node.js
npx serve .

# 或使用 PHP
php -S localhost:8080
```

然後訪問 `http://localhost:8080`

---

## 📖 詳細使用指南

### 基本操作流程

1. **選擇模型**：在頂部下拉選單中選擇要探索的模型架構
2. **輸入文字**：在左側面板輸入任意文字（預設已填入範例文字）
3. **點擊執行**：點擊 ▶️ Run 按鈕或按 `Ctrl+Enter`
4. **探索視覺化**：
   - 切換到 **Architecture** 標籤查看模型結構
   - 切換到 **Attention** 標籤查看注意力模式
   - 切換到 **Embeddings** 標籤查看詞嵌入投影
   - 切換到 **Lessons** 標籤學習互動式課程

### 逐步執行模式

1. 點擊左側面板的 🔍 **Step Mode** 按鈕
2. 使用底部控制欄的 ⏮️ **Prev** / ⏭️ **Next** 按鈕逐層執行
3. 或點擊 ⏩ **Auto Play** 自動播放前向傳播過程

### 匯出功能

| 功能 | 格式 | 操作位置 |
|------|------|----------|
| 架構圖 | SVG / PNG | Architecture 視圖工具列 |
| 注意力熱力圖 | PNG | Attention 視圖工具列 |
| 分析報告 | Markdown | 控制台命令 |

---

## 💡 設計思路與迭代規劃

### 設計理念

- **教育優先**：每個視覺化元素都配有清晰的說明，降低理解門檻
- **零門檻**：無需安裝任何依賴，打開瀏覽器即可使用
- **互動驅動**：透過互動操作（而非被動閱讀）來學習抽象概念
- **模組化**：10 個獨立 JS 模組，程式碼結構清晰，易於擴展

### 技術選型

| 選擇 | 原因 |
|------|------|
| 純 HTML/CSS/JS | 零建置依賴，最大化可訪問性 |
| Canvas 2D API | 高效能渲染，適合架構圖和嵌入投影 |
| CSS Custom Properties | 優雅的主題切換實現 |
| IIFE 模組模式 | 無需打包工具，瀏覽器原生支援 |

### 後續迭代計劃

- [ ] 新增更多模型架構（ViT、Whisper、LLaMA 等）
- [ ] 支援載入真實預訓練模型的權重
- [ ] 新增梯度流視覺化
- [ ] 支援自訂模型配置（JSON/YAML）
- [ ] 新增更多語言版本的教程
- [ ] 整合 WebGPU 加速渲染
- [ ] 新增協作標註功能

---

## 📦 專案結構

```
NeuroViz/
├── index.html              # 主頁面
├── css/
│   ├── style.css           # 全域樣式與主題
│   ├── architecture.css    # 架構視覺化樣式
│   ├── attention.css       # 注意力熱力圖樣式
│   ├── embedding.css       # 嵌入投影樣式
│   ├── controls.css        # UI 元件樣式
│   └── lessons.css         # 教程頁面樣式
├── js/
│   ├── utils.js            # 工具函式庫
│   ├── models.js           # 模型架構定義
│   ├── tokenizer.js        # 分詞器與嵌入生成
│   ├── embedding.js        # 嵌入投影渲染
│   ├── attention.js        # 注意力視覺化
│   ├── architecture.js     # 架構圖渲染
│   ├── renderer.js         # 渲染器總控
│   ├── lessons.js          # 互動式教程
│   ├── export.js           # 匯出工具
│   └── app.js              # 應用主控制器
├── LICENSE                 # MIT 開源協議
└── .gitignore              # Git 忽略配置
```

---

## 🤝 貢獻指南

歡迎所有形式的貢獻！請遵循以下步驟：

1. **Fork** 本倉庫
2. 建立特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 **Pull Request**

### 提交規範

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 規範：

- `feat:` 新功能
- `fix:` 修復問題
- `docs:` 文件更新
- `style:` 程式碼格式
- `refactor:` 程式碼重構
- `test:` 測試相關
- `chore:` 建置/工具相關

### Issue 回饋

發現 Bug 或有功能建議？請 [提交 Issue](https://github.com/gitstq/NeuroViz/issues)。

---

## 📄 開源協議

本專案基於 [MIT License](LICENSE) 開源，可自由使用、修改和分發。

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq">gitstq</a>
</p>
