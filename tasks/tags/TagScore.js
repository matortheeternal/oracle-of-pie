function ratio(part, whole) {
    return whole ? part / whole : 0;
}

export default class TagScore {
    static fromJSON({ counts, falsePositives, falseNegatives }) {
        const score = new TagScore(Object.keys(counts));
        Object.assign(score, { counts, falsePositives, falseNegatives });
        return score;
    }

    constructor(tags) {
        this.tags = tags;
        this.counts = {};
        this.falsePositives = {};
        this.falseNegatives = {};
        for (const tag of tags) this.reset(tag);
    }

    reset(tag) {
        this.counts[tag] = { tp: 0, fp: 0, fn: 0 };
        this.falsePositives[tag] = [];
        this.falseNegatives[tag] = [];
    }

    add(key, predicted, gold) {
        for (const tag of this.tags)
            this.addTag(tag, key, predicted.has(tag), gold.has(tag));
    }

    addTag(tag, key, predicted, gold) {
        const counts = this.counts[tag];
        if (predicted && gold) counts.tp++;
        if (predicted && !gold) this.recordMiss(tag, 'fp', this.falsePositives, key);
        if (gold && !predicted) this.recordMiss(tag, 'fn', this.falseNegatives, key);
    }

    recordMiss(tag, kind, misses, key) {
        this.counts[tag][kind]++;
        misses[tag].push(key);
    }

    rowFor(tag) {
        const { tp, fp, fn } = this.counts[tag];
        const precision = ratio(tp, tp + fp);
        const recall = ratio(tp, tp + fn);
        const f1 = ratio(2 * precision * recall, precision + recall);
        return { tag, gold: tp + fn, tp, fp, fn, precision, recall, f1 };
    }

    get rows() {
        return this.tags.map(tag => this.rowFor(tag));
    }

    get micro() {
        const counts = Object.values(this.counts);
        const sum = kind => counts.reduce((total, count) => total + count[kind], 0);
        const totals = { tp: sum('tp'), fp: sum('fp'), fn: sum('fn') };
        return {
            precision: ratio(totals.tp, totals.tp + totals.fp),
            recall: ratio(totals.tp, totals.tp + totals.fn)
        };
    }

    toJSON() {
        const { counts, falsePositives, falseNegatives } = this;
        return { counts, falsePositives, falseNegatives };
    }
}
