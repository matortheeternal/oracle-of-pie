const EXAMPLE_LIMIT = 3;

function increment(counts, key) {
    counts.set(key, (counts.get(key) ?? 0) + 1);
}

function topEntries(counts, limit) {
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export default class ShapeStats {
    constructor(shape) {
        this.shape = shape;
        this.cards = new Set();
        this.unlocks = 0;
        this.contexts = new Map();
        this.spans = new Map();
        this.examples = [];
    }

    add(cardName, gap) {
        this.cards.add(cardName);
        increment(this.contexts, gap.context);
        increment(this.spans, gap.raw);
        if (this.examples.length < EXAMPLE_LIMIT && !this.examples.includes(cardName))
            this.examples.push(cardName);
    }

    topContexts(limit) {
        return topEntries(this.contexts, limit);
    }

    topSpans(limit) {
        return topEntries(this.spans, limit);
    }

    toJSON() {
        return {
            shape: this.shape,
            cards: this.cards.size,
            unlocks: this.unlocks,
            contexts: Object.fromEntries(this.contexts),
            spans: Object.fromEntries(this.topSpans(10)),
            examples: this.examples
        };
    }
}
