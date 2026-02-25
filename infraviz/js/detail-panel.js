/**
 * InfraViz — Detail Panel
 * Shows service details when a node is clicked.
 */
const DetailPanel = (() => {
    let panelEl, placeholderEl, contentEl, overlay;

    function init() {
        panelEl = document.getElementById('detail-panel');
        placeholderEl = document.getElementById('panel-placeholder');
        contentEl = document.getElementById('panel-content');
        overlay = document.getElementById('mobile-overlay');

        // Close button
        document.getElementById('panel-close').addEventListener('click', close);

        // Mobile overlay close
        overlay.addEventListener('click', close);
    }

    /**
     * Show details for a node
     */
    function show(nodeData) {
        if (!nodeData) return;

        const cat = nodeData.category;
        const color = Icons.COLORS[cat] || '#8892b0';

        // Icon
        const iconEl = document.getElementById('panel-icon');
        iconEl.innerHTML = Icons.getSVG(nodeData.icon, cat);
        iconEl.style.background = Icons.BG[cat];

        // Title
        document.getElementById('panel-title').textContent =
            nodeData.label.replace(/\n/g, ' ');

        // Category badge
        const catEl = document.getElementById('panel-category');
        catEl.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        catEl.className = `panel-category cat-${cat}`;

        // Details
        const detailsEl = document.getElementById('panel-details');
        detailsEl.innerHTML = '';
        if (nodeData.details) {
            Object.entries(nodeData.details).forEach(([key, val]) => {
                const row = document.createElement('div');
                row.className = 'detail-row';
                row.innerHTML = `
                    <span class="label">${key}</span>
                    <span class="value">${val}</span>
                `;
                detailsEl.appendChild(row);
            });
        }

        // Connections
        const connsEl = document.getElementById('panel-connections');
        connsEl.innerHTML = '';
        const connections = Graph.getConnections(nodeData.id);
        if (connections.length === 0) {
            connsEl.innerHTML = '<div style="color:#374151;font-size:0.8rem">Sin conexiones</div>';
        } else {
            connections.forEach(conn => {
                const item = document.createElement('div');
                item.className = 'connection-item';
                item.innerHTML = `
                    <span class="conn-dir">${conn.direction}</span>
                    <span class="conn-name">${conn.node ? conn.node.label.replace(/\n/g, ' ') : '?'}</span>
                    ${conn.label ? `<span class="conn-label">${conn.label}</span>` : ''}
                `;
                // Click to navigate to connected node
                if (conn.node) {
                    item.addEventListener('click', () => {
                        const net = Graph.getNetwork();
                        if (net) {
                            net.selectNodes([conn.node.id]);
                            net.focus(conn.node.id, {
                                scale: 1.2,
                                animation: { duration: 400 }
                            });
                            const connData = Graph.getNodeData(conn.node.id);
                            if (connData) show(connData);
                        }
                    });
                }
                connsEl.appendChild(item);
            });
        }

        // Show content, hide placeholder
        placeholderEl.style.display = 'none';
        contentEl.style.display = 'block';
        panelEl.classList.remove('closed');

        // Mobile
        if (window.innerWidth <= 768) {
            panelEl.classList.add('open-mobile');
            overlay.classList.add('active');
        }
    }

    /**
     * Close the panel
     */
    function close() {
        contentEl.style.display = 'none';
        placeholderEl.style.display = 'flex';

        // Mobile
        panelEl.classList.remove('open-mobile');
        overlay.classList.remove('active');

        // Deselect in graph
        const net = Graph.getNetwork();
        if (net) net.unselectAll();
    }

    /**
     * Reset to placeholder state
     */
    function reset() {
        close();
    }

    return { init, show, close, reset };
})();
