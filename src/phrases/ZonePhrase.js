import Phrase from './Phrase.js';

const ZONE_OWNER_ALTERNATIVES = [
    'your', 'their', 'its owner\'s', 'target player\'s', 'target opponent\'s',
    'each opponent\'s', 'each player\'s', 'that player\'s', 'an opponent\'s',
    'all opponents\'', 'your opponents\'', 'all', 'each'
];
const ZONE_OWNER = ZONE_OWNER_ALTERNATIVES.join('|');
const ZONE_PHRASE = new RegExp(`^(${ZONE_OWNER}) (graveyards?)\\b`, 'i');
const YOUR = 'your';
const MASS_OWNER = /^(?:all|each|your opponents')(?!\w)/i;

export default class ZonePhrase extends Phrase {
    static match(scribe, str) {
        return str.match(ZONE_PHRASE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.owner = match[1].toLowerCase();
        this.zoneName = 'graveyard';
    }

    get zone() {
        return this.zoneName;
    }

    get ownedByYou() {
        return this.owner === YOUR;
    }

    get controlledByYou() {
        return this.ownedByYou;
    }

    get isCardInZone() {
        return true;
    }

    get isMass() {
        return MASS_OWNER.test(this.owner);
    }
}
