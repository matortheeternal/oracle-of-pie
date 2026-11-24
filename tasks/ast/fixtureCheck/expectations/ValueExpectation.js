import Expectation from './Expectation.js';
import describeValue from '../describeValue.js';

export default class ValueExpectation extends Expectation {
    static matches(expected) {
        return true;
    }

    compare(actual, comparison, path) {
        if (Object.is(actual, this.expected)) return;
        const expected = describeValue(this.expected);
        comparison.mismatch(path, `expected ${expected}, got ${describeValue(actual)}`);
    }
}
