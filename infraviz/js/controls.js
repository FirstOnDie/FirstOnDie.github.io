/**
 * InfraViz — Controls
 * Toolbar button handlers for zoom, fit, and architecture selector.
 */
const Controls = (() => {
    let showLabels = true;

    function init() {
        // Zoom buttons
        document.getElementById('btn-zoom-in').addEventListener('click', () => Graph.zoomIn());
        document.getElementById('btn-zoom-out').addEventListener('click', () => Graph.zoomOut());
        document.getElementById('btn-fit').addEventListener('click', () => Graph.fit());

        // Toggle labels
        const toggleBtn = document.getElementById('btn-toggle-labels');
        toggleBtn.addEventListener('click', () => {
            showLabels = !showLabels;
            toggleBtn.classList.toggle('active', showLabels);
            const net = Graph.getNetwork();
            if (net) {
                const nodes = net.body.data.nodes;
                const updates = [];
                nodes.forEach(n => {
                    updates.push({
                        id: n.id,
                        font: { ...n.font, color: showLabels ? '#ccd6f6' : 'transparent' },
                    });
                });
                nodes.update(updates);

                // Toggle edge labels too
                const edges = net.body.data.edges;
                const edgeUpdates = [];
                edges.forEach(e => {
                    edgeUpdates.push({
                        id: e.id,
                        font: { ...e.font, color: showLabels ? '#8892b0' : 'transparent' },
                    });
                });
                edges.update(edgeUpdates);
            }
        });

        // Architecture selector
        document.getElementById('arch-select').addEventListener('change', async (e) => {
            await App.loadArchitecture(e.target.value);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
            switch (e.key) {
                case '+':
                case '=':
                    Graph.zoomIn();
                    break;
                case '-':
                    Graph.zoomOut();
                    break;
                case '0':
                    Graph.fit();
                    break;
                case 'Escape':
                    DetailPanel.close();
                    break;
            }
        });
    }

    return { init };
})();
