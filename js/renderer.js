/**
 * NeuroViz - Renderer
 * Orchestrates all visualization components
 */

const NeuroVizRenderer = (() => {
    'use strict';

    let currentModelType = 'transformer';
    let currentTokens = [];
    let isRunning = false;
    let autoPlayInterval = null;

    /**
     * Initialize all renderers
     */
    function init() {
        NeuroVizArchitecture.init();
        NeuroVizAttention.init();
        NeuroVizEmbedding.init();
        NeuroVizLessons.init();

        // Set initial model
        setModel('transformer');
    }

    /**
     * Set the current model type
     */
    function setModel(type) {
        currentModelType = type;
        NeuroVizArchitecture.setModel(type);
    }

    /**
     * Process input text and run visualization
     */
    function run(text) {
        if (!text.trim()) return;

        isRunning = true;
        updateStatus('running');

        // Tokenize
        currentTokens = NeuroVizTokenizer.tokenize(text);
        addLog('info', `Tokenized "${text}" into ${currentTokens.length} tokens`);
        currentTokens.forEach((t, i) => {
            addLog('info', `  Token ${i}: "${t.text}" (ID: ${t.id})`);
        });

        // Render token preview
        renderTokenPreview();

        // Generate attention
        NeuroVizAttention.setTokens(currentTokens, currentModelType);
        addLog('success', `Generated attention maps for ${currentTokens.length} tokens`);

        // Generate embeddings
        NeuroVizEmbedding.setTokens(currentTokens);
        addLog('success', `Computed ${currentTokens.length} token embeddings (64-dim)`);

        // Run architecture animation
        NeuroVizArchitecture.resetSteps();
        if (NeuroVizArchitecture.totalSteps > 0) {
            addLog('step', 'Starting architecture forward pass...');
            animateArchitecture();
        }

        isRunning = false;
        updateStatus('complete');
    }

    /**
     * Render token chips in the preview area
     */
    function renderTokenPreview() {
        const preview = document.getElementById('token-preview');
        if (!preview) return;

        preview.innerHTML = currentTokens
            .map(
                (t, i) =>
                    `<span class="token-chip" data-index="${i}" style="border-left:3px solid ${NeuroVizTokenizer.getTokenColor(i, currentTokens.length)};">
                ${t.text}
                <span class="token-id">#${t.id}</span>
            </span>`
            )
            .join('');

        // Click to highlight
        preview.querySelectorAll('.token-chip').forEach((chip) => {
            chip.addEventListener('click', () => {
                const idx = parseInt(chip.dataset.index);
                preview.querySelectorAll('.token-chip').forEach((c) => c.classList.remove('active'));
                chip.classList.add('active');
                addLog('info', `Selected token: "${currentTokens[idx].text}" (index ${idx})`);
            });
        });
    }

    /**
     * Animate architecture forward pass
     */
    function animateArchitecture() {
        const totalSteps = NeuroVizArchitecture.totalSteps;
        let step = 0;

        function doStep() {
            if (step >= totalSteps) {
                addLog('success', 'Forward pass complete! All layers processed.');
                return;
            }

            const result = NeuroVizArchitecture.nextStep();
            if (result.done) {
                addLog('success', 'Forward pass complete! All layers processed.');
                return;
            }

            const layer = result.layer;
            addLog('step', `[${result.step}/${result.total}] Processing: ${layer.name}`);
            updateStepIndicator(result.step, result.total);

            step++;
        }

        // Run all steps with animation delay
        let delay = 0;
        for (let i = 0; i < totalSteps; i++) {
            setTimeout(doStep, delay);
            delay += 400;
        }
    }

    /**
     * Step mode: go to next step
     */
    function nextStep() {
        const result = NeuroVizArchitecture.nextStep();
        if (result.layer) {
            addLog('step', `[${result.step}/${result.total}] Processing: ${result.layer.name}`);
        }
        updateStepIndicator(result.step, result.total);
        return result;
    }

    /**
     * Step mode: go to previous step
     */
    function prevStep() {
        const result = NeuroVizArchitecture.prevStep();
        if (result.layer) {
            addLog('step', `[${result.step}/${result.total}] Back to: ${result.layer.name}`);
        }
        updateStepIndicator(result.step, result.total);
        return result;
    }

    /**
     * Toggle auto-play in step mode
     */
    function toggleAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            return false;
        }

        autoPlayInterval = setInterval(() => {
            const result = nextStep();
            if (result.done) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }, 600);
        return true;
    }

    /**
     * Reset visualization
     */
    function reset() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        currentTokens = [];
        NeuroVizArchitecture.resetSteps();
        document.getElementById('token-preview').innerHTML = '';
        document.getElementById('attention-matrix').innerHTML = '<p class="placeholder-text">Run visualization to see attention patterns</p>';
        document.getElementById('stats-content').innerHTML = '';
        updateStatus('idle');
        updateStepIndicator(0, 0);
        addLog('info', 'Visualization reset.');
    }

    /**
     * Add a log entry
     */
    function addLog(type, message) {
        const log = document.getElementById('output-log');
        if (!log) return;

        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `<span class="log-time">${NeuroVizUtils.timestamp()}</span><span class="log-msg">${message}</span>`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    /**
     * Update processing status
     */
    function updateStatus(status) {
        const badge = document.getElementById('processing-status');
        if (!badge) return;

        badge.className = `status-badge ${status}`;
        const labels = { idle: '● Idle', running: '● Processing...', complete: '● Complete' };
        badge.textContent = labels[status] || '● Idle';
    }

    /**
     * Update step indicator
     */
    function updateStepIndicator(step, total) {
        const indicator = document.getElementById('step-indicator');
        if (indicator) indicator.textContent = `Step ${step} / ${total}`;
    }

    return {
        init,
        setModel,
        run,
        nextStep,
        prevStep,
        toggleAutoPlay,
        reset,
        addLog,
        get currentModelType() { return currentModelType; },
    };
})();
