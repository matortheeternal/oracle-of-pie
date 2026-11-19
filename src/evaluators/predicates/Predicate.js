import { NotImplementedError } from '../../core/customErrors.js';

export default class Predicate {
    static matches(key, expected) {
        throw new NotImplementedError('matches');
    }

    constructor(key, expected) {
        this.key = key;
        this.expected = expected;
    }

    appliesTo(subject) {
        return true;
    }

    test(subject, context) {
        throw new NotImplementedError('test');
    }
}
