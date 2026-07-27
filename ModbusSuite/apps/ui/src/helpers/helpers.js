export const formatPipeLength = (mm) =>
    `${(mm / 1000).toFixed(2)} m`;



export function formatRuntime(totalSeconds) {

    totalSeconds = Number(totalSeconds) || 0;

    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor(
        (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    const parts = [];

    if (days > 0) {

        parts.push(`${days} day${days > 1 ? "s" : ""}`);

    }

    if (hours > 0) {

        parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);

    }

    if (minutes > 0) {

        parts.push(`${minutes} min`);

    }

    if (seconds > 0 || parts.length === 0) {

        parts.push(`${seconds} sec`);

    }

    return parts.join(" ");
}


export const getShiftElapsedTime = (currentInterval) => {
    const now = new Date();

    const [startHour, startMinute] = currentInterval.start
        .split(":")
        .map(Number);

    const shiftStart = new Date(now);
    shiftStart.setHours(startHour, startMinute, 0, 0);

    // Handle overnight shifts (e.g. 19:00 → 07:00)
    if (
        currentInterval.start > currentInterval.end &&
        now.getHours() < startHour
    ) {
        shiftStart.setDate(shiftStart.getDate() - 1);
    }

    const diff = now - shiftStart;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};