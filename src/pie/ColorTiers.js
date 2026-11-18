import { COLORS } from './ColorProfile.js';

export default class ColorTiers {
    static of(W, U, B, R, G) {
        return new ColorTiers({ W, U, B, R, G });
    }

    constructor(byColor) {
        this.byColor = byColor;
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
