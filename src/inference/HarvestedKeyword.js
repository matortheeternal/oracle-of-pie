export default class HarvestedKeyword {
    constructor(name) {
        this.name = name;
        this.reminderCounts = new Map();
        this.cards = new Set();
    }

    add(reminder, cardName) {
        this.reminderCounts.set(reminder, (this.reminderCounts.get(reminder) ?? 0) + 1);
        this.cards.add(cardName);
    }

    toJSON(grants = []) {
        const counts = new Map(this.reminderCounts);
        const cards = new Set(this.cards);
        for (const { reminder, cardName } of grants) {
            counts.set(reminder, (counts.get(reminder) ?? 0) + 1);
            cards.add(cardName);
        }
        const ranked = [...counts].sort((a, b) => b[1] - a[1]);
        const reminders = ranked.map(([reminder]) => reminder);
        return {
            name: this.name, reminder: reminders[0], reminders, cards: cards.size,
            examples: [...cards].slice(0, 5),
            reminderVariants: reminders.length
        };
    }
}
