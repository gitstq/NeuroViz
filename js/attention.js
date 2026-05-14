/**
 * NeuroViz - Attention Visualization
 * Renders attention weight matrices and statistics
 */

const NeuroVizAttention = (() => {
    'use strict';

    let currentTokens = [];
    let fullAttention = []; // [layer][head] = matrix
    let currentLayer = 0;
    let currentHead = 0;
    let numLayers = 4;
    let numHeads = 4;

    /**
     * Initialize attention view
     */
    function init() {
        // Layer and head selectors
        const layerSelect = document.getElementById('attention-layer-select');
        const headSelect = document.getElementById('attention-head-select');

        if (layerSelect) {
            layerSelect.addEventListener('change', (e) => {
                currentLayer = parseInt(e.target.value);
                renderMatrix();
                renderStats();
            });
        }

        if (headSelect) {
            headSelect.addEventListener('change', (e) => {
                currentHead = parseInt(e.target.value);
                renderMatrix();
                renderStats();
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-attention-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportAttentionMap);
        }
    }

    /**
     * Set tokens and generate attention data
     */
    function setTokens(tokens, modelType = 'transformer') {
        currentTokens = tokens;

        const model = NeuroVizModels.getModel(modelType);
        numLayers = Math.min(model.params.numLayers, 6); // Cap at 6 for display
        numHeads = Math.min(model.params.numHeads, 8); // Cap at 8 for display

        fullAttention = NeuroVizTokenizer.generateFullAttention(
            tokens, modelType, numLayers, numHeads
        );

        // Update selectors
        updateSelectors();
        renderMatrix();
        renderStats();
    }

    /**
     * Update layer/head selectors
     */
    function updateSelectors() {
        const layerSelect = document.getElementById('attention-layer-select');
        const headSelect = document.getElementById('attention-head-select');

        if (layerSelect) {
            layerSelect.innerHTML = '';
            for (let l = 0; l < numLayers; l++) {
                const opt = document.createElement('option');
                opt.value = l;
                opt.textContent = `Layer ${l + 1}`;
                layerSelect.appendChild(opt);
            }
        }

        if (headSelect) {
            headSelect.innerHTML = '';
            for (let h = 0; h < numHeads; h++) {
                const opt = document.createElement('option');
                opt.value = h;
                opt.textContent = `Head ${h + 1}`;
                headSelect.appendChild(opt);
            }
        }
    }

    /**
     * Render the attention heatmap matrix
     */
    function renderMatrix() {
        const container = document.getElementById('attention-matrix');
        if (!container || currentTokens.length === 0) return;

        const matrix = fullAttention[currentLayer]?.[currentHead];
        if (!matrix) return;

        const n = currentTokens.length;
        const cellSize = Math.min(48, Math.max(28, Math.floor(400 / n)));

        let html = '<div style="display:flex;align-items:center;gap:8px;">';

        // Row labels (left side)
        html += '<div class="attention-row-labels">';
        for (let i = 0; i < n; i++) {
            html += `<div class="attention-row-label" style="height:${cellSize}px;width:60px;">${currentTokens[i].text}</div>`;
        }
        html += '</div>';

        // Column labels (top) + matrix
        html += '<div>';
        // Column labels
        html += '<div class="attention-col-labels" style="padding-left:0;">';
        html += `<div style="width:60px;"></div>`; // Spacer for row labels
        for (let j = 0; j < n; j++) {
            html += `<div class="attention-label" style="width:${cellSize}px;height:24px;">${currentTokens[j].text}</div>`;
        }
        html += '</div>';

        // Matrix grid
        html += `<div class="attention-grid" style="grid-template-columns:repeat(${n}, ${cellSize}px);">`;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const weight = matrix[i][j];
                const color = NeuroVizUtils.Color.attentionColor(weight);
                const textColor = weight > 0.5 ? '#fff' : '#333';
                html += `<div class="attention-cell" style="width:${cellSize}px;height:${cellSize}px;background:${color};color:${textColor};">
                    ${weight.toFixed(2)}
                    <span class="cell-tooltip">${currentTokens[i].text} → ${currentTokens[j].text}: ${(weight * 100).toFixed(1)}%</span>
                </div>`;
            }
        }
        html += '</div>';

        // Color scale
        html += `<div class="attention-colorscale" style="margin-top:12px;">
            <span>0.0</span>
            <div class="colorscale-bar"></div>
            <span>1.0</span>
        </div>`;

        html += '</div></div>';

        container.innerHTML = html;
    }

    /**
     * Render attention statistics
     */
    function renderStats() {
        const statsContent = document.getElementById('stats-content');
        if (!statsContent || currentTokens.length === 0) return;

        const matrix = fullAttention[currentLayer]?.[currentHead];
        if (!matrix) return;

        const n = currentTokens.length;

        // Compute statistics
        let totalAttention = 0;
        let maxAttention = 0;
        let maxPair = [0, 0];
        const tokenTotalAttention = new Float32Array(n);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                totalAttention += matrix[i][j];
                tokenTotalAttention[j] += matrix[i][j];
                if (matrix[i][j] > maxAttention) {
                    maxAttention = matrix[i][j];
                    maxPair = [i, j];
                }
            }
        }

        const avgAttention = totalAttention / (n * n);
        const entropy = computeEntropy(matrix, n);

        // Top attended tokens
        const tokenScores = Array.from(tokenTotalAttention).map((score, idx) => ({
            token: currentTokens[idx].text,
            score,
            idx,
        }));
        tokenScores.sort((a, b) => b.score - a.score);

        let html = '';

        // Summary stats
        html += `<div class="stat-card">
            <div class="stat-label">Average Attention</div>
            <div class="stat-value">${(avgAttention * 100).toFixed(1)}%</div>
            <div class="stat-bar"><div class="stat-bar-fill" style="width:${avgAttention * 100}%;background:var(--accent-blue);"></div></div>
        </div>`;

        html += `<div class="stat-card">
            <div class="stat-label">Max Attention</div>
            <div class="stat-value">${(maxAttention * 100).toFixed(1)}%</div>
            <div class="stat-bar"><div class="stat-bar-fill" style="width:${maxAttention * 100}%;background:var(--accent-green);"></div></div>
        </div>`;

        html += `<div class="stat-card">
            <div class="stat-label">Strongest Connection</div>
            <div class="stat-value" style="font-size:0.85rem;">"${currentTokens[maxPair[0]].text}" → "${currentTokens[maxPair[1]].text}"</div>
        </div>`;

        html += `<div class="stat-card">
            <div class="stat-label">Attention Entropy</div>
            <div class="stat-value">${entropy.toFixed(3)}</div>
            <div class="stat-bar"><div class="stat-bar-fill" style="width:${(entropy / Math.log2(n)) * 100}%;background:var(--accent-purple);"></div></div>
        </div>`;

        // Top attended tokens
        html += '<div class="stat-card"><div class="stat-label">Most Attended Tokens</div>';
        html += '<ul class="top-tokens-list">';
        for (let i = 0; i < Math.min(5, tokenScores.length); i++) {
            const pct = (tokenScores[i].score / totalAttention * 100).toFixed(1);
            html += `<li>
                <span class="token-name">${tokenScores[i].token}</span>
                <span class="token-score">${pct}%</span>
            </li>`;
        }
        html += '</ul></div>';

        statsContent.innerHTML = html;
    }

    /**
     * Compute entropy of attention distribution
     */
    function computeEntropy(matrix, n) {
        let entropy = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const p = matrix[i][j];
                if (p > 0) {
                    entropy -= p * Math.log2(p);
                }
            }
        }
        return entropy / n; // Average per row
    }

    /**
     * Export attention map as PNG
     */
    function exportAttentionMap() {
        const container = document.getElementById('attention-matrix');
        if (!container) return;

        // Create a canvas for export
        const matrix = fullAttention[currentLayer]?.[currentHead];
        if (!matrix) return;

        const n = currentTokens.length;
        const cellSize = 48;
        const labelWidth = 80;
        const padding = 40;
        const canvasWidth = labelWidth + n * cellSize + padding * 2;
        const canvasHeight = labelWidth + n * cellSize + padding * 2 + 40;

        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = canvasWidth;
        exportCanvas.height = canvasHeight;
        const ectx = exportCanvas.getContext('2d');

        // Background
        ectx.fillStyle = '#ffffff';
        ectx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Title
        ectx.fillStyle = '#1a1d2e';
        ectx.font = 'bold 14px Inter, sans-serif';
        ectx.fillText(`Attention Map - Layer ${currentLayer + 1}, Head ${currentHead + 1}`, padding, padding - 10);

        // Column labels
        ectx.font = '11px monospace';
        ectx.fillStyle = '#4a5068';
        ectx.textAlign = 'center';
        for (let j = 0; j < n; j++) {
            ectx.fillText(
                currentTokens[j].text,
                labelWidth + padding + j * cellSize + cellSize / 2,
                padding + 15
            );
        }

        // Row labels and cells
        ectx.textAlign = 'right';
        for (let i = 0; i < n; i++) {
            ectx.fillStyle = '#4a5068';
            ectx.fillText(currentTokens[i].text, labelWidth + padding - 8, padding + 30 + i * cellSize + cellSize / 2);

            for (let j = 0; j < n; j++) {
                const weight = matrix[i][j];
                const color = NeuroVizUtils.Color.attentionColor(weight);
                ectx.fillStyle = color;
                ectx.fillRect(
                    labelWidth + padding + j * cellSize,
                    padding + 30 + i * cellSize,
                    cellSize - 1,
                    cellSize - 1
                );

                // Weight text
                ectx.fillStyle = weight > 0.5 ? '#fff' : '#333';
                ectx.textAlign = 'center';
                ectx.font = '9px monospace';
                ectx.fillText(
                    weight.toFixed(2),
                    labelWidth + padding + j * cellSize + cellSize / 2,
                    padding + 30 + i * cellSize + cellSize / 2 + 3
                );
                ectx.textAlign = 'right';
            }
        }

        // Download
        const link = document.createElement('a');
        link.download = `attention-layer${currentLayer + 1}-head${currentHead + 1}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
    }

    return {
        init,
        setTokens,
        renderMatrix,
        renderStats,
    };
})();
