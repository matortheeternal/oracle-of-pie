import Modifier from './Modifier.js';

const RELATION_ALTERNATIVES = [
    'this way',
    'attached to (?:it|them|~|that [a-z]+|this [a-z]+)',
    'blocking (?:it|them|this [a-z]+)',
    'created with (?:it|them|~|this [a-z]+)',
    'exiled with (?:it|them|~|this [a-z]+)',
    'with the most votes(?: or tied for most votes)?'
];
const RELATION = new RegExp(`^(${RELATION_ALTERNATIVES.join('|')})(?!\\w)`, 'i');

export default class RelationModifier extends Modifier {
    static match(scribe, str) {
        return str.match(RELATION);
    }

    get relatesToObject() {
        return true;
    }
}
