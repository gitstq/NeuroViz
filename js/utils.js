/**
 * NeuroViz - Utility Functions
 * Common helper functions used across the application
 */

const NeuroVizUtils = (() => {
    'use strict';

    /**
     * Generate a unique ID
     */
    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Clamp a value between min and max
     */
    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    /**
     * Linear interpolation
     */
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Map a value from one range to another
     */
    function mapRange(value, inMin, inMax, outMin, outMax) {
        return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
    }

    /**
     * Get current timestamp string
     */
    function timestamp() {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
    }

    /**
     * Debounce function
     */
    function debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Throttle function
     */
    function throttle(fn, limit = 100) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    /**
     * Deep clone an object
     */
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Format number with commas
     */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Color utilities
     */
    const Color = {
        /**
         * Convert hex color to RGB
         */
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16),
                  }
                : { r: 0, g: 0, b: 0 };
        },

        /**
         * Convert RGB to hex
         */
        rgbToHex(r, g, b) {
            return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
        },

        /**
         * Interpolate between two colors
         */
        interpolate(color1, color2, t) {
            const c1 = this.hexToRgb(color1);
            const c2 = this.hexToRgb(color2);
            const r = Math.round(lerp(c1.r, c2.r, t));
            const g = Math.round(lerp(c1.g, c2.g, t));
            const b = Math.round(lerp(c1.b, c2.b, t));
            return this.rgbToHex(r, g, b);
        },

        /**
         * Get attention color based on weight (0-1)
         */
        attentionColor(weight, alpha = 1) {
            // Gradient from light gray to deep blue
            const t = clamp(weight, 0, 1);
            const r = Math.round(lerp(240, 79, t));
            const g = Math.round(lerp(240, 110, t));
            const b = Math.round(lerp(240, 247, t));
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        },

        /**
         * Get layer color by type
         */
        layerColor(type) {
            const colors = {
                input: '#60a5fa',
                embedding: '#818cf8',
                attention: '#f472b6',
                feedforward: '#34d399',
                normalization: '#fbbf24',
                output: '#fb923c',
                activation: '#a78bfa',
                pooling: '#38bdf8',
                dropout: '#94a3b8',
                residual: '#c084fc',
                position: '#2dd4bf',
            };
            return colors[type] || '#94a3b8';
        },

        /**
         * Get token color by index
         */
        tokenColor(index, total) {
            const hue = (index / total) * 300 + 200;
            return `hsl(${hue % 360}, 70%, 60%)`;
        },
    };

    /**
     * Matrix utilities for attention computation
     */
    const Matrix = {
        /**
         * Create a zero matrix
         */
        zeros(rows, cols) {
            return Array.from({ length: rows }, () => new Float32Array(cols));
        },

        /**
         * Create a random matrix with softmax normalization per row
         */
        randomAttention(rows, cols, temperature = 1.0) {
            const matrix = this.zeros(rows, cols);
            for (let i = 0; i < rows; i++) {
                // Generate random logits
                const logits = [];
                for (let j = 0; j < cols; j++) {
                    logits.push(Math.random() * 3 - 1);
                }
                // Apply temperature
                const scaled = logits.map((l) => l / temperature);
                // Softmax
                const maxLogit = Math.max(...scaled);
                const exps = scaled.map((l) => Math.exp(l - maxLogit));
                const sumExp = exps.reduce((a, b) => a + b, 0);
                for (let j = 0; j < cols; j++) {
                    matrix[i][j] = exps[j] / sumExp;
                }
            }
            return matrix;
        },

        /**
         * Generate patterned attention (for educational purposes)
         */
        patternedAttention(rows, cols, pattern = 'diagonal') {
            const matrix = this.zeros(rows, cols);
            switch (pattern) {
                case 'diagonal':
                    for (let i = 0; i < rows; i++) {
                        for (let j = 0; j < cols; j++) {
                            matrix[i][j] = i === j ? 0.8 + Math.random() * 0.2 : Math.random() * 0.1;
                        }
                    }
                    break;
                case 'forward':
                    for (let i = 0; i < rows; i++) {
                        for (let j = 0; j < cols; j++) {
                            matrix[i][j] = j >= i ? 0.5 + Math.random() * 0.5 : Math.random() * 0.05;
                        }
                    }
                    break;
                case 'full':
                    return this.randomAttention(rows, cols);
                case 'local':
                    for (let i = 0; i < rows; i++) {
                        for (let j = 0; j < cols; j++) {
                            const dist = Math.abs(i - j);
                            matrix[i][j] = dist <= 2 ? 0.6 + Math.random() * 0.4 : Math.random() * 0.05;
                        }
                    }
                    break;
                default:
                    return this.randomAttention(rows, cols);
            }
            // Normalize rows
            for (let i = 0; i < rows; i++) {
                const sum = Array.from(matrix[i]).reduce((a, b) => a + b, 0);
                for (let j = 0; j < cols; j++) {
                    matrix[i][j] /= sum;
                }
            }
            return matrix;
        },

        /**
         * Simple PCA for 2D projection (power iteration method)
         */
        simplePCA(vectors, dims = 2) {
            if (vectors.length === 0) return [];
            const n = vectors.length;
            const d = vectors[0].length;

            // Center the data
            const mean = new Float32Array(d);
            for (const v of vectors) {
                for (let i = 0; i < d; i++) mean[i] += v[i] / n;
            }
            const centered = vectors.map((v) => {
                const c = new Float32Array(d);
                for (let i = 0; i < d; i++) c[i] = v[i] - mean[i];
                return c;
            });

            // Power iteration for top-k components
            const components = [];
            for (let comp = 0; comp < dims; comp++) {
                let vec = new Float32Array(d);
                for (let i = 0; i < d; i++) vec[i] = Math.random() - 0.5;

                // Orthogonalize against previous components
                for (const prevComp of components) {
                    let dot = 0;
                    for (let i = 0; i < d; i++) dot += vec[i] * prevComp[i];
                    for (let i = 0; i < d; i++) vec[i] -= dot * prevComp[i];
                }

                // Iterate
                for (let iter = 0; iter < 50; iter++) {
                    // Multiply by covariance matrix (centered^T * centered)
                    const newVec = new Float32Array(d);
                    for (const c of centered) {
                        let dot = 0;
                        for (let i = 0; i < d; i++) dot += c[i] * vec[i];
                        for (let i = 0; i < d; i++) newVec[i] += dot * c[i];
                    }
                    // Normalize
                    let norm = 0;
                    for (let i = 0; i < d; i++) norm += newVec[i] * newVec[i];
                    norm = Math.sqrt(norm);
                    if (norm < 1e-10) break;
                    for (let i = 0; i < d; i++) vec[i] = newVec[i] / norm;
                }
                components.push(vec);
            }

            // Project
            return centered.map((c) => {
                const proj = [];
                for (const comp of components) {
                    let dot = 0;
                    for (let i = 0; i < d; i++) dot += c[i] * comp[i];
                    proj.push(dot);
                }
                return proj;
            });
        },
    };

    /**
     * Simple seeded random number generator (for reproducibility)
     */
    function seededRandom(seed = 42) {
        let s = seed;
        return function () {
            s = (s * 16807 + 0) % 2147483647;
            return (s - 1) / 2147483646;
        };
    }

    /**
     * Simple hash function for text
     */
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return Math.abs(hash);
    }

    /**
     * DOM helper utilities
     */
    const DOM = {
        create(tag, attrs = {}, children = []) {
            const el = document.createElement(tag);
            for (const [key, val] of Object.entries(attrs)) {
                if (key === 'className') el.className = val;
                else if (key === 'innerHTML') el.innerHTML = val;
                else if (key === 'textContent') el.textContent = val;
                else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
                else el.setAttribute(key, val);
            }
            for (const child of children) {
                if (typeof child === 'string') el.appendChild(document.createTextNode(child));
                else if (child) el.appendChild(child);
            }
            return el;
        },

        clear(el) {
            while (el.firstChild) el.removeChild(el.firstChild);
        },

        show(el) {
            el.classList.remove('hidden');
        },

        hide(el) {
            el.classList.add('hidden');
        },
    };

    return {
        uid,
        clamp,
        lerp,
        mapRange,
        timestamp,
        debounce,
        throttle,
        deepClone,
        formatNumber,
        Color,
        Matrix,
        seededRandom,
        hashString,
        DOM,
    };
})();
