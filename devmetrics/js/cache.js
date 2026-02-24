// localstorage caching module
const Cache = {
    set(key, data, ttlMinutes = 60) {
        const item = {
            data: data,
            expiry: new Date().getTime() + ttlMinutes * 60000
        };
        localStorage.setItem(`devmetrics_${key}`, JSON.stringify(item));
    },

    get(key) {
        const itemStr = localStorage.getItem(`devmetrics_${key}`);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        if (new Date().getTime() > item.expiry) {
            localStorage.removeItem(`devmetrics_${key}`);
            return null;
        }
        return item.data;
    },

    clear() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('devmetrics_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    }
};
