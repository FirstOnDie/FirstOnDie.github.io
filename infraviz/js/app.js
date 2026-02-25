/**
 * InfraViz — App (Main Entry Point)
 * Initializes all modules and orchestrates architecture loading.
 */
const App = (() => {
    const loadingEl = () => document.getElementById('loading');
    const descEl = () => document.getElementById('arch-description');

    /**
     * Load and render an architecture
     */
    async function loadArchitecture(key) {
        // Show loading
        const loading = loadingEl();
        loading.classList.remove('hidden');

        // Reset detail panel
        DetailPanel.reset();

        try {
            // Load data
            const data = await Architectures.load(key);

            // Update description
            descEl().textContent = data.description || '';

            // Render graph
            const network = Graph.render(data);

            // Wire node click events
            network.on('click', (params) => {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    const nodeData = Graph.getNodeData(nodeId);
                    if (nodeData) {
                        DetailPanel.show(nodeData);
                    }
                } else {
                    // Clicked on empty area
                    DetailPanel.close();
                }
            });

            // Wire double-click to focus
            network.on('doubleClick', (params) => {
                if (params.nodes.length > 0) {
                    network.focus(params.nodes[0], {
                        scale: 1.5,
                        animation: { duration: 400, easingFunction: 'easeInOutQuad' },
                    });
                }
            });

            // Hide loading after render
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 400);

        } catch (err) {
            console.error('Error loading architecture:', err);
            loading.classList.add('hidden');
        }
    }

    /**
     * Initialize the app
     */
    async function init() {
        // Init modules
        Graph.init(document.getElementById('network'));
        DetailPanel.init();
        Controls.init();

        // Load default architecture
        await loadArchitecture('ecommerce');
    }

    // Boot
    document.addEventListener('DOMContentLoaded', init);

    return { loadArchitecture };
})();
