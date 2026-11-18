const COLOR_ORDER = 'WUBRG';
const HYBRID_SYMBOL = /\{[WUBRG]\/[WUBRG]\}/;
const SINGLE_COLOR_SYMBOL = /\{[WUBRG]\}/;
const COLOR_LETTER = /[WUBRG]/g;

function colorRank(color) {
    return COLOR_ORDER.indexOf(color);
}

function sortColors(colors) {
    return [...new Set(colors)].sort((a, b) => colorRank(a) - colorRank(b));
}

function isHybridCost(manaCost) {
    return HYBRID_SYMBOL.test(manaCost) && !SINGLE_COLOR_SYMBOL.test(manaCost);
}

export default class CardColors {
    static fromManaCost(manaCost) {
        return new CardColors({ colors: manaCost.match(COLOR_LETTER) ?? [], manaCost });
    }

    constructor({ colors = [], manaCost = '', hybrid = isHybridCost(manaCost) } = {}) {
        this.colors = sortColors(colors);
        this.hybridCost = hybrid;
    }

    withAbilityColors(abilityColors) {
        const colors = sortColors([...this.colors, ...abilityColors]);
        if (colors.length === this.colors.length) return this;
        return new CardColors({ colors, hybrid: false });
    }

    get isMonocolored() {
        return this.colors.length === 1;
    }

    get isHybrid() {
        return this.colors.length > 1 && this.hybridCost;
    }

    get isGold() {
        return this.colors.length > 1 && !this.hybridCost;
    }

    get soleColor() {
        return this.isMonocolored ? this.colors[0] : null;
    }

    toString() {
        return this.colors.join('') || 'C';
    }
}
