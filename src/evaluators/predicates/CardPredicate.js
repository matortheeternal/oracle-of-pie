import Predicate from './Predicate.js';
import Query from '../Query.js';

export default class CardPredicate extends Predicate {
    static matches(key) {
        return key === 'card';
    }

    constructor(key, expected) {
        super(key, expected);
        this.query = Query.compile(expected);
    }

    test(subject, context) {
        return this.query.test(context.card, context);
    }
}
