import PropertyPredicate from './PropertyPredicate.js';

export default class OneOfPredicate extends PropertyPredicate {
    static matches(key, expected) {
        return Array.isArray(expected);
    }

    test(subject) {
        return this.expected.includes(this.read(subject));
    }
}
