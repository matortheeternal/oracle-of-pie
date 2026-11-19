import Predicate from './Predicate.js';
import { QueryError } from '../../core/customErrors.js';

function isPlainObject(subject) {
    return Object.getPrototypeOf(subject) === Object.prototype;
}

export default class PropertyPredicate extends Predicate {
    appliesTo(subject) {
        return this.key in subject || isPlainObject(subject);
    }

    property(subject) {
        if (!this.appliesTo(subject))
            throw new QueryError(`${subject.constructor.name} has no "${this.key}"`);
        return subject[this.key];
    }

    read(subject) {
        const value = this.property(subject);
        return typeof value === 'function' ? value.bind(subject) : value;
    }
}
