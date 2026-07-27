import shiftSettingsService from "./shiftSettings.service";

class ShiftDataService {

    constructor() {

        this.intervalData = {};

        this.previousInterval = this.getCurrentInterval().key;

    }

    toMinutes(time) {

        const [h, m] = time.split(":").map(Number);

        return h * 60 + m;

    }

    getCurrentInterval() {

        const settings = shiftSettingsService.get();

        const [time1, time2] = settings.resetTimes;

        const now = new Date();

        const currentMinutes =
            now.getHours() * 60 +
            now.getMinutes();

        const first = this.toMinutes(time1);

        const second = this.toMinutes(time2);

        // Normal interval (07:00 -> 19:00)
        if (first < second) {

            if (
                currentMinutes >= first &&
                currentMinutes < second
            ) {

                return {

                    key: time1,
                    start: time1,
                    end: time2

                };

            }

            return {

                key: time2,
                start: time2,
                end: time1

            };

        }

        // Interval crosses midnight
        if (
            currentMinutes >= first ||
            currentMinutes < second
        ) {

            return {

                key: time1,
                start: time1,
                end: time2

            };

        }

        return {

            key: time2,
            start: time2,
            end: time1

        };

    }

    getCurrentIntervalData() {

        const key = this.getCurrentInterval().key;

        if (!this.intervalData[key]) {

            this.intervalData[key] = {

                production: 0,

                runtime: 0,

                operator: "Operator Not Assigned",

                startCount: 0,

                stopCount: 0

            };

        }

        return this.intervalData[key];

    }

    getIntervalData() {

        return this.intervalData;

    }

    updateProduction(pipeLength) {

        this.getCurrentIntervalData().production += pipeLength;

    }

    updateRuntime(runtime) {

        const data = this.getCurrentIntervalData();

        data.runtime = runtime.todayRuntime;

        data.startCount = runtime.startCount;

        data.stopCount = runtime.stopCount;

    }

    setOperator(name) {

        this.getCurrentIntervalData().operator = name;

    }

    resetCurrentInterval() {

        const key = this.getCurrentInterval().key;

        this.intervalData[key] = {

            production: 0,

            runtime: 0,

            operator: "Operator Not Assigned",

            startCount: 0,

            stopCount: 0

        };

    }

   checkIntervalChange() {

    const currentKey = this.getCurrentInterval().key;

    if (currentKey !== this.previousInterval) {

        console.log(
            `Interval Changed: ${this.previousInterval} -> ${currentKey}`
        );

        this.previousInterval = currentKey;

        return true;

    }

    return false;

}
syncCurrentInterval() {

    this.previousInterval =
        this.getCurrentInterval().key;

}

}

export default new ShiftDataService();