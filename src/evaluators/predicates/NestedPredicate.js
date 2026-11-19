import PropertyPredicate from './PropertyPredicate.js';
import Query from '../Query.js';

function isPlainObject(value) {
    return Object.getPrototypeOf(value ?? 0) === Object.prototype;
}

export default class NestedPredicate extends PropertyPredicate {
    static matches(key, expected) {
        return isPlainObject(expected);
    }

    constructor(key, expected) {
        super(key, expected);
        this.query = Query.compile(expected);
    }

    test(subject, context) {
        return this.query.testAny(this.property(subject), context);
    }
}
