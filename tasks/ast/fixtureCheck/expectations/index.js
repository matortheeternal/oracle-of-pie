import ListExpectation from './ListExpectation.js';
import NodeExpectation from './NodeExpectation.js';
import ValueExpectation from './ValueExpectation.js';

export const EXPECTATIONS = [ListExpectation, NodeExpectation, ValueExpectation];

export function expectationFor(expected) {
    const Type = EXPECTATIONS.find(expectation => expectation.matches(expected));
    return new Type(expected);
}
