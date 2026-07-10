import StorageService from "./storage.service";
import { APP_CONFIG } from "../config/app.config";

class EventService {

    add(type, data = {}) {

        const events = StorageService.get(
            APP_CONFIG.STORAGE_KEYS.MACHINE_EVENTS,
            []
        );

        events.unshift({
            id: crypto.randomUUID(),
            type,
            timestamp: Date.now(),
            ...data
        });

        if (events.length > APP_CONFIG.MAX_EVENTS) {
            events.pop();
        }

        StorageService.save(
            APP_CONFIG.STORAGE_KEYS.MACHINE_EVENTS,
            events
        );

        return events;
    }

    getEvents() {

        return StorageService.get(
            APP_CONFIG.STORAGE_KEYS.MACHINE_EVENTS,
            []
        );

    }

    clear() {

        StorageService.remove(
            APP_CONFIG.STORAGE_KEYS.MACHINE_EVENTS
        );

    }

}

export default new EventService();