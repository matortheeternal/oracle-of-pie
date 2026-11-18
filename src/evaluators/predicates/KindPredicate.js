import Predicate from './Predicate.js';

const NAMES_BY_CLASS = new WeakMap();

function collectClassNames(constructor) {
    const names = new Set();
    let current = constructor;
    while (current && current !== Object) {
        names.add(current.name);
        current = Object.getPrototypeOf(current);
    }
    return names;
}

function classNames(subject) {
    const constructor = subject.constructor;
    if (!NAMES_BY_CLASS.has(constructor))
        NAMES_BY_CLASS.set(constructor, collectClassNames(constructor));
    return NAMES_BY_CLASS.get(constructor);
}

export default class KindPredicate extends Predicate {
    static matches(key) {
        return key === 'kind';
    }

    constructor(key, expected) {
        super(key, expected);
        this.kinds = [expected].flat();
    }

    test(subject) {
        const names = classNames(subject);
        return this.kinds.some(kind => names.has(kind));
    }
}
