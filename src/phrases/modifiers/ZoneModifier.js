import Modifier from './Modifier.js';

const ZONE_OWNERS = [
    'your', 'a', 'an opponent\'s', 'their', 'its owner\'s', 'target player\'s',
    'that player\'s', 'each player\'s', 'any'
];
const ZONE_NAMES = ['graveyard', 'graveyards', 'hand', 'library', 'exile'];
const OWNED_ZONE = `^(?:from|in) (${ZONE_OWNERS.join('|')}) (${ZONE_NAMES.join('|')})\\b`;
const ZONE = new RegExp(
    `${OWNED_ZONE}|^from exile\\b|^(?:on|from) the battlefield\\b`, 'i'
);

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
}
