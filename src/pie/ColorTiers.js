import { COLORS } from './ColorProfile.js';
import { TIERS_BY_NAME, NONE } from './ColorTier.js';

export default class ColorTiers {
    static of(W, U, B, R, G) {
        return new ColorTiers({ W, U, B, R, G });
    }

    static fromNames(names) {
        const byColor = COLORS.map(color => [color, TIERS_BY_NAME[names[color]] ?? NONE]);
        return new ColorTiers(Object.fromEntries(byColor));
    }

    constructor(byColor) {
        this.byColor = byColor;
    }

    withOverrides(overrides) {
        return new ColorTiers({ ...this.byColor, ...overrides });
    }

    loosenedBy(other) {
        const entries = COLORS.map(color => [color, this.milderOf(color, other)]);
        return new ColorTiers(Object.fromEntries(entries));
    }

    milderOf(color, other) {
        const own = this.tierOf(color);
        const theirs = other.tierOf(color);
        return own.isWorseThan(theirs) ? theirs : own;
    }

    tierOf(color) {
        return this.byColor[color];
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

    toJSON() {
        return Object.fromEntries(COLORS.map(color => [color, this.tierOf(color).name]));
    }
}
