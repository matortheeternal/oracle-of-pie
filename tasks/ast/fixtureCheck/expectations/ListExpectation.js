import Expectation from './Expectation.js';
import { expectationFor } from './index.js';
import describeValue from '../describeValue.js';

export default class ListExpectation extends Expectation {
    static matches(expected) {
        return Array.isArray(expected);
    }

    compare(actual, comparison, path) {
        const problem = this.shapeProblem(actual);
        if (problem) return comparison.skip(this.expected, path, problem);
        this.expected.forEach((item, index) => {
            expectationFor(item).compare(actual[index], comparison, `${path}[${index}]`);
        });
    }

    shapeProblem(actual) {
        if (!Array.isArray(actual))
            return `expected a list, got ${describeValue(actual)}`;
        return this.lengthProblem(actual);
    }

    lengthProblem(actual) {
        const count = this.expected.length;
        if (actual.length === count) return null;
        return `expected ${count} items, got ${actual.length}: ${describeValue(actual)}`;
    }
}
