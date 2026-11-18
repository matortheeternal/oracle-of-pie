import ColorProfile, { COLORS } from './ColorProfile.js';

const EXAMPLES_PER_COLOR = 3;

export default class ColorProfileBuilder {
    constructor(inspections) {
        this.inspections = inspections;
        this.totals = Object.fromEntries(COLORS.map(color => [color, 0]));
        const entries = inspections
            .map(inspection => [inspection.id, new ColorProfile()]);
        this.profiles = new Map(entries);
    }

    addCard(cardColors) {
        const color = cardColors.soleColor;
        if (color) this.totals[color]++;
    }

    addAttribution(attribution, name) {
        const color = attribution.colors.soleColor;
        if (!color || attribution.exception) return;
        const profile = this.profiles.get(attribution.inspection.id);
        profile.counts[color] = (profile.counts[color] ?? 0) + 1;
        const examples = profile.examples[color] ??= [];
        if (examples.length < EXAMPLES_PER_COLOR) examples.push(name);
    }

    build() {
        const result = {};
        for (const [id, profile] of this.profiles) {
            profile.totals = this.totals;
            result[id] = profile.toJSON();
        }
        return result;
    }
}
