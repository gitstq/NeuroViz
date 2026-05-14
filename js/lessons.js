/**
 * NeuroViz - Interactive Lessons
 * Built-in learning content for understanding AI model architectures
 */

const NeuroVizLessons = (() => {
    'use strict';

    let currentLesson = -1;

    const lessons = [
        {
            id: 'intro-transformer',
            title: 'What is a Transformer?',
            duration: '5 min',
            category: 'Fundamentals',
            content: `
                <div class="lesson-header">
                    <span class="lesson-tag">Fundamentals</span>
                    <h2>What is a Transformer?</h2>
                    <div class="lesson-meta">
                        <span>📖 5 min read</span>
                        <span>🎯 Beginner</span>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>The Revolution in AI</h3>
                    <p>The Transformer architecture, introduced in the landmark 2017 paper "Attention Is All You Need" by Vaswani et al., revolutionized natural language processing and became the foundation for modern AI systems like GPT, BERT, and more.</p>
                    <p>Unlike previous models that processed text sequentially (word by word), Transformers process <strong>all words simultaneously</strong> using a mechanism called <strong>self-attention</strong>. This makes them incredibly fast to train and capable of understanding long-range dependencies in text.</p>
                </div>

                <div class="lesson-section">
                    <h3>Key Innovation: Self-Attention</h3>
                    <div class="concept-box">
                        <div class="concept-title">💡 Core Concept</div>
                        <p>Self-attention allows each word to "look at" every other word in the sentence to understand its context. For example, in "The bank of the river", the word "bank" attends to "river" to understand it means the water edge, not a financial institution.</p>
                    </div>
                    <p>The attention mechanism computes three vectors for each word:</p>
                    <ul style="padding-left:20px;margin:12px 0;color:var(--text-secondary);">
                        <li><strong>Query (Q)</strong>: "What am I looking for?"</li>
                        <li><strong>Key (K)</strong>: "What do I contain?"</li>
                        <li><strong>Value (V)</strong>: "What information should I pass?"</li>
                    </ul>
                    <p>Attention scores are computed as: <code>Attention(Q, K, V) = softmax(QK^T / √d_k) × V</code></p>
                </div>

                <div class="lesson-section">
                    <h3>Transformer vs. RNN vs. CNN</h3>
                    <p>Before Transformers, Recurrent Neural Networks (RNNs) were the dominant architecture for sequence processing. However, RNNs process tokens one at a time, making them slow and prone to "forgetting" early information in long sequences.</p>
                    <div class="concept-box">
                        <div class="concept-title">⚡ Why Transformers Win</div>
                        <p><strong>Parallelization</strong>: All positions are processed simultaneously<br>
                        <strong>Long-range dependencies</strong>: Every word can attend to every other word<br>
                        <strong>Scalability</strong>: Easily scaled to billions of parameters<br>
                        <strong>Flexibility</strong>: Works for text, images, audio, and more</p>
                    </div>
                </div>

                <div class="lesson-quiz">
                    <h4>🧪 Quick Quiz</h4>
                    <p style="margin-bottom:12px;color:var(--text-secondary);">What is the key mechanism that allows Transformers to process all words simultaneously?</p>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">A. Recurrent connections</button>
                    <button class="quiz-option" data-correct="true" onclick="handleQuiz(this, true)">B. Self-attention mechanism</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">C. Convolutional filters</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">D. Backpropagation through time</button>
                    <div class="quiz-feedback" id="quiz-feedback-1"></div>
                </div>
            `,
        },
        {
            id: 'attention-mechanism',
            title: 'How Attention Works',
            duration: '8 min',
            category: 'Core Mechanism',
            content: `
                <div class="lesson-header">
                    <span class="lesson-tag">Core Mechanism</span>
                    <h2>How Self-Attention Works</h2>
                    <div class="lesson-meta">
                        <span>📖 8 min read</span>
                        <span>🎯 Intermediate</span>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Step by Step</h3>
                    <p>Let's walk through how self-attention works using a simple example: <strong>"The cat sat on the mat"</strong></p>
                </div>

                <div class="lesson-section">
                    <h3>Step 1: Create Q, K, V Vectors</h3>
                    <p>Each token's embedding is multiplied by three learned weight matrices to produce Query, Key, and Value vectors:</p>
                    <div class="code-block">
<span class="code-comment"># For each token embedding x:</span>
Q = x @ W_Q    <span class="code-comment"># Query: what am I looking for?</span>
K = x @ W_K    <span class="code-comment"># Key: what do I contain?</span>
V = x @ W_V    <span class="code-comment"># Value: what info should I share?</span>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Step 2: Compute Attention Scores</h3>
                    <p>The Query of each token is compared against the Key of every other token using dot product:</p>
                    <div class="code-block">
scores = Q @ K^T    <span class="code-comment"># [seq_len, seq_len] attention score matrix</span>
scores = scores / sqrt(d_k)   <span class="code-comment"># Scale by dimension (prevents large values)</span>
weights = softmax(scores)     <span class="code-comment"># Normalize to probabilities (sum to 1)</span>
                    </div>
                    <div class="concept-box">
                        <div class="concept-title">🔍 Try It!</div>
                        <p>Switch to the <strong>Attention</strong> tab above, enter "The cat sat on the mat", and click Run to see the actual attention pattern between tokens!</p>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Step 3: Apply Attention to Values</h3>
                    <p>The attention weights determine how much of each token's Value vector to mix in:</p>
                    <div class="code-block">
output = weights @ V    <span class="code-comment"># Weighted sum of all Value vectors</span>
                    </div>
                    <p>Each token's output is now a mixture of information from all tokens, weighted by relevance!</p>
                </div>

                <div class="lesson-section">
                    <h3>Multi-Head Attention</h3>
                    <p>Instead of a single attention function, Transformers use <strong>multiple "heads"</strong> — each head learns to attend to different patterns:</p>
                    <ul style="padding-left:20px;margin:12px 0;color:var(--text-secondary);">
                        <li><strong>Head 1</strong> might focus on syntactic relationships (subject-verb)</li>
                        <li><strong>Head 2</strong> might focus on semantic similarity</li>
                        <li><strong>Head 3</strong> might focus on positional patterns</li>
                        <li><strong>Head N</strong> might focus on something else entirely!</li>
                    </ul>
                    <p>GPT-2 uses 12 heads, each with dimension 64 (total embedding dim = 768).</p>
                </div>

                <div class="lesson-quiz">
                    <h4>🧪 Quick Quiz</h4>
                    <p style="margin-bottom:12px;color:var(--text-secondary);">Why do we divide the attention scores by √d_k (square root of key dimension)?</p>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">A. To make training faster</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">B. To reduce memory usage</button>
                    <button class="quiz-option" data-correct="true" onclick="handleQuiz(this, true)">C. To prevent softmax from producing extreme values</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">D. To increase the model capacity</button>
                    <div class="quiz-feedback" id="quiz-feedback-2"></div>
                </div>
            `,
        },
        {
            id: 'embeddings',
            title: 'Understanding Embeddings',
            duration: '6 min',
            category: 'Fundamentals',
            content: `
                <div class="lesson-header">
                    <span class="lesson-tag">Fundamentals</span>
                    <h2>Understanding Embeddings</h2>
                    <div class="lesson-meta">
                        <span>📖 6 min read</span>
                        <span>🎯 Beginner</span>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>From Words to Numbers</h3>
                    <p>AI models can't process text directly — they need numbers. <strong>Embeddings</strong> are dense vector representations that capture the meaning of words as points in a high-dimensional space.</p>
                    <div class="concept-box">
                        <div class="concept-title">💡 Key Idea</div>
                        <p>Words with similar meanings are located close together in embedding space. "King" is near "Queen", "cat" is near "dog", and the vector difference ("king" - "man" + "woman") ≈ "queen"!</p>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>How Embeddings Work</h3>
                    <p>Each word is mapped to a vector of real numbers (e.g., 768 dimensions for GPT-2). These vectors are learned during training so that:</p>
                    <ul style="padding-left:20px;margin:12px 0;color:var(--text-secondary);">
                        <li>Similar words have similar vectors (high cosine similarity)</li>
                        <li>Relationships are captured as vector arithmetic</li>
                        <li>Contextual information can modify embeddings</li>
                    </ul>
                </div>

                <div class="lesson-section">
                    <h3>Visualizing Embeddings</h3>
                    <p>Since we can't visualize 768 dimensions, we use dimensionality reduction techniques like <strong>PCA</strong> (Principal Component Analysis) or <strong>t-SNE</strong> to project embeddings down to 2D.</p>
                    <div class="concept-box">
                        <div class="concept-title">🔍 Try It!</div>
                        <p>Switch to the <strong>Embeddings</strong> tab above, enter some text, and click Run to see how tokens cluster in 2D embedding space!</p>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Position Embeddings</h3>
                    <p>Since Transformers process all tokens in parallel, they have no inherent sense of word order. <strong>Position embeddings</strong> are added to token embeddings to encode positional information.</p>
                    <p>There are two main approaches:</p>
                    <ul style="padding-left:20px;margin:12px 0;color:var(--text-secondary);">
                        <li><strong>Learned</strong>: Position embeddings are learned parameters (used in GPT-2, BERT)</li>
                        <li><strong>Sinusoidal</strong>: Fixed mathematical functions (used in the original Transformer)</li>
                    </ul>
                </div>

                <div class="lesson-quiz">
                    <h4>🧪 Quick Quiz</h4>
                    <p style="margin-bottom:12px;color:var(--text-secondary);">What is the famous word analogy that demonstrates embedding arithmetic?</p>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">A. "dog" - "animal" + "plant" = "tree"</button>
                    <button class="quiz-option" data-correct="true" onclick="handleQuiz(this, true)">B. "king" - "man" + "woman" ≈ "queen"</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">C. "fast" - "slow" + "big" = "huge"</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">D. "happy" + "sad" = "neutral"</button>
                    <div class="quiz-feedback" id="quiz-feedback-3"></div>
                </div>
            `,
        },
        {
            id: 'transformer-block',
            title: 'Inside a Transformer Block',
            duration: '10 min',
            category: 'Architecture',
            content: `
                <div class="lesson-header">
                    <span class="lesson-tag">Architecture Deep Dive</span>
                    <h2>Inside a Transformer Block</h2>
                    <div class="lesson-meta">
                        <span>📖 10 min read</span>
                        <span>🎯 Intermediate</span>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>The Building Block</h3>
                    <p>A Transformer model is essentially a stack of identical blocks. Each block contains two main sub-components:</p>
                    <ol style="padding-left:20px;margin:12px 0;color:var(--text-secondary);line-height:2;">
                        <li><strong>Multi-Head Self-Attention</strong> — allows tokens to communicate</li>
                        <li><strong>Feed-Forward Network (FFN)</strong> — processes each token independently</li>
                    </ol>
                    <p>Each sub-component is preceded by <strong>Layer Normalization</strong> and followed by a <strong>Residual Connection</strong>.</p>
                </div>

                <div class="lesson-section">
                    <h3>Layer Normalization</h3>
                    <p>Normalizes the activations to have zero mean and unit variance. This stabilizes training and allows deeper networks.</p>
                    <div class="code-block">
<span class="code-comment"># Layer Normalization</span>
x_norm = (x - mean(x)) / sqrt(var(x) + eps)
output = gamma * x_norm + beta   <span class="code-comment"># Learnable scale and shift</span>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Residual Connections</h3>
                    <p>The input to each sub-layer is added back to its output. This "shortcut" helps gradients flow through deep networks:</p>
                    <div class="code-block">
output = LayerNorm(x + SubLayer(x))
                    </div>
                    <div class="concept-box">
                        <div class="concept-title">🏗️ Architecture Pattern</div>
                        <p>GPT-2 uses <strong>Pre-LN</strong> (normalization before the sub-layer), while the original Transformer uses <strong>Post-LN</strong> (normalization after). Pre-LN generally leads to more stable training.</p>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Feed-Forward Network</h3>
                    <p>The FFN is applied to each position independently and identically. It consists of two linear transformations with a GELU activation:</p>
                    <div class="code-block">
FFN(x) = GELU(x @ W1 + b1) @ W2 + b2
<span class="code-comment"># GPT-2: 768 → 3072 → 768 (4x expansion)</span>
                    </div>
                    <p>The expansion to 4x dimension allows the model to learn richer representations before projecting back.</p>
                </div>

                <div class="lesson-section">
                    <h3>Scaling Up</h3>
                    <p>The power of Transformers comes from stacking many blocks:</p>
                    <ul style="padding-left:20px;margin:12px 0;color:var(--text-secondary);">
                        <li><strong>GPT-2 Small</strong>: 12 layers, 768 dim, 12 heads (~124M params)</li>
                        <li><strong>GPT-2 Medium</strong>: 24 layers, 1024 dim, 16 heads (~355M params)</li>
                        <li><strong>GPT-2 Large</strong>: 36 layers, 1280 dim, 20 heads (~774M params)</li>
                        <li><strong>GPT-2 XL</strong>: 48 layers, 1600 dim, 25 heads (~1.5B params)</li>
                    </ul>
                </div>

                <div class="lesson-quiz">
                    <h4>🧪 Quick Quiz</h4>
                    <p style="margin-bottom:12px;color:var(--text-secondary);">What is the purpose of the residual connection in a Transformer block?</p>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">A. To increase the model's parameter count</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">B. To add randomness for regularization</button>
                    <button class="quiz-option" data-correct="true" onclick="handleQuiz(this, true)">C. To help gradients flow through deep networks</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">D. To reduce the computational cost</button>
                    <div class="quiz-feedback" id="quiz-feedback-4"></div>
                </div>
            `,
        },
        {
            id: 'gpt-vs-bert',
            title: 'GPT vs BERT: Encoder vs Decoder',
            duration: '7 min',
            category: 'Architecture',
            content: `
                <div class="lesson-header">
                    <span class="lesson-tag">Architecture Comparison</span>
                    <h2>GPT vs BERT: Encoder vs Decoder</h2>
                    <div class="lesson-meta">
                        <span>📖 7 min read</span>
                        <span>🎯 Intermediate</span>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Two Sides of the Same Coin</h3>
                    <p>Both GPT and BERT are based on the Transformer architecture, but they use it in fundamentally different ways:</p>
                </div>

                <div class="lesson-section">
                    <h3>GPT (Decoder-Only)</h3>
                    <div class="concept-box">
                        <div class="concept-title">🤖 GPT: "Predict the Next Word"</div>
                        <p>Uses <strong>causal (masked) attention</strong> — each token can only attend to previous tokens. This makes it perfect for text generation, as it naturally predicts the next token in sequence.</p>
                    </div>
                    <p><strong>Training</strong>: Given "The cat sat on the", predict "mat"</p>
                    <p><strong>Use cases</strong>: Text generation, chatbots, code completion, translation</p>
                </div>

                <div class="lesson-section">
                    <h3>BERT (Encoder-Only)</h3>
                    <div class="concept-box">
                        <div class="concept-title">🔍 BERT: "Understand the Full Context"</div>
                        <p>Uses <strong>bidirectional attention</strong> — each token can attend to all other tokens. This gives BERT a complete understanding of the entire input at once.</p>
                    </div>
                    <p><strong>Training</strong>: Masked Language Modeling (fill in the blank) + Next Sentence Prediction</p>
                    <p><strong>Use cases</strong>: Text classification, NER, question answering, semantic search</p>
                </div>

                <div class="lesson-section">
                    <h3>Attention Pattern Comparison</h3>
                    <p>Try switching between the Transformer and BERT models in the model selector above to see how the attention patterns differ!</p>
                    <ul style="padding-left:20px;margin:12px 0;color:var(--text-secondary);">
                        <li><strong>GPT</strong>: Lower-triangular attention mask (can't see future)</li>
                        <li><strong>BERT</strong>: Full attention matrix (sees everything)</li>
                    </ul>
                </div>

                <div class="lesson-quiz">
                    <h4>🧪 Quick Quiz</h4>
                    <p style="margin-bottom:12px;color:var(--text-secondary);">Which attention pattern does GPT use?</p>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">A. Bidirectional attention</button>
                    <button class="quiz-option" data-correct="true" onclick="handleQuiz(this, true)">B. Causal (masked) attention</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">C. Local window attention</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">D. Sparse attention</button>
                    <div class="quiz-feedback" id="quiz-feedback-5"></div>
                </div>
            `,
        },
        {
            id: 'cnn-text',
            title: 'CNNs for Text Classification',
            duration: '5 min',
            category: 'Alternative Architectures',
            content: `
                <div class="lesson-header">
                    <span class="lesson-tag">Alternative Architectures</span>
                    <h2>CNNs for Text Classification</h2>
                    <div class="lesson-meta">
                        <span>📖 5 min read</span>
                        <span>🎯 Beginner</span>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Convolutional Neural Networks for NLP</h3>
                    <p>While Transformers dominate modern NLP, CNNs remain a powerful and efficient choice for text classification tasks. The key idea: apply 1D convolutions over word embeddings to detect n-gram features.</p>
                </div>

                <div class="lesson-section">
                    <h3>How It Works</h3>
                    <p>Multiple convolutional filters of different sizes (e.g., 3, 4, 5) slide over the embedded text:</p>
                    <ul style="padding-left:20px;margin:12px 0;color:var(--text-secondary);">
                        <li><strong>Filter size 3</strong>: Captures trigrams ("not good", "very happy")</li>
                        <li><strong>Filter size 4</strong>: Captures 4-grams ("really not good at")</li>
                        <li><strong>Filter size 5</strong>: Captures 5-grams (longer phrases)</li>
                    </ul>
                    <p>Global max pooling extracts the most important feature from each filter, and the results are concatenated for classification.</p>
                </div>

                <div class="lesson-section">
                    <h3>Advantages</h3>
                    <div class="concept-box">
                        <div class="concept-title">⚡ Why CNNs for Text?</div>
                        <p><strong>Fast</strong>: Highly parallelizable, much faster than RNNs<br>
                        <strong>Effective</strong>: Excellent for short-text classification<br>
                        <strong>Simple</strong>: Fewer parameters, easier to train<br>
                        <strong>Interpretable</strong>: Filters can be inspected to see what patterns they learned</p>
                    </div>
                </div>

                <div class="lesson-quiz">
                    <h4>🧪 Quick Quiz</h4>
                    <p style="margin-bottom:12px;color:var(--text-secondary);">What does a filter size of 3 in a text CNN capture?</p>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">A. Single words</button>
                    <button class="quiz-option" data-correct="true" onclick="handleQuiz(this, true)">B. Three-word phrases (trigrams)</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">C. Three sentences</button>
                    <button class="quiz-option" data-correct="false" onclick="handleQuiz(this, false)">D. Three paragraphs</button>
                    <div class="quiz-feedback" id="quiz-feedback-6"></div>
                </div>
            `,
        },
    ];

    /**
     * Initialize lessons
     */
    function init() {
        renderLessonList();
    }

    /**
     * Render the lesson sidebar
     */
    function renderLessonList() {
        const list = document.getElementById('lesson-list');
        if (!list) return;

        list.innerHTML = lessons
            .map(
                (lesson, i) => `
            <div class="lesson-item ${i === currentLesson ? 'active' : ''}" data-index="${i}">
                <div class="lesson-number">${lesson.category}</div>
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-duration">⏱ ${lesson.duration}</div>
            </div>
        `
            )
            .join('');

        list.querySelectorAll('.lesson-item').forEach((item) => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.index);
                selectLesson(idx);
            });
        });
    }

    /**
     * Select a lesson
     */
    function selectLesson(index) {
        currentLesson = index;
        const lesson = lessons[index];

        // Update sidebar
        document.querySelectorAll('.lesson-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // Update content
        const content = document.getElementById('lesson-content');
        if (content) {
            content.innerHTML = lesson.content;

            // Add navigation
            const navHtml = `
                <div class="lesson-nav">
                    <button class="lesson-nav-btn" ${index === 0 ? 'disabled' : ''} onclick="NeuroVizLessons.selectLesson(${index - 1})">
                        ← Previous
                    </button>
                    <button class="lesson-nav-btn" ${index === lessons.length - 1 ? 'disabled' : ''} onclick="NeuroVizLessons.selectLesson(${index + 1})">
                        Next →
                    </button>
                </div>
            `;
            content.innerHTML += navHtml;
        }
    }

    return {
        init,
        selectLesson,
        get lessons() { return lessons; },
    };
})();

/**
 * Quiz handler (global function for onclick)
 */
function handleQuiz(button, isCorrect) {
    const quizContainer = button.closest('.lesson-quiz');
    const feedback = quizContainer.querySelector('.quiz-feedback');

    // Reset all options
    quizContainer.querySelectorAll('.quiz-option').forEach((opt) => {
        opt.classList.remove('correct', 'wrong');
        opt.disabled = true;
    });

    if (isCorrect) {
        button.classList.add('correct');
        feedback.className = 'quiz-feedback show correct';
        feedback.textContent = '✅ Correct! Great job!';
    } else {
        button.classList.add('wrong');
        // Highlight correct answer
        quizContainer.querySelectorAll('.quiz-option').forEach((opt) => {
            if (opt.dataset.correct === 'true') opt.classList.add('correct');
        });
        feedback.className = 'quiz-feedback show wrong';
        feedback.textContent = '❌ Not quite. The correct answer is highlighted above.';
    }
}
