export function timeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, secondsPerUnit] of Object.entries(intervals)) {
        const count = Math.floor(seconds / secondsPerUnit);
        if (count >= 1) {
            return `${count}${unit.charAt(0)} ago`;
        }
    }

    return 'just now';
}
