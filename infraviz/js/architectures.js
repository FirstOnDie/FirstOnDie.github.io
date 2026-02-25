/**
 * InfraViz — Architecture Data Loader
 * Loads architecture JSON files and manages architecture switching.
 */
const Architectures = (() => {
    const FILES = {
        ecommerce: 'data/ecommerce.json',
        serverless: 'data/serverless.json',
        pipeline: 'data/pipeline.json',
        containers: 'data/containers.json',
        'ml-pipeline': 'data/ml-pipeline.json',
        streaming: 'data/streaming.json',
        'event-driven': 'data/event-driven.json',
        'multi-region': 'data/multi-region.json',
    };

    let cache = {};
    let current = null;

    /**
     * Load an architecture by key
     */
    async function load(key) {
        if (cache[key]) {
            current = cache[key];
            return current;
        }
        const resp = await fetch(FILES[key]);
        if (!resp.ok) throw new Error(`Failed to load ${key}: ${resp.status}`);
        const data = await resp.json();
        cache[key] = data;
        current = data;
        return data;
    }

    /**
     * Get current architecture data
     */
    function getCurrent() {
        return current;
    }

    /**
     * Get all architecture keys
     */
    function getKeys() {
        return Object.keys(FILES);
    }

    return { load, getCurrent, getKeys };
})();
