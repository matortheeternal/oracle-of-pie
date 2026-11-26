function mostFrequent(counts) {
    return [...counts].sort((a, b) => b[1] - a[1])[0][0];
}

function countTypes(occurrences) {
    const byReminder = new Map();
    for (const { reminder, type } of occurrences) {
        if (!type) continue;
        const counts = byReminder.get(reminder) ?? new Map();
        counts.set(type, (counts.get(type) ?? 0) + 1);
        byReminder.set(reminder, counts);
    }
    return byReminder;
}

export default function inferReminderTypes(occurrences) {
    const byReminder = countTypes(occurrences);
    return Object.fromEntries([...byReminder].map(([reminder, counts]) =>
        [reminder, mostFrequent(counts)]));
}
