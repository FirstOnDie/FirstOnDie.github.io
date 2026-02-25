/**
 * InfraViz — vis.js Network Graph
 * Configures and renders the interactive cloud architecture graph.
 */
const Graph = (() => {
    let network = null;
    let container = null;

    const CATEGORY_COLORS = Icons.COLORS;
    const CATEGORY_BG = Icons.BG;

    /**
     * Initialize graph with container element
     */
    function init(el) {
        container = el;
    }

    /**
     * Render architecture data as a vis.js network
     */
    function render(archData) {
        // Destroy previous network
        if (network) {
            network.destroy();
            network = null;
        }

        const nodes = archData.nodes.map(n => {
            const color = CATEGORY_COLORS[n.category] || '#8892b0';
            const bg = CATEGORY_BG[n.category] || 'rgba(136,146,176,0.12)';
            return {
                id: n.id,
                label: n.label,
                shape: 'box',
                size: 25,
                margin: { top: 12, bottom: 12, left: 16, right: 16 },
                font: {
                    color: '#ccd6f6',
                    size: 12,
                    face: 'Inter, sans-serif',
                    multi: true,
                    bold: { color: '#e6f1ff', size: 13 },
                },
                borderWidth: 2,
                borderWidthSelected: 3,
                color: {
                    border: color,
                    background: '#112240',
                    highlight: {
                        border: '#64ffda',
                        background: '#1d3461',
                    },
                    hover: {
                        border: color,
                        background: '#162a4a',
                    }
                },
                shapeProperties: {
                    borderRadius: 8,
                },
                shadow: {
                    enabled: true,
                    color: 'rgba(0,0,0,0.35)',
                    size: 10,
                    x: 0, y: 4,
                },
                // Store custom data
                _data: n,
            };
        });

        const edges = archData.edges.map((e, i) => {
            const isDashed = e.style === 'dashed';
            return {
                id: `edge-${i}`,
                from: e.from,
                to: e.to,
                label: e.label || '',
                font: {
                    color: '#8892b0',
                    size: 10,
                    face: 'JetBrains Mono, monospace',
                    strokeWidth: 3,
                    strokeColor: '#0a192f',
                    align: 'middle',
                },
                arrows: {
                    to: { enabled: true, scaleFactor: 0.7, type: 'arrow' },
                },
                dashes: isDashed ? [6, 4] : false,
                color: {
                    color: 'rgba(100,255,218,0.25)',
                    highlight: '#64ffda',
                    hover: 'rgba(100,255,218,0.5)',
                    opacity: 0.8,
                },
                width: 1.5,
                smooth: {
                    enabled: true,
                    type: 'curvedCW',
                    roundness: 0.15,
                },
                chosen: {
                    edge: (values) => {
                        values.width = 2.5;
                        values.color = '#64ffda';
                    },
                },
            };
        });

        const data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges),
        };

        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 120,
                    nodeSpacing: 160,
                    treeSpacing: 200,
                    blockShifting: true,
                    edgeMinimization: true,
                    parentCentralization: true,
                },
            },
            physics: {
                enabled: false,
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                zoomView: true,
                dragView: true,
                dragNodes: true,
                navigationButtons: false,
                keyboard: {
                    enabled: true,
                    speed: { x: 10, y: 10, zoom: 0.03 },
                },
            },
            nodes: {
                shapeProperties: {
                    useImageSize: false,
                    interpolation: false,
                },
            },
            edges: {
                selectionWidth: 2,
            },
        };

        network = new vis.Network(container, data, options);

        // Fit after stabilization
        network.once('stabilizationIterationsDone', () => {
            network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
        });

        // Immediately fit since physics is off
        setTimeout(() => {
            network.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
        }, 100);

        return network;
    }

    /**
     * Get the vis.js network instance
     */
    function getNetwork() {
        return network;
    }

    /**
     * Get node data by ID
     */
    function getNodeData(nodeId) {
        if (!network) return null;
        const nodeData = network.body.data.nodes.get(nodeId);
        return nodeData ? nodeData._data : null;
    }

    /**
     * Get connected edges for a node
     */
    function getConnections(nodeId) {
        if (!network) return [];
        const arch = Architectures.getCurrent();
        if (!arch) return [];

        const conns = [];
        arch.edges.forEach(e => {
            if (e.from === nodeId) {
                const target = arch.nodes.find(n => n.id === e.to);
                conns.push({ direction: '→', node: target, label: e.label });
            } else if (e.to === nodeId) {
                const source = arch.nodes.find(n => n.id === e.from);
                conns.push({ direction: '←', node: source, label: e.label });
            }
        });
        return conns;
    }

    /**
     * Zoom controls
     */
    function zoomIn() {
        if (!network) return;
        const scale = network.getScale();
        network.moveTo({ scale: scale * 1.3, animation: { duration: 300 } });
    }

    function zoomOut() {
        if (!network) return;
        const scale = network.getScale();
        network.moveTo({ scale: scale / 1.3, animation: { duration: 300 } });
    }

    function fit() {
        if (!network) return;
        network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
    }

    return { init, render, getNetwork, getNodeData, getConnections, zoomIn, zoomOut, fit };
})();
