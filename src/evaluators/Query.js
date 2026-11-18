import { PREDICATES } from './predicates/index.js';
import { QueryError } from '../core/customErrors.js';

function createPredicate(key, expected) {
    const predicateClass = PREDICATES.find(candidate => candidate.matches(key, expected));
    if (!predicateClass) throw new QueryError(`No predicate understands "${key}"`);
    return new predicateClass(key, expected);
}

export default class Query {
    static compile(spec) {
        if (spec instanceof Query) return spec;
        const entries = Object.entries(spec);
        return new Query(entries.map(([key, value]) => createPredicate(key, value)));
    }

    constructor(predicates) {
        this.predicates = predicates;
    }

    test(subject, context) {
        if (subject === null || subject === undefined) return false;
        return this.predicates.every(predicate => predicate.test(subject, context));
    }

    testAny(subject, context) {
        if (Array.isArray(subject)) return subject.some(item => this.test(item, context));
        return this.test(subject, context);
    }
}
