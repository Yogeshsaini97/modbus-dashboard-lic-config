import StorageService from "./storage.service";
import { APP_CONFIG } from "../config/app.config";

class RuntimeService {

    update(currentPowerState) {

        const now = Date.now();

        const runtime = StorageService.get(
            APP_CONFIG.STORAGE_KEYS.MACHINE_RUNTIME,
            {
                todayRuntime: 60,
                todayOffTime: 0,
                startCount: 0,
                stopCount: 0,
                lastPowerState: "OFF",
                lastStateChange: now
            }
        );

        const elapsedSeconds = Math.floor(
            (now - runtime.lastStateChange) / 1000
        );

        // Add elapsed time
        if (runtime.lastPowerState === "ON") {
            runtime.todayRuntime += elapsedSeconds;
        } else {
            runtime.todayOffTime += elapsedSeconds;
        }

        // Detect transitions
        if (
            runtime.lastPowerState === "OFF" &&
            currentPowerState === "ON"
        ) {
            runtime.startCount++;
        }

        if (
            runtime.lastPowerState === "ON" &&
            currentPowerState === "OFF"
        ) {
            runtime.stopCount++;
        }

        runtime.lastPowerState = currentPowerState;
        runtime.lastStateChange = now;

        StorageService.save(
            APP_CONFIG.STORAGE_KEYS.MACHINE_RUNTIME,
            runtime
        );

        return runtime;
    }

    getRuntime() {

        return StorageService.get(
            APP_CONFIG.STORAGE_KEYS.MACHINE_RUNTIME,
            {
                todayRuntime: 60,
                todayOffTime: 0,
                startCount: 0,
                stopCount: 0,
                lastPowerState: "OFF",
                lastStateChange: Date.now()
            }
        );

    }

    clear() {

        StorageService.remove(
            APP_CONFIG.STORAGE_KEYS.MACHINE_RUNTIME
        );

    }
    reset() {

   const runtime = {

    todayRuntime: 60, // Start from 1 minute

    todayOffTime: 0,

    startCount: 0,

    stopCount: 0,

    lastPowerState: "OFF",

    lastStateChange: Date.now()

};

    StorageService.save(

        APP_CONFIG.STORAGE_KEYS.MACHINE_RUNTIME,

        runtime

    );


    return runtime;

}

}

export default new RuntimeService();