import Predicate from './Predicate.js';

const FIXED_COLORED_MANA = /\{([WUBRG])\}/g;

export default class OffcolorCostPredicate extends Predicate {
    static matches(key) {
        return key === 'hasOffcolorManaCost';
    }

    test(subject, context) {
        const colors = context.card.colors;
        if (!colors?.length) return false;
        const symbols = subject.symbols ?? subject.parameter ?? '';
        return [...symbols.matchAll(FIXED_COLORED_MANA)]
            .some(([, color]) => !colors.includes(color));
    }
}
