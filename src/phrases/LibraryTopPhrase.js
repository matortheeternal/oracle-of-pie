import Phrase from './Phrase.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const OWNER_ALTERNATIVES = [
    'your', 'their', 'its owner\'s', 'that player\'s', 'target player\'s',
    'target opponent\'s', 'each player\'s', 'each opponent\'s',
    'each of those opponents\'', 'an opponent\'s'
];
const TOP_COUNT = `(?:(${NUMBER_PATTERN}|that many|a number of) cards|card|(half))`;
const OWNERS = OWNER_ALTERNATIVES.join('|');
const LIBRARY_TOP = new RegExp(
    `^(?<complement>all but )?the (top|bottom) ${TOP_COUNT}\\b`
        + `(?: of (${OWNERS}) librar(?:y|ies))?`,
    'i'
);
const YOUR = 'your';

export default class LibraryTopPhrase extends Phrase {
    static match(scribe, str) {
        return str.match(LIBRARY_TOP);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.excludesCountedCards = Boolean(match.groups.complement);
        this.position = match[2].toLowerCase();
        this.count = match[3] ?? match[4] ?? '1';
        this.owner = match[5]?.toLowerCase() ?? null;
    }

    get zone() {
        return 'library';
    }

    get isCardInZone() {
        return true;
    }

    get ownedByYou() {
        return this.owner === YOUR;
    }

    get zoneOwnedByYou() {
        return this.ownedByYou;
    }
}
