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
        const library = context.tagLibrary;
        return this.tags.some(tag =>
            library.get(tag).tagsFor(subject, context).includes(tag));
    }
}
