import Phrase from './Phrase.js';

const ANY_TARGET = /^any (?:other |one )?target\b/i;

export default class AnyTarget extends Phrase {
    static match(scribe, str) {
        return str.match(ANY_TARGET);
    }

    get isAnyTarget() {
        return true;
    }

    hasType(type) {
        return ['creature', 'player', 'planeswalker', 'battle'].includes(type);
    }
}
