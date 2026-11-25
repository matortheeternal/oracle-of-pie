import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const LOOK_VERB = '(?:looks? at|reveal|reveals|exile|exiles)';
const COUNT = `(?:twice |half )?${NUMBER_PATTERN}|that many`;
const TOP_CARDS = `(?:the top (?:(?<count>${COUNT}) cards|card) of`
    + `|(?<fromCount>${COUNT}) cards from the top of)`;
const OWNERS = `your|their|target player's|that player's|each player's`;
const OPPONENT_OWNERS = `target opponent's|an opponent's|each opponent's`;
const LOOK = new RegExp(
    `^(?<verb>${LOOK_VERB}) ${TOP_CARDS} (?<owner>${OWNERS}|${OPPONENT_OWNERS})`
        + ' (?<zone>library|planar deck)(?: face down)?',
    'i'
);

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
        const count = match.groups.count ?? match.groups.fromCount;
        this.cardCount = count?.toLowerCase() ?? null;
    }

    get looksAtOneCard() {
        return !this.cardCount;
    }

    get looksInYourLibrary() {
        return this.libraryOwner === 'your' && this.zone === 'library';
    }
}
