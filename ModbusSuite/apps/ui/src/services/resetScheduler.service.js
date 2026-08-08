import dayjs from "dayjs";
import StorageService from "./storage.service";

const STORAGE_KEY = "scheduled_reset";

class ResetSchedulerService {

    save(schedule) {

        StorageService.save(STORAGE_KEY, schedule);

    }

    get() {

        return StorageService.get(STORAGE_KEY, null);

    }

    clear() {

        StorageService.remove(STORAGE_KEY);

    }

    isTimeReached() {

        const schedule = this.get();

        if (!schedule || !schedule.enabled) {

            return false;

        }

        return dayjs().isAfter(dayjs(schedule.resetAt));

    }

}

export default new ResetSchedulerService();
