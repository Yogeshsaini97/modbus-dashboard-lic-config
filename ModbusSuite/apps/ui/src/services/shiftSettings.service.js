import StorageService from "./storage.service";

const STORAGE_KEY = "shift-settings";

const DEFAULT_SETTINGS = {

    resetTimes: [

        "07:00",

        "19:00"

    ],

    autoReset: true

};

class ShiftSettingsService {

   get() {

    const settings = StorageService.get(
        STORAGE_KEY,
        DEFAULT_SETTINGS
    );

    // Migrate old settings automatically
    if (
        !settings.resetTimes &&
        settings.morning &&
        settings.evening
    ) {

        const migrated = {

            resetTimes: [

                settings.morning.start,

                settings.evening.start

            ],

            autoReset:
                settings.autoShift ?? true

        };

        StorageService.save(
            STORAGE_KEY,
            migrated
        );

        return migrated;

    }

    return settings;

}

    save(settings) {
        StorageService.save(STORAGE_KEY, settings);
    }

}

export default new ShiftSettingsService();