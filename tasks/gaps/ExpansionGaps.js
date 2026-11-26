import ShapeStats from './ShapeStats.js';
import { spanShape } from './spanShape.js';

export default class ExpansionGaps {
    constructor() {
        this.groups = new Map();
    }

    addCard(cardName, parsed) {
        for (const [node, context] of parsed.text.walk()) {
            if (!context.expansion || !node.isUnrecognizedSpan) continue;
            this.add(cardName, node, context.expansion.definition.key);
        }
    }

    add(cardName, node, keyword) {
        const shape = spanShape(node.raw);
        const key = JSON.stringify([keyword, shape]);
        if (!this.groups.has(key))
            this.groups.set(key, { keyword, stats: new ShapeStats(shape) });
        const { stats } = this.groups.get(key);
        stats.add(cardName, { context: node.constructor.name, raw: node.raw });
    }

    toJSON() {
        return [...this.groups.values()]
            .sort((a, b) => b.stats.cards.size - a.stats.cards.size)
            .map(({ keyword, stats }) => ({ keyword, ...stats.toJSON() }));
    }
}
