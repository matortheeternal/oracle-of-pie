import Predicate from './Predicate.js';

export default class BooleanPredicate extends Predicate {
    static matches(key, expected) {
        return typeof expected === 'boolean';
    }

    test(subject) {
        return Boolean(this.read(subject)) === this.expected;
    }
}
