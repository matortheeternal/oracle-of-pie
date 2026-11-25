import Modifier from './Modifier.js';

const ZONE_OWNERS = [
    'your', 'a', 'a single', 'an opponent\'s', 'their', 'its owner\'s',
    'target player\'s', 'target opponent\'s', 'that player\'s', 'each player\'s', 'that',
    'each opponent\'s', 'defending player\'s', 'any', 'all', 'your opponents\''
];
const ZONE_NAMES = [
    'graveyard', 'graveyards', 'hand', 'library', 'libraries', 'exile', 'command zone'
];
const ZONE_NAME = `(?:${ZONE_NAMES.join('|')})`;
const EXILE_ACTION = '(?!exile (?:it|them|target|that|this|all|each|any|up to)\\b)';
const ZONE_JOINER = '(?:,? (?:and\\/or|and|or) |, )';
const OWNED_ZONE = `^(?:from|in) (${ZONE_OWNERS.join('|')}) (${ZONE_NAME})\\b`
    + `((?:${ZONE_JOINER}${EXILE_ACTION}${ZONE_NAME}\\b)*)`;
const JOINER = new RegExp(ZONE_JOINER);
const ZONE_ALTERNATIVES = [
    OWNED_ZONE,
    `^(?:from|in) ()(graveyards|libraries)\\b((?:${ZONE_JOINER}${ZONE_NAME}\\b)*)`,
    '^from the top of (?:your|their|its owner\'s|target player\'s) library\\b',
    '^from (?:it|among (?:them|those cards|the revealed cards))\\b',
    '^from the command zone\\b',
    '^(?:in|from) exile\\b',
    '^from anywhere other than your hand\\b',
    '^(?:on|from) the battlefield\\b'
];
const ZONE = new RegExp(ZONE_ALTERNATIVES.join('|'), 'i');

function singularZoneName(zone) {
    return zone.replace('graveyards', 'graveyard').replace('libraries', 'library');
}

export default class ZoneModifier extends Modifier {
    static match(scribe, str) {
        return str.match(ZONE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const first = (match[2] ?? match[0].split(' ').pop()).toLowerCase();
        const alternatives = (match[3] ?? '').toLowerCase().split(JOINER).filter(Boolean);
        this.zones = [first, ...alternatives].filter(zone => ZONE_NAMES.includes(zone))
            .map(singularZoneName);
        this.zoneName = this.zones[0] ?? null;
        this.owner = match[1]?.toLowerCase() ?? null;
    }

    get zone() {
        return this.zoneName;
    }

    get ownedByYou() {
        return this.owner === 'your';
    }
}
