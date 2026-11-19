import Predicate from './Predicate.js';

export default class TagPredicate extends Predicate {
    static matches(key) {
        return key === 'tag';
    }

    constructor(key, expected) {
        super(key, expected);
        this.tags = [expected].flat();
    }

    test(subject, context) {
        return this.tags.some(tag => context.tagLibrary.hasTag(tag, subject, context));
    }
}
