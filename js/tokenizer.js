/**
 * NeuroViz - Tokenizer
 * Simulates tokenization for visualization purposes
 */

const NeuroVizTokenizer = (() => {
    'use strict';

    /**
     * Common English subword tokens (simulating BPE vocabulary)
     */
    const VOCAB = [
        'The', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
        'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
        'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
        'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
        'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
        'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same',
        'so', 'than', 'too', 'very', 'just', 'because', 'but', 'and', 'or',
        'if', 'while', 'although', 'this', 'that', 'these', 'those', 'it',
        'its', 'he', 'she', 'they', 'them', 'his', 'her', 'their', 'my',
        'your', 'our', 'what', 'which', 'who', 'whom', 'I', 'you', 'we',
        'cat', 'dog', 'sat', 'mat', 'on', 'the', 'red', 'blue', 'big',
        'small', 'fast', 'slow', 'happy', 'sad', 'good', 'bad', 'new',
        'old', 'man', 'woman', 'child', 'boy', 'girl', 'house', 'car',
        'tree', 'sun', 'moon', 'star', 'water', 'fire', 'earth', 'wind',
        'love', 'hate', 'think', 'know', 'see', 'hear', 'feel', 'make',
        'take', 'give', 'find', 'tell', 'say', 'said', 'go', 'went',
        'come', 'came', 'run', 'walk', 'eat', 'drink', 'sleep', 'wake',
        'read', 'write', 'learn', 'teach', 'play', 'work', 'live', 'die',
        'ing', 'ed', 'er', 'est', 'ly', 'tion', 'ment', 'ness', 'ful',
        'less', 'able', 'ous', 'ive', 'ent', 'al', 'ize', 'ise',
        '##s', '##ed', '##ing', '##er', '##ly', '##tion', '##ment',
        '人工智能', '机器学习', '深度学习', '神经网络', '自然语言', '处理',
        '计算机', '科学', '技术', '数据', '模型', '训练', '预测', '分析',
    ];

    /**
     * Build a simple token-to-id mapping
     */
    const TOKEN_TO_ID = {};
    VOCAB.forEach((token, idx) => {
        TOKEN_TO_ID[token] = idx;
    });

    /**
     * Simple BPE-like tokenizer
     * Splits text into tokens based on common subword patterns
     */
    function tokenize(text) {
        const tokens = [];
        let remaining = text.trim();

        while (remaining.length > 0) {
            let matched = false;

            // Try longest match first
            for (let len = Math.min(remaining.length, 20); len >= 1; len--) {
                const candidate = remaining.substring(0, len);
                if (TOKEN_TO_ID[candidate] !== undefined) {
                    tokens.push({
                        text: candidate,
                        id: TOKEN_TO_ID[candidate],
                    });
                    remaining = remaining.substring(len);
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // Character-level fallback
                const char = remaining[0];
                const id = VOCAB.length + char.charCodeAt(0);
                tokens.push({ text: char, id });
                remaining = remaining.substring(1);
            }
        }

        return tokens;
    }

    /**
     * Generate simulated embedding vectors for tokens
     * Uses deterministic hashing for reproducibility
     */
    function generateEmbeddings(tokens, dim = 64) {
        const rng = NeuroVizUtils.seededRandom(42);
        return tokens.map((token) => {
            const vec = new Float32Array(dim);
            const seed = NeuroVizUtils.hashString(token.text);
            const localRng = NeuroVizUtils.seededRandom(seed);
            for (let i = 0; i < dim; i++) {
                vec[i] = (localRng() - 0.5) * 2;
            }
            // Normalize
            let norm = 0;
            for (let i = 0; i < dim; i++) norm += vec[i] * vec[i];
            norm = Math.sqrt(norm);
            for (let i = 0; i < dim; i++) vec[i] /= norm;
            return vec;
        });
    }

    /**
     * Generate simulated attention weights
     * Creates realistic-looking attention patterns based on the model type
     */
    function generateAttention(tokens, modelType = 'transformer', layerIdx = 0, headIdx = 0) {
        const n = tokens.length;
        if (n === 0) return NeuroVizUtils.Matrix.zeros(0, 0);

        // Different attention patterns for different layers/heads
        const patterns = ['diagonal', 'forward', 'local', 'full'];
        const patternIdx = (layerIdx * 4 + headIdx) % patterns.length;
        const pattern = modelType === 'transformer' && patternIdx < 2 ? 'forward' : patterns[patternIdx];

        // Add some token-based patterns (e.g., "the" attends to nouns)
        const matrix = NeuroVizUtils.Matrix.patternedAttention(n, n, pattern);

        // Add some linguistic patterns
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // Function words attend to content words
                const functionWords = ['the', 'a', 'an', 'is', 'are', 'on', 'in', 'to', 'of'];
                const isFuncI = functionWords.includes(tokens[i].text.toLowerCase());
                const isFuncJ = functionWords.includes(tokens[j].text.toLowerCase());

                if (isFuncI && !isFuncJ) {
                    matrix[i][j] += 0.15;
                }
                // Same word gets extra attention
                if (tokens[i].text.toLowerCase() === tokens[j].text.toLowerCase() && i !== j) {
                    matrix[i][j] += 0.1;
                }
            }
            // Re-normalize row
            let sum = 0;
            for (let j = 0; j < n; j++) sum += matrix[i][j];
            for (let j = 0; j < n; j++) matrix[i][j] /= sum;
        }

        return matrix;
    }

    /**
     * Generate multi-layer, multi-head attention
     */
    function generateFullAttention(tokens, modelType = 'transformer', numLayers = 4, numHeads = 4) {
        const attention = [];
        for (let l = 0; l < numLayers; l++) {
            const heads = [];
            for (let h = 0; h < numHeads; h++) {
                heads.push(generateAttention(tokens, modelType, l, h));
            }
            attention.push(heads);
        }
        return attention;
    }

    /**
     * Get token color based on index
     */
    function getTokenColor(index, total) {
        const colors = [
            '#4f6ef7', '#f472b6', '#34d399', '#fbbf24', '#a78bfa',
            '#fb923c', '#06b6d4', '#ef4444', '#22c55e', '#818cf8',
            '#ec4899', '#14b8a6', '#f59e0b', '#6366f1', '#10b981',
        ];
        return colors[index % colors.length];
    }

    return {
        tokenize,
        generateEmbeddings,
        generateAttention,
        generateFullAttention,
        getTokenColor,
        VOCAB_SIZE: VOCAB.length,
    };
})();
