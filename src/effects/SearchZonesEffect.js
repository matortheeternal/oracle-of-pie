import ObjectEffect from './ObjectEffect.js';

const SOURCE_PLAYER = 'target (?:player|opponent)\'s|its (?:owner|controller)\'s'
    + '|your|their|that player\'s';
const ZONE = '(?:library|graveyard|hand|outside the game)';
const ZONES = `(?<zones>${ZONE}(?:(?:,? (?:and/or|and|or) |, )${ZONE})*)`;
const OWNER_AFTER = 'of (?<ownerAfter>that (?:spell|card|permanent)\'s controller) ';
const SEARCH = new RegExp(
    `^search(?:es)? (?:(?<owner>${SOURCE_PLAYER}) |the )${ZONES} `
        + `(?:${OWNER_AFTER})?for `, 'i'
);
const JOINER = /,? (?:and\/or|and|or) |, /i;

export default class SearchZonesEffect extends ObjectEffect {
    static get pattern() {
        return SEARCH;
    }

    parseArguments(match) {
        const { owner, ownerAfter } = match.groups;
        this.owner = (owner ?? ownerAfter)?.toLowerCase() ?? null;
        this.zones = match.groups.zones.toLowerCase().split(JOINER);
        super.parseArguments();
    }

    get isPlayerAction() {
        return true;
    }
}
