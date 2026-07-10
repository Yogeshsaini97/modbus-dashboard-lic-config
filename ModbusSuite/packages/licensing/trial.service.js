import Store from "electron-store";

const store = new Store({
    name: "license"
});

const TRIAL_DAYS = 1;

export function initializeTrial() {

    if (!store.has("trialStart")) {

        store.set("trialStart", new Date().toISOString());

    }

}

export function getTrialStatus() {

    const trialStart = new Date(store.get("trialStart"));

    const today = new Date();

    const diff =
        Math.floor(
            (today - trialStart) /
            (1000 * 60 * 60 * 24)
        );

    const remaining = TRIAL_DAYS - diff;

    return {

        expired: remaining <= 0,

        remainingDays:
            remaining > 0 ? remaining : 0

    };

}