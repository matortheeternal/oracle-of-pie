import Predicate from './Predicate.js';
import Query from '../Query.js';

export default class EffectOrderPredicate extends Predicate {
    static matches(key) {
        return key === 'effectOrder';
    }

    constructor(key, expected) {
        super(key, expected);
        this.steps = expected.map(({ kind, ...rest }) => ({
            kind: Query.compile({ kind }),
            rest: Query.compile(rest)
        }));
    }

    test(subject, context) {
        const effects = subject.effects ?? [];
        let previous = -1;
        for (const step of this.steps) {
            const index = effects.findIndex(effect => step.kind.test(effect, context));
            if (index <= previous) return false;
            if (!step.rest.test(effects[index], context)) return false;
            previous = index;
        }
        return true;
    }
}
