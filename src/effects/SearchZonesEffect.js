import ObjectEffect from './ObjectEffect.js';

const SOURCE_PLAYER = `target (?:player|opponent)'s|its owner's|your|their|that player's`;
const ZONE = '(?:library|graveyard|hand|outside the game)';
const ZONES = `(?<zones>${ZONE}(?:(?:,? (?:and/or|and|or) |, )${ZONE})*)`;
const SEARCH = new RegExp(`^search(?:es)? (?<owner>${SOURCE_PLAYER}) ${ZONES} for `, 'i');
const JOINER = /,? (?:and\/or|and|or) |, /i;

export default class SearchZonesEffect extends ObjectEffect {
    static get pattern() {
        return SEARCH;
    }

    parseArguments(match) {
        this.owner = match.groups.owner.toLowerCase();
        this.zones = match.groups.zones.toLowerCase().split(JOINER);
        super.parseArguments();
    }

    get isPlayerAction() {
        return true;
    }
}
