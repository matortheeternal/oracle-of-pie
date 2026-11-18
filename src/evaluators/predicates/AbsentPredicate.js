import Predicate from './Predicate.js';

export default class AbsentPredicate extends Predicate {
    static matches(key, expected) {
        return expected === null;
    }

    test(subject) {
        return this.read(subject) === null || this.read(subject) === undefined;
    }
}
