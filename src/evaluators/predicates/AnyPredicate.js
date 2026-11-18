import Predicate from './Predicate.js';
import Query from '../Query.js';

export default class AnyPredicate extends Predicate {
    static matches(key) {
        return key === 'any';
    }

    constructor(key, expected) {
        super(key, expected);
        this.queries = expected.map(spec => Query.compile(spec));
    }

    test(subject, context) {
        return this.queries.some(query => query.test(subject, context));
    }
}
