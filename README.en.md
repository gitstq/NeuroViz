<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.zh-TW.md">繁體中文</a> | <a href="README.en.md">English</a>
</p>

<h1 align="center">🧠 NeuroViz</h1>

<p align="center">
  <strong>Interactive AI Model Architecture Visualizer</strong><br>
  Explore how Transformer, BERT, CNN, and RNN process data — right in your browser<br>
  Zero Dependencies · Pure Frontend · Ready to Use
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/dependencies-zero-orange" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/browser-any-green" alt="Any Browser">
</p>

---

## 🎉 About

**NeuroViz** is an interactive visualization tool designed for AI learners and developers. It transforms complex neural network architectures into intuitive visual interfaces, enabling users to:

- 🔍 **Observe in real-time** how each layer of Transformer, BERT, CNN, and RNN architectures processes input data
- 👁️ **Visualize attention weights** to understand how models "focus" on different parts of the input
- 📊 **Project token embeddings** into 2D space to intuitively grasp semantic relationships
- 📚 **Learn through built-in interactive lessons** covering core deep learning concepts from scratch

### 💡 Inspiration

Inspired by poloclub/transformer-explainer, NeuroViz is a fully independent implementation using a pure frontend approach — no build tools, no backend dependencies. Just open it in your browser and start exploring.

### 🌟 Key Differentiators

| Feature | NeuroViz | Other Solutions |
|---------|----------|-----------------|
| Model Support | Transformer + BERT + CNN + RNN | Usually single model only |
| Setup | Zero dependencies, open HTML directly | Requires Node.js / Python |
| Attention Viz | Multi-layer, multi-head switching | Usually single layer only |
| Education | 6 built-in interactive lessons | None |
| Export | SVG / PNG / JSON / CSV / Markdown | Limited |
| Themes | Light / Dark mode toggle | Usually light only |

---

## ✨ Features

### 🏗️ Architecture Visualization
- **4 model architectures**: Transformer (GPT-2 style), BERT Encoder, CNN Text Classifier, RNN Sequence Model
- **Interactive architecture diagram**: Click any layer to inspect detailed parameters and descriptions
- **Step-by-step execution mode**: Observe the forward pass layer by layer
- **Zoom & pan**: Freely explore complex architectures

### 👁️ Attention Heatmap
- **Multi-layer & multi-head switching**: Select any layer and attention head
- **Real-time statistics**: Average attention, max attention, entropy, strongest connection
- **Hover tooltips**: View attention weights for any token pair
- **One-click export**: Export as high-resolution PNG

### 📊 Embedding Projection
- **3 dimensionality reduction modes**: PCA, t-SNE, Raw dimensions
- **Interactive exploration**: Hover and click to inspect token details
- **Similarity lines**: Automatically draw connections between semantically similar tokens

### 📚 Interactive Lessons
- **6 curated lessons**: From Transformer basics to GPT vs BERT comparison
- **Instant quizzes**: Each lesson includes interactive quizzes
- **Hands-on guidance**: Lessons guide users to switch views for practical exploration

### 🎨 User Experience
- 🌙 **Light / Dark themes**: Persists user preference
- ⌨️ **Keyboard shortcuts**: `Ctrl+Enter` to run
- 📱 **Responsive design**: Adapts to desktop and tablet
- 📥 **Multi-format export**: SVG, PNG, JSON, CSV, Markdown

---

## 🚀 Quick Start

### Option 1: Open Directly (Recommended)

```bash
# Clone the repository
git clone https://github.com/gitstq/NeuroViz.git
cd NeuroViz

# Open index.html directly in your browser
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

### Option 2: Local Server

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8080
```

Then visit `http://localhost:8080`

### Option 3: Use Online

Visit [GitHub Pages](https://gitstq.github.io/NeuroViz/) (if deployed)

---

## 📖 Usage Guide

### Basic Workflow

1. **Select a model**: Choose an architecture from the dropdown in the header
2. **Enter text**: Type any text in the left panel (a sample is pre-filled)
3. **Click Run**: Press the ▶️ Run button or use `Ctrl+Enter`
4. **Explore visualizations**:
   - Switch to the **Architecture** tab to view model structure
   - Switch to the **Attention** tab to view attention patterns
   - Switch to the **Embeddings** tab to view token embedding projections
   - Switch to the **Lessons** tab for interactive learning

### Step-by-Step Mode

1. Click the 🔍 **Step Mode** button in the left panel
2. Use ⏮️ **Prev** / ⏭️ **Next** buttons in the bottom control bar to step through layers
3. Or click ⏩ **Auto Play** to automatically animate the forward pass

### Export Options

| Feature | Format | Location |
|---------|--------|----------|
| Architecture Diagram | SVG / PNG | Architecture view toolbar |
| Attention Heatmap | PNG | Attention view toolbar |
| Analysis Report | Markdown | Console command |

---

## 💡 Design Philosophy & Roadmap

### Design Principles

- **Education first**: Every visual element includes clear descriptions to lower the learning curve
- **Zero barrier**: No dependencies to install — just open in a browser
- **Interaction-driven**: Learn abstract concepts through hands-on interaction, not passive reading
- **Modular**: 10 independent JS modules with clean architecture, easy to extend

### Technology Choices

| Choice | Rationale |
|--------|-----------|
| Pure HTML/CSS/JS | Zero build dependencies, maximum accessibility |
| Canvas 2D API | High-performance rendering for architecture diagrams and embeddings |
| CSS Custom Properties | Elegant theme switching implementation |
| IIFE Module Pattern | No bundler required, native browser support |

### Roadmap

- [ ] Add more architectures (ViT, Whisper, LLaMA, etc.)
- [ ] Support loading real pre-trained model weights
- [ ] Add gradient flow visualization
- [ ] Support custom model configurations (JSON/YAML)
- [ ] Add lessons in more languages
- [ ] Integrate WebGPU for accelerated rendering
- [ ] Add collaborative annotation features

---

## 📦 Project Structure

```
NeuroViz/
├── index.html              # Main page
├── css/
│   ├── style.css           # Global styles & themes
│   ├── architecture.css    # Architecture visualization styles
│   ├── attention.css       # Attention heatmap styles
│   ├── embedding.css       # Embedding projection styles
│   ├── controls.css        # UI component styles
│   └── lessons.css         # Lesson page styles
├── js/
│   ├── utils.js            # Utility functions
│   ├── models.js           # Model architecture definitions
│   ├── tokenizer.js        # Tokenizer & embedding generation
│   ├── embedding.js        # Embedding projection renderer
│   ├── attention.js        # Attention visualization
│   ├── architecture.js     # Architecture diagram renderer
│   ├── renderer.js         # Master renderer controller
│   ├── lessons.js          # Interactive lessons
│   ├── export.js           # Export utilities
│   └── app.js              # Main application controller
├── LICENSE                 # MIT License
└── .gitignore              # Git ignore configuration
```

---

## 🤝 Contributing

Contributions of all kinds are welcome! Please follow these steps:

1. **Fork** this repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push the branch: `git push origin feature/amazing-feature`
5. Submit a **Pull Request**

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Testing related
- `chore:` Build/tooling related

### Issue Reporting

Found a bug or have a feature request? Please [open an Issue](https://github.com/gitstq/NeuroViz/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Free to use, modify, and distribute.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq">gitstq</a>
</p>
