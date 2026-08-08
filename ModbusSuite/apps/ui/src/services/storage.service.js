// src/services/storage.service.js

class StorageService {

    cache = new Map();
    initialized = false;
    initializationPromise = null;

    async initialize() {

        if (this.initialized) {
            return;
        }

        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this.initializeCache();
        return this.initializationPromise;

    }

    async initializeCache() {

        if (!window.storageAPI) {
            console.warn("[Storage] SQLite API is unavailable; data will not persist outside Electron.");
            this.initialized = true;
            return;
        }

        const storedValues = await window.storageAPI.getAll();

        // Migrate existing browser storage once so existing dashboard data is retained.
        if (Object.keys(storedValues).length === 0 && localStorage.length > 0) {
            const legacyEntries = Array.from({ length: localStorage.length }, (_, index) => {
                const key = localStorage.key(index);
                return [key, localStorage.getItem(key)];
            }).filter(([key, value]) => key && value !== null);

            await Promise.all(legacyEntries.map(([key, value]) => window.storageAPI.set(key, value)));
            localStorage.clear();
            legacyEntries.forEach(([key, value]) => storedValues[key] = value);
            console.log("[Storage] Migrated browser storage to SQLite", { count: legacyEntries.length });
        }

        this.cache = new Map(Object.entries(storedValues));
        this.initialized = true;
        console.log("[Storage] SQLite cache initialized", { count: this.cache.size });
    }

    save(key, value) {

        const serializedValue = JSON.stringify(value);
        this.cache.set(key, serializedValue);

        if (window.storageAPI) {
            window.storageAPI.set(key, serializedValue).catch((error) => {
                console.error("[Storage] SQLite save failed", { key, error });
            });
        }

    }

    get(key, defaultValue = null) {

        const value = this.cache.get(key);

        if (!value) return defaultValue;

        try {

            return JSON.parse(value);

        } catch {

            return defaultValue;

        }

    }

    remove(key) {

        this.cache.delete(key);

        if (window.storageAPI) {
            window.storageAPI.remove(key).catch((error) => {
                console.error("[Storage] SQLite remove failed", { key, error });
            });
        }

    }

    clear() {

        this.cache.clear();

        if (window.storageAPI) {
            window.storageAPI.clear().catch((error) => {
                console.error("[Storage] SQLite clear failed", error);
            });
        }

    }

}

export default new StorageService();
