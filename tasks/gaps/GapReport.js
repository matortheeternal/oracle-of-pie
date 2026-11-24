import ShapeStats from './ShapeStats.js';
import { spanShape, shapeFamily } from './spanShape.js';

function statsFor(table, key) {
    if (!table.has(key)) table.set(key, new ShapeStats(key));
    return table.get(key);
}

function ranked(table, field) {
    const byField = (a, b) => b[field] - a[field] || b.cards.size - a.cards.size;
    return [...table.values()].sort(byField);
}

export default class GapReport {
    constructor() {
        this.cards = 0;
        this.recognized = 0;
        this.unrecognized = new Map();
        this.families = new Map();
        this.opaque = new Map();
    }

    addCard(name, gaps, recognized) {
        this.cards++;
        if (recognized) this.recognized++;
        const shapes = new Set();
        for (const gap of gaps) this.addGap(name, gap, shapes);
        if (shapes.size === 1) statsFor(this.unrecognized, [...shapes][0]).unlocks++;
    }

    addGap(name, gap, shapes) {
        const shape = spanShape(gap.raw);
        shapes.add(shape);
        statsFor(this.unrecognized, shape).add(name, gap);
        if (gap.kind === 'opaque') return statsFor(this.opaque, shape).add(name, gap);
        statsFor(this.families, `${gap.context} | ${shapeFamily(shape)}`).add(name, gap);
    }

    get byUnlocks() {
        return ranked(this.unrecognized, 'unlocks');
    }

    get byFamily() {
        return [...this.families.values()].sort((a, b) => b.cards.size - a.cards.size);
    }

    get byOpaque() {
        return [...this.opaque.values()].sort((a, b) => b.cards.size - a.cards.size);
    }

    toJSON() {
        return {
            cards: this.cards,
            recognized: this.recognized,
            unrecognized: this.byUnlocks.map(stats => stats.toJSON()),
            families: this.byFamily.map(stats => stats.toJSON()),
            opaque: this.byOpaque.map(stats => stats.toJSON())
        };
    }
}
