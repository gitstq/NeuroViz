/**
 * NeuroViz - Architecture Visualization
 * Renders the model architecture diagram on canvas
 */

const NeuroVizArchitecture = (() => {
    'use strict';

    let canvas, ctx;
    let currentModel = null;
    let layers = [];
    let layerRects = [];
    let hoveredLayer = -1;
    let selectedLayer = -1;
    let zoom = 1;
    let panX = 0, panY = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let animationProgress = {};
    let stepMode = false;
    let currentStep = 0;
    let totalSteps = 0;

    const LAYER_WIDTH = 200;
    const LAYER_HEIGHT = 44;
    const LAYER_GAP = 12;
    const BLOCK_GAP = 20;
    const PADDING = 40;

    /**
     * Initialize architecture view
     */
    function init() {
        canvas = document.getElementById('arch-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        const container = document.getElementById('arch-canvas-container');

        // Resize
        const observer = new ResizeObserver(() => resizeCanvas());
        observer.observe(container);

        // Mouse events
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('click', onClick);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mouseleave', onMouseUp);
        canvas.addEventListener('wheel', onWheel, { passive: false });

        // Zoom controls
        document.querySelectorAll('[data-zoom]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.zoom;
                if (action === 'in') zoom = Math.min(zoom * 1.2, 3);
                else if (action === 'out') zoom = Math.max(zoom / 1.2, 0.3);
                else if (action === 'fit') { zoom = 1; panX = 0; panY = 0; }
                render();
            });
        });

        // Export buttons
        const exportSvgBtn = document.getElementById('export-svg-btn');
        if (exportSvgBtn) exportSvgBtn.addEventListener('click', exportSVG);

        const exportPngBtn = document.getElementById('export-png-btn');
        if (exportPngBtn) exportPngBtn.addEventListener('click', exportPNG);

        resizeCanvas();
    }

    function resizeCanvas() {
        if (!canvas || !canvas.parentElement) return;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        render();
    }

    /**
     * Set the current model
     */
    function setModel(modelType) {
        currentModel = NeuroVizModels.getModel(modelType);
        layers = NeuroVizModels.getSimplifiedLayers(currentModel);
        totalSteps = layers.length;
        currentStep = 0;
        animationProgress = {};
        layers.forEach((_, i) => (animationProgress[i] = 0));
        computeLayout();
        render();
    }

    /**
     * Compute layer positions
     */
    function computeLayout() {
        layerRects = [];
        const totalHeight = layers.reduce((sum, layer) => {
            return sum + (layer.isCollapsed ? LAYER_HEIGHT + LAYER_GAP * 3 : LAYER_HEIGHT + LAYER_GAP);
        }, 0);

        let y = PADDING;
        const centerX = (canvas.width / window.devicePixelRatio) / 2;

        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            const x = centerX - LAYER_WIDTH / 2;
            layerRects.push({
                x,
                y,
                w: LAYER_WIDTH,
                h: LAYER_HEIGHT,
                layer,
                index: i,
            });
            y += layer.isCollapsed ? LAYER_HEIGHT + LAYER_GAP * 3 : LAYER_HEIGHT + LAYER_GAP;
        }
    }

    /**
     * Main render function
     */
    function render() {
        if (!ctx || !canvas) return;
        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;

        ctx.clearRect(0, 0, w, h);

        // Apply zoom and pan
        ctx.save();
        ctx.translate(w / 2 + panX, PADDING + panY);
        ctx.scale(zoom, zoom);
        ctx.translate(-w / 2, -PADDING);

        // Draw connections
        drawConnections();

        // Draw layers
        for (let i = 0; i < layerRects.length; i++) {
            drawLayer(layerRects[i], i);
        }

        ctx.restore();

        // Update tooltip
        updateTooltip();
    }

    /**
     * Draw connection lines between layers
     */
    function drawConnections() {
        for (let i = 1; i < layerRects.length; i++) {
            const prev = layerRects[i - 1];
            const curr = layerRects[i];

            const progress = animationProgress[i] || 0;
            if (progress <= 0) continue;

            const color = NeuroVizUtils.Color.layerColor(curr.layer.type);
            const alpha = Math.min(progress, 1) * 0.4;

            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);

            ctx.beginPath();
            ctx.moveTo(prev.x + prev.w / 2, prev.y + prev.h);
            ctx.lineTo(curr.x + curr.w / 2, curr.y);
            ctx.stroke();

            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
        }
    }

    /**
     * Draw a single layer block
     */
    function drawLayer(rect, index) {
        const { x, y, w, h, layer } = rect;
        const progress = animationProgress[index] || 0;
        const isHovered = index === hoveredLayer;
        const isSelected = index === selectedLayer;
        const isProcessing = stepMode && index === currentStep;

        if (progress <= 0 && stepMode) {
            // Draw dimmed placeholder
            ctx.globalAlpha = 0.2;
            drawLayerBlock(x, y, w, h, layer, false, false);
            ctx.globalAlpha = 1;
            return;
        }

        // Glow effect for processing layer
        if (isProcessing) {
            ctx.shadowColor = NeuroVizUtils.Color.layerColor(layer.type);
            ctx.shadowBlur = 15;
        }

        drawLayerBlock(x, y, w, h, layer, isHovered, isSelected);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Processing indicator
        if (isProcessing) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('▶', x + w - 15, y + h / 2 + 4);
        }
    }

    function drawLayerBlock(x, y, w, h, layer, isHovered, isSelected) {
        const color = NeuroVizUtils.Color.layerColor(layer.type);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Background
        ctx.fillStyle = isDark ? '#252840' : '#ffffff';
        roundRect(ctx, x, y, w, h, 8);
        ctx.fill();

        // Border
        ctx.strokeStyle = isSelected ? color : isHovered ? color : isDark ? '#3a3f65' : '#e2e5f0';
        ctx.lineWidth = isSelected ? 2 : 1;
        roundRect(ctx, x, y, w, h, 8);
        ctx.stroke();

        // Color accent bar (left side)
        ctx.fillStyle = color;
        roundRectPartial(ctx, x, y, 4, h, 8, 'left');
        ctx.fill();

        // Layer name
        ctx.fillStyle = isDark ? '#e8ebf4' : '#1a1d2e';
        ctx.font = `${isHovered || isSelected ? 'bold ' : ''}12px Inter, -apple-system, sans-serif`;
        ctx.textAlign = 'left';
        const displayName = layer.name.length > 28 ? layer.name.substring(0, 26) + '...' : layer.name;
        ctx.fillText(displayName, x + 14, y + h / 2 + 1);

        // Type badge
        ctx.font = '9px monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'right';
        ctx.fillText(layer.type.toUpperCase(), x + w - 10, y + h / 2 + 1);

        // Collapsed indicator
        if (layer.isCollapsed) {
            ctx.fillStyle = isDark ? '#6b7194' : '#8891a8';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⋯', x + w / 2, y + h + 14);
        }
    }

    /**
     * Draw rounded rectangle
     */
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function roundRectPartial(ctx, x, y, w, h, r, side) {
        ctx.beginPath();
        if (side === 'left') {
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
        }
        ctx.closePath();
    }

    /**
     * Mouse event handlers
     */
    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left - panX - canvas.width / window.devicePixelRatio / 2) / zoom + canvas.width / window.devicePixelRatio / 2;
        const my = (e.clientY - rect.top - panY - PADDING) / zoom + PADDING;

        if (isDragging) {
            panX += e.clientX - dragStartX;
            panY += e.clientY - dragStartY;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            render();
            return;
        }

        hoveredLayer = -1;
        for (let i = 0; i < layerRects.length; i++) {
            const lr = layerRects[i];
            if (mx >= lr.x && mx <= lr.x + lr.w && my >= lr.y && my <= lr.y + lr.h) {
                hoveredLayer = i;
                break;
            }
        }
        canvas.style.cursor = hoveredLayer >= 0 ? 'pointer' : 'grab';
        render();
    }

    function onClick(e) {
        if (hoveredLayer >= 0) {
            selectedLayer = selectedLayer === hoveredLayer ? -1 : hoveredLayer;
            showLayerDetails(selectedLayer);
            render();
        }
    }

    function onMouseDown(e) {
        if (hoveredLayer < 0) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            canvas.style.cursor = 'grabbing';
        }
    }

    function onMouseUp() {
        isDragging = false;
        canvas.style.cursor = hoveredLayer >= 0 ? 'pointer' : 'grab';
    }

    function onWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoom = Math.max(0.3, Math.min(3, zoom * delta));
        render();
    }

    /**
     * Show layer details panel
     */
    function showLayerDetails(index) {
        const panel = document.getElementById('layer-details');
        const info = document.getElementById('layer-info');

        if (index < 0 || !panel || !info) {
            if (panel) panel.classList.remove('open');
            return;
        }

        const layer = layers[index];
        const color = NeuroVizUtils.Color.layerColor(layer.type);

        let html = `
            <div class="info-section">
                <div class="info-label">Name</div>
                <div class="info-value" style="color:${color};font-weight:600;">${layer.name}</div>
            </div>
            <div class="info-section">
                <div class="info-label">Type</div>
                <div class="info-value"><span class="badge badge-blue">${layer.type}</span></div>
            </div>
            <div class="info-section">
                <div class="info-label">Description</div>
                <div class="info-value">${layer.description}</div>
            </div>
            <div class="info-section">
                <div class="info-label">Output Shape</div>
                <div class="info-value mono">${layer.outputShape}</div>
            </div>`;

        if (layer.params && Object.keys(layer.params).length > 0) {
            html += '<div class="info-section"><div class="info-label">Parameters</div><div class="param-grid">';
            for (const [key, val] of Object.entries(layer.params)) {
                html += `<div class="param-item">
                    <div class="param-name">${key}</div>
                    <div class="param-val">${val}</div>
                </div>`;
            }
            html += '</div></div>';
        }

        info.innerHTML = html;
        panel.classList.add('open');
    }

    /**
     * Update tooltip
     */
    function updateTooltip() {
        const tooltip = document.getElementById('layer-tooltip');
        if (!tooltip) return;

        if (hoveredLayer >= 0 && hoveredLayer !== selectedLayer) {
            const layer = layers[hoveredLayer];
            tooltip.innerHTML = `
                <div class="tooltip-title">${layer.name}</div>
                <div class="tooltip-type">${layer.type}</div>
                <div class="tooltip-desc">${layer.description.substring(0, 100)}${layer.description.length > 100 ? '...' : ''}</div>
            `;
            tooltip.classList.add('visible');
        } else {
            tooltip.classList.remove('visible');
        }
    }

    /**
     * Step mode controls
     */
    function setStepMode(enabled) {
        stepMode = enabled;
        if (enabled) {
            currentStep = 0;
            layers.forEach((_, i) => (animationProgress[i] = i === 0 ? 1 : 0));
        } else {
            layers.forEach((_, i) => (animationProgress[i] = 1));
        }
        render();
    }

    function nextStep() {
        if (currentStep < totalSteps - 1) {
            animationProgress[currentStep] = 1;
            currentStep++;
            animationProgress[currentStep] = 0.5;
            render();
            return { step: currentStep, total: totalSteps, layer: layers[currentStep] };
        }
        animationProgress[currentStep] = 1;
        render();
        return { step: totalSteps, total: totalSteps, done: true };
    }

    function prevStep() {
        if (currentStep > 0) {
            animationProgress[currentStep] = 0;
            currentStep--;
            render();
            return { step: currentStep, total: totalSteps, layer: layers[currentStep] };
        }
        return { step: 0, total: totalSteps };
    }

    function resetSteps() {
        currentStep = 0;
        if (stepMode) {
            layers.forEach((_, i) => (animationProgress[i] = i === 0 ? 1 : 0));
        } else {
            layers.forEach((_, i) => (animationProgress[i] = 1));
        }
        render();
    }

    /**
     * Export as SVG
     */
    function exportSVG() {
        // Generate SVG representation
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="${layers.length * 60 + 80}" viewBox="0 0 400 ${layers.length * 60 + 80}">`;
        svg += `<rect width="100%" height="100%" fill="#f8f9fc"/>`;
        svg += `<text x="200" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#1a1d2e">${currentModel.name}</text>`;

        layers.forEach((layer, i) => {
            const y = 50 + i * 60;
            const color = NeuroVizUtils.Color.layerColor(layer.type);
            svg += `<rect x="50" y="${y}" width="300" height="44" rx="8" fill="white" stroke="${color}" stroke-width="1.5"/>`;
            svg += `<rect x="50" y="${y}" width="4" height="44" rx="2" fill="${color}"/>`;
            svg += `<text x="70" y="${y + 27}" font-size="12" fill="#1a1d2e">${layer.name}</text>`;
            svg += `<text x="340" y="${y + 27}" text-anchor="end" font-size="9" fill="${color}" font-family="monospace">${layer.type.toUpperCase()}</text>`;

            if (i > 0) {
                svg += `<line x1="200" y1="${y - 16}" x2="200" y2="${y}" stroke="${color}" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.4"/>`;
            }
        });

        svg += '</svg>';

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = `${currentModel.type}-architecture.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
    }

    /**
     * Export as PNG
     */
    function exportPNG() {
        const exportCanvas = document.createElement('canvas');
        const scale = 2;
        const width = 400;
        const height = layers.length * 60 + 80;
        exportCanvas.width = width * scale;
        exportCanvas.height = height * scale;
        const ectx = exportCanvas.getContext('2d');
        ectx.scale(scale, scale);

        ectx.fillStyle = '#f8f9fc';
        ectx.fillRect(0, 0, width, height);

        ectx.fillStyle = '#1a1d2e';
        ectx.font = 'bold 16px Inter, sans-serif';
        ectx.textAlign = 'center';
        ectx.fillText(currentModel.name, 200, 30);

        layers.forEach((layer, i) => {
            const y = 50 + i * 60;
            const color = NeuroVizUtils.Color.layerColor(layer.type);

            ectx.fillStyle = '#ffffff';
            ectx.beginPath();
            ectx.roundRect(50, y, 300, 44, 8);
            ectx.fill();
            ectx.strokeStyle = color;
            ectx.lineWidth = 1.5;
            ectx.stroke();

            ectx.fillStyle = color;
            ectx.fillRect(50, y, 4, 44);

            ectx.fillStyle = '#1a1d2e';
            ectx.font = '12px Inter, sans-serif';
            ectx.textAlign = 'left';
            ectx.fillText(layer.name, 70, y + 27);

            ectx.fillStyle = color;
            ectx.font = '9px monospace';
            ectx.textAlign = 'right';
            ectx.fillText(layer.type.toUpperCase(), 340, y + 27);

            if (i > 0) {
                ectx.strokeStyle = color;
                ectx.globalAlpha = 0.4;
                ectx.setLineDash([4, 4]);
                ectx.beginPath();
                ectx.moveTo(200, y - 16);
                ectx.lineTo(200, y);
                ectx.stroke();
                ectx.setLineDash([]);
                ectx.globalAlpha = 1;
            }
        });

        const link = document.createElement('a');
        link.download = `${currentModel.type}-architecture.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
    }

    return {
        init,
        setModel,
        setStepMode,
        nextStep,
        prevStep,
        resetSteps,
        render,
        get currentStep() { return currentStep; },
        get totalSteps() { return totalSteps; },
    };
})();
