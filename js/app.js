/**
 * NeuroViz - Main Application Controller
 * Orchestrates all components and handles user interactions
 */

(function () {
    'use strict';

    /**
     * Initialize the application
     */
    function init() {
        // Initialize all modules
        NeuroVizRenderer.init();

        // Set up event listeners
        setupNavigation();
        setupControls();
        setupTheme();
        setupModelSelector();

        // Log initialization
        NeuroVizRenderer.addLog('success', 'NeuroViz v1.0.0 initialized successfully!');
        NeuroVizRenderer.addLog('info', 'Select a model, enter text, and click Run to start visualizing.');
    }

    /**
     * Set up view navigation
     */
    function setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const views = document.querySelectorAll('.viz-view');

        navBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const targetView = btn.dataset.view;

                // Update nav buttons
                navBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');

                // Update views
                views.forEach((v) => v.classList.remove('active'));
                const target = document.getElementById(`${targetView}-view`);
                if (target) target.classList.add('active');

                // Trigger resize for canvas-based views
                if (targetView === 'architecture' || targetView === 'embedding') {
                    setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
                }
            });
        });
    }

    /**
     * Set up control buttons
     */
    function setupControls() {
        // Run button
        const runBtn = document.getElementById('run-btn');
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                const text = document.getElementById('input-text').value;
                if (text.trim()) {
                    NeuroVizRenderer.run(text);
                }
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                NeuroVizRenderer.reset();
            });
        }

        // Step mode toggle
        const stepModeBtn = document.getElementById('step-mode-btn');
        if (stepModeBtn) {
            stepModeBtn.addEventListener('click', () => {
                const stepControls = document.getElementById('step-controls');
                const isActive = !stepControls.classList.contains('hidden');

                if (isActive) {
                    stepControls.classList.add('hidden');
                    stepModeBtn.classList.remove('primary');
                    NeuroVizArchitecture.setStepMode(false);
                    NeuroVizRenderer.addLog('info', 'Step mode disabled.');
                } else {
                    stepControls.classList.remove('hidden');
                    stepModeBtn.classList.add('primary');
                    NeuroVizArchitecture.setStepMode(true);
                    NeuroVizRenderer.addLog('info', 'Step mode enabled. Use Next/Prev to step through layers.');
                }
            });
        }

        // Step navigation buttons
        const prevStepBtn = document.getElementById('prev-step-btn');
        const nextStepBtn = document.getElementById('next-step-btn');
        const autoPlayBtn = document.getElementById('auto-play-btn');

        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', () => NeuroVizRenderer.prevStep());
        }
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => NeuroVizRenderer.nextStep());
        }
        if (autoPlayBtn) {
            autoPlayBtn.addEventListener('click', () => {
                const playing = NeuroVizRenderer.toggleAutoPlay();
                autoPlayBtn.textContent = playing ? '⏸ Pause' : '⏩ Auto Play';
            });
        }

        // Clear log button
        const clearLogBtn = document.getElementById('clear-log-btn');
        if (clearLogBtn) {
            clearLogBtn.addEventListener('click', () => {
                const log = document.getElementById('output-log');
                if (log) log.innerHTML = '';
            });
        }

        // Ctrl+Enter to run
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const text = document.getElementById('input-text').value;
                if (text.trim()) {
                    NeuroVizRenderer.run(text);
                }
            }
        });
    }

    /**
     * Set up theme toggle
     */
    function setupTheme() {
        const themeBtn = document.getElementById('theme-toggle');
        if (!themeBtn) return;

        // Check saved preference
        const savedTheme = localStorage.getItem('neuroviz-theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeBtn.textContent = '☀️';
        }

        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                themeBtn.textContent = '🌙';
                localStorage.setItem('neuroviz-theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeBtn.textContent = '☀️';
                localStorage.setItem('neuroviz-theme', 'dark');
            }
            // Re-render canvases
            setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
        });

        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen();
                }
            });
        }
    }

    /**
     * Set up model selector
     */
    function setupModelSelector() {
        const modelSelect = document.getElementById('model-select');
        if (!modelSelect) return;

        modelSelect.addEventListener('change', () => {
            const modelType = modelSelect.value;
            NeuroVizRenderer.setModel(modelType);
            NeuroVizRenderer.addLog('info', `Switched to model: ${modelSelect.options[modelSelect.selectedIndex].text}`);

            // Re-run if there's existing text
            const text = document.getElementById('input-text').value;
            if (text.trim()) {
                NeuroVizRenderer.run(text);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
