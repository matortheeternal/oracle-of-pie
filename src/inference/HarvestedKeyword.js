import inferReminderTypes from './inferReminderTypes.js';

function rankReminders(occurrences) {
    const counts = new Map();
    for (const { reminder } of occurrences)
        counts.set(reminder, (counts.get(reminder) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1]).map(([reminder]) => reminder);
}

export default class HarvestedKeyword {
    constructor(name) {
        this.name = name;
        this.occurrences = [];
    }

    add(reminder, cardName, type) {
        this.occurrences.push({ reminder, cardName, type });
    }

    toJSON(grants = []) {
        const occurrences = [...this.occurrences, ...grants];
        const reminders = rankReminders(occurrences);
        const cards = new Set(occurrences.map(({ cardName }) => cardName));
        const reminderTypes = inferReminderTypes(occurrences);
        return {
            name: this.name, reminder: reminders[0], reminders, cards: cards.size,
            examples: [...cards].slice(0, 5),
            reminderVariants: reminders.length,
            ...(Object.keys(reminderTypes).length && { reminderTypes })
        };
    }
}
