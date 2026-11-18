import Predicate from './Predicate.js';

export default class UltimatePredicate extends Predicate {
    static matches(key) {
        return key === 'isUltimate';
    }

    test(subject, context) {
        const isUltimate = context.card.isUltimate(subject.loyaltyLoss ?? 0);
        return isUltimate === this.expected;
    }
}
