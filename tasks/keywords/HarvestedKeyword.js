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

    get reminder() {
        const ranked = [...this.reminderCounts].sort((a, b) => b[1] - a[1]);
        return ranked[0][0];
    }

    toJSON() {
        return { name: this.name, reminder: this.reminder, cards: this.cards.size };
    }
}
