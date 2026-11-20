import Expectation from './Expectation.js';
import { expectationFor } from './index.js';
import Node from '../../../../src/core/Node.js';
import describeValue from '../describeValue.js';

const RESERVED_KEYS = new Set(['kind', 'pending']);

export default class NodeExpectation extends Expectation {
    static matches(expected) {
        return expected !== null && typeof expected === 'object';
    }

    get properties() {
        return Object.entries(this.expected).filter(([key]) => !RESERVED_KEYS.has(key));
    }

    get propertyExpectations() {
        return Object.fromEntries(this.properties);
    }

    compare(actual, comparison, path) {
        comparison.within(this.expected.pending, path, () => {
            this.compareNode(actual, comparison, path);
        });
    }

    compareNode(actual, comparison, path) {
        const problem = this.kindProblem(actual);
        if (problem) return comparison.skip(this.propertyExpectations, path, problem);
        const nodePath = `${path}(${actual.constructor.name})`;
        for (const [key, value] of this.properties)
            this.compareProperty(actual, key, value, comparison, nodePath);
    }

    kindProblem(actual) {
        if (!(actual instanceof Node))
            return `expected a node, got ${describeValue(actual)}`;
        const kind = actual.constructor.name;
        const { kind: expected } = this.expected;
        return expected && kind !== expected ? `expected ${expected}, got ${kind}` : null;
    }

    compareProperty(node, key, expected, comparison, path) {
        const propertyPath = `${path}.${key}`;
        if (!(key in node))
            return comparison.skip(expected, propertyPath, 'no such property');
        expectationFor(expected).compare(node[key], comparison, propertyPath);
    }
}
