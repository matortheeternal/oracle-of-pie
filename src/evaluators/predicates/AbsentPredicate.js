import Predicate from './Predicate.js';

export default class AbsentPredicate extends Predicate {
    static matches(key, expected) {
        return expected === null;
    }

    test(subject) {
        return subject[this.key] === null || subject[this.key] === undefined;
    }
}
