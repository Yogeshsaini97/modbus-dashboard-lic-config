// src/services/storage.service.js

class StorageService {

    save(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }

    get(key, defaultValue = null) {

        const value = localStorage.getItem(key);

        if (!value) return defaultValue;

        try {

            return JSON.parse(value);

        } catch {

            return defaultValue;

        }

    }

    remove(key) {

        localStorage.removeItem(key);

    }

    clear() {

        localStorage.clear();

    }

}

export default new StorageService();