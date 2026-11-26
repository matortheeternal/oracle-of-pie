import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const LOOK_VERB = '(?:looks? at|reveal|reveals|exile|exiles)';
const COUNT = `(?:twice |half )?${NUMBER_PATTERN}(?: plus ${NUMBER_PATTERN})?|that many`;
const TOP_CARDS = `(?:the top (?:(?<count>${COUNT}) cards|card) of`
    + '|the top (?<fraction>half) of'
    + `|(?<fromCount>${COUNT}) cards from the top of)`;
const OWNERS = `your|their|target player's|that player's|each player's`;
const OPPONENT_OWNERS = `target opponent's|an opponent's|each opponent's|that opponent's`;
const LOOK = new RegExp(
    `^(?<verb>${LOOK_VERB}) ${TOP_CARDS} (?<owner>${OWNERS}|${OPPONENT_OWNERS})`
        + ' (?<zone>library|planar deck)(?: face down)?'
        + '(?: in (?<pile>a|another) face-(?<orientation>up|down) pile)?',
    'i'
);

const RANDOM_ZONE_CARDS = new RegExp(
    '^(?:, (?:and )?a card at random from their (?:graveyard|hand))+\\b', 'i'
);
const RANDOM_ZONE = /(?:graveyard|hand)/gi;
const COUNTER = /^with a (?<kind>[a-z-]+) counter on it\b/i;

export default class LookAtTopEffect extends Effect {
    static get pattern() {
        return LOOK;
    }

    static match(scribe, str) {
        const match = super.match(scribe, str);
        if (!match) return null;
        const { owner, verb } = match.groups;
        const isOpponent = owner.toLowerCase().includes('opponent');
        if (isOpponent && !verb.toLowerCase().endsWith(' at')) return null;
        return match;
    }

    parseArguments(match) {
        const verb = match.groups.verb.toLowerCase();
        this.verb = verb.endsWith(' at') ? 'look' : verb;
        this.libraryOwner = match.groups.owner.toLowerCase();
        this.zone = match.groups.zone.toLowerCase();
        const { count, fromCount, fraction } = match.groups;
        const quantity = count ?? fromCount ?? fraction;
        this.cardCount = quantity?.toLowerCase() ?? null;
        this.pileOrientation = match.groups.orientation?.toLowerCase() ?? null;
        this.randomCardZones = this.readRandomCardZones();
        this.counterKind = this.consumeText(COUNTER)?.groups.kind ?? null;
        this.startsAnotherPile = match.groups.pile?.toLowerCase() === 'another';
    }

    readRandomCardZones() {
        if (!this.verb.startsWith('exile')) return [];
        const random = this.consumeText(RANDOM_ZONE_CARDS)?.[0];
        return random?.match(RANDOM_ZONE) ?? [];
    }

    get looksAtOneCard() {
        return !this.cardCount;
    }

    get looksInYourLibrary() {
        return this.libraryOwner === 'your' && this.zone === 'library';
    }
}
