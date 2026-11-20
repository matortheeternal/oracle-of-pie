import Parser from '../../core/Parser.js';

const OWNED_ZONE = '(?:your|an opponent\'s|a|their) (?:graveyard|library|hand)';
const ZONE_ALTERNATIVES = [
    'the battlefield', OWNED_ZONE, 'graveyards', 'libraries', 'exile', 'library', 'hand'
];
const ZONE = `(?:${ZONE_ALTERNATIVES.join('|')})`;
const ZONE_LIST = `${ZONE}(?:(?:,? (?:and/or|or)|,) ${ZONE})*`;
const ORIGIN = new RegExp(
    `^from (?:(?<anywhere>anywhere)(?: other than (?<excluded>${ZONE}))?`
        + `|(?<zones>${ZONE_LIST}))(?=$|[ ,.])`,
    'i'
);
const ZONE_JOINER = /,? (?:and\/or|or) |, /i;
const ZONE_NAME = /(battlefield|graveyard|librar|hand|exile)/i;
const ZONE_NAMES = { librar: 'library' };
const BATTLEFIELD = 'battlefield';

function zoneName(text) {
    const name = text.match(ZONE_NAME)[1].toLowerCase();
    return ZONE_NAMES[name] ?? name;
}

export default class ZoneOrigin extends Parser {
    static match(scribe, str) {
        return str.match(ORIGIN);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { anywhere, excluded, zones } = match.groups;
        this.isAnywhere = Boolean(anywhere);
        this.excludedZone = excluded ? zoneName(excluded) : null;
        this.zones = zones ? zones.split(ZONE_JOINER).map(zoneName) : [];
    }

    get isFromBattlefield() {
        return this.zones.includes(BATTLEFIELD);
    }

    get includesBattlefield() {
        if (this.isAnywhere) return this.excludedZone !== BATTLEFIELD;
        return this.isFromBattlefield;
    }
}
