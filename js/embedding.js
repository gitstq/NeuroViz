/**
 * NeuroViz - Embedding Visualization
 * Renders token embeddings in 2D space using PCA
 */

const NeuroVizEmbedding = (() => {
    'use strict';

    let canvas, ctx;
    let currentTokens = [];
    let currentEmbeddings = [];
    let projectedPoints = [];
    let animationId = null;
    let selectedPoint = -1;
    let hoveredPoint = -1;
    let currentMode = 'pca';

    const PADDING = 60;
    const POINT_RADIUS = 8;
    const COLORS = [
        '#4f6ef7', '#f472b6', '#34d399', '#fbbf24', '#a78bfa',
        '#fb923c', '#06b6d4', '#ef4444', '#22c55e', '#818cf8',
        '#ec4899', '#14b8a6', '#f59e0b', '#6366f1', '#10b981',
    ];

    /**
     * Initialize the embedding view
     */
    function init() {
        canvas = document.getElementById('embedding-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        // Handle resize
        const observer = new ResizeObserver(() => resizeCanvas());
        observer.observe(canvas.parentElement);

        // Mouse events
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('click', onClick);
        canvas.addEventListener('mouseleave', () => {
            hoveredPoint = -1;
            render();
        });

        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
                updateProjection();
                render();
            });
        });

        resizeCanvas();
    }

    function resizeCanvas() {
        if (!canvas || !canvas.parentElement) return;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        render();
    }

    /**
     * Set tokens and compute embeddings
     */
    function setTokens(tokens) {
        currentTokens = tokens;
        currentEmbeddings = NeuroVizTokenizer.generateEmbeddings(tokens, 64);
        updateProjection();
        render();
        updateLegend();
    }

    /**
     * Update 2D projection based on current mode
     */
    function updateProjection() {
        if (currentEmbeddings.length === 0) return;

        switch (currentMode) {
            case 'pca':
                projectedPoints = NeuroVizUtils.Matrix.simplePCA(
                    Array.from(currentEmbeddings),
                    2
                );
                break;
            case 'tsne':
                // Simplified t-SNE-like projection (using PCA + jitter for demo)
                projectedPoints = NeuroVizUtils.Matrix.simplePCA(
                    Array.from(currentEmbeddings),
                    2
                );
                // Add some non-linear jitter to simulate t-SNE clustering
                const rng = NeuroVizUtils.seededRandom(123);
                projectedPoints = projectedPoints.map((p) => [
                    p[0] + (rng() - 0.5) * 0.5,
                    p[1] + (rng() - 0.5) * 0.5,
                ]);
                break;
            case 'raw':
                // Use first two dimensions of raw embeddings
                projectedPoints = currentEmbeddings.map((e) => [e[0], e[1]]);
                break;
        }
    }

    /**
     * Render the embedding visualization
     */
    function render() {
        if (!ctx || !canvas) return;
        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Draw grid
        drawGrid(w, h);

        // Draw axis labels
        drawAxes(w, h);

        if (projectedPoints.length === 0) {
            // Draw placeholder
            ctx.fillStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-tertiary')
                .trim();
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Enter text and click Run to visualize embeddings', w / 2, h / 2);
            return;
        }

        // Compute bounds
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const p of projectedPoints) {
            minX = Math.min(minX, p[0]);
            maxX = Math.max(maxX, p[0]);
            minY = Math.min(minY, p[1]);
            maxY = Math.max(maxY, p[1]);
        }

        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;
        const plotW = w - PADDING * 2;
        const plotH = h - PADDING * 2;
        const scale = Math.min(plotW / rangeX, plotH / rangeY) * 0.8;

        // Map points to canvas coordinates
        const canvasPoints = projectedPoints.map((p, i) => ({
            x: PADDING + (p[0] - minX) / rangeX * plotW * 0.8 + plotW * 0.1,
            y: PADDING + (p[1] - minY) / rangeY * plotH * 0.8 + plotH * 0.1,
            index: i,
        }));

        // Draw connection lines between similar tokens
        ctx.strokeStyle = 'rgba(79, 110, 247, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvasPoints.length; i++) {
            for (let j = i + 1; j < canvasPoints.length; j++) {
                const dist = Math.sqrt(
                    (projectedPoints[i][0] - projectedPoints[j][0]) ** 2 +
                    (projectedPoints[i][1] - projectedPoints[j][1]) ** 2
                );
                if (dist < rangeX * 0.3) {
                    ctx.beginPath();
                    ctx.moveTo(canvasPoints[i].x, canvasPoints[i].y);
                    ctx.lineTo(canvasPoints[j].x, canvasPoints[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw points
        for (let i = 0; i < canvasPoints.length; i++) {
            const p = canvasPoints[i];
            const color = COLORS[i % COLORS.length];
            const isHovered = i === hoveredPoint;
            const isSelected = i === selectedPoint;
            const radius = isHovered || isSelected ? POINT_RADIUS * 1.5 : POINT_RADIUS;

            // Glow effect
            if (isHovered || isSelected) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius + 6, 0, Math.PI * 2);
                ctx.fillStyle = color + '30';
                ctx.fill();
            }

            // Point
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = isSelected ? '#fff' : color + '80';
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-primary')
                .trim();
            ctx.font = `${isHovered || isSelected ? 'bold ' : ''}12px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(currentTokens[i].text, p.x, p.y - radius - 6);
        }
    }

    function drawGrid(w, h) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 1;

        const gridSize = 40;
        for (let x = PADDING; x < w - PADDING; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, PADDING);
            ctx.lineTo(x, h - PADDING);
            ctx.stroke();
        }
        for (let y = PADDING; y < h - PADDING; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(PADDING, y);
            ctx.lineTo(w - PADDING, y);
            ctx.stroke();
        }
    }

    function drawAxes(w, h) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        ctx.font = '11px "JetBrains Mono", monospace';

        // X axis label
        ctx.textAlign = 'center';
        ctx.fillText(
            currentMode === 'pca' ? 'PC1' : currentMode === 'tsne' ? 't-SNE 1' : 'Dim 1',
            w / 2,
            h - 15
        );

        // Y axis label
        ctx.save();
        ctx.translate(15, h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(
            currentMode === 'pca' ? 'PC2' : currentMode === 'tsne' ? 't-SNE 2' : 'Dim 2',
            0,
            0
        );
        ctx.restore();
    }

    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        hoveredPoint = findNearestPoint(mx, my);
        canvas.style.cursor = hoveredPoint >= 0 ? 'pointer' : 'default';
        render();
    }

    function onClick(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const nearest = findNearestPoint(mx, my);
        selectedPoint = nearest === selectedPoint ? -1 : nearest;
        render();
    }

    function findNearestPoint(mx, my) {
        if (projectedPoints.length === 0) return -1;

        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const p of projectedPoints) {
            minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]);
            minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]);
        }
        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;
        const plotW = w - PADDING * 2;
        const plotH = h - PADDING * 2;

        let nearest = -1;
        let minDist = Infinity;

        for (let i = 0; i < projectedPoints.length; i++) {
            const px = PADDING + (projectedPoints[i][0] - minX) / rangeX * plotW * 0.8 + plotW * 0.1;
            const py = PADDING + (projectedPoints[i][1] - minY) / rangeY * plotH * 0.8 + plotH * 0.1;
            const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
            if (dist < 20 && dist < minDist) {
                minDist = dist;
                nearest = i;
            }
        }
        return nearest;
    }

    function updateLegend() {
        const legend = document.getElementById('embedding-legend');
        if (!legend) return;

        let html = '<h5>Token Legend</h5>';
        currentTokens.forEach((token, i) => {
            html += `<div class="legend-item">
                <span class="legend-dot" style="background:${COLORS[i % COLORS.length]}"></span>
                <span class="legend-label">${token.text}</span>
            </div>`;
        });
        legend.innerHTML = html;
    }

    return {
        init,
        setTokens,
        render,
    };
})();
