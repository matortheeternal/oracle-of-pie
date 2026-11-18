export const COLORS = ['W', 'U', 'B', 'R', 'G'];

export default class ColorProfile {
    constructor({ counts = {}, totals = {}, examples = {} } = {}) {
        this.counts = counts;
        this.totals = totals;
        this.examples = examples;
    }

    countOf(color, excluded) {
        const count = this.counts[color] ?? 0;
        return color === excluded ? Math.max(0, count - 1) : count;
    }

    support(excluded = null) {
        return COLORS.reduce((sum, color) => sum + this.countOf(color, excluded), 0);
    }

    rateOf(color, excluded) {
        return this.countOf(color, excluded) / (this.totals[color] || 1);
    }

    share(color, excluded = null) {
        const total = COLORS.reduce((sum, each) => sum + this.rateOf(each, excluded), 0);
        return total ? this.rateOf(color, excluded) / total : 0;
    }

    shares(excluded = null) {
        const entries = COLORS.map(color => [color, this.share(color, excluded)]);
        return Object.fromEntries(entries);
    }

    toJSON() {
        const { counts, totals, examples } = this;
        return { counts, totals, examples };
    }
}
