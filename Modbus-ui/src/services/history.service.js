import StorageService from "./storage.service";
import { APP_CONFIG } from "../config/app.config";

class HistoryService {

    append(reading) {

        const history = StorageService.get(
            APP_CONFIG.STORAGE_KEYS.MACHINE_HISTORY,
            []
        );

        history.push(reading);

        const cutoffTime =
            Date.now() -
            APP_CONFIG.HISTORY_DURATION_HOURS * 60 * 60 * 1000;

        const filteredHistory = history.filter(
            item => item.timestamp >= cutoffTime
        );

        StorageService.save(
            APP_CONFIG.STORAGE_KEYS.MACHINE_HISTORY,
            filteredHistory
        );

        return filteredHistory;
    }

    getHistory() {

        return StorageService.get(
            APP_CONFIG.STORAGE_KEYS.MACHINE_HISTORY,
            []
        );

    }

    clearHistory() {

        StorageService.remove(
            APP_CONFIG.STORAGE_KEYS.MACHINE_HISTORY
        );

    }

}

export default new HistoryService();