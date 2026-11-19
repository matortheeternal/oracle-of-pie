import { COLORS } from './ColorProfile.js';
import { TIERS_BY_NAME, NONE } from './ColorTier.js';

function eachColor(valueOf) {
    return Object.fromEntries(COLORS.map(color => [color, valueOf(color)]));
}

export default class ColorTiers {
    static of(W, U, B, R, G) {
        return new ColorTiers({ W, U, B, R, G });
    }

    static fromNames(names, source = null) {
        const byColor = eachColor(color => TIERS_BY_NAME[names[color]] ?? NONE);
        return new ColorTiers(byColor, eachColor(() => source));
    }

    constructor(byColor, sources = {}) {
        this.byColor = byColor;
        this.sources = sources;
    }

    withOverrides(overrides, source = null) {
        const overridden = Object.keys(overrides);
        const sources = Object.fromEntries(overridden.map(color => [color, source]));
        return new ColorTiers(
            { ...this.byColor, ...overrides },
            { ...this.sources, ...sources }
        );
    }

    loosenedBy(other) {
        const winners = eachColor(color => this.milderSide(color, other));
        return new ColorTiers(
            eachColor(color => winners[color].tierOf(color)),
            eachColor(color => winners[color].sourceOf(color))
        );
    }

    milderSide(color, other) {
        return this.tierOf(color).isWorseThan(other.tierOf(color)) ? other : this;
    }

    get listed() {
        const listed = COLORS.filter(color => this.tierOf(color) !== NONE);
        return Object.fromEntries(listed.map(color => [color, this.tierOf(color)]));
    }

    tierOf(color) {
        return this.byColor[color];
    }

    sourceOf(color) {
        return this.sources[color] ?? null;
    }

    flaggedColors(colors) {
        return colors.filter(color => this.tierOf(color).isFlagged);
    }

    worstOf(colors) {
        return colors.map(color => this.tierOf(color))
            .reduce((worst, tier) => (tier.isWorseThan(worst) ? tier : worst));
    }

    mildestOf(colors) {
        return colors.map(color => this.tierOf(color))
            .reduce((mildest, tier) => (mildest.isWorseThan(tier) ? tier : mildest));
    }

    reasonOf(color) {
        return { tier: this.tierOf(color).name, source: this.sourceOf(color) };
    }

    reasonsFor(colors) {
        return Object.fromEntries(colors.map(color => [color, this.reasonOf(color)]));
    }

    toJSON() {
        return Object.fromEntries(COLORS.map(color => [color, this.tierOf(color).name]));
    }
}
