import Predicate from './Predicate.js';

const VALUE_MATCHERS = [
    [value => typeof value === 'function', (value, expected) => Boolean(value(expected))],
    [Array.isArray, (value, expected) => value.includes(expected)],
    [() => true, (value, expected) => value === expected]
];

export default class ValuePredicate extends Predicate {
    static matches(key, expected) {
        return typeof expected === 'string' || typeof expected === 'number';
    }

    test(subject) {
        const value = this.read(subject);
        const [, compare] = VALUE_MATCHERS.find(([accepts]) => accepts(value));
        return compare(value, this.expected);
    }
}
