import PropertyPredicate from './PropertyPredicate.js';

export default class PatternPredicate extends PropertyPredicate {
    static matches(key, expected) {
        return expected instanceof RegExp;
    }

    test(subject) {
        const value = this.read(subject);
        return typeof value === 'string' && this.expected.test(value);
    }
}
