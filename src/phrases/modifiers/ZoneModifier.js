import Modifier from './Modifier.js';

const ZONE_OWNERS = [
    'your', 'a', 'a single', 'an opponent\'s', 'their', 'its owner\'s',
    'target player\'s', 'target opponent\'s', 'that player\'s', 'each player\'s',
    'each opponent\'s', 'any', 'all'
];
const ZONE_NAMES = ['graveyard', 'graveyards', 'hand', 'library', 'exile'];
const OWNED_ZONE = `^(?:from|in) (${ZONE_OWNERS.join('|')}) (${ZONE_NAMES.join('|')})\\b`;
const ZONE_ALTERNATIVES = [
    OWNED_ZONE,
    '^(?:from|in) graveyards\\b',
    '^from exile\\b',
    '^(?:on|from) the battlefield\\b'
];
const ZONE = new RegExp(ZONE_ALTERNATIVES.join('|'), 'i');

export default class ZoneModifier extends Modifier {
    static match(scribe, str) {
        return str.match(ZONE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const zone = (match[2] ?? match[0].split(' ').pop()).toLowerCase();
        this.zoneName = zone.replace('graveyards', 'graveyard');
        this.owner = match[1]?.toLowerCase() ?? null;
    }

    get zone() {
        return this.zoneName;
    }

    get ownedByYou() {
        return this.owner === 'your';
    }
}
