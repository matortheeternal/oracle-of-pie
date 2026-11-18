import Phrase from './Phrase.js';

const ATTACHED_ALTERNATIVES = [
    'creature',
    'permanent',
    'land',
    'artifact',
    'planeswalker'
];
const ATTACHED = new RegExp(
    `^(enchanted|equipped|fortified) (${ATTACHED_ALTERNATIVES.join('|')})\\b`, 'i'
);

const ENCHANTED = 'enchanted';

export default class AttachedReference extends Phrase {
    static match(scribe, str) {
        return str.match(ATTACHED);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.attachment = match[1].toLowerCase();
        this.objectType = match[2].toLowerCase();
    }

    get controlledByYou() {
        return this.attachment !== ENCHANTED;
    }

    hasType(type) {
        return this.objectType === type;
    }
}
