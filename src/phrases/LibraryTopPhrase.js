import Phrase from './Phrase.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const OWNER_ALTERNATIVES = [
    'your', 'their', 'its owner\'s', 'that player\'s', 'target player\'s',
    'target opponent\'s', 'each player\'s', 'each opponent\'s',
    'each of those opponents\'', 'an opponent\'s'
];
const TOP_COUNT = `(?:(${NUMBER_PATTERN}|that many|a number of) cards|card)`;
const OWNERS = OWNER_ALTERNATIVES.join('|');
const LIBRARY_TOP = new RegExp(
    `^the (top|bottom) ${TOP_COUNT}\\b(?: of (${OWNERS}) librar(?:y|ies))?`,
    'i'
);
const YOUR = 'your';

export default class LibraryTopPhrase extends Phrase {
    static match(scribe, str) {
        return str.match(LIBRARY_TOP);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.position = match[1].toLowerCase();
        this.count = match[2] ?? '1';
        this.owner = match[3]?.toLowerCase() ?? null;
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
