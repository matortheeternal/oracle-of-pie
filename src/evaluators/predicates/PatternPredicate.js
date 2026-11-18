import Predicate from './Predicate.js';

export default class PatternPredicate extends Predicate {
    static matches(key, expected) {
        return expected instanceof RegExp;
    }

    test(subject) {
        const value = this.read(subject);
        return typeof value === 'string' && this.expected.test(value);
    }
}
