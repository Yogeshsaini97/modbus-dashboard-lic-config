import dayjs from "dayjs";

const STORAGE_KEY = "scheduled_reset";

class ResetSchedulerService {

    save(schedule) {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(schedule)

        );

    }

    get() {

        const data = localStorage.getItem(STORAGE_KEY);

        return data ? JSON.parse(data) : null;

    }

    clear() {

        localStorage.removeItem(STORAGE_KEY);

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