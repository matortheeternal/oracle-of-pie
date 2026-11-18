import Phrase from './Phrase.js';

const SELF_NOUNS = [
    'creature', 'artifact', 'enchantment', 'land', 'permanent', 'card', 'spell',
    'Equipment', 'Aura', 'Vehicle', 'token', 'Saga', 'planeswalker', 'battle',
    'Class', 'Room', 'Siege'
];
const SELF = new RegExp(`^(?:~|this (?:${SELF_NOUNS.join('|')})\\b)`, 'i');

export default class SelfReference extends Phrase {
    static match(scribe, str) {
        return str.match(SELF);
    }

    get refersToSelf() {
        return true;
    }

    get controlledByYou() {
        return true;
    }
}
