import Phrase from './Phrase.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const OWNER_ALTERNATIVES = [
    'your', 'their', 'its owner\'s', 'that player\'s', 'target player\'s',
    'target opponent\'s', 'each player\'s', 'each opponent\'s'
];
const TOP_COUNT = `(?:(${NUMBER_PATTERN}) cards|card)`;
const LIBRARY_TOP = new RegExp(
    `^the top ${TOP_COUNT} of (${OWNER_ALTERNATIVES.join('|')}) library`,
    'i'
);
const YOUR = 'your';

export default class LibraryTopPhrase extends Phrase {
    static match(scribe, str) {
        return str.match(LIBRARY_TOP);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.count = match[1] ?? '1';
        this.owner = match[2].toLowerCase();
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
