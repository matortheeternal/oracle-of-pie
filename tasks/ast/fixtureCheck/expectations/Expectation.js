import { NotImplementedError } from '../../../../src/core/customErrors.js';

export default class Expectation {
    static matches(expected) {
        throw new NotImplementedError('matches');
    }

    constructor(expected) {
        this.expected = expected;
    }

    compare(actual, comparison, path) {
        throw new NotImplementedError('compare');
    }
}
