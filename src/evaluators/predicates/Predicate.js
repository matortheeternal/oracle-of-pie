import { NotImplementedError } from '../../core/customErrors.js';

export default class Predicate {
    static matches(key, expected) {
        throw new NotImplementedError('matches');
    }

    constructor(key, expected) {
        this.key = key;
        this.expected = expected;
    }

    read(subject) {
        const value = subject[this.key];
        return typeof value === 'function' ? value.bind(subject) : value;
    }

    test(subject, context) {
        throw new NotImplementedError('test');
    }
}
