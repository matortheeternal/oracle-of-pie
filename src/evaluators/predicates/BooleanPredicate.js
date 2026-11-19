import PropertyPredicate from './PropertyPredicate.js';

export default class BooleanPredicate extends PropertyPredicate {
    static matches(key, expected) {
        return typeof expected === 'boolean';
    }

    test(subject) {
        return Boolean(this.read(subject)) === this.expected;
    }
}
