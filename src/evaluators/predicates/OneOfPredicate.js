import Predicate from './Predicate.js';

export default class OneOfPredicate extends Predicate {
    static matches(key, expected) {
        return Array.isArray(expected);
    }

    test(subject) {
        return this.expected.includes(this.read(subject));
    }
}
