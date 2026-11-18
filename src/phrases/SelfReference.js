import Phrase from './Phrase.js';
import ZoneModifier from './modifiers/ZoneModifier.js';

const SELF_NOUNS = [
    'creature', 'artifact', 'enchantment', 'land', 'permanent', 'card', 'spell',
    'Equipment', 'Aura', 'Vehicle', 'token', 'Saga', 'planeswalker', 'battle',
    'Class', 'Room', 'Siege'
];
const SELF_NOUN = `this (?:${SELF_NOUNS.join('|')})\\b`;
const SELF = new RegExp(`^(?:~|(?:he|she)(?= )|${SELF_NOUN})`, 'i');

export default class SelfReference extends Phrase {
    static match(scribe, str) {
        return str.match(SELF);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.zoneModifier = this.consume([ZoneModifier]);
    }

    get children() {
        return [this.zoneModifier].filter(Boolean);
    }

    get zone() {
        return this.zoneModifier?.zone ?? null;
    }

    get zoneOwnedByYou() {
        return Boolean(this.zoneModifier?.ownedByYou);
    }

    get isCardInZone() {
        return Boolean(this.zone && this.zone !== 'battlefield');
    }

    get refersToSelf() {
        return true;
    }

    get controlledByYou() {
        return true;
    }
}
