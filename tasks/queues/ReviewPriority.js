function compareKeys(left, right) {
    const index = left.key.findIndex((value, position) => value !== right.key[position]);
    if (index < 0) return 0;
    return left.key[index] < right.key[index] ? -1 : 1;
}

export default class ReviewPriority {
    constructor(reviews) {
        this.reviews = reviews;
    }

    order(items) {
        const pending = items.filter(item => this.reviews.isPending(item.id));
        const decided = items.filter(item => !this.reviews.isPending(item.id));
        return [...this.interleave(pending), ...decided];
    }

    interleave(items) {
        const rounds = new Map();
        const ranked = items.map(item => this.rank(item, rounds));
        return ranked.sort(compareKeys).map(entry => entry.item);
    }

    rank(item, rounds) {
        const round = rounds.get(item.tag) ?? 0;
        rounds.set(item.tag, round + 1);
        const history = this.reviews.historyFor(item.tag);
        const key = [Number(history.isSettled), round, history.total, item.tag];
        return { item, key };
    }
}
